from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
import sys

def promote_user(email: str):
    db = SessionLocal()
    try:
        user = db.query(models.User).filter(models.User.email == email).first()
        if not user:
            print(f"User with email {email} not found.")
            return
        
        user.role = "ADMIN"
        db.commit()
        print(f"Successfully promoted {user.username} ({user.email}) to ADMIN.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python promote_user.py <email>")
    else:
        promote_user(sys.argv[1])
