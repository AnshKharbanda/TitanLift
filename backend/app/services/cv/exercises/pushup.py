from ..angle_calculator import AngleCalculator
from ..types import PoseData


BOTTOM_THRESHOLD = 90
UP_THRESHOLD = 160

INITIAL_ELBOW_ANGLE = 180

DEPTH_TOLERANCE = 0.02
BODY_ALIGNMENT_THRESHOLD = 170


class PushUp:

    def __init__(self, side: str):

        self.side = side

        self.rep_count = 0

        self.state = "UP"
        self.previous_state = "UP"

        # Live Feedback
        self.live_feedback = set()

        # Session Statistics
        self.session_stats = {
            "exercise": "PUSHUP",
            "total_reps": 0,
            "good_reps": 0,
            "depth_errors": 0,
            "hip_sag_errors": 0,
        }

        self.current_rep_hip_sag_failed = False

        # Angles
        self.elbow_angle = INITIAL_ELBOW_ANGLE
        self.body_angle = 180

        self.min_elbow_angle = INITIAL_ELBOW_ANGLE

        self.angle_calculator = AngleCalculator()

    def _get_side_landmarks(self, pose: PoseData):

        if self.side == "LEFT":
            return (
                pose.left_shoulder,
                pose.left_elbow,
                pose.left_wrist,
                pose.left_hip,
                pose.left_ankle,
            )

        return (
            pose.right_shoulder,
            pose.right_elbow,
            pose.right_wrist,
            pose.right_hip,
            pose.right_ankle,
        )

    def _calculate_angles(self, pose: PoseData):

        shoulder, elbow, wrist, hip, ankle = self._get_side_landmarks(pose)

        self.elbow_angle = self.angle_calculator.calculate_angle(
            shoulder,
            elbow,
            wrist,
        )

        self.body_angle = self.angle_calculator.calculate_angle(
            shoulder,
            hip,
            ankle,
        )

        self.min_elbow_angle = min(
            self.min_elbow_angle,
            self.elbow_angle,
        )

    def _update_state(self):

        if self.elbow_angle <= BOTTOM_THRESHOLD:
            self.state = "BOTTOM"

        elif self.elbow_angle >= UP_THRESHOLD:
            self.state = "UP"

    def _check_depth(self, pose: PoseData):

        shoulder, elbow, _, _, _ = self._get_side_landmarks(pose)

        # Verify comparison once while testing
        if shoulder.y < elbow.y - DEPTH_TOLERANCE:
            self.live_feedback.add("Go Lower")
            return False

        return True

    def _check_hip_alignment(self):

        if self.body_angle < BODY_ALIGNMENT_THRESHOLD:

            self.live_feedback.add("Keep Your Body Straight")

            self.current_rep_hip_sag_failed = True

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

            if self.current_rep_hip_sag_failed:

                self.session_stats["hip_sag_errors"] += 1

            self.current_rep_hip_sag_failed = False

            self.min_elbow_angle = INITIAL_ELBOW_ANGLE

        self.previous_state = self.state

    def _check_form(self):

        self.live_feedback.clear()

        self._check_hip_alignment()

    def update(self, pose: PoseData):

        self._calculate_angles(pose)

        self._update_state()

        self._check_form()

        self._count_rep(pose)