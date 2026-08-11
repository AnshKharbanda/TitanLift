from .types import Point,PoseData
import mediapipe as mp

LANDMARK_MAPPING = {
    "nose": mp.solutions.pose.PoseLandmark.NOSE,

    "left_eye_inner": mp.solutions.pose.PoseLandmark.LEFT_EYE_INNER,
    "left_eye": mp.solutions.pose.PoseLandmark.LEFT_EYE,
    "left_eye_outer": mp.solutions.pose.PoseLandmark.LEFT_EYE_OUTER,

    "right_eye_inner": mp.solutions.pose.PoseLandmark.RIGHT_EYE_INNER,
    "right_eye": mp.solutions.pose.PoseLandmark.RIGHT_EYE,
    "right_eye_outer": mp.solutions.pose.PoseLandmark.RIGHT_EYE_OUTER,

    "left_ear": mp.solutions.pose.PoseLandmark.LEFT_EAR,
    "right_ear": mp.solutions.pose.PoseLandmark.RIGHT_EAR,

    "mouth_left": mp.solutions.pose.PoseLandmark.MOUTH_LEFT,
    "mouth_right": mp.solutions.pose.PoseLandmark.MOUTH_RIGHT,

    "left_shoulder": mp.solutions.pose.PoseLandmark.LEFT_SHOULDER,
    "right_shoulder": mp.solutions.pose.PoseLandmark.RIGHT_SHOULDER,

    "left_elbow": mp.solutions.pose.PoseLandmark.LEFT_ELBOW,
    "right_elbow": mp.solutions.pose.PoseLandmark.RIGHT_ELBOW,

    "left_wrist": mp.solutions.pose.PoseLandmark.LEFT_WRIST,
    "right_wrist": mp.solutions.pose.PoseLandmark.RIGHT_WRIST,

    "left_pinky": mp.solutions.pose.PoseLandmark.LEFT_PINKY,
    "right_pinky": mp.solutions.pose.PoseLandmark.RIGHT_PINKY,

    "left_index": mp.solutions.pose.PoseLandmark.LEFT_INDEX,
    "right_index": mp.solutions.pose.PoseLandmark.RIGHT_INDEX,

    "left_thumb": mp.solutions.pose.PoseLandmark.LEFT_THUMB,
    "right_thumb": mp.solutions.pose.PoseLandmark.RIGHT_THUMB,

    "left_hip": mp.solutions.pose.PoseLandmark.LEFT_HIP,
    "right_hip": mp.solutions.pose.PoseLandmark.RIGHT_HIP,

    "left_knee": mp.solutions.pose.PoseLandmark.LEFT_KNEE,
    "right_knee": mp.solutions.pose.PoseLandmark.RIGHT_KNEE,

    "left_ankle": mp.solutions.pose.PoseLandmark.LEFT_ANKLE,
    "right_ankle": mp.solutions.pose.PoseLandmark.RIGHT_ANKLE,

    "left_heel": mp.solutions.pose.PoseLandmark.LEFT_HEEL,
    "right_heel": mp.solutions.pose.PoseLandmark.RIGHT_HEEL,

    "left_foot_index": mp.solutions.pose.PoseLandmark.LEFT_FOOT_INDEX,
    "right_foot_index": mp.solutions.pose.PoseLandmark.RIGHT_FOOT_INDEX,
}


class LandmarkProcessor:
    
    def _to_point(self,landmarks):
        '''
        Convert Mediapipe Landmarks into Point
        '''
        
        return Point(
            x=landmarks.x,
            y=landmarks.y,
            z=landmarks.z,
            visibility=landmarks.visibility
        )
        
        
    def process(self,landmarks):
        data = {}

        for field_name, mp_landmark in LANDMARK_MAPPING.items():

            landmark = landmarks[mp_landmark.value]

            data[field_name] = self._to_point(landmark)

        return PoseData(**data)