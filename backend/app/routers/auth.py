from fastapi import APIRouter,Depends
from database import get_db
from sqlalchemy.orm import Session
from schemas.user import UserCreate,UserResponse

auth_router=APIRouter()

@auth_router.post("/register",response_model=UserResponse)
def register(user:UserCreate,db:Session=Depends(get_db)):
    