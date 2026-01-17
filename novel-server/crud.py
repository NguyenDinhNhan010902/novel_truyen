from sqlalchemy.orm import Session
from sqlalchemy import desc
import models, schemas
from datetime import datetime

# Category CRUD
def get_categories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Category).offset(skip).limit(limit).all()

def get_category_by_name(db: Session, name: str):
    return db.query(models.Category).filter(models.Category.name == name).first()

def get_or_create_category(db: Session, name: str):
    category = get_category_by_name(db, name)
    if not category:
        # Simple slug generation
        slug = name.lower().replace(" ", "-")
        category = models.Category(name=name, slug=slug)
        db.add(category)
        db.flush() # Use flush instead of commit to keep transaction open
        db.refresh(category)
    return category

from sqlalchemy.orm import joinedload

# ...

# Novel CRUD
def get_novel(db: Session, novel_id: int):
    return db.query(models.Novel).options(joinedload(models.Novel.categories)).filter(models.Novel.id == novel_id).first()

def get_novel_by_slug(db: Session, slug: str):
    return db.query(models.Novel).options(joinedload(models.Novel.categories)).filter(models.Novel.slug == slug).first()

import unicodedata

def remove_accents(input_str):
    nfkd_form = unicodedata.normalize('NFKD', input_str)
    return "".join([c for c in nfkd_form if not unicodedata.combining(c)])

def get_novels(
    db: Session, 
    skip: int = 0, 
    limit: int = 100, 
    q: str = None,
    status: models.NovelStatus = None,
    category_slug: str = None,
    sort_by: str = "latest", # latest, oldest, views, az, za
    min_chapters: int = None,
    max_chapters: int = None
):
    # Ensure strict loading but we need to join for filtering
    query = db.query(models.Novel)
    
    # --- JOINING ---
    # Nếu có tìm kiếm hoặc lọc theo category, ta cần join bảng categories
    if q or category_slug:
        query = query.outerjoin(models.Novel.categories)

    # --- FILTERING ---
    conditions = []

    # 1. Search Query (Existing Logic)
    if q:
        from sqlalchemy import or_, and_, func
        keywords = q.strip().split()
        search_conditions = []
        for word in keywords:
            search_pattern = f"%{word}%"
            word_unaccented = remove_accents(word)
            slug_pattern = f"%{word_unaccented}%"
            
            word_condition = or_(
                models.Novel.title.ilike(search_pattern),
                models.Novel.author.ilike(search_pattern),
                models.Category.name.ilike(search_pattern),
                models.Novel.slug.ilike(slug_pattern),
                models.Category.slug.ilike(slug_pattern),
                func.unaccent(models.Novel.title).ilike(slug_pattern),
                func.unaccent(models.Novel.author).ilike(slug_pattern)
            )
            search_conditions.append(word_condition)
        conditions.append(and_(*search_conditions))

    # 2. Filter by Category Slug
    if category_slug:
        conditions.append(models.Category.slug == category_slug)

    # 3. Filter by Status
    if status:
        conditions.append(models.Novel.status == status)

    # 4. Filter by Chapter Count
    if min_chapters is not None:
        conditions.append(models.Novel.total_chapters >= min_chapters)
    if max_chapters is not None:
        conditions.append(models.Novel.total_chapters <= max_chapters)

    # Apply all conditions
    if conditions:
        from sqlalchemy import and_
        query = query.filter(and_(*conditions))

    # --- SORTING ---
    if sort_by == "latest":
        query = query.order_by(desc(models.Novel.updated_at))
    elif sort_by == "oldest":
        query = query.order_by(models.Novel.updated_at)
    elif sort_by == "views":
        query = query.order_by(desc(models.Novel.views))
    elif sort_by == "az":
        query = query.order_by(models.Novel.title)
    elif sort_by == "za":
        query = query.order_by(desc(models.Novel.title))
    else:
        # Default fallback
        query = query.order_by(desc(models.Novel.updated_at))

    # Distinct because joins might multiply rows (though 'unique' on ID usually handles it in ORM, distinct() is safer with joins)
    query = query.distinct()
    
    # Apply joinedload for efficient fetching of related data in the result
    query = query.options(joinedload(models.Novel.categories))
    
    return query.offset(skip).limit(limit).all()

def create_novel(db: Session, novel: schemas.NovelCreate):
    # Extract categories from schema
    category_names = novel.categories
    novel_data = novel.model_dump()
    if 'categories' in novel_data:
        del novel_data['categories'] # Remove list of strings to avoid kwargs error
        
    db_novel = models.Novel(**novel_data)
    
    # Process categories
    if category_names:
        for cat_name in category_names:
            category = get_or_create_category(db, cat_name)
            db_novel.categories.append(category)
            
    db.add(db_novel)
    db.commit()
    db.refresh(db_novel)
    return db_novel

def update_novel(db: Session, novel_id: int, novel_update: schemas.NovelUpdate):
    db_novel = get_novel(db, novel_id)
    if not db_novel:
        return None
    
    update_data = novel_update.model_dump(exclude_unset=True)
    
    # Handle categories update
    if 'categories' in update_data:
        category_names = update_data['categories']
        del update_data['categories']
        
        # Clear existing categories and add new ones (Replace strategy)
        db_novel.categories = []
        for cat_name in category_names:
            category = get_or_create_category(db, cat_name)
            db_novel.categories.append(category)

    for key, value in update_data.items():
        setattr(db_novel, key, value)
    
    db.add(db_novel)
    db.commit()
    db.refresh(db_novel)
    return db_novel

def delete_novel(db: Session, novel_id: int):
    db_novel = get_novel(db, novel_id)
    if db_novel:
        db.delete(db_novel)
        db.commit()
    return db_novel

# Chapter CRUD
def get_chapters(db: Session, novel_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Chapter).filter(models.Chapter.novel_id == novel_id).order_by(models.Chapter.order).offset(skip).limit(limit).all()

def create_chapter(db: Session, chapter: schemas.ChapterCreate, novel_id: int):
    db_chapter = models.Chapter(**chapter.model_dump(), novel_id=novel_id)
    db.add(db_chapter)
    db.commit()
    
    # Update total chapters and updated_at for novel
    novel = get_novel(db, novel_id)
    novel.total_chapters += 1
    novel.updated_at = datetime.now()
    db.add(novel)
    db.commit()
    
    db.refresh(db_chapter)
    db.refresh(db_chapter)
    return db_chapter

def get_chapter(db: Session, chapter_id: int):
    return db.query(models.Chapter).filter(models.Chapter.id == chapter_id).first()

def update_chapter(db: Session, chapter_id: int, chapter_update: schemas.ChapterBase):
    db_chapter = get_chapter(db, chapter_id)
    if not db_chapter:
        return None
    
    update_data = chapter_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_chapter, key, value)
        
    db.add(db_chapter)
    db.commit()
    db.refresh(db_chapter)
    return db_chapter

# User CRUD
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate, verification_code: str = None):
    from auth import get_password_hash
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email, 
        username=user.username, 
        hashed_password=hashed_password,
        verification_code=verification_code,
        is_active=False if verification_code else True 
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def set_reset_code(db: Session, email: str, code: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    user.verification_code = code
    db.commit()
    return user

def reset_password(db: Session, email: str, new_password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    
    from auth import get_password_hash
    user.hashed_password = get_password_hash(new_password)
    user.verification_code = None # Clear code
    db.commit()
    return user
