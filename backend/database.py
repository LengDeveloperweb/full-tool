import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Direct connection string for your Render PostgreSQL database
SQLALCHEMY_DATABASE_URL = "postgresql://postgres_of2g_user:dK8cAnfgvMVXGoZqHQPWBGX5DNTOhCqX@dpg-da42nprtqb8s73fvmepg-a/chab_mongleng"

# 2. Fix the Render string if it starts with 'postgres://' instead of 'postgresql://'
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()