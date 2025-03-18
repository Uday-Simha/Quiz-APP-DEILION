from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from models import User
from passlib.context import CryptContext
from jose import jwt, JWTError
import os
from dotenv import load_dotenv
from database import get_db

load_dotenv()

auth_router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Load environment variables
SECRET_KEY = os.getenv("SECRET_KEY", "your_default_secret")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

# Pydantic models for request validation
class UserRegister(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

@auth_router.post("/register")
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_password = pwd_context.hash(user_data.password)
    db_user = User(username=user_data.username, password_hash=hashed_password)
    db.add(db_user)
    db.commit()
    
    return {"message": "User created successfully"}

@auth_router.post("/login")
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == user_data.username).first()
    if not user or not pwd_context.verify(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = jwt.encode({"sub": user.username}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer","user_id":user.id}
