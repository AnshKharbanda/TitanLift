from fastapi import FastAPI


from app.database import Base,engine
from app.models import User,WeightLog,Workout,WorkoutExercise
from app.routers.auth import auth_router
from app.routers.workout import workout_router

app=FastAPI()

app.include_router(auth_router)
app.include_router(workout_router)



# Internal Collection and create entire db schema
Base.metadata.create_all(bind=engine)


@app.get("/")
def running():
    print("running")