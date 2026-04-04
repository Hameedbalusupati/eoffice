"""
utils/auth.py

👉 Handles authentication utilities
👉 Includes:
   - Password hashing
   - Password verification
   - JWT token creation
   - JWT token decoding
"""

from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer

from config.settings import settings


# =========================
# 🔐 PASSWORD HASHING SETUP
# =========================
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

# =========================
# 🔑 OAUTH2 SCHEME
# =========================
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# =========================
# 🔐 HASH PASSWORD
# =========================
def hash_password(password: str) -> str:
    """
    Hash plain password
    """
    return pwd_context.hash(password)


# =========================
# 🔐 VERIFY PASSWORD
# =========================
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify password
    """
    return pwd_context.verify(plain_password, hashed_password)


# =========================
# 🔑 CREATE ACCESS TOKEN
# =========================
def create_access_token(data: dict) -> str:
    """
    Create JWT token
    """
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )

    return encoded_jwt


# =========================
# 🔍 VERIFY TOKEN
# =========================
def verify_token(token: str):
    """
    Decode and verify JWT token
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        user_id: int = payload.get("user_id")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

        return payload

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is invalid or expired"
        )


# =========================
# 👤 GET CURRENT USER
# =========================
def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Extract current user from token
    """
    payload = verify_token(token)
    return payload