from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config.settings import settings

# 🔥 CREATE ENGINE (RENDER FIX)
engine = create_engine(
    settings.DATABASE_URL,
    echo=True,
    connect_args={"sslmode": "require"}  # 🔥 MUST FOR RENDER
)

# 🔥 SESSION
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# 🔄 DB DEPENDENCY
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()