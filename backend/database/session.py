"""
database/session.py

👉 Handles DB connection + session management
👉 Used in all routes with Depends(get_db)
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config.settings import settings

# ================================
# 🔥 DATABASE URL
# ================================
DATABASE_URL = settings.DATABASE_URL


# ================================
# 🔥 CREATE ENGINE
# ================================
engine = create_engine(
    DATABASE_URL,
    echo=True,          # Show SQL queries (debug)
    pool_pre_ping=True  # Avoid connection errors
)


# ================================
# 🔥 SESSION FACTORY
# ================================
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# ================================
# 🔥 DEPENDENCY (IMPORTANT)
# ================================
def get_db():
    """
    Dependency for getting DB session
    Used in FastAPI routes
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()