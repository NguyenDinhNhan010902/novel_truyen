from sqlalchemy.orm import Session
from database import SessionLocal
import models
import crud
from auth import verify_password

def test_reset():
    db = SessionLocal()
    email = "nhan010902@gmail.com"
    new_pass = "newpassword123"
    
    print(f"Testing reset for {email}")
    
    # Get current user
    user = crud.get_user_by_email(db, email)
    if not user:
        print("User not found!")
        return

    old_hash = user.hashed_password
    print(f"Old Hash: {old_hash[:20]}...")

    # Perform Reset
    print(f"Resetting password to: {new_pass}")
    crud.reset_password(db, email, new_pass)
    
    # Refresh and check
    db.refresh(user)
    new_hash = user.hashed_password
    print(f"New Hash: {new_hash[:20]}...")
    
    if old_hash == new_hash:
        print("FAIL: Hash did not change!")
    else:
        print("SUCCESS: Hash changed.")

    # Verify logic
    is_valid = verify_password(new_pass, new_hash)
    print(f"Verify new password: {is_valid}")
    
    db.close()

if __name__ == "__main__":
    test_reset()
