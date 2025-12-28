import os
import re
from firebase_config import db
from dotenv import load_dotenv

# Load .env
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dotenv_path = os.path.join(BASE_DIR, '.env')
load_dotenv(dotenv_path)

def slugify(text):
    """
    Simple slugify to create usernames from names.
    """
    text = text.lower()
    text = text.replace('ı', 'i').replace('ğ', 'g').replace('ü', 'u').replace('ş', 's').replace('ö', 'o').replace('ç', 'c')
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'\s+', '.', text).strip('.')
    return text

def create_or_update_student_user(student_name, student_id):
    """
    Creates or updates a student user in Firestore with specific credentials.
    Username: slugified name (e.g., mehmet.deniz)
    Password: student_id (okul no)
    """
    if not student_name or not student_id:
        return None

    username = slugify(student_name)
    # As requested: Username = isim.soyisim, Password = student_id
    user_data = {
        "username": username,
        "password": str(student_id).strip(),
        "name": student_name,
        "student_id": str(student_id),
        "role": "Öğrenci"
    }

    # Use username as document ID for easy lookup
    db.collection("users").document(username).set(user_data)
    print(f"DEBUG: Student user created/updated: {username}")
    return user_data

def verify_user(username, password, role):
    """
    Verifies credentials for both Teachers and Students.
    """
    # Normalize inputs
    username = str(username).strip()
    password = str(password).strip()
    role_norm = str(role).strip().lower()
    
    # Robust role detection
    # 'Öğretmen' and 'Öğrenci' both start with 'ö'.
    if "etmen" in role_norm or "teacher" in role_norm:
        is_teacher = True
        is_student = False
    elif "enci" in role_norm or "student" in role_norm:
        is_teacher = False
        is_student = True
    else:
        is_teacher = False
        is_student = False

    if is_teacher:
        print("DEBUG: Identified as TEACHER role")
        teacher_user = os.getenv("TEACHER_USERNAME")
        teacher_pass = os.getenv("TEACHER_PASSWORD")
        
        # Hard fallbacks to ensure it works even if .env fails
        if not teacher_user: teacher_user = "ogretmen"
        if not teacher_pass: teacher_pass = "gbb123"
        
        print(f"DEBUG: Comparing against -> user: {repr(teacher_user)}, pass: {repr(teacher_pass)}")
        
        if username == teacher_user and password == teacher_pass:
            print("DEBUG: RESULT -> Teacher MATCH")
            return {"name": "Öğretmen", "username": username, "role": "Öğretmen"}
        else:
            print(f"DEBUG: RESULT -> Teacher MISMATCH (User match: {username == teacher_user}, Pass match: {password == teacher_pass})")
        return None

    elif is_student:
        print("DEBUG: Identified as STUDENT role")
        # Check Firestore for student
        print(f"DEBUG: Checking student in Firestore: {repr(username)}")
        try:
            user_doc = db.collection("users").document(username).get()
            if user_doc.exists:
                user_data = user_doc.to_dict()
                db_pass = str(user_data.get("password")).strip()
                print(f"DEBUG: Student found. DB Password: {repr(db_pass)}")
                if db_pass == password:
                    print("DEBUG: RESULT -> Student MATCH")
                    return user_data
                else:
                    print(f"DEBUG: RESULT -> Student PASSWORD MISMATCH")
            else:
                print("DEBUG: RESULT -> Student NOT FOUND in Firestore")
        except Exception as e:
            print(f"DEBUG: ERROR during Firestore lookup: {e}")
    else:
        print(f"DEBUG: ROLE NOT RECOGNIZED: {repr(role_norm)}")
    
    return None
