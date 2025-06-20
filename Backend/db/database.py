import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv
from sqlalchemy.exc import OperationalError
from db.models import Base  # Import Base from models.py


load_dotenv()


DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
   raise ValueError("DATABASE_URL environment variable is not set.")


engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Create tables
def create_tables():
   Base.metadata.create_all(bind=engine)


def get_db():
   db = SessionLocal()
   try:
       print("Database connection established.")
       yield db
   except OperationalError as e:
       print(f"Database connection failed: {e}")
   finally:
       db.close()
       print("Database connection closed.")


def test_database_connection():
   try:
       db = SessionLocal()
       db.execute(text("SELECT 1"))
       print("Database connection successful!")
   except OperationalError as e:
       print(f"Database connection failed: {e}")
   finally:
       db.close()


def set_up():
   create_tables()
   test_database_connection()