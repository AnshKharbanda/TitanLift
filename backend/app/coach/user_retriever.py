from sqlalchemy.orm import Session

from app.models import (
    User,
    Workout,
    WorkoutExercise,
    Exercise,
    WeightLog,
    CVAnalysis,
)

from app.coach.query_router import CoachIntent


def enum_value(value):
    """
    Safely return the underlying value for either
    an Enum instance or a plain string.
    """

    if value is None:
        return None

    return (
        value.value
        if hasattr(value, "value")
        else value
    )


def get_profile_data(
    current_user: User,
) -> dict:

    return {
        "name": current_user.name,
        "age": current_user.age,
        "height": current_user.height,

        "gender": enum_value(
            current_user.gender
        ),

        "goal": enum_value(
            current_user.goal
        ),
    }


def get_weight_data(
    current_user: User,
    db: Session,
) -> list[dict]:

    logs = (
        db.query(WeightLog)
        .filter(
            WeightLog.user_id ==
            current_user.id
        )
        .order_by(
            WeightLog.recorded_at.desc()
        )
        .limit(20)
        .all()
    )

    return [
        {
            "weight": log.weight,
            "recorded_at":
                log.recorded_at.isoformat(),
        }
        for log in logs
    ]


def get_workout_data(
    current_user: User,
    db: Session,
) -> list[dict]:

    workouts = (
        db.query(Workout)
        .filter(
            Workout.user_id ==
            current_user.id
        )
        .order_by(
            Workout.created_at.desc()
        )
        .limit(20)
        .all()
    )

    if not workouts:
        return []

    workout_ids = [
        workout.id
        for workout in workouts
    ]

    workout_exercises = (
        db.query(WorkoutExercise)
        .filter(
            WorkoutExercise.workout_id.in_(
                workout_ids
            )
        )
        .all()
    )

    exercise_ids = {
        item.exercise_id
        for item in workout_exercises
    }

    exercise_lookup = {}

    if exercise_ids:

        exercises = (
            db.query(Exercise)
            .filter(
                Exercise.id.in_(
                    exercise_ids
                )
            )
            .all()
        )

        exercise_lookup = {
            exercise.id: exercise
            for exercise in exercises
        }

    workout_lookup = {}

    for workout in workouts:

        workout_lookup[workout.id] = {
            "title": workout.title,

            "created_at":
                workout.created_at.isoformat(),

            "notes": workout.notes,

            "exercises": [],
        }

    for item in workout_exercises:

        workout = workout_lookup.get(
            item.workout_id
        )

        if workout is None:
            continue

        exercise = exercise_lookup.get(
            item.exercise_id
        )

        workout["exercises"].append({
            "exercise": (
                exercise.name
                if exercise
                else (
                    f"Exercise #{item.exercise_id}"
                )
            ),

            "sets": item.sets,
            "reps": item.reps,
            "weight": item.weight,
        })

    return list(
        workout_lookup.values()
    )


def get_cv_data(
    current_user: User,
    db: Session,
) -> list[dict]:

    analyses = (
        db.query(CVAnalysis)
        .filter(
            CVAnalysis.user_id ==
            current_user.id
        )
        .order_by(
            CVAnalysis.created_at.desc()
        )
        .limit(20)
        .all()
    )

    return [
        {
            "exercise": enum_value(
                analysis.exercise
            ),

            "side": enum_value(
                analysis.side
            ),

            "total_reps":
                analysis.total_reps,

            "good_reps":
                analysis.good_reps,

            "depth_errors":
                analysis.depth_errors,

            "hip_drive_errors":
                analysis.hip_drive_errors,

            "hip_sag_errors":
                analysis.hip_sag_errors,

            "duration_seconds":
                analysis.duration_seconds,

            "created_at":
                analysis.created_at.isoformat(),
        }
        for analysis in analyses
    ]


def retrieve_user_context(
    intents: set[CoachIntent],
    current_user: User,
    db: Session,
) -> dict:

    context = {}


    # =========================================================
    # PROFILE
    # =========================================================

    if (
        CoachIntent.PROFILE in intents
        or CoachIntent.TRAINING in intents
        or CoachIntent.PROGRESS in intents
    ):

        context["profile"] = (
            get_profile_data(
                current_user
            )
        )


    # =========================================================
    # WEIGHT HISTORY
    # =========================================================

    if (
        CoachIntent.WEIGHT in intents
        or CoachIntent.PROGRESS in intents
    ):

        context["weight_history"] = (
            get_weight_data(
                current_user,
                db,
            )
        )


    # =========================================================
    # WORKOUT HISTORY
    # =========================================================

    if (
        CoachIntent.WORKOUT in intents
        or CoachIntent.PROGRESS in intents
        or CoachIntent.TRAINING in intents
    ):

        context["workouts"] = (
            get_workout_data(
                current_user,
                db,
            )
        )


    # =========================================================
    # CV / FORM HISTORY
    # =========================================================

    if CoachIntent.FORM in intents:

        context["cv_analyses"] = (
            get_cv_data(
                current_user,
                db,
            )
        )


    return context