import cv2
import mediapipe as mp

class PoseEstimator:
    
    def __init__(
        self,
        static_image_mode=False,
        model_complexity=1,
        smooth_landmarks=True,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    ):
        # pose module
        self.mp_pose=mp.solutions.pose
        
        # pose detector
        self.pose=self.mp_pose.Pose(
            static_image_mode=static_image_mode,
            model_complexity=model_complexity,
            smooth_landmarks=smooth_landmarks,
            min_detection_confidence=min_detection_confidence,
            min_tracking_confidence=min_tracking_confidence
        )
        
        self.mp_drawing=mp.solutions.drawing_utils
        
        
    def detect(self, frame):
        # Convert BGR (OpenCV) to RGB (MediaPipe)
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Run pose estimation
        results = self.pose.process(rgb_frame)

        return results


    def has_person(self, results):
        return results.pose_landmarks is not None


    def get_landmarks(self, results):
        if not self.has_person(results):
            return None

        return results.pose_landmarks.landmark
