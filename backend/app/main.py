from fastapi import FastAPI


from app.database import Base,engine
from app.models import User,WeightLog,Workout,WorkoutExercise
from app.routers.auth import auth_router
from app.routers.workout import workout_router
from app.routers.weightlog import weight_log_router
from app.routers.exercise import exercise_router
from app.routers.workoutexercise import workout_exercise_router



app=FastAPI()

app.include_router(auth_router)
app.include_router(workout_router)
app.include_router(weight_log_router)
app.include_router(exercise_router)
app.include_router(workout_exercise_router)




# Internal Collection and create entire db schema
Base.metadata.create_all(bind=engine)


@app.get("/")
def running():
    print("running")