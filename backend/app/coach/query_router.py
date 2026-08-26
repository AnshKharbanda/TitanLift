from enum import Enum


class CoachIntent(str, Enum):
    GENERAL = "GENERAL"
    WORKOUT = "WORKOUT"
    PROGRESS = "PROGRESS"
    FORM = "FORM"
    WEIGHT = "WEIGHT"
    PROFILE = "PROFILE"
    TRAINING = "TRAINING"


def route_coach_query(query: str) -> set[CoachIntent]:
    text = query.lower().strip()

    intents = set()

    if any(word in text for word in [
        "workout", "trained", "training", "session",
        "last workout", "previous workout",
        "what did i do", "sets", "reps",
        "bench", "squat", "deadlift", "curl",
        "press", "row", "exercise"
    ]):
        intents.add(CoachIntent.WORKOUT)

    if any(word in text for word in [
        "progress", "progressing", "improving",
        "improved", "plateau", "stalled",
        "stuck", "stronger", "weaker",
        "performance", "getting better",
        "getting worse", "increase", "decrease"
    ]):
        intents.add(CoachIntent.PROGRESS)

    if any(word in text for word in [
        "form", "technique", "depth",
        "hip drive", "hip sag", "posture",
        "alignment", "cv", "camera"
    ]):
        intents.add(CoachIntent.FORM)

    if any(word in text for word in [
        "body weight", "weight change",
        "weight loss", "weight gain",
        "weigh", "weighed", "scale"
    ]):
        intents.add(CoachIntent.WEIGHT)

    if any(word in text for word in [
        "my goal", "my goals", "my height",
        "my age", "my profile"
    ]):
        intents.add(CoachIntent.PROFILE)

    if any(word in text for word in [
        "hypertrophy", "strength", "endurance",
        "volume", "frequency", "progressive overload",
        "program", "routine", "split",
        "how many sets", "how many reps"
    ]):
        intents.add(CoachIntent.TRAINING)

    if not intents:
        intents.add(CoachIntent.GENERAL)

    return intents