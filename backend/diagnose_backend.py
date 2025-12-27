import os
import fitz
from services import analyze_pdf_robust, GOOGLE_API_KEY
import sys

def create_dummy_pdf():
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((50, 50), "Öğrenci Adı: Test Öğrenci\nNumara: 12345\nMatematik D: 10 Y: 5 N: 8.75")
    pdf_bytes = doc.tobytes()
    return pdf_bytes

def test_analysis():
    print(f"Checking API Key: {'Found' if GOOGLE_API_KEY else 'MISSING'}")
    
    print("Creating dummy PDF...")
    pdf_bytes = create_dummy_pdf()
    
    print("Running analyze_pdf_robust...")
    try:
        results = analyze_pdf_robust(pdf_bytes)
        print("Analysis Result:")
        print(results)
    except Exception as e:
        print(f"Analysis Failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_analysis()
