import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

model = genai.GenerativeModel('gemini-2.0-flash-lite')
try:
    print("Sending 'Hello' to gemini-2.0-flash-lite...")
    response = model.generate_content("Hello")
    print(f"SUCCESS: {response.text}")
except Exception as e:
    print(f"ERROR: {e}")
