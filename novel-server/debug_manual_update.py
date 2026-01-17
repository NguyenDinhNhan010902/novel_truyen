from sqlalchemy.orm import Session
from database import SessionLocal
import crud, schemas
from pydantic import ValidationError

def debug_update():
    db = SessionLocal()
    try:
        # 1. Get first novel
        novel = db.query(crud.models.Novel).first()
        if not novel:
            print("No novels found.")
            return

        print(f"Testing on Novel ID {novel.id}: {novel.title}")
        print(f"Initial audio_url: {novel.audio_url}")

        # 2. Prepare Update Data using Dictionary (Frontend simulation)
        update_payload = {
            "audioUrl": "https://soundcloud.com/test-audio-link",
            "title": novel.title # Keep title same
        }
        
        print(f"Payload from Frontend: {update_payload}")

        # 3. Validate via Pydantic Schema
        try:
            # Pydantic v2: Check if alias works
            novel_update_schema = schemas.NovelUpdate(**update_payload)
            print(f"Parsed Schema: {novel_update_schema}")
            print(f"Dumped Schema (exclude_unset=True): {novel_update_schema.model_dump(exclude_unset=True)}")
            
        except ValidationError as e:
            print(f"Schema Validation Error: {e}")
            return

        # 4. Perform Update
        updated_novel = crud.update_novel(db, novel.id, novel_update_schema)
        
        # 5. Verify
        print(f"Updated audio_url in DB object: {updated_novel.audio_url}")
        
        # Re-fetch from DB to be sure
        db.refresh(updated_novel)
        print(f"Refreshed audio_url in DB: {updated_novel.audio_url}")
        
        if updated_novel.audio_url == "https://soundcloud.com/test-audio-link":
            print("SUCCESS: Audio Link updated.")
        else:
            print("FAIL: Audio Link NOT updated.")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    debug_update()
