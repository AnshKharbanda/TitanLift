import base64
import json
from datetime import datetime, timezone

import cv2
import numpy as np

from fastapi import (
    APIRouter,
    WebSocket,
    WebSocketDisconnect,
    HTTPException,
)

from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import User, CVAnalysis
from app.security import decode_access_token

from app.cv.pose_estimator import PoseEstimator
from app.cv.landmark_processor import LandmarkProcessor
from app.cv.exercises.squat import Squat
from app.cv.exercises.pushup import PushUp


cv_router = APIRouter(
    prefix="/cv",
    tags=["Computer Vision"],
)


def get_user_from_token(
    token: str,
    db: Session,
):
    user_id = decode_access_token(token)

    if user_id is None:
        return None

    return (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )


def save_cv_session(
    db: Session,
    user_id: int,
    exercise: str,
    side: str,
    analyzer,
    session_started_at: datetime | None,
):
    ended_at = datetime.now(timezone.utc)

    duration_seconds = None

    if session_started_at is not None:
        duration_seconds = max(
            0,
            int(
                (
                    ended_at -
                    session_started_at
                ).total_seconds()
            )
        )

    stats = analyzer.session_stats

    record = CVAnalysis(
        user_id=user_id,
        exercise=exercise,
        side=side,

        total_reps=stats.get(
            "total_reps",
            0
        ),

        good_reps=stats.get(
            "good_reps",
            0
        ),

        depth_errors=stats.get(
            "depth_errors",
            0
        ),

        hip_drive_errors=stats.get(
            "hip_drive_errors",
            0
        ),

        hip_sag_errors=stats.get(
            "hip_sag_errors",
            0
        ),

        duration_seconds=duration_seconds,
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return record


@cv_router.websocket("/ws")
async def cv_websocket(
    websocket: WebSocket,
):
    db = SessionLocal()

    analyzer = None
    exercise = None
    side = None
    user = None
    session_started_at = None

    try:

        # =========================================================
        # AUTHENTICATION
        # =========================================================

        token = websocket.query_params.get(
            "token"
        )

        if not token:
            await websocket.close(
                code=1008,
                reason="Authentication required."
            )
            return

        user = get_user_from_token(
            token,
            db
        )

        if user is None:
            await websocket.close(
                code=1008,
                reason="Invalid token."
            )
            return


        await websocket.accept()


        # =========================================================
        # CV PIPELINE
        # =========================================================

        pose_estimator = PoseEstimator()
        landmark_processor = LandmarkProcessor()


        while True:

            message = (
                await websocket.receive_text()
            )

            try:
                data = json.loads(message)

            except json.JSONDecodeError:

                await websocket.send_json({
                    "type": "error",
                    "message": "Invalid JSON message."
                })

                continue


            message_type = data.get(
                "type"
            )


            # =====================================================
            # START SESSION
            # =====================================================

            if message_type == "start":

                exercise_value = (
                    data.get("exercise")
                )

                side_value = (
                    data.get(
                        "side",
                        "RIGHT"
                    )
                )


                if exercise_value not in {
                    "SQUAT",
                    "PUSHUP",
                }:
                    await websocket.send_json({
                        "type": "error",
                        "message": "Unsupported exercise."
                    })
                    continue


                if side_value not in {
                    "LEFT",
                    "RIGHT",
                }:
                    await websocket.send_json({
                        "type": "error",
                        "message": "Invalid camera side."
                    })
                    continue


                exercise = exercise_value
                side = side_value


                if exercise == "SQUAT":

                    analyzer = Squat(
                        side=side
                    )

                else:

                    analyzer = PushUp(
                        side=side
                    )


                session_started_at = (
                    datetime.now(timezone.utc)
                )


                await websocket.send_json({
                    "type": "started",
                    "exercise": exercise,
                    "side": side,
                })

                continue


            # =====================================================
            # STOP SESSION
            # =====================================================

            if message_type == "stop":

                if (
                    analyzer is not None
                    and exercise is not None
                    and side is not None
                ):

                    saved = save_cv_session(
                        db=db,
                        user_id=user.id,
                        exercise=exercise,
                        side=side,
                        analyzer=analyzer,
                        session_started_at=session_started_at,
                    )

                    await websocket.send_json({
                        "type": "saved",
                        "analysis_id": saved.id,
                        "total_reps": saved.total_reps,
                        "good_reps": saved.good_reps,
                    })


                await websocket.send_json({
                    "type": "stopped"
                })

                break


            # =====================================================
            # FRAME
            # =====================================================

            if message_type != "frame":
                continue


            if analyzer is None:

                await websocket.send_json({
                    "type": "error",
                    "message": "Start a CV session first."
                })

                continue


            frame_data = data.get(
                "frame"
            )

            if not frame_data:
                continue


            # -----------------------------------------------------
            # Decode browser image
            # -----------------------------------------------------

            try:

                if "," in frame_data:

                    frame_data = (
                        frame_data.split(
                            ",",
                            1
                        )[1]
                    )


                image_bytes = (
                    base64.b64decode(
                        frame_data
                    )
                )

                np_array = np.frombuffer(
                    image_bytes,
                    dtype=np.uint8
                )

                frame = cv2.imdecode(
                    np_array,
                    cv2.IMREAD_COLOR
                )

            except Exception:

                await websocket.send_json({
                    "type": "error",
                    "message": "Invalid frame data."
                })

                continue


            if frame is None:
                continue


            # -----------------------------------------------------
            # MediaPipe
            # -----------------------------------------------------

            results = (
                pose_estimator.detect(
                    frame
                )
            )


            # -----------------------------------------------------
            # No person
            # -----------------------------------------------------

            if not pose_estimator.has_person(
                results
            ):

                stats = (
                    analyzer.session_stats
                )

                await websocket.send_json({

                    "type": "metrics",

                    "person_detected": False,

                    "exercise": exercise,

                    "side": side,

                    "total_reps":
                        stats.get(
                            "total_reps",
                            0
                        ),

                    "good_reps":
                        stats.get(
                            "good_reps",
                            0
                        ),

                    "depth_errors":
                        stats.get(
                            "depth_errors",
                            0
                        ),

                    "hip_drive_errors":
                        stats.get(
                            "hip_drive_errors",
                            0
                        ),

                    "hip_sag_errors":
                        stats.get(
                            "hip_sag_errors",
                            0
                        ),

                    "live_feedback": [
                        "Position yourself in the camera."
                    ],
                })

                continue


            # -----------------------------------------------------
            # Landmarks → PoseData
            # -----------------------------------------------------

            landmarks = (
                pose_estimator.get_landmarks(
                    results
                )
            )

            if landmarks is None:
                continue


            pose_data = (
                landmark_processor.process(
                    landmarks
                )
            )


            # -----------------------------------------------------
            # Existing exercise analyzer
            # -----------------------------------------------------

            analyzer.update(
                pose_data
            )


            stats = (
                analyzer.session_stats
            )


            # -----------------------------------------------------
            # Send live metrics
            # -----------------------------------------------------

            await websocket.send_json({

                "type": "metrics",

                "person_detected": True,

                "exercise": exercise,

                "side": side,

                "total_reps":
                    stats.get(
                        "total_reps",
                        0
                    ),

                "good_reps":
                    stats.get(
                        "good_reps",
                        0
                    ),

                "depth_errors":
                    stats.get(
                        "depth_errors",
                        0
                    ),

                "hip_drive_errors":
                    stats.get(
                        "hip_drive_errors",
                        0
                    ),

                "hip_sag_errors":
                    stats.get(
                        "hip_sag_errors",
                        0
                    ),

                "knee_angle":
                    getattr(
                        analyzer,
                        "knee_angle",
                        None
                    ),

                "hip_angle":
                    getattr(
                        analyzer,
                        "hip_angle",
                        None
                    ),

                "elbow_angle":
                    getattr(
                        analyzer,
                        "elbow_angle",
                        None
                    ),

                "body_angle":
                    getattr(
                        analyzer,
                        "body_angle",
                        None
                    ),

                "live_feedback": sorted(
                    list(
                        analyzer.live_feedback
                    )
                ),
            })


    except WebSocketDisconnect:

        # Browser closed the connection.
        # We intentionally don't save here because
        # the client may disconnect without explicitly
        # ending the session.

        pass


    except Exception as exc:

        try:

            await websocket.send_json({
                "type": "error",
                "message": (
                    f"CV session failed: {str(exc)}"
                )
            })

        except Exception:
            pass


    finally:

        db.close()