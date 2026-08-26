TitanLift

AI-Powered Fitness Tracking & Coaching Platform

TitanLift is a full-stack AI fitness platform that combines workout
planning, progress analytics, real-time computer-vision form analysis,
and a research-grounded AI Coach in one application.

The platform is designed around three complementary intelligence layers:

                    TITANLIFT
                       |
        +--------------+--------------+
        |              |              |
   Training Data    Computer Vision   AI Coach
        |              |              |
  PostgreSQL       MediaPipe Pose      RAG
        |              |              |
        +--------------+--------------+
                       |
                    FastAPI
                       |
                    React UI

The result is a fitness application that does more than store workouts:
it can understand training data, analyze exercise movement, and answer
fitness/nutrition questions using retrieved knowledge.

Features

1. Authentication & User Accounts

User registration and login

JWT-based authentication

Password hashing with bcrypt

Protected backend routes

Authenticated frontend state

User-specific workout, weight, and CV data

The frontend manages authentication through AuthContext, while
authenticated API requests are sent through the shared API layer.

2. Workout Management

Users can:

Create and manage workouts

Add exercises to workouts

Edit workout exercises

Remove exercises

Organize training around individual exercise selections

Record workout-related information

The workout system provides the structured training data used by the
dashboard and analytics features.

3. Exercise Management

Exercise records contain information such as:

Exercise name

Muscle group

Description

Exercise metadata

The frontend provides expandable exercise cards and exercise management
functionality.

4. Dashboard & Training Analytics

TitanLift converts stored training data into useful progress
information.

Dashboard functionality includes:

Workout statistics

Training consistency

Streak information

Weight progress

Training analytics

Muscle distribution

Progress visualizations

The muscle-distribution view summarizes training volume by muscle group
and displays the number of sets performed.

5. Weight & Progress Tracking

Users can record body weight over time.

TitanLift uses these records to provide:

Weight history

Progress trends

Dashboard insights

Historical training context for the AI Coach

6. Real-Time Computer Vision Form Analysis

TitanLift provides live exercise analysis through a browser webcam.

Current exercise support includes:

Squat

Push-up

The CV pipeline uses:

Webcam
  ↓
Browser / React
  ↓
WebSocket
  ↓
FastAPI
  ↓
OpenCV
  ↓
MediaPipe Pose
  ↓
Pose Landmarks
  ↓
Exercise Analyzer
  ↓
Rep + Form Metrics
  ↓
React UI

Pose estimation

MediaPipe detects body landmarks such as:

Shoulders

Hips

Knees

Ankles

Wrists

Hands

Feet

The backend converts the incoming OpenCV BGR frame to RGB before pose
estimation.

Geometric analysis

Instead of treating form analysis as an opaque classifier, TitanLift
uses explicit body geometry and exercise-specific rules.

For squats, the system calculates:

Knee angle

Hip angle

Torso-related geometry

The current squat state machine uses:

UP → BOTTOM → UP

with current knee-angle thresholds:

BOTTOM: ≤ 90°
UP:     ≥ 160°

The system also checks:

Squat depth

Hip drive during ascent

Example feedback:

Go Lower
Keep Your Chest Up

CV sessions record metrics such as:

Total reps

Good reps

Depth errors

Hip-drive errors

Hip-sag errors

Exercise

Side

Session duration

Completed sessions are persisted to PostgreSQL.

7. AI Coach

TitanLift includes a conversational AI Coach that combines:

The user's personal training information

TitanLift's fitness knowledge base

An LLM

User Question
      |
      +----------------------+
      |                      |
Personal Data          RAG Knowledge
(PostgreSQL)                |
      |                      |
      +----------+-----------+
                 |
          Grounded Prompt
                 |
             Groq LLM
                 |
           Coach Response

The Coach can use information such as training history and user profile
data together with retrieved fitness/nutrition knowledge.

Frontend capabilities include:

Chat history

Suggested questions

Loading states

Error handling

Clear-chat functionality

Responsive chat UI

RAG Knowledge System

TitanLift's RAG system provides the knowledge layer behind the AI Coach.

It uses research-oriented fitness and nutrition material from:

PDF documents

YouTube transcripts

RAG ingestion

PDFs + YouTube Transcripts
            |
         Loaders
            |
     Document Cleaning
            |
    Recursive Chunking
            |
      BGE Embeddings
            |
          FAISS
            |
      Persisted KB

The current knowledge base has been tested with more than 1,000 chunks.

Query-time RAG

User Question
      |
Query Rewriter
      |
      +--------------------+
      |                    |
Dense Retrieval       BM25 Retrieval
BGE + FAISS           Lexical Search
      |                    |
      +---------+----------+
                |
          RRF Fusion
                |
      Cross-Encoder Reranker
                |
         Top Documents
                |
        Context Builder
                |
          Groq Generator
                |
        Grounded Answer

RAG techniques

Query rewriting

BGE dense embeddings

FAISS vector search

BM25 lexical search

Reciprocal Rank Fusion (RRF)

Cross-encoder reranking

Context construction

Evidence-grounded generation

Insufficient-context handling

The rewritten query is used for retrieval, while the original user
question is retained for final generation.

Architecture

High-level architecture

                         React Frontend
                              |
                    Axios / WebSocket
                              |
                         FastAPI API
                              |
       +----------------------+----------------------+
       |                      |                      |
   PostgreSQL              AI Coach                  CV
       |                      |                      |
 User/Workout/          Personal Data + RAG     OpenCV + MediaPipe
 Weight/CV Data                 |                      |
       |                       Groq                CVAnalysis
       |                                               |
       +----------------------+------------------------+
                              |
                         Dashboard

Frontend architecture

src/
├── assets/
├── components/
│   ├── AppShell.jsx
│   ├── CVFeed.jsx
│   ├── ExerciseCard.jsx
│   ├── WorkoutCard.jsx
│   └── ...
├── context/
│   └── AuthContext.jsx
├── pages/
│   ├── Home.jsx
│   ├── login.jsx
│   ├── signup.jsx
│   ├── Dashboard.jsx
│   ├── Workouts.jsx
│   ├── Exercises.jsx
│   ├── AIAnalysis.jsx
│   └── AICoach.jsx
├── services/
│   ├── api.js
│   ├── dashboard.js
│   ├── workout.js
│   ├── exercise.js
│   ├── coach.js
│   └── ...
└── App.jsx

Application routes

Route            Purpose

/              Landing page
/login         Login
/signup        Registration
/dashboard     Training dashboard
/workouts      Workout management
/exercises     Exercise management
/ai-analysis   Live CV form analysis
/ai-coach      AI Coach

Tech Stack

Frontend

Technology                  Purpose

React                       UI
Vite                        Development/build tooling
React Router                Client-side routing
Tailwind CSS                Styling
Axios / API service layer   Backend communication
Lucide React                Icons
Recharts                    Analytics visualizations

Backend

Technology         Purpose

Python             Backend language
FastAPI            REST API + WebSockets
SQLAlchemy         ORM/database access
PostgreSQL         Persistent application data
JWT                Authentication
Passlib / bcrypt   Password hashing

Computer Vision

Technology                Purpose

OpenCV                    Frame processing
MediaPipe Pose            Human pose estimation
WebSockets                Real-time frame/metric transport
Custom geometry           Joint-angle calculation
Exercise state machines   Rep counting and form rules

AI / RAG

Technology                        Purpose

Groq                              LLM inference for AI Coach
BGE                               Dense text embeddings
FAISS                             Vector similarity search
BM25                              Lexical retrieval
RRF                               Hybrid retrieval fusion
Cross-Encoder / MS MARCO MiniLM   Reranking
PDF loaders                       Research ingestion
YouTube transcript loaders        Knowledge ingestion

Requirements

Before running TitanLift locally, install:

Node.js

npm

Python 3.10+

PostgreSQL

A modern browser with webcam support

A Groq API key

For the RAG ingestion/retrieval stack, the backend dependencies also
install the required LangChain, FAISS, Hugging
Face/sentence-transformer, BM25, PDF, transcript, and related packages
through requirements.txt.

Note: The current TitanLift RAG implementation uses Groq for
generation. Earlier/local RAG documentation referenced
Ollama/Qwen3:4b; the current AI Coach generation path is Groq-based.

Project Structure

A typical repository layout is:

TitanLift/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── app/
│   │   ├── auth/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── cv/
│   │   ├── rag/
│   │   └── ...
│   ├── requirements.txt
│   ├── .env
│   └── ...
│
└── README.md

The exact directory layout may evolve, but the architectural separation
remains:

Frontend
Backend API
Database
CV subsystem
RAG subsystem
LLM generation

Installation

1. Clone the repository

git clone <your-repository-url>
cd TitanLift

2. Set up PostgreSQL

Create a PostgreSQL database for TitanLift.

Example:

Database: titanlift
Host: localhost
Port: 5432

The backend should be configured with the database connection string
through environment configuration.

Example:

DATABASE_URL=postgresql://postgres:PASSWORD@localhost:5432/titanlift

Do not commit database credentials.

Backend Setup

Open a terminal in:

TitanLift/backend

1. Create a virtual environment

Windows PowerShell

python -m venv venv
.\venv\Scripts\Activate.ps1

macOS / Linux

python3 -m venv venv
source venv/bin/activate

2. Install dependencies

pip install -r requirements.txt

3. Configure environment variables

Create:

backend/.env

At minimum, configure the values required by your local backend,
including:

DATABASE_URL=postgresql://postgres:PASSWORD@localhost:5432/titanlift

GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b

If your backend uses additional authentication/CORS configuration,
configure those according to the current backend settings.

Never commit .env or API keys to Git.

Before production deployment, the JWT signing secret should also be
supplied through an environment variable rather than hard-coded in
source code.

RAG Setup

The RAG knowledge base is generated from fitness/nutrition sources.

1. Add PDFs

Place research PDFs in:

backend/app/rag/data/pdf/

2. Add YouTube sources

Add one YouTube URL per line to:

backend/app/rag/data/yt_urls.txt

3. Build the knowledge base

From backend/:

python -m app.rag.ingest

This generates persistent retrieval artifacts such as:

app/rag/data/storage/
├── faiss_index/
└── chunks.pkl

You only need to rerun ingestion when the underlying knowledge sources
change.

4. Test RAG independently

python -m app.rag.test

Example queries:

How does protein intake affect muscle growth?
What causes knee valgus during a squat?
How does sleep affect athletic recovery?

If sufficient evidence is unavailable, the system can return an
insufficient-context response rather than fabricate unsupported
information.

Frontend Setup

Open another terminal in:

TitanLift/frontend

Install dependencies:

npm install

Start the development server:

npm run dev

The Vite development server normally runs at:

http://localhost:5173

The FastAPI backend must also be running for API-dependent
functionality.

Running TitanLift

You generally need three services/components available locally:

1. PostgreSQL
2. FastAPI backend
3. React/Vite frontend

Terminal 1 --- PostgreSQL

Make sure PostgreSQL is running and the titanlift database exists.

Terminal 2 --- Backend

cd TitanLift/backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload

If your FastAPI entrypoint has a different module path in the current
repository, use that module path instead.

Terminal 3 --- Frontend

cd TitanLift/frontend
npm run dev

Open:

http://localhost:5173

Development Workflow

A typical development workflow is:

Start PostgreSQL
      ↓
Start FastAPI
      ↓
Load RAG artifacts
      ↓
Start React/Vite
      ↓
Open TitanLift
      ↓
Login / Register
      ↓
Create workouts
      ↓
Track weight and training
      ↓
Use AI Form Analysis
      ↓
Use AI Coach

API / Data Flow

Standard REST request

React Page
    ↓
Service Module
    ↓
Axios / API Client
    ↓
FastAPI
    ↓
SQLAlchemy
    ↓
PostgreSQL

AI Coach request

AICoach.jsx
    ↓
services/coach.js
    ↓
POST /coach/chat
    ↓
FastAPI Coach Router
    ↓
Personal PostgreSQL Data
        +
RAG Retrieved Context
    ↓
Groq LLM
    ↓
Coach Response
    ↓
React Chat UI

CV request

Browser Webcam
    ↓
CVFeed.jsx
    ↓
JPEG Frame
    ↓
WebSocket
    ↓
FastAPI
    ↓
OpenCV
    ↓
MediaPipe
    ↓
Exercise Analyzer
    ↓
Metrics / Feedback
    ↓
WebSocket
    ↓
React UI

Security Notes

TitanLift currently uses JWT-based authentication and bcrypt password
hashing.

For a production deployment:

Store JWT secrets in environment variables.

Never commit .env.

Never expose the Groq API key to the frontend.

Configure production CORS explicitly.

Use HTTPS/WSS.

Validate request payloads at API boundaries.

Add rate limiting to authentication and AI endpoints.

Avoid logging passwords, tokens, or other sensitive data.

Use a production-grade PostgreSQL configuration.

Review camera/video privacy requirements before storing any raw
media.

Production Build

Frontend

npm run build

Preview locally:

npm run preview

Before deployment, verify:

Production API URL

CORS origins

Authentication flow

Logout behavior

React Router direct navigation

Webcam permissions

AI Coach API connectivity

Current Project Status

TitanLift V1 currently includes:

Authentication                 ✓
Dashboard                     ✓
Workout management             ✓
Exercise management            ✓
Weight/progress tracking       ✓
Training analytics             ✓
Muscle distribution            ✓
Real-time CV analysis          ✓
Squat form analysis            ✓
Push-up analysis               ✓
Rep counting                   ✓
Form feedback                  ✓
CV session persistence         ✓
AI Coach                       ✓
RAG knowledge base             ✓
Hybrid retrieval               ✓
Cross-encoder reranking        ✓
Query rewriting                ✓
Grounded generation            ✓
PostgreSQL persistence         ✓

The RAG pipeline has been tested end-to-end with the real TitanLift
knowledge base, including ingestion, embeddings, FAISS persistence, BM25
retrieval, RRF fusion, reranking, query rewriting, context construction,
and grounded generation.

Future Improvements

AI Coach / RAG

Retrieval quality

Retrieval evaluation using Recall@K, MRR, Hit Rate, and nDCG

Compare dense-only, BM25-only, hybrid, and reranked retrieval

Evaluate recursive versus semantic chunking

Dynamic top-k based on retrieval confidence

Better retrieval-confidence thresholds

Grounding & provenance

Source citations in AI Coach responses

PDF page citations

YouTube timestamps

Structured source metadata

Stronger insufficient-context abstention

Unsupported-claim evaluation

Personalization

Conversation-aware retrieval

Metadata filtering by topic such as nutrition, recovery, exercise,
and programming

Retrieval conditioned on user training history

More detailed personalization of recommendations

Performance

Query caching

Embedding caching

Retrieval-result caching

Generation caching where appropriate

Latency instrumentation

GPU/model optimization

Incremental indexing instead of rebuilding the complete FAISS index

Duplicate/near-duplicate chunk detection

Computer Vision

Potential improvements:

Support additional exercises

More robust rep-state detection

Temporal smoothing of landmarks

Confidence-aware landmark filtering

Automatic camera-position validation

Exercise-specific calibration

More detailed form metrics

Improved false-positive/false-negative handling

Form-analysis accuracy evaluation against labelled videos

Historical form trends

Session replay

Real-time exercise recommendations

A particularly useful extension would be moving from fixed geometric
thresholds toward a more robust temporal model while retaining
interpretable rule-based checks for safety-critical feedback.

Platform

Potential product improvements:

Personalized workout generation based on progression history

Automatic progressive overload recommendations

Exercise substitutions based on available equipment

Training-volume recommendations

Recovery/readiness scoring

Nutrition tracking

Meal-plan personalization

Better dashboard analytics

Training PR detection

Weekly/monthly progress reports

Mobile/PWA support

Push notifications

Cloud deployment

Background processing for expensive AI/CV jobs

Automated testing and CI/CD

Structured observability and performance monitoring

Engineering Roadmap

A sensible next-stage roadmap is:

V1
 |
 +-- Core fitness platform
 |     ├── Authentication
 |     ├── Workouts
 |     ├── Exercises
 |     ├── Weight tracking
 |     └── Dashboard
 |
 +-- Computer Vision
 |     ├── Pose estimation
 |     ├── Rep counting
 |     ├── Form analysis
 |     └── Session persistence
 |
 +-- AI Coach
 |     ├── Personal data
 |     ├── RAG
 |     ├── Hybrid retrieval
 |     ├── Reranking
 |     └── Grounded generation
 |
 V2
 |
 +-- Retrieval evaluation
 +-- Better CV robustness
 +-- Conversation-aware AI
 +-- Source citations
 +-- Personalised progression
 +-- More exercises
 +-- Performance / caching
 |
 V3
 |
 +-- Production deployment
 +-- Mobile experience
 +-- Advanced analytics
 +-- Automated coaching
 +-- Large-scale observability

Design Philosophy

TitanLift deliberately separates its major intelligence components:

              DATA
               |
        PostgreSQL Layer
               |
       +-------+-------+
       |               |
     Coach             CV
       |               |
      RAG          Pose Geometry
       |               |
       +-------+-------+
               |
              API
               |
             React

This separation makes the system easier to debug and extend.

For example:

The retrieval strategy can change without rewriting the AI Coach UI.

A new exercise can be added without replacing the pose-estimation
infrastructure.

The LLM provider can be changed without redesigning retrieval.

Dashboard analytics can evolve independently of CV processing.

The architecture therefore favors modularity, interpretability, and
replaceable components over a single monolithic AI system.

Disclaimer

TitanLift is an AI-assisted fitness application and should not be
treated as a substitute for qualified medical or fitness professionals.

AI-generated recommendations and computer-vision feedback can be
imperfect. Users should use appropriate judgment, especially when
dealing with pain, injury, medical conditions, or high-risk training.

License

Add the project's license here if/when one is selected.

TitanLift --- Train Hard. Analyze Smart.