"""
routes/auth_routes.py

✅ FINAL FIXED VERSION (NO 500 ERROR)
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt
from pydantic import BaseModel

from database.session import get_db
from models.user import User
from models.activity import Activity
from utils.auth import hash_password, verify_password
from config.settings import settings
from constants.activities import initialize_faculty_activities

# ✅ REMOVE prefix here
router = APIRouter(tags=["Auth"])


# =========================
# 📦 REQUEST MODELS
# =========================
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str = "employee"


class LoginRequest(BaseModel):
    email: str
    password: str


# =========================
# 🔑 CREATE ACCESS TOKEN
# =========================
def create_access_token(data: dict, expires_delta: int = 60):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_delta)
    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )


# =========================
# 📝 REGISTER USER
# =========================
@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):

    # 🔍 Check if exists
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 🔐 Hash password
    hashed_password = hash_password(data.password)

    # 👤 Create user
    new_user = User(
        name=data.name,
        email=data.email,
        password=hashed_password,
        role=data.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 🔥 Initialize activities
    initialize_faculty_activities(db, new_user.id, Activity)

    return {
        "message": "User registered successfully",
        "user_id": new_user.id
    }


# =========================
# 🔐 LOGIN USER
# =========================
@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid password")

    access_token = create_access_token(
        data={
            "user_id": user.id,
            "email": user.email,
            "role": user.role
        },
        expires_delta=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }


# =========================
# 👤 GET USER
# =========================
@router.get("/user/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user