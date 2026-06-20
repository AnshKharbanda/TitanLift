# TitanLift Database Design

## Overview

This document defines the initial database schema for TitanLift MVP (Phase 1).

The design focuses on:

* User management
* Authentication
* Workout tracking
* Exercise management
* Weight tracking

The schema is intentionally simple and extensible so that future features such as analytics, AI coaching, nutrition tracking, and computer vision can be added without major redesign.



# Users

Stores user account and profile information.

## Fields

| Field           | Type           | Description           |
| --------------- | -------------- | --------------------- |
| id              | UUID / Integer | Primary Key           |
| name            | String         | User's full name      |
| email           | String         | Unique email          |
| hashed_password | String         | Encrypted password    |
| age             | Integer        | User age              |
| height          | Float          | Height in cm          |
| goal            | String         | Fitness goal          |
| created_at      | Timestamp      | Account creation time |


# WeightLogs

Stores historical weight entries.

## Why Separate Table?

Weight changes over time.

Keeping historical records allows:

* Weight progression charts
* Analytics
* AI recommendations
* Progress tracking

## Fields

| Field       | Type           | Description         |
| ----------- | -------------- | ------------------- |
| id          | UUID / Integer | Primary Key         |
| user_id     | Foreign Key    | References Users    |
| weight      | Float          | Weight in kg        |
| recorded_at | Timestamp      | Time of measurement |



# Workouts

Represents a workout session created by a user.

## Fields

| Field      | Type           | Description          |
| ---------- | -------------- | -------------------- |
| id         | UUID / Integer | Primary Key          |
| user_id    | Foreign Key    | References Users     |
| title      | String         | Workout name         |
| created_at | Timestamp      | Record creation time |



# Exercises

Master exercise library.

Exercises are stored once and reused across all workouts.

## Fields

| Field        | Type           | Description          |
| ------------ | -------------- | -------------------- |
| id           | UUID / Integer | Primary Key          |
| name         | String         | Exercise name        |
| muscle_group | String         | Primary muscle group |
| description  | Text           | Exercise description |



# WorkoutExercises

Connects workouts and exercises.

This table stores exercise performance within a specific workout.

## Fields

| Field       | Type           | Description          |
| ----------- | -------------- | -------------------- |
| id          | UUID / Integer | Primary Key          |
| workout_id  | Foreign Key    | References Workouts  |
| exercise_id | Foreign Key    | References Exercises |
| sets        | Integer        | Number of sets       |
| reps        | Integer        | Number of reps       |
| weight      | Float          | Weight used          |

# Future Database Extensions

The following tables may be added in later phases.

## AI Chat History

```text
ChatMessages
------------
id
user_id
role
message
created_at
```

---

## Nutrition Tracking

```text
Meals
-----
id
user_id
meal_type
calories
protein
carbs
fat
created_at
```

---

## Personal Records

```text
PersonalRecords
---------------
id
user_id
exercise_id
best_weight
best_reps
recorded_at
```

---

## Computer Vision Sessions

```text
FormAnalysisSessions
--------------------
id
user_id
exercise_id
form_score
feedback
created_at
```

---

