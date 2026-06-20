import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function WorkoutDetailsPage() {
  const { id } = useParams();
  const [workout, setWorkout] = useState(null);
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [formData, setFormData] = useState({
    exercise_id: "",
    sets: "",
    reps: "",
    weight: "",
  });
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    async function loadWorkoutDetails() {
      setLoading(true);
      setError("");
      setSuccess("");

      if (!token) {
        setError("Authentication token is missing. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const [workoutResponse, exerciseResponse, workoutExerciseResponse] =
          await Promise.all([
            api.get("/workout/", { headers: authHeaders }),
            api.get("/exercise/"),
            api.get(`/workout/exercise/${id}`, { headers: authHeaders }),
          ]);

        const currentWorkout = workoutResponse.data.find(
          (item) => String(item.id) === String(id)
        );
        setWorkout(currentWorkout || null);
        setExercises(exerciseResponse.data || []);
        setWorkoutExercises(workoutExerciseResponse.data || []);

        if (!currentWorkout) {
          setError("Workout not found.");
        }
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            err.response?.data?.message ||
            "Unable to load workout details."
        );
      } finally {
        setLoading(false);
      }
    }

    loadWorkoutDetails();
  }, [authHeaders, id, token]);

  const exerciseMap = useMemo(
    () => Object.fromEntries(exercises.map((item) => [item.id, item])),
    [exercises]
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleAddExercise(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.exercise_id) {
      setError("Please select an exercise.");
      return;
    }

    if (!formData.sets || !formData.reps || formData.weight === "") {
      setError("Sets, reps, and weight are required.");
      return;
    }

    const payload = {
      exercise_id: Number(formData.exercise_id),
      sets: Number(formData.sets),
      reps: Number(formData.reps),
      weight: Number(formData.weight),
    };

    setAdding(true);
    try {
      const response = await api.post(`/workout/exercise/${id}`, payload, {
        headers: authHeaders,
      });
      setWorkoutExercises((current) => [response.data, ...current]);
      setSuccess("Exercise added to workout.");
      setFormData({ exercise_id: "", sets: "", reps: "", weight: "" });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Unable to add exercise to workout."
      );
    } finally {
      setAdding(false);
    }
  }

  async function handleRemoveExercise(exercise_id) {
    setError("");
    setSuccess("");
    setDeletingId(exercise_id);

    try {
      const response = await api.delete(
        `/workout/exercise/${id}/${exercise_id}`,
        {
          headers: authHeaders,
        }
      );
      setWorkoutExercises(response.data || []);
      setSuccess("Exercise removed from workout.");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Unable to remove exercise."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8 xl:px-6">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl shadow-black/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-blue-400">Workout details</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">{workout?.title || "Workout Details"}</h1>
              <p className="mt-2 text-zinc-400">Manage exercises for this workout and stay in sync with the backend.</p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/workouts")}
              className="rounded-2xl bg-zinc-800 px-5 py-3 text-sm text-white transition hover:bg-zinc-700"
            >
              Back to Workouts
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-red-200">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-sm shadow-black/20">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-white">{workout?.title || "Workout not found"}</h2>
                  {workout && (
                    <p className="mt-2 text-sm text-zinc-400">
                      Created {new Date(workout.created_at).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm shadow-black/20">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Attached Exercises</h3>
                <span className="text-sm text-zinc-400">{workoutExercises.length} entries</span>
              </div>

              {loading ? (
                <div className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-center text-zinc-400">
                  Loading exercise details...
                </div>
              ) : workoutExercises.length === 0 ? (
                <div className="mt-6 rounded-3xl border border-dashed border-zinc-800 bg-zinc-950 p-6 text-center text-zinc-400">
                  No exercises attached yet.
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {workoutExercises.map((item) => {
                    const exercise = exerciseMap[item.exercise_id];
                    return (
                      <div
                        key={`${item.exercise_id}-${item.id}`}
                        className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-lg font-semibold text-white">{exercise?.name || `Exercise ${item.exercise_id}`}</p>
                            <p className="text-sm text-zinc-400">
                              {exercise?.muscle_group || "Unknown muscle group"}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveExercise(item.exercise_id)}
                            disabled={deletingId === item.exercise_id}
                            className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-500/70"
                          >
                            {deletingId === item.exercise_id ? "Removing..." : "Remove"}
                          </button>
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                          <div className="rounded-2xl bg-zinc-900 p-3 text-sm text-zinc-300">
                            <span className="font-semibold text-white">Sets:</span> {item.sets}
                          </div>
                          <div className="rounded-2xl bg-zinc-900 p-3 text-sm text-zinc-300">
                            <span className="font-semibold text-white">Reps:</span> {item.reps}
                          </div>
                          <div className="rounded-2xl bg-zinc-900 p-3 text-sm text-zinc-300">
                            <span className="font-semibold text-white">Weight:</span> {item.weight} kg
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-sm shadow-black/20">
            <h3 className="text-xl font-semibold text-white">Add Exercise</h3>

            {success && (
              <div className="mt-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-emerald-300">
                {success}
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-2xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleAddExercise} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm text-zinc-300 mb-2" htmlFor="exercise_id">
                  Exercise
                </label>
                <select
                  id="exercise_id"
                  name="exercise_id"
                  value={formData.exercise_id}
                  onChange={handleChange}
                  className="w-full rounded-2xl bg-zinc-900 border border-zinc-700 px-4 py-3 outline-none"
                >
                  <option value="">Choose an exercise</option>
                  {exercises.map((exercise) => (
                    <option key={exercise.id} value={exercise.id}>
                      {exercise.name} ({exercise.muscle_group})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm text-zinc-300 mb-2" htmlFor="sets">
                    Sets
                  </label>
                  <input
                    id="sets"
                    name="sets"
                    type="number"
                    min="1"
                    value={formData.sets}
                    onChange={handleChange}
                    className="w-full rounded-2xl bg-zinc-900 border border-zinc-700 px-4 py-3 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-300 mb-2" htmlFor="reps">
                    Reps
                  </label>
                  <input
                    id="reps"
                    name="reps"
                    type="number"
                    min="1"
                    value={formData.reps}
                    onChange={handleChange}
                    className="w-full rounded-2xl bg-zinc-900 border border-zinc-700 px-4 py-3 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-300 mb-2" htmlFor="weight">
                  Weight (kg)
                </label>
                <input
                  id="weight"
                  name="weight"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full rounded-2xl bg-zinc-900 border border-zinc-700 px-4 py-3 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={adding}
                className="w-full rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-500/60"
              >
                {adding ? "Adding..." : "Add Exercise"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkoutDetailsPage;
