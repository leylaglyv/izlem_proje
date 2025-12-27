import os
import fitz  # PyMuPDF
import PIL.Image
import io
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

def analyze_pdf(pdf_bytes: bytes) -> list[StudentResult]:
    """
    Converts PDF pages to images and sends them to Gemini for analysis.
    Returns a list of student results.
    """
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    except Exception as e:
        print(f"Error opening PDF: {e}")
        return []

    images = []

    print(f"Processing PDF with {len(doc)} pages...")

    # Limit page processing to avoid timeouts during debugging if needed
    for i in range(len(doc)):
        try:
            print(f"Processing image for page {i}...")
            page = doc.load_page(i)
            # Use 'png' as format
            pix = page.get_pixmap()
            img_data = pix.tobytes("png")
            
            # Convert to PIL Image
            img = PIL.Image.open(io.BytesIO(img_data))
            images.append(img)
            
        except Exception as e:
            print(f"Error processing page {i}: {e}")

    # Gemini Flash Latest (Available and quota-friendly)
    model = genai.GenerativeModel('gemini-flash-latest')

    prompt = """
    Bu göründüdeki sınav sonuç belgesini analiz et.
    
    Şunları yap:
    1. Öğrenci Adı ve Numarasını bul.
    2. Tablodaki dersleri tek tek oku (Matematik, Türkçe, Fen, Sosyal vb.).
    3. Her ders için Doğru (D), Yanlış (Y) ve Net (N) sayılarını çıkar.
    4. Yanlış yapılan soruların konu başlıklarını tespit et.
    5. Öğrenci için 'suggestion' (tavsiye) alanını oluştururken şunlara dikkat et:
       - ÇOK DETAYLI ve KAPSAMLI bir değerlendirme yaz (En az 3-4 paragraf).
       - Her ders grubunu (Sayısal, Sözel vb.) ayrı ayrı ele alarak güçlü ve zayıf yönleri belirt.
       - Yanlış yapılan konulara yönelik spesifik, uygulanabilir çalışma stratejileri öner.
       - Öğrencinin genel başarı durumunu motive edici, yapıcı ve profesyonel bir koç gibi değerlendir.
       - Metin akıcı olsun ve öğrenciye doğrudan hitap et (Örn: "Matematikteki başarın gayet iyi ancak...").
    
    Çıktı Formatı:
    JSON formatında bir liste (Array) döndür. (Tek öğrenci olsa bile liste içinde olmalı)
    
    Örnek JSON Yapısı:
    [
        {
            "student_name": "Ali Yılmaz",
            "student_id": "12345",
            "results": [
                {"subject": "Türkçe", "D": 30, "Y": 5, "N": 28.75},
                {"subject": "Matematik", "D": 20, "Y": 2, "N": 19.5}
            ],
            "weak_topics": ["Yazım Kuralları", "Üslü Sayılar"],
            "suggestion": "Ali, genel performansın oldukça etkileyici. Özellikle Türkçe dersindeki paragraf sorularındaki hızın ve isabet oranın dikkat çekici... (Burada uzun ve detaylı analiz devam etmeli)"
        }
    ]
    """

    all_results = []
    
    # Process each image individually to respect rate limits
    for idx, img in enumerate(images):
        print(f"Sending page {idx + 1}/{len(images)} to Gemini...")
        try:
            content = [prompt, img]
            
            # Safety settings to avoid blocking content
            safety_settings = [
                {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
            ]

            response = model.generate_content(
                content,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json"
                    # Removed strict schema to allow more flexibility and avoid 500 errors
                ),
                safety_settings=safety_settings
            )
            
            # LOGGING RAW RESPONSE
            print(f"Raw Gemini Response (Page {idx + 1}):")
            try:
                # Store original text
                response_text = response.text
                print(response_text.encode('utf-8', errors='replace').decode('utf-8'))
                
                # CLEANUP: Remove markdown code blocks if present
                cleaned_text = response_text.strip()
                if cleaned_text.startswith("```json"):
                    cleaned_text = cleaned_text[7:]
                elif cleaned_text.startswith("```"):
                    cleaned_text = cleaned_text[3:]
                
                if cleaned_text.endswith("```"):
                    cleaned_text = cleaned_text[:-3]
                
                cleaned_text = cleaned_text.strip()
                
            except Exception:
                print("Raw response could not be printed due to encoding issues.")
                cleaned_text = response.text

            page_results = json.loads(cleaned_text)
            
            # Handle both List and Dict (Single object) responses
            if isinstance(page_results, list):
                all_results.extend(page_results)
            elif isinstance(page_results, dict):
                all_results.append(page_results)
            else:
                error_msg = f"Warning: Response for page {idx + 1} was neither list nor dict: {type(page_results)}"
                print(error_msg)
                with open("last_error_log.txt", "a", encoding="utf-8") as f:
                    f.write(error_msg + "\n")

        except Exception as e:
            error_msg = f"Error processing page {idx + 1}: {str(e)}\nTraceback: {cleaned_text if 'cleaned_text' in locals() else 'No text'}"
            print(error_msg)
            with open("last_error_log.txt", "a", encoding="utf-8") as f:
                f.write(error_msg + "\n")
            # Continue to next page even if one fails
        
        # Rate Limiting: Sleep 5 seconds after each page (user request)
        if idx < len(images) - 1: # Don't sleep after the last page
             print("Waiting 5 seconds to respect API limits...")
             time.sleep(5)

    # If no results found, log it
    if not all_results:
        with open("last_error_log.txt", "a", encoding="utf-8") as f:
            f.write("Analysis finished but no results were collected.\n")

    return all_results

def save_results_to_firestore(results: list[StudentResult]):
    """
    Saves the analyzed results to Firestore.
    """
    batch = db.batch()
    
    for result in results:
        # Create a new document reference in 'exam_results' collection
        # We can use student_id as part of the ID or let Firestore auto-generate
        # Here we'll let Firestore generate, but queryable by student_id
        doc_ref = db.collection("exam_results").document()
        
        # Add timestamp
        # Create a copy for Firestore to avoid modifying the response with non-serializable objects
        doc_data = result.copy()
        doc_data["created_at"] = firestore.SERVER_TIMESTAMP
        
        batch.set(doc_ref, doc_data)

    batch.commit()
    print(f"Saved {len(results)} results to Firestore.")

def get_all_results_from_firestore():
    """
    Retrieves all exam results from Firestore, ordered by creation time (newest first).
    """
    try:
        # Query the 'exam_results' collection
        # Order by 'created_at' descending to show newest first
        docs = db.collection("exam_results").order_by("created_at", direction=firestore.Query.DESCENDING).stream()
        
        results = []
        for doc in docs:
            data = doc.to_dict()
            # Convert timestamp to string if needed, or let frontend handle it
            # Firestore timestamps are objects, we might need to serialize them
            if 'created_at' in data and data['created_at']:
                 data['created_at'] = data['created_at'].isoformat()
            
            results.append(data)
            
        return results
    except Exception as e:
        print(f"Error fetching results: {e}")
        return []
