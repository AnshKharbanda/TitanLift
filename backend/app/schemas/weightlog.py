from pydantic import BaseModel,Field
from datetime import datetime


class WeightlogCreate(BaseModel):
    weight:float=Field(gt=20,lt=300,description="Weight of user in kg")
    

class WeightlogResponse(BaseModel):
    id:int
    weight:float
    recorded_at:datetime
    
    model_config = {
        "from_attributes": True
    }