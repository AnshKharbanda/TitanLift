from fastapi import APIRouter,Depends,HTTPException
from app.database import get_db
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate,UserResponse
from app.models import User
from app.security import hash_password

auth_router=APIRouter(prefix="/auth",tags=["Authentication"])

@auth_router.post("/register",response_model=UserResponse)
def register(user:UserCreate,db:Session=Depends(get_db)):
    
    existing_user=db.query(User).filter(User.email==user.email).first()
    
    if existing_user:
        raise HTTPException(status_code=409,detail="Email already Registered")
    
    print(user.password)
    print(len(user.password))
    hashed_password=hash_password(user.password)
    
    new_user=User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,
        age=user.age,
        height=user.height,
        gender=user.gender,
        goal=user.goal
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user
    