from fastapi import FastAPI, UploadFile, File, HTTPException
from services import analyze_pdf, save_results_to_firestore
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
async def upload_results(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    try:
        contents = await file.read()
        results = analyze_pdf(contents)
        
        if not results:
             raise HTTPException(status_code=500, detail="Failed to analyze PDF or no results found")

        save_results_to_firestore(results)
        
        return {
            "message": "Successfully processed and saved results",
            "count": len(results),
            "results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
