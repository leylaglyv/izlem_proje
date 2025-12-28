import requests

def test_login(username, password, role):
    url = "http://localhost:8001/api/login"
    data = {
        "username": username,
        "password": password,
        "role": role
    }
    try:
        response = requests.post(url, json=data)
        print(f"Testing {role} login with {username}/{password}")
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.json()}")
        print("-" * 30)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Test Teacher (should match .env or defaults)
    test_login("admin", "wrongpassword", "Öğretmen")
    test_login("admin", "gbb123", "Öğretmen")
    test_login("fakeuser", "fakepass", "Öğretmen")
    
    # Test Student
    test_login("fake_student", "123", "Öğrenci")
