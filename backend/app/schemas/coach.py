from datetime import datetime

from pydantic import BaseModel, Field


class CoachChatRequest(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="User's message to the TitanLift AI Coach",
    )


class CoachChatResponse(BaseModel):
    answer: str


class CoachContextResponse(BaseModel):
    user_id: int
    goal: str | None
    age: int
    height: float

    latest_weight: float | None

    recent_workouts: list[dict]
    recent_weight_logs: list[dict]
    recent_cv_analyses: list[dict]