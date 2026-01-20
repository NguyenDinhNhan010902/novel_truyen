import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from database import engine, Base
import models # Import models để SQLAlchemy nhận diện các bảng

# Thông tin kết nối vào database mặc định 'postgres'
DB_HOST = "localhost"
DB_NAME = "postgres"
DB_USER = "postgres"
DB_PASS = "111111"
NEW_DB_NAME = "novel-db"

def create_database():
    try:
        # Kết nối vào database mặc định
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()
        
        # Kiểm tra xem database đã tồn tại chưa
        cur.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{NEW_DB_NAME}'")
        exists = cur.fetchone()
        
        if not exists:
            print(f"Database '{NEW_DB_NAME}' does not exist. Creating...")
            cur.execute(f'CREATE DATABASE "{NEW_DB_NAME}"')
            print(f"Database '{NEW_DB_NAME}' created successfully!")
        else:
            print(f"Database '{NEW_DB_NAME}' already exists.")
            
        cur.close()
        conn.close()

        # Tạo tables
        print("Creating tables...")
        Base.metadata.create_all(bind=engine)
        print("Database initialization completed!")
        
    except Exception as e:
        print(f"Error creating database: {e}")

if __name__ == "__main__":
    create_database()
