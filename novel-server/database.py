from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import os
from dotenv import load_dotenv

load_dotenv()

# Thông tin kết nối PostgreSQL
# Ưu tiên lấy từ biến môi trường (Render/Vercel), fallback về local
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:111111@127.0.0.1:5432/novel-db")

# Nếu đang chạy trên Vercel (có biến DATABASE_URL bắt đầu bằng postgres:// hoặc postgresql://)
# Hãy chuyển sang driver pg8000 (Pure Python) để tránh lỗi thư viện C của psycopg2
if SQLALCHEMY_DATABASE_URL and "pg8000" not in SQLALCHEMY_DATABASE_URL:
    # Thay thế scheme: postgresql:// -> postgresql+pg8000://
    if SQLALCHEMY_DATABASE_URL.startswith("postgresql://"):
        SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgresql://", "postgresql+pg8000://")
    elif SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
         SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql+pg8000://")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
