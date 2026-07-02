from pydantic import BaseModel,Field
from enum import Enum
from typing import List
from workout import RecentWorkoutResponse
from datetime import datetime

class LatestWeightResponse(BaseModel):
    weight:float
    
    model_config = {
        "from_attributes": True
    }
    
    
class DashboardSummaryResponse(BaseModel):
    total_workouts:int
    total_weight_logs:int
    latest_weight:LatestWeightResponse | None
    recent_workouts:List[RecentWorkoutResponse]
    
    model_config = {
        "from_attributes": True
    }
    
class WeightProgressResponse(BaseModel):
    weight: float
    recorded_at: datetime

    model_config = {
        "from_attributes": True
    }
    
    
class WorkoutStreakResponse(BaseModel):
    current_streak: int
    last_workout: datetime | None