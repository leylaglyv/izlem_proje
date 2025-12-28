import os
import google.generativeai as genai
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore
import sys

def verify_system():
    with open("verify_result.txt", "w", encoding="utf-8") as f:
        def log(msg):
            print(msg)
            f.write(msg + "\n")
            
        log("--- Starting System Verification ---")
        
        # 1. Check .env and API Key
        dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
        if os.path.exists(dotenv_path):
            load_dotenv(dotenv_path)
            log("PASS: .env file found.")
        else:
            log("FAIL: .env file NOT found!")
            return

        api_key = os.getenv("GOOGLE_API_KEY")
        if api_key:
            log(f"PASS: Google API Key found (starts with: {api_key[:5]}...)")
        else:
            log("FAIL: Google API Key is MISSING in .env!")
            return

        # 2. Check Gemini Model Availability
        try:
            genai.configure(api_key=api_key)
            log("\n--- Checking Gemini Models ---")
            
            TargetModel = 'models/gemini-1.5-flash'
            found = False
            # list_models returns an iterable
            for m in genai.list_models():
                if TargetModel in m.name:
                    found = True
                    break
            
            if found:
                 log("PASS: 'gemini-1.5-flash' is available.")
                 # Try a simple generation
                 model = genai.GenerativeModel('gemini-1.5-flash')
                 response = model.generate_content("Hello")
                 log(f"PASS: Test Generation: {response.text.strip()}")
            else:
                 log(f"FAIL: '{TargetModel}' was NOT found.")
                 log("Available models:")
                 for m in genai.list_models():
                     log(f" - {m.name}")

        except Exception as e:
            log(f"FAIL: Error connecting to Gemini API: {e}")

        # 3. Check Firebase Connection
        log("\n--- Checking Firebase Connection ---")
        cred_path = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")
        if os.path.exists(cred_path):
             log("PASS: serviceAccountKey.json found.")
             try:
                 if not firebase_admin._apps:
                     cred = credentials.Certificate(cred_path)
                     firebase_admin.initialize_app(cred)
                 
                 db = firestore.client()
                 # Try to list collections (read operation)
                 # Note: db.collections() returns a generator
                 cols = list(db.collections()) 
                 log(f"PASS: Firebase initialized. Found {len(cols)} root collections.")
             except Exception as e:
                 log(f"FAIL: Firebase Connection Failed: {e}")
        else:
             log("FAIL: serviceAccountKey.json NOT found!")

        log("\n--- Verification Complete ---")

if __name__ == "__main__":
    verify_system()
