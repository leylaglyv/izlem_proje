from firebase_config import db
import json

def audit_duplicates():
    print("--- AUDITING DUPLICATE EXAM ENTRIES ---")
    docs = db.collection('exam_results').stream()
    
    # Map to track unique content: (student_id, json_results) -> [doc_ids]
    content_map = {}
    total_docs = 0
    
    for doc in docs:
        total_docs += 1
        data = doc.to_dict()
        sid = data.get('student_id')
        results = data.get('results', [])
        
        # Create a stable string representation of the results for comparison
        # Sorting by subject to ensure order doesn't fail the match
        sorted_results = sorted(results, key=lambda x: x.get('subject', ''))
        results_str = json.dumps(sorted_results, sort_keys=True)
        
        key = (sid, results_str)
        if key not in content_map:
            content_map[key] = []
        content_map[key].append(doc.id)

    duplicates_found = 0
    for key, doc_ids in content_map.items():
        if len(doc_ids) > 1:
            duplicates_found += (len(doc_ids) - 1)
            print(f"Student {key[0]} has {len(doc_ids)} identical entries. Doc IDs: {doc_ids}")

    print(f"\nAudit Summary:")
    print(f"Total entries scanned: {total_docs}")
    print(f"Duplicate entries found: {duplicates_found}")
    
    return content_map

if __name__ == "__main__":
    audit_duplicates()
