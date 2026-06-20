from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.schemas.exercise import ExerciseCreate,ExerciseResponse
from app.security import get_current_user
from app.models import Exercise,User
from app.database import get_db
from typing import List

exercise_router=APIRouter(prefix="/exercise",tags=["Exercise"])

@exercise_router.post("/",response_model=ExerciseResponse)
def create_exercise(exercise:ExerciseCreate,db:Session=Depends(get_db)):
    new_exercise=Exercise(
        name=exercise.name,
        muscle_group=exercise.muscle_group,
        description=exercise.description
    )
    
    db.add(new_exercise)
    db.commit()
    db.refresh(new_exercise)
    
    return new_exercise
    
@exercise_router.get("/",response_model=List[ExerciseResponse])
def all_exercises(db:Session=Depends(get_db)):
    exercises=db.query(Exercise).all()
    
    return exercises

@exercise_router.delete("/{id}")
def delete_exercise(id:int,db:Session=Depends(get_db)):
    exercise=db.query(Exercise).filter(Exercise.id==id).first()
    
    if exercise is None:
        raise HTTPException(status_code=404,detail="Exercise Not Found")
    
    db.delete(exercise)
    db.commit()
    
    return {
        "message":"Exercise Deleted Successfully"
    }