import requests
import json

API_URL = "http://localhost:8000"

def verify_user(email, code):
    payload = {
        "email": email,
        "code": code
    }
    
    print(f"Sending verification request for {email} with code {code}...")
    try:
        response = requests.post(f"{API_URL}/auth/verify", json=payload)
        print(f"Status Code: {response.status_code}")
        print("Response Body:")
        print(response.text)
    except Exception as e:
        print(f"Connection Error: {e}")

if __name__ == "__main__":
    verify_user("nhan010902@gmail.com", "721658")
