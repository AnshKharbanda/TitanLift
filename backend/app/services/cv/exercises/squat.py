"""
Exercise: Squat

Camera Position:
    Side View (90°)

Landmarks Used:
    Shoulder
    Hip
    Knee
    Ankle

Angles Used:
    Hip Angle
    Knee Angle
    Torso Angle

Rep Rule:
    UP → DOWN → UP

Form Rules:
    Reach proper depth
    Keep torso within acceptable lean
    Fully extend at the top
    
"""


from ..angle_calculator import AngleCalculator
from ..types import PoseData


# threshold for complete rep

BOTTOM_THRESHOLD = 90
UP_THRESHOLD = 160

# constants for hip shoots up

HIP_DRIVE_ANALYSIS_FRAMES = 8
HIP_SHOULDER_GAP_THRESHOLD = 20
ASCENT_START_THRESHOLD = 3

INITIAL_KNEE_ANGLE = 180
DEPTH_TOLERANCE = 0.02


class Squat:

    def __init__(self, side: str):

        self.side = side

        self.rep_count = 0

        self.state = "UP"
        self.previous_state = "UP"
        
        # feedbacks

        self.live_feedback = set()
        
        self.session_stats = {
            "exercise":"SQUAT",
            "depth_errors": 0,
            "hip_drive_errors": 0,
            "good_reps": 0,
            "total_reps": 0,
        }
        
        self.current_rep_hip_drive_failed = False

        # Angles
        self.hip_angle = INITIAL_KNEE_ANGLE
        self.knee_angle = INITIAL_KNEE_ANGLE

        self.previous_knee_angle = INITIAL_KNEE_ANGLE
        self.min_knee_angle = INITIAL_KNEE_ANGLE

        # Hip Drive
        self.ascent_started = False
        self.ascent_frames = 0

        self.start_hip_y = None
        self.start_shoulder_y = None

        self.max_hip_shoulder_gap = 0

        self.angle_calculator = AngleCalculator()

    def _get_side_landmarks(self, pose: PoseData):

        if self.side == "LEFT":
            return (
                pose.left_shoulder,
                pose.left_hip,
                pose.left_knee,
                pose.left_ankle,
            )

        return (
            pose.right_shoulder,
            pose.right_hip,
            pose.right_knee,
            pose.right_ankle,
        )

    def _calculate_angles(self, pose: PoseData):

        shoulder, hip, knee, ankle = self._get_side_landmarks(pose)

        self.hip_angle = self.angle_calculator.calculate_angle(
            shoulder,
            hip,
            knee,
        )

        self.knee_angle = self.angle_calculator.calculate_angle(
            hip,
            knee,
            ankle,
        )

        self.min_knee_angle = min(
            self.min_knee_angle,
            self.knee_angle,
        )

    def _update_state(self):

        if self.knee_angle <= BOTTOM_THRESHOLD:
            self.state = "BOTTOM"

        elif self.knee_angle >= UP_THRESHOLD:
            self.state = "UP"

    def _check_depth(self, pose: PoseData):

        _, hip, knee, _ = self._get_side_landmarks(pose)

        if hip.y < knee.y - DEPTH_TOLERANCE:
            self.live_feedback.add("Go Lower")
            return False

        return True

    def _check_hip_drive(self, pose: PoseData):

        shoulder, hip, _, _ = self._get_side_landmarks(pose)

        if (
            not self.ascent_started
            and self.min_knee_angle <= BOTTOM_THRESHOLD
            and self.knee_angle > self.previous_knee_angle + ASCENT_START_THRESHOLD
        ):

            self.ascent_started = True
            self.ascent_frames = 0

            self.start_hip_y = hip.y
            self.start_shoulder_y = shoulder.y

            self.max_hip_shoulder_gap = 0

        if self.ascent_started:

            self.ascent_frames += 1

            hip_rise = self.start_hip_y - hip.y
            shoulder_rise = self.start_shoulder_y - shoulder.y

            gap = hip_rise - shoulder_rise

            self.max_hip_shoulder_gap = max(
                self.max_hip_shoulder_gap,
                gap,
            )

            if self.ascent_frames >= HIP_DRIVE_ANALYSIS_FRAMES:

                if (
                    self.max_hip_shoulder_gap > HIP_SHOULDER_GAP_THRESHOLD
                ):
                    self.live_feedback.add("Keep Your Chest Up")
                    self.current_rep_hip_drive_failed = True

                self.ascent_started = False

        self.previous_knee_angle = self.knee_angle

    def _count_rep(self, pose: PoseData):

        if (
            self.previous_state == "BOTTOM"
            and self.state == "UP"
        ):
            self.rep_count += 1
            
            self.session_stats["total_reps"] += 1

            depth_ok = self._check_depth(pose)

            if depth_ok:
                self.session_stats["good_reps"] += 1

            else:
                self.session_stats["depth_errors"] += 1

            if self.current_rep_hip_drive_failed:
                self.session_stats["hip_drive_errors"] += 1

            # Reset for next rep
            self.current_rep_hip_drive_failed = False

            self.min_knee_angle = INITIAL_KNEE_ANGLE

        self.previous_state = self.state

    def _check_form(self, pose: PoseData):

        self.live_feedback.clear()

        self._check_hip_drive(pose)

    def update(self, pose: PoseData):

        self._calculate_angles(pose)

        self._update_state()

        self._check_form(pose)

        self._count_rep(pose)