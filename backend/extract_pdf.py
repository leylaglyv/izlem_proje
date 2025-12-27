import fitz
import os

source_path = r"c:\Ampps\www\proje\GÜLŞEN BATAR APOTEMİ 12.SINIF.pdf"
output_path = r"c:\Ampps\www\proje\frontend\public\demo_test.pdf"

# Create output directory if it doesn't exist
os.makedirs(os.path.dirname(output_path), exist_ok=True)

try:
    src_doc = fitz.open(source_path)
    new_doc = fitz.open()
    
    # Extract pages 23 to 33 (1-based) -> indices 22 to 32 (0-based)
    # fitz checks are inclusive for from_page and to_page
    new_doc.insert_pdf(src_doc, from_page=22, to_page=32)
    
    new_doc.save(output_path)
    print(f"Successfully created {output_path} with {new_doc.page_count} pages.")
except Exception as e:
    print(f"Error: {e}")
