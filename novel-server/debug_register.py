import requests
import json

API_URL = "http://localhost:8000"

def test_register():
    payload = {
        "username": "nhan010902",
        "email": "nhan010902@gmail.com",
        "password": "password123"
    }
    
    print(f"Sending registration request to {API_URL}/auth/register...")
    try:
        response = requests.post(f"{API_URL}/auth/register", json=payload)
        print(f"Status Code: {response.status_code}")
        print("Response Body:")
        print(response.text)
    except Exception as e:
        print(f"Connection Error: {e}")

if __name__ == "__main__":
    test_register()
