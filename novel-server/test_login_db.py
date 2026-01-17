from sqlalchemy.orm import Session
from database import SessionLocal
import crud
from auth import verify_password

def test_login():
    db = SessionLocal()
    username_input = "nhan010902"
    email_input = "nhan010902@gmail.com"
    password_input = "newpassword123" 
    
    print(f"Testing login for username: {username_input}")
    
    # 1. Test fetch by username
    user = crud.get_user_by_username(db, username=username_input)
    if not user:
        print(f"User not found by username '{username_input}'")
        # Try fetch by email to see if it exists
        user_by_email = crud.get_user_by_email(db, email=email_input)
        if user_by_email:
             print(f"BUT User FOUND by email '{email_input}'. Username is '{user_by_email.username}'")
             user = user_by_email
        else:
             print("User not found by email either.")
             return

    print(f"User found: {user.username} (ID: {user.id})")
    print(f"Is Active: {user.is_active}")
    print(f"Hashed Password: {user.hashed_password[:20]}...")

    # 2. Test Password Verify
    is_valid = verify_password(password_input, user.hashed_password)
    print(f"Password '{password_input}' matches? -> {is_valid}")
    
    if not is_valid:
        print("!!! Password mismatch !!!")
    
    db.close()

if __name__ == "__main__":
    test_login()
