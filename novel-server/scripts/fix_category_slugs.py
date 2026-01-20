
import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import unicodedata
import re

# Add parent dir to path to import models
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import models
from database import SQLALCHEMY_DATABASE_URL

# Setup DB connection
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def slugify(text: str) -> str:
    text = unicodedata.normalize('NFKD', text)
    text = "".join([c for c in text if not unicodedata.combining(c)])
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'\s+', '-', text)
    return text.strip('-')

def fix_categories():
    print("Checking categories...")
    categories = db.query(models.Category).all()
    count = 0
    for cat in categories:
        correct_slug = slugify(cat.name)
        if cat.slug != correct_slug:
            print(f"Fixing: {cat.name} | Old: {cat.slug} -> New: {correct_slug}")
            cat.slug = correct_slug
            count += 1
            
    if count > 0:
        db.commit()
        print(f"Updated {count} categories.")
    else:
        print("All categories are good.")

if __name__ == "__main__":
    if sys.platform == "win32":
        sys.stdout.reconfigure(encoding='utf-8')
    fix_categories()
