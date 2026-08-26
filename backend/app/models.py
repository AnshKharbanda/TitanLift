from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    Enum,
    ForeignKey,
    Text,
)
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(254),
        unique=True,
        nullable=False
    )

    gender = Column(
        Enum(
            "MALE",
            "FEMALE",
            "OTHER",
            name="gender_enum"
        ),
        nullable=False
    )

    hashed_password = Column(
        String(255),
        nullable=False
    )

    age = Column(
        Integer,
        nullable=False
    )

    height = Column(
        Float,
        nullable=False
    )

    goal = Column(
        Enum(
            "HYPERTROPHY",
            "FAT_LOSS",
            "STRENGTH",
            "ENDURANCE",
            "NOT_SURE",
            name="goal_enum"
        ),
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    workouts = relationship(
        "Workout",
        back_populates="user"
    )

    weight_logs = relationship(
        "WeightLog",
        back_populates="user"
    )

    cv_analyses = relationship(
        "CVAnalysis",
        back_populates="user"
    )


class WeightLog(Base):
    __tablename__ = "weight_logs"

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    weight = Column(
        Float,
        nullable=False
    )

    recorded_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="weight_logs"
    )


class Workout(Base):
    __tablename__ = "workouts"

    id = Column(
        Integer,
        autoincrement=True,
        primary_key=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    title = Column(
        String(100),
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    notes = Column(
        Text,
        nullable=True
    )

    user = relationship(
        "User",
        back_populates="workouts"
    )

    workout_exercises = relationship(
        "WorkoutExercise",
        back_populates="workout"
    )


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(
        Integer,
        autoincrement=True,
        primary_key=True
    )

    name = Column(
        String(70),
        nullable=False,
        unique=True
    )

    muscle_group = Column(
        Enum(
            "CHEST",
            "BACK",
            "LEGS",
            "BICEPS",
            "TRICEPS",
            "SHOULDERS",
            "ABS",
            name="muscle_group_enum"
        ),
        nullable=False
    )

    description = Column(
        Text,
        nullable=True
    )

    workout_exercises = relationship(
        "WorkoutExercise",
        back_populates="exercise"
    )


class WorkoutExercise(Base):
    __tablename__ = "workout_exercises"

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    workout_id = Column(
        Integer,
        ForeignKey("workouts.id"),
        nullable=False
    )

    exercise_id = Column(
        Integer,
        ForeignKey("exercises.id"),
        nullable=False
    )

    sets = Column(
        Integer,
        nullable=False
    )

    reps = Column(
        Integer,
        nullable=False
    )

    weight = Column(
        Integer,
        nullable=False
    )

    workout = relationship(
        "Workout",
        back_populates="workout_exercises"
    )

    exercise = relationship(
        "Exercise",
        back_populates="workout_exercises"
    )


class CVAnalysis(Base):
    __tablename__ = "cv_analyses"

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    exercise = Column(
        Enum(
            "SQUAT",
            "PUSHUP",
            name="cv_exercise_enum"
        ),
        nullable=False
    )

    side = Column(
        Enum(
            "LEFT",
            "RIGHT",
            name="cv_side_enum"
        ),
        nullable=False
    )

    total_reps = Column(
        Integer,
        nullable=False,
        default=0
    )

    good_reps = Column(
        Integer,
        nullable=False,
        default=0
    )

    depth_errors = Column(
        Integer,
        nullable=False,
        default=0
    )

    hip_drive_errors = Column(
        Integer,
        nullable=False,
        default=0
    )

    hip_sag_errors = Column(
        Integer,
        nullable=False,
        default=0
    )

    duration_seconds = Column(
        Integer,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="cv_analyses"
    )