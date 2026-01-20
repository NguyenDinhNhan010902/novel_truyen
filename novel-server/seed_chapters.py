from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
import random

def seed_chapters():
    db = SessionLocal()
    try:
        novels = db.query(models.Novel).all()
        print(f"Found {len(novels)} novels.")
        
        for novel in novels:
            # Check existing chapters
            count = db.query(models.Chapter).filter(models.Chapter.novel_id == novel.id).count()
            current_order = count
            
            if count >= 5:
                print(f"Novel '{novel.title}' already has {count} chapters. Skipping.")
                continue
                
            print(f"Adding chapters for '{novel.title}'...")
            
            num_to_add = random.randint(3, 8)
            
            for i in range(num_to_add):
                order = current_order + i + 1
                chapter_title = f"Chương {order}: Chương mẫu số {order}"
                content = f"""
                <p>Đây là nội dung mẫu cho <strong>{chapter_title}</strong> của bộ truyện <em>{novel.title}</em>.</p>
                <p>Nội dung này được tạo tự động để kiểm thử chức năng.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <p>...</p>
                <p>Hết chương {order}.</p>
                """
                
                chapter = models.Chapter(
                    novel_id=novel.id,
                    title=chapter_title,
                    order=order,
                    content=content
                )
                db.add(chapter)
            
            # Update total count
            novel.total_chapters = count + num_to_add
            db.add(novel)
            
            db.commit()
            print(f"Added {num_to_add} chapters to '{novel.title}'. Total: {novel.total_chapters}")
            
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_chapters()
