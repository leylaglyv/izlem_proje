import os
import google.generativeai as genai
from dotenv import load_dotenv

# Setup logging manually to file
def log(msg):
    print(msg)
    with open("diagnostic_output_v4.txt", "a", encoding="utf-8") as f:
        f.write(msg + "\n")

if os.path.exists("diagnostic_output_v4.txt"):
    os.remove("diagnostic_output_v4.txt")

log("Starting Multi-Model Diagnostic...")

# Load Env
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)
api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

models_to_test = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-flash-latest',
    'gemini-pro'
]

for model_name in models_to_test:
    log(f"\n--- Testing Model: {model_name} ---")
    try:
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Say 'Test' if you work.")
        log(f"SUCCESS: {model_name} responded: {response.text}")
    except Exception as e:
        log(f"FAIL: {model_name} Error: {str(e)}")

log("\nDiagnostic Complete.")
