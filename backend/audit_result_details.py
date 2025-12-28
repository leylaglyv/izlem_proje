from firebase_config import db

def audit_results_detail():
    print("--- DETAILED RESULTS AUDIT ---")
    docs = db.collection('exam_results').stream()
    total = 0
    incomplete = 0
    
    for doc in docs:
        total += 1
        data = doc.to_dict()
        results = data.get('results', [])
        
        has_issue = False
        if not results:
            print(f"Doc {doc.id} ({data.get('student_name')}): NO RESULTS LIST")
            has_issue = True
        else:
            for r in results:
                # Check for D, Y, N
                d = r.get('D')
                y = r.get('Y')
                n = r.get('N')
                
                if d is None or y is None or n is None:
                    has_issue = True
                    break
        
        if has_issue:
            incomplete += 1
            print(f"Doc {doc.id} ({data.get('student_name')}): INCOMPLETE DATA (D:{r.get('D')}, Y:{r.get('Y')}, N:{r.get('N')})")

    print(f"\nSummary: {incomplete} / {total} records have incomplete results details.")

if __name__ == "__main__":
    audit_results_detail()
