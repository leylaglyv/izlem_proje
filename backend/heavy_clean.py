from firebase_config import db
from auth_services import slugify

def heavy_clean():
    print("--- STARTING HEAVY CLEAN AND REBUILD ---")
    
    # 1. Fetch all exam results
    results_docs = list(db.collection('exam_results').stream())
    print(f"Found {len(results_docs)} exam results.")

    # 2. Build a mapping of NameSlug -> {sid_votes, results[]}
    student_map = {}
    
    for doc in results_docs:
        data = doc.to_dict()
        name = str(data.get('student_name', '')).strip()
        sid = str(data.get('student_id', '')).strip()
        
        if not name: continue
        
        slug = slugify(name)
        if slug not in student_map:
            student_map[slug] = {
                "name": name,
                "ids": {}, # sid -> count
                "docs": []
            }
        
        student_map[slug]["ids"][sid] = student_map[slug]["ids"].get(sid, 0) + 1
        student_map[slug]["docs"].append(doc)

    print(f"Found {len(student_map)} unique student name-slugs.")

    # 3. Clear Users collection (optional but safer for sync)
    print("Clearing 'users' collection for students (not teachers)...")
    users = db.collection('users').where("role", "==", "Öğrenci").stream()
    for u in users:
        u.reference.delete()

    # 4. Rebuild Users and update Results
    for slug, data in student_map.items():
        # Pick the most common SID for this student
        best_sid = max(data["ids"], key=data["ids"].get)
        
        print(f"Rebuilding {slug}: '{data['name']}' with ID '{best_sid}'")
        
        # Create user doc
        user_data = {
            "username": slug,
            "password": best_sid,
            "name": data["name"],
            "student_id": best_sid,
            "role": "Öğrenci"
        }
        db.collection("users").document(slug).set(user_data)
        
        # Update all results for this student to have the same canonical ID
        for result_doc in data["docs"]:
            res_data = result_doc.to_dict()
            if res_data.get("student_id") != best_sid:
                result_doc.reference.update({"student_id": best_sid})

    print("\nHEAVY CLEAN FINISHED.")

if __name__ == "__main__":
    heavy_clean()
