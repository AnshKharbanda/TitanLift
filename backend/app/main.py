from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from app.database import Base,engine
from app.models import User,WeightLog,Workout,WorkoutExercise
from app.routers.auth import auth_router
from app.routers.workout import workout_router
from app.routers.weightlog import weight_log_router
from app.routers.exercise import exercise_router
from app.routers.workoutexercise import workout_exercise_router
from app.routers.dashboard import dashboard_router
from app.routers.cv import cv_router
from app.routers.coach import coach_router



from app.rag.build_pipeline import build_rag_pipeline


app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(auth_router)
app.include_router(workout_router)
app.include_router(weight_log_router)
app.include_router(exercise_router)
app.include_router(workout_exercise_router)
app.include_router(dashboard_router)
app.include_router(cv_router)
app.include_router(coach_router)


@app.on_event("startup")
def startup_event():

    pipeline = build_rag_pipeline(
        index_path="app/rag/data/storage/faiss_index",
        chunks_path="app/rag/data/storage/chunks.pkl",
    )

    app.state.rag_pipeline = pipeline



# Internal Collection and create entire db schema
Base.metadata.create_all(bind=engine)


