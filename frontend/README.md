# TitanLift Frontend

TitanLift is an AI-powered fitness platform designed to help users train smarter through workout tracking, exercise management, computer-vision form analysis, progress tracking, and personalized AI coaching.

## Overview

The TitanLift frontend is built with React and Vite and provides the complete user interface for the fitness platform.

The application allows users to:

- Create and manage workouts
- Add and manage exercises
- Track sets, reps, and weight
- Monitor training progress
- Track body weight
- Analyze exercise form using a webcam
- Store computer-vision analysis sessions
- Interact with an AI fitness coach

The frontend communicates with a FastAPI backend through REST APIs.

## Features

### Dashboard

The dashboard provides a centralized overview of the user's training activity.

It includes:

- Workout statistics
- Recent workouts
- Training streak
- Longest training streak
- Weight progress
- Muscle-group distribution

### Workout Management

Users can create and manage workouts directly from the application.

Supported functionality includes:

- Create workouts
- View workouts
- Expand workout details
- Edit workout titles
- Edit workout notes
- Add exercises
- Edit sets
- Edit reps
- Edit weight
- Remove exercises from workouts
- Delete workouts

### Exercise Library

The exercise library allows users to browse and manage exercises.

Each exercise contains information such as:

- Exercise name
- Muscle group
- Description

Users can expand exercise cards to view additional information.

### AI Form Analysis

TitanLift includes webcam-based computer-vision analysis for exercise form.

The AI Analysis interface provides:

- Webcam access
- Live video feed
- Session controls
- Rep counting
- Form feedback
- Movement analysis
- Session statistics
- Saving analysis results

The basic flow is:

```text
Webcam
   ↓
CVFeed
   ↓
Computer Vision Pipeline
   ↓
Movement Analysis
   ↓
Rep / Form Metrics
   ↓
CV Session
   ↓
PostgreSQL