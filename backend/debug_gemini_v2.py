import os
import sys
import traceback

# Add backend directory to path
sys.path.append(os.getcwd())
from services import analyze_pdf

def test_analyze():
    pdf_path = r"c:\Ampps\www\proje\frontend\public\demo_test.pdf"
    
    if not os.path.exists(pdf_path):
        print(f"Error: PDF file not found at {pdf_path}")
        return

    print(f"Reading PDF from {pdf_path}...")
    with open(pdf_path, "rb") as f:
        pdf_bytes = f.read()

    print("Calling analyze_pdf...")
    try:
        results = analyze_pdf(pdf_bytes)
        print("Analysis finished.")
        print("Results:", results)
    except Exception:
        print("CRITICAL ERROR CAUGHT IN MAIN:")
        traceback.print_exc()

if __name__ == "__main__":
    test_analyze()
