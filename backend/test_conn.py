import requests
import json
import io

BASE_URL = "http://127.0.0.1:5000"

def test_endpoint(name, url, method="GET", data=None, files=None):
    print(f"\n--- Testing {name} ---")
    try:
        if method == "POST":
            # For FormData, utilize 'data' for form fields and 'files' for file uploads
            r = requests.post(url, data=data, files=files) 
        else:
            r = requests.get(url)
        
        print(f"Status: {r.status_code}")
        print(f"Content-Type: {r.headers.get('Content-Type')}")
        if r.status_code == 200:
            print("Response:", r.text[:300] + "...")
        else:
            print("Error Response:", r.text[:300])
    except Exception as e:
        print(f"FAILED: {e}")

# Dummy Resume File
dummy_file = io.BytesIO(b"Job Description: Looking for Python and React developers.")
dummy_file.name = "jd.pdf"

test_endpoint("Analyze with JD (FormData)", f"{BASE_URL}/analyze_with_jd", "POST", 
              data={"user_skills": json.dumps(["Python", "Java"])},
              files={"jd_file": dummy_file}
)
