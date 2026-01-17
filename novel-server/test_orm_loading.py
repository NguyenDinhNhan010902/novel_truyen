from database import SessionLocal
import models, schemas
from pydantic import TypeAdapter

def test_orm():
    db = SessionLocal()
    novel = db.query(models.Novel).filter(models.Novel.id == 2).first()
    if novel:
        print(f"DB Audio URL: {novel.audio_url}")
        
        # Test Pydantic Loading
        try:
            # Manually convert using model_validate (Pydantic v2 equivalent of from_orm)
            novel_schema = schemas.Novel.model_validate(novel)
            print(f"Schema Audio URL (alias audioUrl): {novel_schema.model_dump(by_alias=True).get('audioUrl')}")
            print(f"Schema Audio URL (internal): {novel_schema.audio_url}")
        
        except Exception as e:
            print(f"Validation Error: {e}")
            
    db.close()

if __name__ == "__main__":
    test_orm()
