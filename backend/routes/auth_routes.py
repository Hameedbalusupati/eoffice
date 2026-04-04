"""
routes/auth_routes.py

👉 Handles authentication (Register + Login)
👉 Uses JWT for secure login
👉 Initializes activities after registration
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt

from database.session import get_db
from models.user import User
from models.activity import Activity
from utils.auth import hash_password, verify_password
from config.settings import settings
from constants.activities import initialize_faculty_activities

router = APIRouter(prefix="/auth", tags=["Auth"])


# =========================
# 🔑 CREATE ACCESS TOKEN
# =========================
def create_access_token(data: dict, expires_delta: int = 60):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_delta)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt


# =========================
# 📝 REGISTER USER
# =========================
@router.post("/register")
def register(
    name: str,
    email: str,
    password: str,
    role: str = "employee",
    db: Session = Depends(get_db)
):
    # 🔍 Check if user exists
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 🔐 Hash password
    hashed_password = hash_password(password)

    # 👤 Create user
    new_user = User(
        name=name,
        email=email,
        password=hashed_password,
        role=role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 🔥 Initialize activities (ALL ❌)
    initialize_faculty_activities(db, new_user.id, Activity)

    return {
        "message": "User registered successfully",
        "user_id": new_user.id
    }


# =========================
# 🔐 LOGIN USER
# =========================
@router.post("/login")
def login(
    email: str,
    password: str,
    db: Session = Depends(get_db)
):
    # 🔍 Find user
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 🔐 Verify password
    if not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid password")

    # 🔑 Create token
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
# 👤 GET CURRENT USER (OPTIONAL)
# =========================
@router.get("/user/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user