from database import SessionLocal
import models

def read_value():
    db = SessionLocal()
    novel = db.query(models.Novel).filter(models.Novel.id == 2).first()
    if novel:
        print(f"ID: {novel.id}")
        print(f"Title: {novel.title}")
        print(f"Audio URL in DB: '{novel.audio_url}'")
    else:
        print("Novel not found")
    db.close()

if __name__ == "__main__":
    read_value()
