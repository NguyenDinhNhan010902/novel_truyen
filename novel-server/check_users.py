from sqlalchemy.orm import Session
from database import SessionLocal
import models

def list_users():
    db = SessionLocal()
    try:
        users = db.query(models.User).all()
        print(f"Total Users: {len(users)}")
        print("-" * 60)
        print(f"{'ID':<5} {'Username':<20} {'Email':<30} {'Role':<10} {'Active':<10}")
        print("-" * 60)
        for user in users:
            print(f"{user.id:<5} {user.username:<20} {user.email:<30} {user.role:<10} {str(user.is_active):<10}")
        print("-" * 60)
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    list_users()
