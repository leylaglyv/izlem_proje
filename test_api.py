import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load .env
load_dotenv('.env')
api_key = os.getenv("GOOGLE_API_KEY")

print(f"Testing API Key: {api_key[:10]}...")

try:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Say 'Backend is working!'")
    print("Success!")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Failed: {str(e)}")
