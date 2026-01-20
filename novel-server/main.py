from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
import shutil
import os
import uuid

from database import engine, get_db
import models
import schemas
import crud
import auth

# Tạo bảng (nếu chưa có - thực tế nên dùng alembic)
# Tạo bảng (nếu chưa có - thực tế nên dùng alembic)
try:
    with engine.connect() as connection:
        connection.execute(text("CREATE EXTENSION IF NOT EXISTS unaccent"))
        connection.commit()
except Exception as e:
    print(f"Warning: Could not create unaccent extension: {e}")

try:
    models.Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: Could not create tables: {e}")

app = FastAPI()

# Tạo thư mục uploads nếu chưa tồn tại
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Mount thư mục uploads để serve static files
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Cấu hình CORS# Cấu hình CORS
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://novel-reader.vercel.app",
    "https://novel-truyen.vercel.app", 
    "https://novel-page-seven.vercel.app",
    "https://novel-server-phi.vercel.app",
    "https://novel-admin.pages.dev",
    "https://d7caeeb4.novel-truyen.pages.dev", # Preview linkAdmin
    "https://novel-truyen.pages.dev" # Link Admin chính thức (bị thiếu lúc nãy)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Auth Dependencies ---
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
from auth import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY, ALGORITHM
from jose import JWTError, jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_username(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

def get_current_admin_user(current_user: schemas.User = Depends(get_current_user)):
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges",
        )
    return current_user

# supabase_client initialization
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Fallback để không crash local nếu thiếu key (nhưng upload sẽ lỗi)
supabase: Client = None
if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    print("Warning: SUPABASE_URL or SUPABASE_KEY is missing. Upload will fail.")

@app.post("/upload")
async def upload_file(file: UploadFile = File(...), current_user: schemas.User = Depends(get_current_admin_user)):
    file_extension = file.filename.split(".")[-1]
    file_name = f"{uuid.uuid4()}.{file_extension}"
    
    # Read file content
    file_content = await file.read()
    
    if not supabase:
         raise HTTPException(status_code=500, detail="Storage configuration missing")

    try:
        # Upload to Supabase 'images' bucket
        # content-type is important for viewing in browser
        res = supabase.storage.from_("images").upload(
            file=file_content,
            path=file_name,
            file_options={"content-type": file.content_type}
        )
        
        # Get Public URL
        public_url_response = supabase.storage.from_("images").get_public_url(file_name)
        # Assuming public_url_response return directly the url string in new SDK or via .public_url
        # Let's check newer SDK, often it returns a string directly from get_public_url()
        # But to be safe let's treat it as string if possible. 
        # Actually in recent supabase-py: get_public_url returns a string.
        
        return {"url": public_url_response}
        
    except Exception as e:
        print(f"Upload Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


# ... (Skip getters) ...

@app.post("/novels/{novel_id}/chapters/", response_model=schemas.Chapter)
def create_chapter_for_novel(novel_id: int, chapter: schemas.ChapterCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_admin_user)):
    return crud.create_chapter(db=db, chapter=chapter, novel_id=novel_id)

@app.get("/novels/{novel_id}/chapters/", response_model=List[schemas.Chapter])
def read_chapters(novel_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    chapters = crud.get_chapters(db, novel_id=novel_id, skip=skip, limit=limit)
    return chapters

@app.get("/chapters/{chapter_id}", response_model=schemas.Chapter)
def read_chapter(chapter_id: int, db: Session = Depends(get_db)):
    db_chapter = crud.get_chapter(db, chapter_id=chapter_id)
    if db_chapter is None:
        raise HTTPException(status_code=404, detail="Chapter not found")
    return db_chapter

@app.put("/chapters/{chapter_id}", response_model=schemas.Chapter)
def update_chapter(chapter_id: int, chapter_update: schemas.ChapterBase, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_admin_user)):
    db_chapter = crud.update_chapter(db, chapter_id=chapter_id, chapter_update=chapter_update)
    if db_chapter is None:
        raise HTTPException(status_code=404, detail="Chapter not found")
    return db_chapter


@app.get("/")
def read_root():
    """Health check endpoint."""
    return {"message": "Hello from Novel Server!", "status": "running"}

@app.get("/health/db")
def health_check_db(db: Session = Depends(get_db)):
    """Check database connection."""
    try:
        # Thực hiện một truy vấn đơn giản để kiểm tra kết nối
        db.execute(text("SELECT 1"))
        return {"status": "connected", "database": "novel-db"}
    except Exception as e:
        return {"status": "disconnected", "error": str(e)}

# --- Novel Endpoints ---

@app.post("/novels/", response_model=schemas.Novel)
def create_novel(novel: schemas.NovelCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_admin_user)):
    db_novel = crud.get_novel_by_slug(db, slug=novel.slug)
    if db_novel:
        raise HTTPException(status_code=400, detail="Slug already registered")
    return crud.create_novel(db=db, novel=novel)

@app.get("/novels/", response_model=List[schemas.Novel])
def read_novels(
    skip: int = 0, 
    limit: int = 100, 
    q: str = None, 
    status: models.NovelStatus = None,
    category: str = None, # category_slug
    sort: str = "latest",
    min_c: int = None,
    max_c: int = None,
    db: Session = Depends(get_db)
):
    novels = crud.get_novels(
        db, 
        skip=skip, 
        limit=limit, 
        q=q,
        status=status,
        category_slug=category,
        sort_by=sort,
        min_chapters=min_c,
        max_chapters=max_c
    )
    return novels

@app.get("/novels/{novel_id}", response_model=schemas.Novel)
def read_novel(novel_id: int, db: Session = Depends(get_db)):
    db_novel = crud.get_novel(db, novel_id=novel_id)
    if db_novel is None:
        raise HTTPException(status_code=404, detail="Novel not found")
    return db_novel

@app.get("/novels/slug/{slug}", response_model=schemas.Novel)
def read_novel_by_slug(slug: str, db: Session = Depends(get_db)):
    db_novel = crud.get_novel_by_slug(db, slug=slug)
    if db_novel is None:
        raise HTTPException(status_code=404, detail="Novel not found")
    return db_novel

@app.get("/novels/utils/check-slug")
def check_slug_availability(slug: str, db: Session = Depends(get_db)):
    """Check if a slug is available."""
    db_novel = crud.get_novel_by_slug(db, slug=slug)
    return {"slug": slug, "available": db_novel is None}

@app.put("/novels/{novel_id}", response_model=schemas.Novel)
def update_novel(novel_id: int, novel_update: schemas.NovelUpdate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_admin_user)):
    db_novel = crud.update_novel(db, novel_id=novel_id, novel_update=novel_update)
    if db_novel is None:
        raise HTTPException(status_code=404, detail="Novel not found")
    return db_novel

@app.delete("/novels/{novel_id}")
def delete_novel_api(novel_id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_admin_user)):
    db_novel = crud.delete_novel(db, novel_id=novel_id)
    if db_novel is None:
        raise HTTPException(status_code=404, detail="Novel not found")
    return {"status": "success", "message": "Novel deleted"}




@app.post("/auth/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Generate Verification Code
    import random
    import string
    import email_service
    code = ''.join(random.choices(string.digits, k=6))
    
    # Create user with is_active=False and code
    # We need to update crud.create_user to accept code
    new_user = crud.create_user(db=db, user=user, verification_code=code)
    
    # Send Email
    email_service.send_verification_email(user.email, code)
    
    return {"message": "Registration successful. Please verify your email.", "email": user.email}

@app.post("/auth/verify")
def verify_email(verification: schemas.UserVerify, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=verification.email)
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
    
    if user.is_active:
         return {"message": "Account already active"}

    if user.verification_code != verification.code:
        raise HTTPException(status_code=400, detail="Invalid verification code")
    
    # Activate user
    user.is_active = True
    user.verification_code = None
    db.commit()
    
    return {"message": "Account activated successfully"}

@app.post("/auth/forgot-password")
def forgot_password(request: schemas.UserForgotPassword, db: Session = Depends(get_db)):
    print(f" [DEBUG] Forgot password request for: {request.email}")
    user = crud.get_user_by_email(db, email=request.email)
    if not user:
         print(f" [DEBUG] User not found: {request.email}")
         pass 

    if user:
        import random
        import string
        import email_service
        code = ''.join(random.choices(string.digits, k=6))
        print(f" [DEBUG] Generated Code: {code}")
        crud.set_reset_code(db, request.email, code)
        email_service.send_reset_email(request.email, code)
    
    return {"message": "If this email is registered, you will receive a password reset code."}

@app.post("/auth/reset-password")
def reset_password_endpoint(request: schemas.UserResetPassword, db: Session = Depends(get_db)):
    print(f" [DEBUG] Reset password attempt for: {request.email}")
    print(f" [DEBUG] Input Code: {request.code}")
    print(f" [DEBUG] New Password: {request.new_password}")
    
    user = crud.get_user_by_email(db, email=request.email)
    if not user:
        print(" [DEBUG] User not found")
        raise HTTPException(status_code=400, detail="Invalid request")
    
    print(f" [DEBUG] DB Code: {user.verification_code}")
    
    if user.verification_code != request.code:
        print(" [DEBUG] Code mismatch!")
        raise HTTPException(status_code=400, detail="Invalid verification code")

    crud.reset_password(db, request.email, request.new_password)
    print(" [DEBUG] Password reset success!")
    return {"message": "Password updated successfully"}

@app.post("/auth/login", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    print(f" [DEBUG] Login attempt for: {form_data.username}")
    # Authenticate user
    user = crud.get_user_by_username(db, username=form_data.username) 
    if not user:
         print(f" [DEBUG] Username not found, trying email...")
         user = crud.get_user_by_email(db, email=form_data.username)

    if not user:
        print(" [DEBUG] User not found by username or email.")
    elif not auth.verify_password(form_data.password, user.hashed_password):
        print(f" [DEBUG] Password mismatch for user: {user.username}")
    else:
        print(f" [DEBUG] Password verified for user: {user.username}")

    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        print(" [DEBUG] User is not active.")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email not verified",
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}



@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: schemas.User = Depends(get_current_user)):
    return current_user

@app.get("/categories/", response_model=List[schemas.Category])
def read_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    categories = crud.get_categories(db, skip=skip, limit=limit)
    return categories


