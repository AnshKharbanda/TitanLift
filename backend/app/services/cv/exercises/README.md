# Exercise Module

## Overview

The Exercise module is responsible for analyzing a user's movement using MediaPipe pose landmarks. Each exercise is implemented as an independent class that encapsulates its own biomechanics, state machine, rep counting logic, form analysis, and session statistics.

Current supported exercises:

- Squat
- Push-Up

---

## Architecture

```
Pose Estimation
        │
        ▼
Landmark Processor
        │
        ▼
PoseData
        │
        ▼
Exercise Class
        │
        ├── Angle Calculation
        ├── State Detection
        ├── Rep Counting
        ├── Form Analysis
        ├── Live Feedback
        └── Session Statistics
```

Each exercise follows the same workflow, making it easy to add new exercises without modifying the rest of the system.

---

## Exercise Lifecycle

Every frame:

1. Calculate joint angles.
2. Update exercise state.
3. Analyze form.
4. Count repetitions.
5. Update session statistics.

```
update()

├── _calculate_angles()
├── _update_state()
├── _check_form()
└── _count_rep()
```

---

## State Machine

Every exercise uses a finite state machine.

Example:

```
UP
 │
 ▼
BOTTOM
 │
 ▼
UP
```

A repetition is counted only when the movement transitions from **BOTTOM → UP**.

---

## Live Feedback

Each exercise provides real-time coaching through a `live_feedback` set.

Examples:

- Go Lower
- Keep Your Chest Up
- Keep Your Body Straight

These messages are intended for the user interface during exercise execution.

---

## Session Statistics

Each exercise stores statistics describing the completed set.

Example:

```python
{
    "exercise": "SQUAT",
    "total_reps": 10,
    "good_reps": 8,
    "depth_errors": 2,
    "hip_drive_errors": 1,
}
```


---

## Current Exercises

### Squat

Features:

- Rep counting
- Squat depth detection
- Hip drive detection
- Live feedback
- Session statistics

### Push-Up

Features:

- Rep counting
- Push-up depth detection
- Hip alignment detection
- Live feedback
- Session statistics

---

## Design Principles

Each exercise should:

- Be completely independent.
- Use the shared `PoseData` abstraction.
- Use the common `AngleCalculator`.
- Maintain its own state machine.
- Produce live feedback.
- Produce structured session statistics.
- Avoid dependencies on other exercise classes.

---

