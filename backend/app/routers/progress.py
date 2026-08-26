from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from app.database import get_db

from app.models import (
    User,
    Workout,
    WorkoutExercise,
    Exercise,
)

from app.security import get_current_user

from app.schemas.progress import (
    ExerciseProgressResponse,
    ExerciseProgressSession,
)


progress_router = APIRouter(
    prefix="/progress",
    tags=["Progress"],
)


@progress_router.get(
    "/exercise/{exercise_id}",
    response_model=ExerciseProgressResponse,
)
def get_exercise_progress(
    exercise_id: int,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    # =========================================================
    # GET EXERCISE
    # =========================================================

    exercise = (
        db.query(Exercise)
        .filter(
            Exercise.id == exercise_id
        )
        .first()
    )

    if exercise is None:
        raise HTTPException(
            status_code=404,
            detail="Exercise not found.",
        )


    # =========================================================
    # GET USER'S HISTORY FOR THIS EXERCISE
    # =========================================================

    rows = (
        db.query(
            WorkoutExercise,
            Workout,
        )
        .join(
            Workout,
            Workout.id ==
            WorkoutExercise.workout_id,
        )
        .filter(
            Workout.user_id ==
            current_user.id,

            WorkoutExercise.exercise_id ==
            exercise_id,
        )
        .order_by(
            Workout.created_at.asc()
        )
        .all()
    )


    # =========================================================
    # NO HISTORY
    # =========================================================

    if not rows:
        return ExerciseProgressResponse(
            exercise_id=exercise.id,
            exercise_name=exercise.name,
            muscle_group=(
                exercise.muscle_group.value
                if hasattr(
                    exercise.muscle_group,
                    "value",
                )
                else exercise.muscle_group
            ),
            latest_weight=None,
            best_weight=None,
            total_volume=0,
            total_sessions=0,
            progress_percentage=None,
            sessions=[],
        )


    # =========================================================
    # BUILD SESSION HISTORY
    # =========================================================

    sessions = []

    for workout_exercise, workout in rows:

        volume = (
            workout_exercise.sets
            * workout_exercise.reps
            * workout_exercise.weight
        )

        sessions.append(
            ExerciseProgressSession(
                workout_id=workout.id,
                workout_title=workout.title,
                date=workout.created_at,

                sets=workout_exercise.sets,
                reps=workout_exercise.reps,
                weight=workout_exercise.weight,
                volume=volume,
            )
        )


    # =========================================================
    # SUMMARY
    # =========================================================

    weights = [
        session.weight
        for session in sessions
        if session.weight > 0
    ]

    latest_weight = (
        sessions[-1].weight
        if sessions
        else None
    )

    best_weight = (
        max(weights)
        if weights
        else None
    )

    total_volume = sum(
        session.volume
        for session in sessions
    )

    total_sessions = len(sessions)


    # =========================================================
    # PROGRESS %
    #
    # Compared with first recorded non-zero weight.
    # =========================================================

    progress_percentage = None

    first_weight = next(
        (
            session.weight
            for session in sessions
            if session.weight > 0
        ),
        None,
    )

    if (
        first_weight is not None
        and first_weight > 0
        and latest_weight is not None
    ):
        progress_percentage = round(
            (
                (
                    latest_weight
                    - first_weight
                )
                / first_weight
            )
            * 100,
            2,
        )


    return ExerciseProgressResponse(
        exercise_id=exercise.id,
        exercise_name=exercise.name,

        muscle_group=(
            exercise.muscle_group.value
            if hasattr(
                exercise.muscle_group,
                "value",
            )
            else exercise.muscle_group
        ),

        latest_weight=latest_weight,
        best_weight=best_weight,

        total_volume=total_volume,
        total_sessions=total_sessions,

        progress_percentage=(
            progress_percentage
        ),

        sessions=sessions,
    )