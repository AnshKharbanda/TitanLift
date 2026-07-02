from pydantic import BaseModel, Field
from datetime import datetime


class WorkoutCreate(BaseModel):
    title: str = Field(min_length=1,max_length=100,description="Workout Title",example="Push Day")


class WorkoutResponse(BaseModel):
    id: int
    title: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
    
class RecentWorkoutResponse(BaseModel):
    title:str
    created_at:datetime