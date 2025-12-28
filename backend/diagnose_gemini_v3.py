import os
import google.generativeai as genai
from dotenv import load_dotenv
import PIL.Image
import io

# Setup logging manually to file
def log(msg):
    print(msg)
    with open("diagnostic_output.txt", "a", encoding="utf-8") as f:
        f.write(msg + "\n")

if os.path.exists("diagnostic_output.txt"):
    os.remove("diagnostic_output.txt")

log("Starting Gemini Diagnostic...")

# Load Env
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
log(f"Loading .env from: {dotenv_path}")
load_dotenv(dotenv_path)

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    log("CRITICAL: GOOGLE_API_KEY not found in env!")
else:
    log(f"API Key found: {api_key[:5]}...{api_key[-5:]}")

# Configure GenAI
try:
    genai.configure(api_key=api_key)
    log("GenAI Configured.")
except Exception as e:
    log(f"GenAI Configuration Error: {e}")

# Test Simple Text
try:
    log("Testing Simple Text Generation...")
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Hello, can you hear me?")
    log(f"Text Response: {response.text}")
except Exception as e:
    log(f"Text Generation Error: {e}")

# Test Image (Create dummy white image)
try:
    log("Testing Image Generation...")
    img = PIL.Image.new('RGB', (100, 100), color = 'white')
    response = model.generate_content(["Describe this image", img])
    log(f"Image Response: {response.text}")
except Exception as e:
    log(f"Image Generation Error: {e}")

log("Diagnostic Complete.")
