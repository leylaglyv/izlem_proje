from fastapi import FastAPI, UploadFile, File, HTTPException
from services import analyze_pdf_robust, save_results_to_firestore
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
def read_root():
    return {"message": "AI Analysis Platform Backend is Running!"}

@app.post("/api/analyze")
def upload_results(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    try:
        # Read file synchronously since we are in a threadpool
        contents = file.file.read()
        results = analyze_pdf_robust(contents)
        
        if not results:
             print("Analysis returned empty results.")
             raise HTTPException(status_code=500, detail="Öğrenci belgesi okunamadı veya AI servisi yanıt vermedi. Lütfen tekrar deneyin.")

        save_results_to_firestore(results)
        
        return {
            "message": "Successfully processed and saved results",
            "count": len(results),
            "results": results
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Backend Error: {e}")
        raise HTTPException(status_code=500, detail=f"Sunucu hatası: {str(e)}")

@app.get("/api/results")
def get_results():
    from services import get_all_results_from_firestore
    results = get_all_results_from_firestore()
    return results
