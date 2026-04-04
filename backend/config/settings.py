
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
    DEBUG: bool = False              # ✅ FIX: production default
    APP_ENV: str = "production"      # ✅ FIX

    # =========================
    # ⚙️ CONFIG (Pydantic v2)
    # =========================
    model_config = SettingsConfigDict(
        env_file=".env",             # ✅ used locally only
        env_file_encoding="utf-8",
        extra="ignore"               # ✅ ignore extra vars safely
    )


# =========================
# 🔥 INSTANCE
# =========================
settings = Settings()