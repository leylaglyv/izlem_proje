import requests

def test_results_endpoint():
    print("Testing /api/results endpoint...")
    try:
        response = requests.get("http://localhost:8001/api/results")
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            results = response.json()
            print(f"Fetched {len(results)} results.")
            if results:
                print(f"First result: {results[0].get('student_name')} ({results[0].get('student_id')})")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_results_endpoint()
