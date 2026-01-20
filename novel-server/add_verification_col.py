from database import engine
from sqlalchemy import text

def add_verification_column():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN verification_code VARCHAR"))
            conn.commit()
            print("Successfully added verification_code column.")
        except Exception as e:
            print(f"Error (column might already exist): {e}")

if __name__ == "__main__":
    add_verification_column()
