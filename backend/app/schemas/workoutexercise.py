from pydantic import BaseModel,Field

class WorkoutExerciseCreate(BaseModel):
    exercise_id: int
    sets: int = Field(gt=0, le=20)
    reps: int = Field(gt=0, le=100)
    weight: float = Field(ge=0)
    
class WorkoutExerciseResponse(BaseModel):
    id: int
    workout_id: int
    exercise_id: int
    sets: int
    reps: int
    weight: float

    model_config = {
        "from_attributes": True
    }