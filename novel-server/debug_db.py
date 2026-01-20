from sqlalchemy.orm import Session
from database import SessionLocal
import models
from sqlalchemy import text

def check_db():
    db = SessionLocal()
    novel_id = 7
    
    # Check Novel
    novel = db.query(models.Novel).get(novel_id)
    if not novel:
        print(f"Novel {novel_id} not found")
        return

    print(f"Novel: {novel.title}")
    print(f"Categories (lazy): {novel.categories}")
    for c in novel.categories:
        print(f" - {c.name}")
        
    # Check Association Table raw
    stmt = text("SELECT * FROM novel_categories WHERE novel_id = :nid")
    result = db.execute(stmt, {"nid": novel_id}).fetchall()
    print(f"Raw Association Rows: {result}")
    
    db.close()

if __name__ == "__main__":
    check_db()
