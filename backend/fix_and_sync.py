from firebase_config import db
from auth_services import create_or_update_student_user, slugify

def fix_and_sync():
    print("--- STARTING DATA FIX AND SYNC ---")
    
    # 1. Get all exam results
    results = db.collection('exam_results').stream()
    count = 0
    
    for doc in results:
        data = doc.to_dict()
        name = str(data.get('student_name', '')).strip()
        sid = str(data.get('student_id', '')).strip()
        
        if name and sid:
            # Update the result itself to ensure it's clean
            doc.reference.update({
                "student_name": name,
                "student_id": sid
            })
            
            # Create or update the user account
            # This uses slugify(name) as the doc ID
            create_or_update_student_user(name, sid)
            count += 1
            if count % 10 == 0:
                print(f"Processed {count} entries...")

    print(f"\nFinished. Total processed and synced: {count}")

if __name__ == "__main__":
    fix_and_sync()
