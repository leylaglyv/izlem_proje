import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from services import analyze_exam_results, get_all_results_from_firestore
from fastapi.middleware.cors import CORSMiddleware
from logger import logger
import traceback
import time

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    try:
        response = await call_next(request)
        process_time = (time.time() - start_time) * 1000
        logger.info(f"Path: {request.url.path} Method: {request.method} Status: {response.status_code} Time: {process_time:.2f}ms")
        return response
    except Exception as e:
        process_time = (time.time() - start_time) * 1000
        logger.error(f"Request failed: Path: {request.url.path} Method: {request.method} Error: {str(e)} Time: {process_time:.2f}ms")
        logger.error(traceback.format_exc())
        raise e

@app.get("/")
def read_root():
    logger.info("Health check endpoint called")
    return {"message": "AI Analysis Platform Backend is Running!"}

@app.post("/api/analyze")
def upload_results(file: UploadFile = File(...)):
    """
    Endpoint for uploading and analyzing PDF exam results.
    """
    logger.info(f"Received analysis request for file: {file.filename}, content_type: {file.content_type}")
    
    if file.content_type != "application/pdf":
        logger.warning(f"Invalid file type uploaded: {file.content_type}")
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    try:
        # Read file synchronously
        contents = file.file.read()
        logger.info(f"File read successfully. Size: {len(contents)} bytes")
        
        # Call the new analysis function
        results = analyze_exam_results(contents)
        
        if not results:
             logger.error("Analysis returned empty results.")
             raise HTTPException(status_code=500, detail="Öğrenci belgesi analiz edilemedi. AI servisi yoğun olabilir veya dosya okunamadı. Lütfen tekrar deneyin.")

        logger.info(f"Successfully processed and saved results. Count: {len(results)}")
        
        return {
            "message": "Successfully processed and saved results",
            "count": len(results),
            "results": results
        }
    except HTTPException as he:
        logger.error(f"HTTP Exception during analysis: {he.detail}")
        raise he
    except Exception as e:
        logger.error(f"Backend Error: {e}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Sunucu hatası: {str(e)}")

@app.get("/api/results")
def get_results():
    results = get_all_results_from_firestore()
    return results
