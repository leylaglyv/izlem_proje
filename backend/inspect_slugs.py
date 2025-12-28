from firebase_config import db
from auth_services import slugify

def inspect_slugs():
    print("--- SLUG INSPECTOR ---")
    
    # Check what slugify produces for the famous Zehra
    test_name = "ZEHRA ŞAHİN"
    slug = slugify(test_name)
    print(f"Name: {test_name}")
    print(f"Slug: {repr(slug)}")
    print(f"Hex: {slug.encode('utf-8').hex()}")

    # Check what's actually in Firestore Users
    print("\n--- FIRESTORE USERS ---")
    users = db.collection('users').stream()
    for u in users:
        if 'zehra' in u.id.lower():
            print(f"DocID: {repr(u.id)}")
            print(f"Hex  : {u.id.encode('utf-8').hex()}")

if __name__ == "__main__":
    inspect_slugs()
