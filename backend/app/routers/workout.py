from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.schemas.workout import (
    WorkoutResponse,
    WorkoutCreate,
    WorkoutUpdate
)

from app.security import get_current_user
from app.models import User, Workout, WorkoutExercise
from app.database import get_db


workout_router = APIRouter(
    prefix="/workout",
    tags=["Workout"]
)


@workout_router.post(
    "/",
    response_model=WorkoutResponse
)
def create_workout(
    workout: WorkoutCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_workout = Workout(
        user_id=current_user.id,
        title=workout.title,
        notes=workout.notes
    )

    db.add(new_workout)
    db.commit()
    db.refresh(new_workout)

    return new_workout


@workout_router.get(
    "/",
    response_model=List[WorkoutResponse]
)
def all_workouts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workouts = (
        db.query(Workout)
        .filter(Workout.user_id == current_user.id)
        .order_by(Workout.created_at.desc())
        .all()
    )

    return workouts


@workout_router.get(
    "/{id}",
    response_model=WorkoutResponse
)
def get_workout(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workout = (
        db.query(Workout)
        .filter(
            Workout.id == id,
            Workout.user_id == current_user.id
        )
        .first()
    )

    if workout is None:
        raise HTTPException(
            status_code=404,
            detail="Workout Not found"
        )

    return workout


@workout_router.patch(
    "/{id}",
    response_model=WorkoutResponse
)
def update_workout(
    id: int,
    workout_data: WorkoutUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workout = (
        db.query(Workout)
        .filter(
            Workout.id == id,
            Workout.user_id == current_user.id
        )
        .first()
    )

    if workout is None:
        raise HTTPException(
            status_code=404,
            detail="Workout Not found"
        )

    if workout_data.title is not None:
        workout.title = workout_data.title

    if workout_data.notes is not None:
        workout.notes = workout_data.notes

    db.commit()
    db.refresh(workout)

    return workout

@workout_router.delete("/{id}")
def delete_workout(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workout = (
        db.query(Workout)
        .filter(
            Workout.id == id,
            Workout.user_id == current_user.id
        )
        .first()
    )

    if workout is None:
        raise HTTPException(
            status_code=404,
            detail="Workout Not found"
        )

    # Delete all exercises belonging to this workout first
    db.query(WorkoutExercise).filter(
        WorkoutExercise.workout_id == workout.id
    ).delete(
        synchronize_session=False
    )

    # Now delete the workout itself
    db.delete(workout)

    db.commit()

    return {
        "message": "Workout Deleted Successfully"
    }