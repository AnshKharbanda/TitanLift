from fastapi import APIRouter,Depends,HTTPException
from app.database import get_db
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate,UserResponse,UserLogin
from app.models import User
from app.security import hash_password,verify_password,create_access_token,get_current_user,decode_access_token
from fastapi.security import OAuth2PasswordRequestForm

auth_router=APIRouter(prefix="/auth",tags=["Authentication"])

@auth_router.post("/register",response_model=UserResponse)
def register(user:UserCreate,db:Session=Depends(get_db)):
    
    existing_user=db.query(User).filter(User.email==user.email).first()
    
    if existing_user:
        raise HTTPException(status_code=409,detail="Email already Registered")
    
    # print(user.password)
    # print(len(user.password))
    
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

@auth_router.post("/login")
def verify_user(form_data:OAuth2PasswordRequestForm=Depends(),db:Session=Depends(get_db)):

    existing_user = db.query(User).filter(User.email == form_data.username).first()

    if not existing_user:
        raise HTTPException(status_code=401,detail="Invalid Credentials")

    if not verify_password(form_data.password,existing_user.hashed_password):
        raise HTTPException(status_code=401,detail="Invalid Credentials")

    access_token = create_access_token(existing_user.id)

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
    
# def verify_user(user:UserLogin,db:Session=Depends(get_db)):
    
    existing_user=db.query(User).filter(User.email==user.email).first()
    
    if not existing_user:
        raise HTTPException(status_code=401,detail="Invalid Email")
    
    print("Entered Password:", user.password)
    print("Stored Hash:", existing_user.hashed_password)
    print(
        verify_password(
            user.password,
            existing_user.hashed_password
        )
    )
    
    if not verify_password(user.password,existing_user.hashed_password):
        raise HTTPException(status_code=401,detail="Invalid Password")
    
    access_token=create_access_token(existing_user.id)
    
    return {
        "access_token":access_token,
        "token_type":"bearer"
    }
    
@auth_router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email
    }
    
@auth_router.get("/test-token/{token}")
def test_token(token: str):
    return decode_access_token(token)


from app.security import oauth2_scheme

@auth_router.get("/debug")
def debug(token: str = Depends(oauth2_scheme)):
    print("TOKEN RECEIVED:", token)
    return {"token": token}