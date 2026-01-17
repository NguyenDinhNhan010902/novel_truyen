from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
import crud

# Make sure tables exist
models.Base.metadata.create_all(bind=engine)

def init_db():
    db = SessionLocal()
    categories = [
        "Tiên Hiệp", "Huyền Huyễn", "Khoa Huyễn", "Võng Du", 
        "Đô Thị", "Đồng Nhân", "Dã Sử", "Cạnh Kỹ", 
        "Huyền Nghi", "Kiếm Hiệp", "Ngôn Tình", "Lịch Sử", "Quân Sự"
    ]
    
    print("Initializing example categories...")
    count = 0
    for cat_name in categories:
        existing = crud.get_category_by_name(db, cat_name)
        if not existing:
            crud.get_or_create_category(db, cat_name)
            count += 1
            
    db.close()
    print(f"Done! Added {count} new categories.")

if __name__ == "__main__":
    init_db()
