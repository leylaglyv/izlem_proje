from firebase_config import db
from auth_services import create_or_update_student_user

def re_normalize_and_backfill():
    print("--- RE-NORMALIZING AND BACKFILLING ---")
    
    # 1. Get all results
    docs = db.collection('exam_results').stream()
    count = 0
    for doc in docs:
        data = doc.to_dict()
        name = str(data.get('student_name', '')).strip()
        sid = str(data.get('student_id', '')).strip()
        
        if name and sid:
            # Update the result document itself with normalized values
            if data.get('student_name') != name or data.get('student_id') != sid:
                doc.reference.update({
                    "student_name": name,
                    "student_id": sid
                })
                print(f"Updated Doc {doc.id}: {name} ({sid})")
            
            # Ensure user account exists
            create_or_update_student_user(name, sid)
            count += 1
            
    print(f"Finished. Total processed: {count}")

if __name__ == "__main__":
    re_normalize_and_backfill()
