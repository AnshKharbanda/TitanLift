import cv2

from .camera import Camera
from .pose_estimator import PoseEstimator


camera = Camera()
pose = PoseEstimator()

while True:

    frame = camera.read_frame()

    results = pose.detect(frame)
    if pose.has_person(results):

        landmarks = pose.get_landmarks(results)

        print(type(landmarks))
        print(len(landmarks))

        break

    frame = pose.draw_pose(frame, results)

    cv2.imshow("TitanLift Pose Detection", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

camera.release()
cv2.destroyAllWindows()