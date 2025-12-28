from firebase_config import db

def repair_results_detail():
    print("--- REPAIRING RESULTS DETAIL ---")
    docs = db.collection('exam_results').stream()
    repaired_count = 0
    
    for doc in docs:
        data = doc.to_dict()
        results = data.get('results', [])
        changed = False
        
        if not isinstance(results, list):
            print(f"Doc {doc.id}: Results is not a list. Skipping or fixing if possible.")
            continue
            
        new_results = []
        for r in results:
            if not isinstance(r, dict):
                continue
            
            # Normalize D (Correct)
            d = r.get('D')
            try:
                d_val = int(float(str(d))) if d is not None else 0
            except:
                d_val = 0
            
            # Normalize Y (Wrong)
            y = r.get('Y')
            try:
                y_val = int(float(str(y))) if y is not None else 0
            except:
                y_val = 0
                
            # Normalize N (Net)
            n = r.get('N')
            try:
                n_val = float(str(n)) if n is not None else (d_val - (y_val * 0.25))
            except:
                n_val = float(d_val - (y_val * 0.25))
            
            # Round net to 2 decimals
            n_val = round(max(0, n_val), 2)
            
            if d != d_val or y != y_val or n != n_val:
                changed = True
                
            new_results.append({
                "subject": r.get('subject', 'Bilinmeyen Ders'),
                "D": d_val,
                "Y": y_val,
                "N": n_val
            })
            
        if changed:
            doc.reference.update({"results": new_results})
            repaired_count += 1
            print(f"Repaired Doc {doc.id} ({data.get('student_name')})")

    print(f"\nFinished. Total repaired: {repaired_count}")

if __name__ == "__main__":
    repair_results_detail()
