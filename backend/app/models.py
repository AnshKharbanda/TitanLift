from sqlalchemy import Column,Integer,String,Float,DateTime,Enum,ForeignKey,Text
from sqlalchemy.orm import relationship
from datetime import datetime,timezone

from app.database import Base

class User(Base):
    __tablename__="users"
    id=Column(Integer,primary_key=True,autoincrement=True)
    name=Column(String(100),nullable=False)
    email=Column(String(254),unique=True,nullable=False)
    hashed_password=Column(String(255),nullable=False)
    age=Column(Integer,nullable=False)
    height=Column(Float,nullable=False)
    goal=Column(Enum("HYPERTROPHY","FAT_LOSS","STRENGTH","ENDURANCE","NOT_SURE",name="goal_enum"),nullable=True)
    # can handle different timezones now
    # lambda used so that every time a new record is created current timestamp inserts automatically
    created_at=Column(DateTime(timezone=True),default=lambda: datetime.now(timezone.utc),nullable=False)
    
    # relationship - allows to access value without filtering of other tables
    workouts=relationship("Workout",back_populates="user")
    weight_logs=relationship("WeightLog",back_populates="user")
    
class WeightLog(Base):
    __tablename__="weight_logs"
    id=Column(Integer,primary_key=True,autoincrement=True)
    user_id=Column(Integer,ForeignKey("users.id"),nullable=False)
    weight=Column(Float,nullable=False)
    recorded_at=Column(DateTime(timezone=True),default=lambda: datetime.now(timezone.utc),nullable=False)
    
    user=relationship("User",back_populates="weight_logs")
    
class Workout(Base):
    __tablename__="workouts"
    id=Column(Integer,autoincrement=True,primary_key=True)
    user_id=Column(Integer,ForeignKey("users.id"),nullable=False)
    title=Column(String(100),nullable=False)
    created_at=Column(DateTime(timezone=True),default=lambda:datetime.now(timezone.utc),nullable=False)
    
    # relationships
    user=relationship("User",back_populates="workouts")
    workout_exercises=relationship("WorkoutExercise",back_populates="workout")
    
class Exercise(Base):
    __tablename__="exercises"
    id=Column(Integer,autoincrement=True,primary_key=True)
    name=Column(String(70),nullable=False,unique=True)
    muscle_group=Column(Enum("CHEST","BACK","LEGS","BICEPS","TRICEPS","SHOULDERS","ABS",name="muscle_group_enum"),nullable=False)
    description=Column(Text,nullable=True)
    
    workout_exercises=relationship("Exercise",back_populates="exercise")
    
class WorkoutExercise(Base):
    __tablename__="workout_exercises"
    id=Column(Integer,primary_key=True,autoincrement=True)
    workout_id=Column(Integer,ForeignKey("workouts.id"),nullable=False)
    exercise_id=Column(Integer,ForeignKey("exercises.id"),nullable=False)
    sets=Column(Integer,nullable=False)
    reps=Column(Integer,nullable=False)
    weight=Column(Integer,nullable=False)
    
    workout=relationship("Workout",back_populates="workout_exercises")
    exercise=relationship("Exercise",back_populates="workout_exercises")