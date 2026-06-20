from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.schemas.workout import WorkoutResponse,WorkoutCreate
from app.security import get_current_user
from app.models import User,Workout
from app.database import get_db
from typing import List


workout_router=APIRouter(prefix="/workout",tags=["Workout"])


@workout_router.post("/",response_model=WorkoutResponse)
def create_workout(workout:WorkoutCreate,current_user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    new_workout=Workout(
        user_id=current_user.id,
        title=workout.title
    )
    
    db.add(new_workout)
    db.commit()
    db.refresh(new_workout)
    
    return new_workout
    
    
@workout_router.get("/",response_model=List[WorkoutResponse])
def all_workouts(current_user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    workouts=db.query(Workout).filter(Workout.user_id==current_user.id).all()
    
    return workouts

@workout_router.delete("/{id}")
def delete_workout(id:int,current_user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    workout=db.query(Workout).filter(Workout.id==id,Workout.user_id==current_user.id).first()
    
    if workout is None:
        raise HTTPException(status_code=404,detail="Workout Not found")
    
    db.delete(workout)
    db.commit()
    
    return {
        "message":"Workout Deleted Successfully"
    }