from pydantic import BaseModel,Field
from enum import Enum

class MuscleGroup(str,Enum):
    CHEST="CHEST"
    BICEPS="BICEPS"
    TRICEPS="TRICEPS"
    LEGS="LEGS"
    BACK="BACK"
    SHOULDER="SHOULDER"
    ABS="ABS"

class ExerciseCreate(BaseModel):
    name:str=Field(min_length=1,max_length=70,description="Name of Exercise")
    muscle_group: MuscleGroup
    description:str | None=None
    
class ExerciseResponse(BaseModel):
    id:int
    name:str
    muscle_group:MuscleGroup
    description:str | None
    
    model_config={
        "from_attributes":True
    }