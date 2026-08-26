from enum import Enum
from pydantic import BaseModel, Field
from datetime import datetime


class CVExercise(str, Enum):
    SQUAT = "SQUAT"
    PUSHUP = "PUSHUP"


class CVSide(str, Enum):
    LEFT = "LEFT"
    RIGHT = "RIGHT"


class CVStartRequest(BaseModel):
    exercise: CVExercise
    side: CVSide


class CVFrameResponse(BaseModel):
    exercise: CVExercise
    side: CVSide

    total_reps: int = Field(
        ge=0
    )

    good_reps: int = Field(
        ge=0
    )

    depth_errors: int = Field(
        default=0,
        ge=0
    )

    hip_drive_errors: int = Field(
        default=0,
        ge=0
    )

    hip_sag_errors: int = Field(
        default=0,
        ge=0
    )

    knee_angle: float | None = None
    hip_angle: float | None = None

    elbow_angle: float | None = None
    body_angle: float | None = None

    live_feedback: list[str] = Field(
        default_factory=list
    )


class CVAnalysisResponse(BaseModel):
    id: int
    exercise: CVExercise
    side: CVSide

    total_reps: int
    good_reps: int

    depth_errors: int
    hip_drive_errors: int
    hip_sag_errors: int

    duration_seconds: int | None

    created_at: datetime

    model_config = {
        "from_attributes": True
    }