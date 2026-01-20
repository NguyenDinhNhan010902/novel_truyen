from sqlalchemy import text, inspect
from database import engine

def check_column():
    inspector = inspect(engine)
    columns = [c['name'] for c in inspector.get_columns('novels')]
    print(f"Columns in 'novels': {columns}")
    
    if 'audio_url' in columns:
        print("PASS: 'audio_url' column exists.")
    else:
        print("FAIL: 'audio_url' column MISSING.")

if __name__ == "__main__":
    check_column()
