from pydantic import BaseModel,Field,EmailStr
from datetime import datetime
from enum import Enum

class Goal(str,Enum):
    HYPERTROPHy="HYPERTROPHY"
    STRENGTH="STRENGTH"
    FAT_LOSS="FAT_LOSS"
    ENDURANCE="ENDURANCE"
    NOT_SURE="NOT_SURE"
    
class Gender(str,Enum):
    MALE="MALE"
    FEMALE="FEMALE"
    OTHER="OTHER"

class UserCreate(BaseModel):
    name:str=Field(max_length=100,title="UserName",description="Username of user",example="Larry Wheels")
    email:EmailStr=Field(title="Email",description="Unique User Email",example="abc123@gmail.com")
    password:str=Field(min_length=6,max_length=72,title="Password",description="Enter User Password")
    age:int=Field(ge=16,lt=100,title="Age",description="Enter age of User")
    height:float=Field(gt=0,title="Height",description="Enter height of user")
    goal: Goal
    gender: Gender
    

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    age: int
    height: float
    gender: Gender
    goal: Goal
    created_at: datetime

    # helps to read attributes from object even if not a dictionary
    model_config = {
        "from_attributes": True
    }