import math
import numpy as np

from .types import Point


class AngleCalculator:
    """
    Utility class for calculating joint angles.
    """

    def calculate_angle(
        self,
        point1: Point,
        point2: Point,
        point3: Point
    ) -> float:
        """
        Calculate the angle (in degrees) formed by three points.

        The angle is measured at point2.

        Example:
            Shoulder ---- Elbow ---- Wrist

            point1 = Shoulder
            point2 = Elbow
            point3 = Wrist
        """

        # Create vectors from the joint (point2)
        vector1 = np.array([
            point1.x - point2.x,
            point1.y - point2.y
        ])

        vector2 = np.array([
            point3.x - point2.x,
            point3.y - point2.y
        ])

        # Calculate dot product
        dot_product = np.dot(vector1, vector2)

        # Calculate vector magnitudes
        magnitude1 = np.linalg.norm(vector1)
        magnitude2 = np.linalg.norm(vector2)

        # Prevent division by zero
        if magnitude1 == 0 or magnitude2 == 0:
            return 0.0

        # Compute cosine of the angle
        cos_theta = dot_product / (magnitude1 * magnitude2)

        # Handle floating-point precision errors
        cos_theta = np.clip(cos_theta, -1.0, 1.0)

        # Convert to degrees
        angle = math.degrees(math.acos(cos_theta))

        return angle