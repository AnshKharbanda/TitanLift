from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.schemas.workoutexercise import WorkoutExerciseCreate,WorkoutExerciseResponse
from app.security import get_current_user
from app.models import WorkoutExercise,User,Workout,Exercise
from app.database import get_db
from typing import List


workout_exercise_router=APIRouter(prefix="/workout/exercise",tags=["WorkoutExercise"])

@workout_exercise_router.post("/{workout_id}",response_model=WorkoutExerciseResponse,status_code=201)
def add_exercise_to_workout(workout_id:int,addexercise:WorkoutExerciseCreate,
                            current_user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    
    workout=db.query(Workout).filter(Workout.id==workout_id,Workout.user_id==current_user.id).first()
    
    if workout is None:
        raise HTTPException(status_code=404,detail="Workout Not Found")
    
    exercise=db.query(Exercise).filter(Exercise.id==addexercise.exercise_id).first()
    
    if exercise is None:
        raise HTTPException(status_code=404,detail="Exercise Not Exists")

    
    new_workout_exercise=WorkoutExercise(
        workout_id=workout_id,
        exercise_id=addexercise.exercise_id,
        sets=addexercise.sets,
        weight=addexercise.weight,
        reps=addexercise.reps
    )
    
    db.add(new_workout_exercise)
    db.commit()
    db.refresh(new_workout_exercise)
    
    return new_workout_exercise

@workout_exercise_router.get("/{workout_id}",response_model=List[WorkoutExerciseResponse])
def workout_exercises(workout_id:int,current_user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    workout=db.query(Workout).filter(Workout.id==workout_id,Workout.user_id==current_user.id).first()
    
    if workout is None:
        raise HTTPException(status_code=404,detail="Workout Not Found")
    
    exercises=db.query(WorkoutExercise).filter(WorkoutExercise.workout_id==workout_id).all()
    
    return exercises

@workout_exercise_router.delete("/{workout_id}/{exercise_id}",response_model=List[WorkoutExerciseResponse])
def delete_exercise(workout_id:int,exercise_id:int,current_user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    workout=db.query(Workout).filter(Workout.id==workout_id,Workout.user_id==current_user.id).first()
    
    if workout is None:
        raise HTTPException(status_code=404,detail="Workout Not Found")
    
    exercise=db.query(Exercise).filter(Exercise.id==exercise_id).first()
    
    if exercise is None:
        raise HTTPException(status_code=404,detail="Exercise Not Exists")
    
    to_delete=db.query(WorkoutExercise).filter(WorkoutExercise.workout_id==workout_id,WorkoutExercise.exercise_id==exercise_id).first()
    
    if to_delete is None:
        raise HTTPException(status_code=404,detail="Exercise Not found in Workout")
    
    db.delete(to_delete)
    db.commit()
    
    exercises=db.query(WorkoutExercise).filter(WorkoutExercise.workout_id==workout_id).all()

    
    return exercises