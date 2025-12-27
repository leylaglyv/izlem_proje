import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import os

def initialize_firebase():
    if not firebase_admin._apps:
        cred_path = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")
        if not os.path.exists(cred_path):
            raise FileNotFoundError(f"serviceAccountKey.json not found at {cred_path}")
        
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)

initialize_firebase()
db = firestore.client()
