from sqlalchemy.orm import Session
from database import SessionLocal
import crud

def force_reset():
    db = SessionLocal()
    email = "nhan010902@gmail.com"
    new_pass = "123456"
    
    print(f"Forcing password reset for {email} to '{new_pass}'")
    
    user = crud.reset_password(db, email, new_pass)
    
    if user:
        print(f"Success! New Hash starts with: {user.hashed_password[:10]}")
    else:
        print("User not found!")
    
    db.close()

if __name__ == "__main__":
    force_reset()
