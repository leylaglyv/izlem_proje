from firebase_config import db
from auth_services import slugify

def audit_data():
    print("--- STARTING DATA AUDIT ---")
    
    # 1. Get all exam results
    results = db.collection('exam_results').stream()
    result_list = []
    for r in results:
        data = r.to_dict()
        data['doc_id'] = r.id
        result_list.append(data)
    
    print(f"Found {len(result_list)} total exam result entries.")

    # 2. Get all users
    users = db.collection('users').stream()
    user_map = {}
    for u in users:
        data = u.to_dict()
        user_map[u.id] = data
    
    print(f"Found {len(user_map)} total user accounts.")

    # 3. Check for mismatches
    print("\n--- ANALYZING MISMATCHES ---")
    orphaned_results = 0
    type_mismatches = 0
    
    for res in result_list:
        name = res.get('student_name')
        sid = res.get('student_id')
        
        # Determine what the username SHOULD be based on the slugify logic
        expected_username = slugify(name) if name else None
        
        user_account = user_map.get(expected_username)
        
        if not user_account:
            print(f"[MISSING USER] Result for '{name}' (ID: {sid}) has no user account '{expected_username}'")
            orphaned_results += 1
        else:
            # Check if student_id matches
            user_sid = user_account.get('student_id')
            if str(user_sid).strip() != str(sid).strip():
                print(f"[ID MISMATCH] User '{expected_username}' has ID '{user_sid}' but Result has ID '{sid}'")
                type_mismatches += 1

    print(f"\n--- SUMMARY ---")
    print(f"Orphaned Results: {orphaned_results}")
    print(f"ID Mismatches: {type_mismatches}")

if __name__ == "__main__":
    audit_data()
