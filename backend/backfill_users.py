from firebase_config import db
from auth_services import create_or_update_student_user

def backfill_users():
    print("--- BACKFILLING STUDENTS FROM EXAM RESULTS ---")
    docs = db.collection('exam_results').stream()
    count = 0
    for doc in docs:
        data = doc.to_dict()
        name = data.get('student_name')
        sid = data.get('student_id')
        if name and sid:
            print(f"Registering: {name} (ID: {sid})")
            create_or_update_student_user(name, sid)
            count += 1
    print(f"Finished. Total registered: {count}")

if __name__ == "__main__":
    backfill_users()
