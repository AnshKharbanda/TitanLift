from passlib.context import CryptContext
from jose import jwt,JWTError
from datetime import datetime,timedelta,timezone
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends,HTTPException
from app.database import get_db
from  sqlalchemy.orm import Session
from app.models import User

# password manager
pwd_context=CryptContext(schemes=["bcrypt"],deprecated="auto")

# jwt constants
SECRET_KEY = "titanlift-super-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def hash_password(password:str):
    return pwd_context.hash(password)

def verify_password(plain_password:str,hashed_password:str):
    return pwd_context.verify(plain_password,hashed_password)


def create_access_token(user_id:int):
    
    expire=datetime.now(timezone.utc)+timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload={
        "sub": str(user_id),
        "exp": expire
    }
    
    access_token=jwt.encode(payload,SECRET_KEY,algorithm=ALGORITHM)
    
    return access_token

def decode_access_token(token:str):
    
    try:
        payload=jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
        
        user_id=payload.get("sub")
        
        if user_id is  None:
            return None
        
        return int(user_id)
    except JWTError:
        return None
    
    
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token:str=Depends(oauth2_scheme),db:Session=Depends(get_db)):
    # print(token)
    user_id=decode_access_token(token)
    
    if user_id is None:
        raise HTTPException(status_code=401,detail="Invalid Token")
    
    user=db.query(User).filter(User.id==user_id).first()
    
    if user is None:
        raise HTTPException(status_code=401,detail="User Not Found")
    
    return user
    
    
