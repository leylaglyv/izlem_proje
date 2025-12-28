from firebase_config import db
import json

def prune_duplicates():
    print("--- PRUNING DUPLICATE EXAM ENTRIES ---")
    docs = list(db.collection('exam_results').stream())
    
    content_map = {}
    deleted_count = 0
    
    for doc in docs:
        data = doc.to_dict()
        sid = data.get('student_id')
        results = data.get('results', [])
        
        # Consistent string for comparison
        sorted_results = sorted(results, key=lambda x: x.get('subject', ''))
        results_str = json.dumps(sorted_results, sort_keys=True)
        
        key = (sid, results_str)
        if key not in content_map:
            # Keep the first one we find
            content_map[key] = doc.id
        else:
            # Delete the extra one
            doc.reference.delete()
            print(f"Deleted duplicate: Doc {doc.id} for Student {sid}")
            deleted_count += 1

    print(f"\nPruning Finished. Deleted {deleted_count} duplicates.")

if __name__ == "__main__":
    prune_duplicates()
