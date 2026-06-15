from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from app.config import db_url

# connection engine
engine=create_engine(db_url)


SessionLocal=sessionmaker(autoflush=False,autocommit=False,bind=engine)

# base class
Base=declarative_base()

def get_db():
    db=SessionLocal()
    
    try:
        yield db
    finally:
        db.close()
