from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.security import get_current_user
from app.models import Exercise,User,Workout,WeightLog,WorkoutExercise
from app.schemas.dashboard import DashboardSummaryResponse,WeightProgressResponse,WorkoutStreakResponse
from app.database import get_db
from typing import List
from datetime import timedelta,date
from app.utils.dashboard import calculate_streak,calculate_longest_streak


dashboard_router=APIRouter(prefix="/u",tags="Dashboard")

@dashboard_router.get("/",response_model=DashboardSummaryResponse)
def get_summary(current_user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    user_id=current_user.id
    
    workouts=db.query(Workout).filter(Workout.user_id==user_id)
        
    weight_logs=db.query(WeightLog).filter(WeightLog.user_id==user_id)
        
    latest_weight=weight_logs.order_by(WeightLog.recorded_at.desc()).first()
        
    recent_workouts=workouts.order_by(Workout.created_at.desc()).limit(10).all()
    
    
    return {
        "total_workouts":workouts.count(),
        "total_weight_logs":weight_logs.count(),
        "latest_weight":latest_weight,
        "recent_workouts":recent_workouts
    }
    
@dashboard_router.get("/stats")
def get_stats(current_user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    user_id=current_user.id
    
    workouts=db.query(Workout).filter(Workout.user_id==user_id).all()
    workout_id=[workout.id for workout in workouts]
    
    total_workouts=len(workouts)
    
    workout_exercises=db.query(WorkoutExercise).filter(WorkoutExercise.workout_id.in_(workout_id)).all()
    
    total_exercises=len(workout_exercises)
    
    total_sets=0
    total_volume=0
    
    for exercise in workout_exercises:
        total_sets+=exercise.sets
        total_volume+=exercise.sets*exercise.reps*exercise.weight
    
    return {
        "total_workouts":total_workouts,
        "total_exercises":total_exercises,
        "total_sets":total_sets,
        "total_volume":total_volume
    }
    
@dashboard_router.get("/weight-progress",response_model=List[WeightProgressResponse])
def get_weight_progress(current_user: User = Depends(get_current_user),db: Session = Depends(get_db)):
    return (
        db.query(WeightLog).filter(WeightLog.user_id == current_user.id).order_by(WeightLog.recorded_at.asc()).all()
    )
       

@dashboard_router.get("/streak",response_model=WorkoutStreakResponse)
def get_streak(current_user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    user_id=current_user.id
    
    workouts=db.query(Workout).filter(Workout.user_id==user_id).order_by(Workout.created_at.desc())
    
    latest_workout=workouts.first()
    
    workouts=workouts.all()
    
    workout_dates={workout.created_at.date() for workout in workouts}
    
    current_date=date.today()
    
    current_streak=0
    
    if current_date in workout_dates:
        current_streak=calculate_streak(current_date,workout_dates)
    else:
        current_streak=calculate_streak(current_date-timedelta(days=1),workout_dates)
        
    return {
        "current_streak":current_streak,
        "latest_workout":latest_workout.created_at if latest_workout else None
    }
        
        
@dashboard_router.get("/longest-streak")
def get_longest_streak(current_user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    user_id=current_user.id
    
    workouts=db.query(Workout).filter(Workout.user_id==user_id).all()
    
    workout_dates={workout.created_at.date() for workout in workouts}
    
    longest_streak=calculate_longest_streak(workout_dates)
    
    return {
        "longest_streak":longest_streak
    }
    
@dashboard_router.get("/muscle-distribution")
def get_muscle_distribution(current_user: User = Depends(get_current_user),db: Session = Depends(get_db)):
    user_id = current_user.id

    # Get all workouts
    workouts = db.query(Workout).filter(Workout.user_id == user_id).all()

    workout_ids = [workout.id for workout in workouts]

    # Get all workout exercises
    workout_exercises = db.query(WorkoutExercise).filter(WorkoutExercise.workout_id.in_(workout_ids)).all()

    # Get all exercise ids
    exercise_ids = [workout_exercise.exercise_id for workout_exercise in workout_exercises]

    # Get all exercises
    exercises = db.query(Exercise).filter(Exercise.id.in_(exercise_ids)).all()

    # lookup table
    exercise_lookup = {exercise.id: exercise.muscle_group.value for exercise in exercises}

    muscle_distribution = {
        "CHEST": 0,
        "BACK": 0,
        "LEGS": 0,
        "BICEPS": 0,
        "TRICEPS": 0,
        "SHOULDERS": 0,
        "ABS": 0
    }

    # Count total sets
    for workout_exercise in workout_exercises:
        muscle = exercise_lookup[workout_exercise.exercise_id]
        muscle_distribution[muscle] += workout_exercise.sets

    return {
        "muscle_distribution": muscle_distribution
    }
    
@dashboard_router.get("/")