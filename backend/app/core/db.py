from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import NullPool
from app.core.config import settings

# DATABASE URL
DATABASE_URL = settings.DATABASE_URL

# Create engine (Neon requires NullPool to avoid timeout)
engine = create_engine(
    DATABASE_URL,
    poolclass=NullPool,
    echo=False,
    future=True
)

# Session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base Model
Base = declarative_base()

# Dependency for FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
