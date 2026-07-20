import cv2

from ..pose_estimator import PoseEstimator
from ..landmark_processor import LandmarkProcessor
from ..drawing import PoseDrawer
from ..exercises.squat import Squat


def main():

    cap = cv2.VideoCapture(0)

    pose_estimator = PoseEstimator()
    landmark_processor = LandmarkProcessor()
    drawing = PoseDrawer()

    squat = Squat("LEFT")

    while True:

        ret, frame = cap.read()

        if not ret:
            break

        frame = cv2.flip(frame, 1)

        results = pose_estimator.detect(frame)

        if pose_estimator.has_person(results):

            pose = landmark_processor.process(results.pose_landmarks.landmark)
            
            squat.update(pose)
            
            print(
                f"State: {squat.state} | "
                f"Knee: {squat.knee_angle:.1f} | "
                f"Hip: {squat.hip_angle:.1f} | "
                f"Reps: {squat.rep_count} | "
                f"Feedback: {squat.live_feedback}"
            )

            frame = drawing.draw_pose(frame, results)

            # -----------------------------
            # Draw Rep Count
            # -----------------------------
            cv2.putText(
                frame,
                f"Reps : {squat.rep_count}",
                (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 0),
                2,
            )

            # -----------------------------
            # Draw State
            # -----------------------------
            cv2.putText(
                frame,
                f"State : {squat.state}",
                (20, 80),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (255, 255, 0),
                2,
            )

            # -----------------------------
            # Draw Knee Angle
            # -----------------------------
            cv2.putText(
                frame,
                f"Knee : {int(squat.knee_angle)}",
                (20, 120),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (255, 255, 255),
                2,
            )

            # -----------------------------
            # Draw Hip Angle
            # -----------------------------
            cv2.putText(
                frame,
                f"Hip : {int(squat.hip_angle)}",
                (20, 160),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (255, 255, 255),
                2,
            )

            # -----------------------------
            # Draw Feedback
            # -----------------------------
            y = 220

            for feedback in squat.live_feedback:

                cv2.putText(
                    frame,
                    feedback,
                    (20, y),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.9,
                    (0, 0, 255),
                    2,
                )

                y += 40

        cv2.imshow("TitanLift - Squat Test", frame)
        
        print("\nSession Stats")
        print(squat.session_stats)

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()