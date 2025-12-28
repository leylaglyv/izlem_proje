import os
import fitz  # PyMuPDF
import PIL.Image
import google.generativeai as genai
from dotenv import load_dotenv
import json
import time
import io
import typing_extensions
from firebase_admin import firestore
from firebase_config import db
from logger import logger  # IMPORT LOGGER

# Load .env
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    logger.critical("GOOGLE_API_KEY is missing in .env")

genai.configure(api_key=GOOGLE_API_KEY)

# --- CONFIGURATION ---
# Updated based on available models list
# Updated based on available models list and quota exhaustion on 2.0
PRIMARY_MODEL = 'gemini-2.5-flash' 
FALLBACK_MODEL = 'gemini-2.0-flash-exp' 
MAX_RETRIES = 3
RETRY_DELAY = 20 # Increased delay 

class SubjectResult(typing_extensions.TypedDict):
    subject: str
    D: int
    Y: int
    N: float

class StudentResult(typing_extensions.TypedDict):
    student_name: str
    student_id: str
    student_class: str
    results: list[SubjectResult]
    score_analysis: dict
    topic_analysis: dict
    comparison: dict
    suggestion: str

# --- CORE FUNCTIONS ---

def get_gemini_model(model_name=PRIMARY_MODEL):
    return genai.GenerativeModel(model_name)

def generate_with_retry(model, content, config):
    retries = 0
    while retries < MAX_RETRIES:
        try:
            return model.generate_content(content, generation_config=config)
        except Exception as e:
            error_str = str(e).lower()
            logger.warning(f"Gemini Attempt {retries+1}/{MAX_RETRIES} Failed: {error_str}")
            
            if "429" in error_str or "quota" in error_str or "resource exhausted" in error_str:
                sleep_time = RETRY_DELAY * (retries + 1)
                logger.warning(f"⚠️ Quota Exceeded. Sleeping {sleep_time}s...")
                time.sleep(sleep_time)
                retries += 1
            elif "404" in error_str or "not found" in error_str:
                logger.error("Model not found (404). Stopping retries for this model.")
                raise e # Let caller handle fallback
            else:
                logger.error(f"Non-retriable error: {e}")
                raise e
                
    raise Exception("Max retries exceeded for Gemini API.")

def convert_pdf_to_images(pdf_bytes: bytes, max_pages: int = 5) -> list[PIL.Image.Image]:
    images = []
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        for i, page in enumerate(doc):
            if i >= max_pages: 
                break
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2)) 
            img_data = pix.tobytes("png")
            image = PIL.Image.open(io.BytesIO(img_data))
            images.append(image)
        logger.info(f"✓ Converted {len(images)} PDF pages to images.")
        return images
    except Exception as e:
        logger.error(f"❌ Error converting PDF to images: {e}")
        return []

def analyze_exam_results(pdf_bytes: bytes) -> list[dict]:
    logger.info(f"--- Starting Analysis (Primary: {PRIMARY_MODEL}) ---")
    
    images = convert_pdf_to_images(pdf_bytes)
    if not images:
        return []

    prompt = """
    Sen uzman bir eğitim analistisin. Görevin, sana verilen Sınav Sonuç Belgesi (veya Karne) görsellerini analiz ederek, öğrencinin performansını en ince detayına kadar çıkarmaktır.

    **GÖREVLER:**
    1. **Kimlik Bilgileri:** Öğrenci Adı, Numarası, Sınıfı.
    2. **Ders Bazlı Performans:** Tablodaki her bir ders için Doğru (D), Yanlış (Y) ve Net (N) sayılarını eksiksiz çıkar. Sütun kaymalarına dikkat et.
    3. **Puan Analizi:** TYT veya ilgili sınav puanını, genel/ilçe/kurum sıralamalarını bul.
    4. **Konu Analizi (Çok Önemli):**
       - 'Konu Analizi' veya benzeri tablolarda, öğrencinin hangi konuda hata yaptığını (Yanlış > 0 veya Boş) tespit et (Hatalı/Eksik Konular).
       - Başarılı olduğu konuları tespit et.
    5. **Tavsiye:** Öğrencinin eksik olduğu konulara göre ona özel, yapıcı ve "şu konulara çalışmalısın" diyen bir tavsiye yazısı yaz.

    **ÇIKTI FORMATI (JSON):**
    Yanıtın SADECE geçerli bir JSON array olmalı. Markdown (```json ... ```) kullanma.
    Format:
    [
        {
            "student_name": "...",
            "student_id": "...",
            "student_class": "...",
            "results": [{"subject": "M...", "D": 0, "Y": 0, "N": 0}],
            "score_analysis": {"tyt_score": 0, "general_rank": 0},
            "topic_analysis": {"successful_topics": [], "failed_topics": [], "weak_topics": []},
            "comparison": {"general_comments": "..."},
            "suggestion": "..."
        }
    ]
    """

    generation_config = genai.GenerationConfig(
        response_mime_type="application/json"
    )

    # 1. Try Primary Model
    try:
        model = get_gemini_model(PRIMARY_MODEL)
        response = generate_with_retry(model, [prompt] + images, generation_config)
        return process_response(response)
    except Exception as e:
        logger.error(f"❌ Primary Model ({PRIMARY_MODEL}) Failed: {e}")
        
        # 2. Try Fallback Model
        logger.info(f"🔄 Attempting Fallback to {FALLBACK_MODEL}...")
        try:
            model = get_gemini_model(FALLBACK_MODEL)
            response = generate_with_retry(model, [prompt] + images, generation_config)
            return process_response(response)
        except Exception as e2:
            logger.error(f"❌ Fallback Model ({FALLBACK_MODEL}) Failed: {e2}")
            return []

def process_response(response):
    try:
        text_response = response.text.strip()
        if text_response.startswith("```json"):
            text_response = text_response[7:]
        if text_response.endswith("```"):
            text_response = text_response[:-3]
            
        data = json.loads(text_response)
        save_results_to_firestore(data)
        return data
    except Exception as e:
        logger.error(f"JSON Parsing Error: {e}. Content: {response.text[:100]}...")
        return []

def save_results_to_firestore(results: list[dict]):
    if not results: return
    
    try:
        batch = db.batch()
        for result in results:
            doc_ref = db.collection("exam_results").document()
            doc_data = result.copy()
            doc_data["created_at"] = firestore.SERVER_TIMESTAMP
            batch.set(doc_ref, doc_data)
        batch.commit()
        logger.info(f"✓ Saved {len(results)} results to Firestore.")
    except Exception as e:
        logger.error(f"❌ Firestore Save Error: {e}")

def get_all_results_from_firestore():
    """
    Retrieves all exam results.
    """
    try:
        docs = db.collection("exam_results").order_by("created_at", direction=firestore.Query.DESCENDING).stream()
        results = []
        for doc in docs:
            data = doc.to_dict()
            if 'created_at' in data and data['created_at']:
                # Convert datetime to ISO string
                data['created_at'] = data['created_at'].isoformat()
            results.append(data)
        return results
    except Exception as e:
        logger.error(f"Error fetching results: {e}")
        return []
