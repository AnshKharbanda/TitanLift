from fastapi import FastAPI


from app.database import Base,engine
from app.models import User,WeightLog,Workout,WorkoutExercise

app=FastAPI()


# Internal Collection and create entire db schema
Base.metadata.create_all(bind=engine)


@app.get("/")
def running():
    print("running")