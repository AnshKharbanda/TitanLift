from datetime import datetime

from pydantic import BaseModel


class ExerciseProgressSession(BaseModel):
    workout_id: int
    workout_title: str
    date: datetime

    sets: int
    reps: int
    weight: int
    volume: int


class ExerciseProgressResponse(BaseModel):
    exercise_id: int
    exercise_name: str
    muscle_group: str

    latest_weight: int | None
    best_weight: int | None
    total_volume: int
    total_sessions: int
    progress_percentage: float | None

    sessions: list[ExerciseProgressSession]