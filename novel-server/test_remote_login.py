import requests
import sys

# URL của Backend trên Vercel (Lấy từ log của bạn)
# Bạn có thể thay đổi URL này nếu tên miền chính xác khác
BASE_URL = "https://novel-server-phi.vercel.app" 

def test_login(username, password):
    print(f"Testing login to {BASE_URL}...")
    print(f"User: {username}")
    
    # 1. Check Health
    try:
        r = requests.get(f"{BASE_URL}/")
        print(f"Server Health: {r.status_code} - {r.json()}")
    except Exception as e:
        print(f"❌ Could not connect to server root: {e}")
        return

    # 2. Login
    try:
        payload = {
            "username": username,
            "password": password
        }
        # FastAPI OAuth2PasswordRequestForm expects form-data, not json usually, 
        # but requests.post data=... sends form-data.
        r = requests.post(f"{BASE_URL}/auth/login", data=payload)
        
        if r.status_code == 200:
            print("✅ Login SUCCESS!")
            print("Token:", r.json().get("access_token")[:20] + "...")
        else:
            print(f"❌ Login FAILED: {r.status_code}")
            print("Response:", r.text)

    except Exception as e:
        print(f"❌ Error during login request: {e}")

if __name__ == "__main__":
    # Thay 'admin' và 'admin123' bằng tài khoản bạn vừa tạo
    test_login("admin", "admin123")
