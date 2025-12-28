from firebase_config import db

def list_users():
    print("--- FIRESTORE USERS ---")
    users = db.collection("users").stream()
    count = 0
    for user in users:
        count += 1
        data = user.to_dict()
        print(f"DocID: {user.id} | Data: {data}")
    print(f"Total users: {count}")

if __name__ == "__main__":
    list_users()
