import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import WorkoutCard from "../components/WorkoutCard";

function WorkoutsPage() {
  const [workouts, setWorkouts] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    async function loadWorkouts() {
      setLoading(true);
      setError("");
      setSuccess("");

      if (!token) {
        setError("Authentication token is missing. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/workout/", { headers: authHeaders });
        setWorkouts(response.data || []);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            err.response?.data?.message ||
            "Unable to load workouts."
        );
      } finally {
        setLoading(false);
      }
    }

    loadWorkouts();
  }, [authHeaders, token]);

  async function handleCreateWorkout(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Workout title is required.");
      return;
    }

    if (!token) {
      setError("Authentication token is missing. Please log in again.");
      return;
    }

    setCreating(true);
    try {
      const response = await api.post(
        "/workout/",
        { title: trimmedTitle },
        { headers: authHeaders }
      );

      setWorkouts((current) => [response.data, ...current]);
      setTitle("");
      setSuccess("Workout created successfully.");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Unable to create workout."
      );
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteWorkout(id) {
    setError("");
    setSuccess("");
    setDeletingId(id);

    if (!token) {
      setError("Authentication token is missing. Please log in again.");
      setDeletingId(null);
      return;
    }

    try {
      await api.delete(`/workout/${id}`, { headers: authHeaders });
      setWorkouts((current) => current.filter((item) => item.id !== id));
      setSuccess("Workout deleted successfully.");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Unable to delete workout."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6 xl:px-6">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl shadow-black/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-blue-400">Workouts</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">My Workouts</h1>
              <p className="mt-2 text-zinc-400">
                Create, manage, and open your workout routines.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="rounded-2xl bg-zinc-800 px-5 py-3 text-sm text-white transition hover:bg-zinc-700"
            >
              Back to Dashboard
            </button>
          </div>

          {success && (
            <div className="mt-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-emerald-300">
              {success}
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-2xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleCreateWorkout} className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
            <label className="sr-only" htmlFor="workout-title">
              Workout title
            </label>
            <input
              id="workout-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="New workout title"
              className="w-full rounded-2xl bg-zinc-800 border border-zinc-700 px-4 py-3 outline-none transition focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={creating}
              className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-500/60"
            >
              {creating ? "Creating..." : "Create Workout"}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-400">
              Loading workouts...
            </div>
          ) : workouts.length === 0 ? (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-400">
              No workouts found. Add your first workout to begin.
            </div>
          ) : (
            workouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onOpen={() => navigate(`/workouts/${workout.id}`)}
                onDelete={() => handleDeleteWorkout(workout.id)}
                deleting={deletingId === workout.id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkoutsPage;
