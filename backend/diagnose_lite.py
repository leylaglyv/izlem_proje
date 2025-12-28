import os
import google.generativeai as genai
from dotenv import load_dotenv

def log(msg):
    print(msg)
    with open("diagnostic_output_lite.txt", "a", encoding="utf-8") as f:
        f.write(msg + "\n")

if os.path.exists("diagnostic_output_lite.txt"):
    os.remove("diagnostic_output_lite.txt")

log("Starting Lite Model Diagnostic...")

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

models_to_test = [
    'gemini-2.0-flash-lite-preview-02-05',
    'gemini-2.0-flash-lite',
    'gemini-1.5-pro-latest' # Just in case
]

for model_name in models_to_test:
    log(f"\n--- Testing Model: {model_name} ---")
    try:
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Test")
        log(f"SUCCESS: {model_name} responded: {response.text}")
    except Exception as e:
        log(f"FAIL: {model_name} Error: {str(e)}")

log("\nDiagnostic Complete.")
