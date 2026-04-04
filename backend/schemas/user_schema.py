"""
schemas/user_schema.py

👉 Pydantic schemas for User
👉 Used for Register, Login, Response
"""

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# =========================
# 🔹 BASE SCHEMA
# =========================
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: Optional[str] = "employee"
    phone: Optional[str] = None
    department: Optional[str] = None


# =========================
# 🔹 REGISTER SCHEMA (INPUT)
# =========================
class UserCreate(UserBase):
    password: str


# =========================
# 🔹 LOGIN SCHEMA (INPUT)
# =========================
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# =========================
# 🔹 UPDATE SCHEMA
# =========================
class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    role: Optional[str] = None


# =========================
# 🔹 RESPONSE SCHEMA (OUTPUT)
# =========================
class UserResponse(UserBase):
    id: int
    is_active: Optional[str] = "true"
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# =========================
# 🔹 LOGIN RESPONSE
# =========================
class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# =========================
# 🔹 BULK USERS RESPONSE
# =========================
class UserListResponse(BaseModel):
    users: list[UserResponse]