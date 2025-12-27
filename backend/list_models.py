import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load .env from project root (one directory up from backend)
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path)

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("API Key not found!")
else:
    genai.configure(api_key=api_key)
    try:
        print("Listing models...")
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(m.name)
    except Exception as e:
        print(f"Error: {e}")
