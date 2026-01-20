from auth import get_password_hash, verify_password
import sys

def test_hashing():
    short_pass = "123456"
    print(f"Testing short password: '{short_pass}'")
    try:
        hash_s = get_password_hash(short_pass)
        print(f"Short hash success: {hash_s[:20]}...")
    except Exception as e:
        print(f"Short hash failed: {e}")

    long_pass = "a" * 80
    print(f"Testing long password: {len(long_pass)} chars")
    try:
        hash_l = get_password_hash(long_pass)
        print(f"Long hash success: {hash_l[:20]}...")
    except Exception as e:
        print(f"Long hash failed: {e}")

if __name__ == "__main__":
    test_hashing()
