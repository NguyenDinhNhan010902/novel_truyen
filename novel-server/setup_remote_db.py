from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import models
import crud
import auth

# Supabase Pooler URL (Option 2: Connection Pooling)
# Format: postgresql://[user].[project_ref]:[password]@[host]:6543/postgres
# User: postgres.ediupqksgzzxylnicotz
DATABASE_URL = "postgresql://postgres.ediupqksgzzxylnicotz:215563746aA@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"

print("Connecting to Supabase...")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    print("Enabling unaccent extension...")
    try:
        with engine.connect() as connection:
            connection.execute(text("CREATE EXTENSION IF NOT EXISTS unaccent"))
            connection.commit()
    except Exception as e:
        print(f"Warning: Could not enable unaccent: {e}")

    print("Creating tables...")
    models.Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    
    # 1. Seed Categories
    categories = [
        "Tiên Hiệp", "Huyền Huyễn", "Khoa Huyễn", "Võng Du", 
        "Đô Thị", "Đồng Nhân", "Dã Sử", "Cạnh Kỹ", 
        "Huyền Nghi", "Kiếm Hiệp", "Ngôn Tình", "Lịch Sử", "Quân Sự"
    ]
    
    print("Seeding categories...")
    for cat_name in categories:
        existing = crud.get_category_by_name(db, cat_name)
        if not existing:
            crud.get_or_create_category(db, cat_name)
            
    # 2. Seed Default Admin
    print("Seeding default admin...")
    admin_email = "admin@novel.com"
    existing_admin = crud.get_user_by_email(db, admin_email)
    if not existing_admin:
        hashed_password = auth.get_password_hash("admin123")
        admin_user = models.User(
            email=admin_email,
            username="admin",
            hashed_password=hashed_password,
            role="ADMIN",
            is_active=True,
            is_verified=True
        )
        db.add(admin_user)
        db.commit()
        print("Admin user created: admin / admin123")
    else:
        print("Admin user already exists.")

    db.close()
    print("Database initialization completed successfully! 🚀")

if __name__ == "__main__":
    init_db()
