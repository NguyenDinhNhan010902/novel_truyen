from sqlalchemy import text
from database import engine

def add_column():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE novels ADD COLUMN audio_url VARCHAR"))
            conn.commit()
            print("Successfully added audio_url column to novels table.")
        except Exception as e:
            print(f"Error (maybe column exists?): {e}")

if __name__ == "__main__":
    add_column()
