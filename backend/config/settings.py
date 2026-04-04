"""
config/settings.py

👉 Handles all environment variables (.env)
👉 Compatible with Pydantic v2
👉 Prevents extra field errors
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # =========================
    # 🗄️ DATABASE
    # =========================
    DATABASE_URL: str

    # =========================
    # 🔐 JWT AUTH
    # =========================
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # =========================
    # 🌐 APP SETTINGS
    # =========================
    APP_NAME: str = "E-Office Backend"
    DEBUG: bool = True
    APP_ENV: str = "development"   # ✅ FIX: added

    # =========================
    # ⚙️ CONFIG (Pydantic v2)
    # =========================
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"   # 🔥 FIX: ignore extra fields like EMAIL, SMS, etc.
    )


# =========================
# 🔥 INSTANCE
# =========================
settings = Settings()