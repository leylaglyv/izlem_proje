import os
import fitz  # PyMuPDF
import PIL.Image
import google.generativeai as genai
from dotenv import load_dotenv
import json
import typing_extensions
import time
from firebase_admin import firestore
from firebase_config import db

# Load .env from project root
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path)

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

# Define the schema for structured output
class SubjectResult(typing_extensions.TypedDict):
    subject: str
    D: int
    Y: int
    N: float

class StudentResult(typing_extensions.TypedDict):
    student_name: str
    student_id: str
    results: list[SubjectResult]
    weak_topics: list[str]
    suggestion: str

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """
    Extracts text from all pages of the PDF.
    """
    text_content = ""
    try:
        with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
            for page in doc:
                text_content += page.get_text() + "\n"
    except Exception as e:
        print(f"Error extracting text: {e}")
    return text_content.strip()

    """
    Analyzes the extracted text using Gemini.
    """
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    prompt = """
    Aşağıdaki metin bir sınav sonuç belgesinden (PDF) elde edilmiştir. Bu metni analiz et ve istene verileri JSON formatında çıkar.

    METİN:
    """ + text_content + """

    İSTENENLER:
    1. Öğrenci Adı ve Numarasını bul.
    2. Tablodaki dersleri (Matematik, Türkçe, Fen, Sosyal vb.) bul.
    3. Her ders için Doğru (D), Yanlış (Y) ve Net (N) sayılarını çıkar.
    4. **ÖNEMLİ:** Yanlış yapılan soruların hangi TEORİK KONULARA (Örn: Üslü Sayılar, Yazım Kuralları, Elektrik vb.) ait olduğunu tespit et. Eğer belgede konu yazmıyorsa, sorunun içeriğinden veya genel analizden tahmin et.
    5. 'suggestion' alanına öğrenciye özel, motive edici kısa bir tavsiye yaz.

    ÇIKTI FORMATI (JSON Listesi):
    [
        {
            "student_name": "Ad Soyad",
            "student_id": "No",
            "results": [
                {"subject": "Ders Adı", "D": 30, "Y": 5, "N": 28.75}
            ],
            "weak_topics": ["Konu 1 (Yanlış)", "Konu 2 (Boş)"],
            "suggestion": "Tavsiye metni..."
        }
    ]
    Eğer metin anlamsızsa veya sınav sonucu içermiyorsa boş liste [] döndür.
    """

    retries = 0
    max_retries = 3
    
    while retries < max_retries:
        try:
            response = model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json"
                )
            )
            return json.loads(response.text)
        except Exception as e:
            error_str = str(e)
            if "429" in error_str or "quota" in error_str.lower():
                print(f"Rate limit exceeded. Retrying in 30 seconds... ({retries+1}/{max_retries})")
                time.sleep(30)
                retries += 1
            else:
                print(f"Gemini Text Analysis Error: {e}")
                return []
    
    print("Max retries reached for Text Analysis.")
    return []

def analyze_first_page_image_fallback(pdf_bytes: bytes) -> list[StudentResult]:
    """
    Fallback: Converts ONLY the first page to image and analyzes it.
    Used when text extraction fails.
    """
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        if len(doc) < 1:
            return []
        
        page = doc.load_page(0)
        pix = page.get_pixmap()
        img_data = pix.tobytes("png")
        
        # Save temp file for Gemini (Image object needs path or bytes)
        # Using PIL directly from bytes is safer for memory
        import io
        image = PIL.Image.open(io.BytesIO(img_data))
        
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = "Bu sınav sonuç belgesini analiz et. Öğrenci adı, ders netleri ve zayıf konuları JSON olarak çıkar."
        
        retries = 0
        max_retries = 3
        
        while retries < max_retries:
            try:
                response = model.generate_content(
                    [prompt, image],
                    generation_config=genai.GenerationConfig(
                        response_mime_type="application/json"
                    )
                )
                return json.loads(response.text)
            except Exception as e:
                error_str = str(e)
                if "429" in error_str or "quota" in error_str.lower():
                    print(f"Fallback Image Rate Limit. Retrying in 30 seconds... ({retries+1}/{max_retries})")
                    time.sleep(30)
                    retries += 1
                else:
                    print(f"Image Fallback Error: {e}")
                    return []
        return []
        
    except Exception as e:
        print(f"Image Fallback Error: {e}")
        return []

def analyze_pdf_robust(pdf_bytes: bytes) -> list[StudentResult]:
    """
    Main analysis function.
    1. Tries to extract text.
    2. If text is sufficient, analyzes text.
    3. If text is empty/insufficient, falls back to first page image analysis.
    """
    print("Starting robust analysis...")
    
    # 1. Try Text Extraction
    text = extract_text_from_pdf(pdf_bytes)
    print(f"Extracted text length: {len(text)}")
    
    # 2. Analyze Text if valid
    if len(text) > 50: # Arbitrary threshold for "valid content"
        print("Text found. Analyzing with Gemini (Text Mode)...")
        results = analyze_text_with_gemini(text)
        if results:
            return results
        print("Text analysis returned empty. Trying fallback...")
    
    # 3. Fallback to Image (First Page Only)
    print("Text extraction failed or insuficient. Falling back to Image Analysis (Page 1)...")
    return analyze_first_page_image_fallback(pdf_bytes)

def save_results_to_firestore(results: list[StudentResult]):
    """
    Saves the analyzed results to Firestore.
    """
    if not results:
        return

    batch = db.batch()
    
    for result in results:
        doc_ref = db.collection("exam_results").document()
        doc_data = result.copy()
        doc_data["created_at"] = firestore.SERVER_TIMESTAMP
        batch.set(doc_ref, doc_data)

    batch.commit()
    print(f"Saved {len(results)} results to Firestore.")

def get_all_results_from_firestore():
    try:
        docs = db.collection("exam_results").order_by("created_at", direction=firestore.Query.DESCENDING).stream()
        results = []
        for doc in docs:
            data = doc.to_dict()
            if 'created_at' in data and data['created_at']:
                 data['created_at'] = data['created_at'].isoformat()
            results.append(data)
        return results
    except Exception as e:
        print(f"Error fetching results: {e}")
        return []
