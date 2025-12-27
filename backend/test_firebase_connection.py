import firebase_admin
from firebase_admin import credentials, firestore
import os

try:
    cred_path = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")
    if not os.path.exists(cred_path):
        print("HATA: serviceAccountKey.json bulunamadı!")
        exit(1)

    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)
    db = firestore.client()

    # Test yazma işlemi
    db.collection("test_collection").document("test_doc").set({"status": "connected", "timestamp": firestore.SERVER_TIMESTAMP})
    print("BAŞARILI: Firestore bağlantısı kuruldu ve test verisi yazıldı.")
    
    # Proje ID'sini yazdıralım (Frontend config için lazım olacak)
    print(f"Project ID: {cred.project_id}")

except Exception as e:
    print(f"HATA OLUŞTU: {e}")
