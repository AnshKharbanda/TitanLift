import mediapipe as mp
import cv2


class PoseDrawer:

    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.mp_drawing = mp.solutions.drawing_utils

    def draw_pose(self, frame, results):
        # Draw the detected pose skeleton on the frame.
        
        if results.pose_landmarks is None:
            return frame

        self.mp_drawing.draw_landmarks(
            frame,
            results.pose_landmarks,
            self.mp_pose.POSE_CONNECTIONS
        )

        return frame