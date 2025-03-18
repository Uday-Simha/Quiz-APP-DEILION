from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
from urllib.parse import quote_plus


load_dotenv()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        

DATABASE_URL = os.getenv("DATABASE_URL")\
# DATABASE_URL=f"postgresql+psycopg2://{USER_NAME}:{quote_plus(PASSWORD)}@{HOST}:{PORT}/{DATABASE_NAME}"
print("DATABASE_URL",DATABASE_URL)


engine = create_engine(DATABASE_URL, pool_size=10, max_overflow=20)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
