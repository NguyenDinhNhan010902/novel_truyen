from pydantic import BaseModel, ConfigDict, Field, AliasChoices
from typing import List, Optional
from datetime import datetime
from models import NovelStatus

class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class NovelBase(BaseModel):
    title: str
    slug: str
    author: str
    tags: List[str] = [] # Legacy
    categories: List[str] = [] # Input: List of category names
    cover: Optional[str] = None
    description: Optional[str] = None
    audio_url: Optional[str] = Field(None, serialization_alias='audioUrl', validation_alias=AliasChoices('audio_url', 'audioUrl'))
    status: NovelStatus = NovelStatus.ONGOING

class NovelCreate(NovelBase):
    pass

class NovelUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    author: Optional[str] = None
    tags: Optional[List[str]] = None
    categories: Optional[List[str]] = None
    cover: Optional[str] = None
    description: Optional[str] = None
    audio_url: Optional[str] = Field(None, serialization_alias='audioUrl', validation_alias=AliasChoices('audio_url', 'audioUrl'))
    status: Optional[NovelStatus] = None



class Novel(NovelBase):
    id: int
    total_chapters: int = Field(serialization_alias='totalChapters')
    rating: float
    views: int
    created_at: datetime = Field(serialization_alias='createdAt')
    updated_at: Optional[datetime] = Field(None, serialization_alias='updatedAt')
    categories_obj: List[Category] = [] 
    categories: List[Category] = []

    model_config = ConfigDict(from_attributes=True)

class ChapterBase(BaseModel):
    title: str
    content: str
    order: int

class ChapterCreate(ChapterBase):
    pass

class Chapter(ChapterBase):
    id: int
    novel_id: int = Field(serialization_alias='novelId')
    created_at: datetime = Field(serialization_alias='createdAt')
    updated_at: Optional[datetime] = Field(None, serialization_alias='updatedAt')

    model_config = ConfigDict(from_attributes=True)

# User Schemas
class UserBase(BaseModel):
    email: str
    username: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class User(UserBase):
    id: int
    is_active: bool
    role: str

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class UserVerify(BaseModel):
    email: str
    code: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserForgotPassword(BaseModel):
    email: str

class UserResetPassword(BaseModel):
    email: str
    code: str
    new_password: str
