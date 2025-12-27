import os
import sys

# Add backend directory to path so we can import services
sys.path.append(os.getcwd())
from backend.services import analyze_pdf, save_results_to_firestore
import json

def test_analyze():
    pdf_path = r"c:\Ampps\www\proje\GÜLŞEN BATAR APOTEMİ 12.SINIF.pdf"
    
    if not os.path.exists(pdf_path):
        print(f"Error: PDF file not found at {pdf_path}")
        return

    print(f"Reading PDF from {pdf_path}...")
    with open(pdf_path, "rb") as f:
        pdf_bytes = f.read()

    print(f"Testing with full file (assuming it is single page)...")

    print("Calling analyze_pdf...")
    try:
        results = analyze_pdf(pdf_bytes)
        print("\nAnalysis Result:")
        print(json.dumps(results, indent=2, ensure_ascii=False))
        
        if results and isinstance(results, list):
             print("\nSUCCESS: Received a list of results.")
             if len(results) > 0 and 'results' in results[0] and isinstance(results[0]['results'], list):
                 print("SUCCESS: 'results' inside student record is a list.")
                 
                 print("\nTesting Firestore Save...")
                 try:
                     save_results_to_firestore(results)
                     print("SUCCESS: Saved to Firestore without error.")
                 except Exception as e:
                     print(f"FAILURE: Error saving to Firestore: {e}")

             else:
                 print("WARNING: Check inner 'results' structure.")
        else:
             print("\nFAILURE: Did not receive a list.")

    except Exception as e:
        print(f"\nERROR during analysis: {e}")

if __name__ == "__main__":
    test_analyze()
