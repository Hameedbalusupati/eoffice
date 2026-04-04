"""
utils/helpers.py

👉 Common helper utilities used across the project
👉 Avoids repeating logic in routes/services
"""

import uuid
import random
import string
from datetime import datetime


# =========================
# 🆔 GENERATE UNIQUE ID
# =========================
def generate_uuid():
    return str(uuid.uuid4())


# =========================
# 🔢 GENERATE RANDOM STRING
# =========================
def generate_random_string(length: int = 8):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))


# =========================
# 🔢 GENERATE OTP
# =========================
def generate_otp(length: int = 6):
    return ''.join(random.choice(string.digits) for _ in range(length))


# =========================
# 📅 GET CURRENT DATETIME
# =========================
def get_current_datetime():
    return datetime.utcnow()


# =========================
# 📅 FORMAT DATETIME
# =========================
def format_datetime(dt: datetime, format_str: str = "%Y-%m-%d %H:%M:%S"):
    if not dt:
        return None
    return dt.strftime(format_str)


# =========================
# 🔄 SAFE STRING CONVERSION
# =========================
def to_string(value):
    return str(value) if value is not None else ""


# =========================
# 🔢 SAFE INT CONVERSION
# =========================
def to_int(value, default=0):
    try:
        return int(value)
    except (ValueError, TypeError):
        return default


# =========================
# 🔢 SAFE FLOAT CONVERSION
# =========================
def to_float(value, default=0.0):
    try:
        return float(value)
    except (ValueError, TypeError):
        return default


# =========================
# 📊 STATUS FORMAT (✔️❌)
# =========================
def format_status(status: bool):
    """
    Convert True/False to UI-friendly symbols
    """
    return "✔️" if status else "❌"


# =========================
# 📊 STATUS TEXT
# =========================
def status_text(status: bool):
    return "completed" if status else "pending"


# =========================
# 📦 STANDARD SUCCESS RESPONSE
# =========================
def success_response(message: str, data=None):
    return {
        "success": True,
        "message": message,
        "data": data
    }


# =========================
# ❌ STANDARD ERROR RESPONSE
# =========================
def error_response(message: str):
    return {
        "success": False,
        "message": message
    }


# =========================
# 🔍 PAGINATION METADATA
# =========================
def pagination_meta(total: int, page: int, limit: int):
    total_pages = (total + limit - 1) // limit

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": total_pages
    }


# =========================
# 🔤 NORMALIZE STRING
# =========================
def normalize_string(text: str):
    """
    Lowercase + strip spaces
    """
    if not text:
        return ""
    return text.strip().lower()


# =========================
# 🔒 MASK EMAIL
# =========================
def mask_email(email: str):
    """
    Example: test@gmail.com → t***@gmail.com
    """
    if not email or "@" not in email:
        return email

    name, domain = email.split("@")
    return name[0] + "***@" + domain


# =========================
# 📱 MASK PHONE
# =========================
def mask_phone(phone: str):
    """
    Example: 9876543210 → 98****3210
    """
    if not phone or len(phone) < 6:
        return phone

    return phone[:2] + "****" + phone[-4:]