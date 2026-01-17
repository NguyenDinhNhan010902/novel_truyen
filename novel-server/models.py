from sqlalchemy import Column, Integer, String, Text, ForeignKey, Enum, DateTime, Float, Boolean
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

class NovelStatus(str, enum.Enum):
    ONGOING = "ONGOING"
    COMPLETED = "COMPLETED"
    PAUSED = "PAUSED"

from sqlalchemy import Table

# Association Table
novel_categories = Table(
    'novel_categories', Base.metadata,
    Column('novel_id', Integer, ForeignKey('novels.id')),
    Column('category_id', Integer, ForeignKey('categories.id'))
)

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    slug = Column(String, unique=True, index=True)
    description = Column(String, nullable=True)

    novels = relationship("Novel", secondary=novel_categories, back_populates="categories")

class Novel(Base):
    __tablename__ = "novels"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    slug = Column(String, unique=True, index=True)
    author = Column(String)
    tags = Column(ARRAY(String), default=[]) # Giữ lại để tương thích ngược nếu cần, hoặc migrate dần
    cover = Column(String, nullable=True) # URL ảnh
    description = Column(Text, nullable=True)
    audio_url = Column(String, nullable=True) # Link nghe truyện
    status = Column(Enum(NovelStatus), default=NovelStatus.ONGOING)
    total_chapters = Column(Integer, default=0)
    rating = Column(Float, default=0.0)
    views = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relations
    chapters = relationship("Chapter", back_populates="novel", cascade="all, delete-orphan")
    categories = relationship("Category", secondary=novel_categories, back_populates="novels")

class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(Integer, primary_key=True, index=True)
    novel_id = Column(Integer, ForeignKey("novels.id"))
    title = Column(String)
    order = Column(Integer) # Số thứ tự chương
    content = Column(Text) # Nội dung HTML
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relations
    novel = relationship("Novel", back_populates="chapters")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=False) # Changed default to False for OTP
    verification_code = Column(String, nullable=True)
    role = Column(String, default="USER") # USER, ADMIN
