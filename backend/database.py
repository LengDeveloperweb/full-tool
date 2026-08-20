from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Replace 'postgres', '8828', and 'lengtool_db' with your actual pgAdmin username, password, and database name
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:8828@localhost:5432/lengtool_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()