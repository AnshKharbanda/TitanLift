from pydantic import BaseModel, Field
from datetime import datetime


class WorkoutCreate(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=100,
        description="Workout Title",
        example="Push Day"
    )

    notes: str | None = Field(
        default=None,
        description="Workout notes"
    )


class WorkoutUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=100
    )

    notes: str | None = None


class WorkoutResponse(BaseModel):
    id: int
    title: str
    notes: str | None = None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class RecentWorkoutResponse(BaseModel):
    title: str
    created_at: datetime