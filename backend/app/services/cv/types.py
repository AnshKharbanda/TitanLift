from dataclasses import dataclass


@dataclass
class Point:
    x: float
    y: float
    z: float
    visibility: float


@dataclass
class PoseData:
    '''
    to access by name
    '''
    
    nose: Point

    left_eye_inner: Point
    left_eye: Point
    left_eye_outer: Point

    right_eye_inner: Point
    right_eye: Point
    right_eye_outer: Point

    left_ear: Point
    right_ear: Point

    mouth_left: Point
    mouth_right: Point

    left_shoulder: Point
    right_shoulder: Point

    left_elbow: Point
    right_elbow: Point

    left_wrist: Point
    right_wrist: Point

    left_pinky: Point
    right_pinky: Point

    left_index: Point
    right_index: Point

    left_thumb: Point
    right_thumb: Point

    left_hip: Point
    right_hip: Point

    left_knee: Point
    right_knee: Point

    left_ankle: Point
    right_ankle: Point

    left_heel: Point
    right_heel: Point

    left_foot_index: Point
    right_foot_index: Point