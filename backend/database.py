from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://veer_user:2gecf232gecf2@localhost:5432/veer_card"
# DATABASE_URL = "postgresql://postgres:2gecf232gecf2@localhost:5432/veer_card"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()
