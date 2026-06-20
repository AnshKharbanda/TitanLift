import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function WeightLogsPage() {
  const [weightLogs, setWeightLogs] = useState([]);
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("access_token");
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    async function loadLogs() {
      setLoading(true);
      setError("");
      setSuccess("");

      if (!token) {
        setError("Authentication token is missing. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/weightlog/", { headers: authHeaders });
        setWeightLogs(response.data || []);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            err.response?.data?.message ||
            "Unable to load weight logs."
        );
      } finally {
        setLoading(false);
      }
    }

    loadLogs();
  }, [authHeaders, token]);

  const latestWeight = useMemo(() => {
    if (!weightLogs.length) return null;
    return [...weightLogs].sort(
      (a, b) => new Date(b.recorded_at) - new Date(a.recorded_at)
    )[0];
  }, [weightLogs]);

  async function handleAddWeight(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!weight) {
      setError("Please enter a weight value.");
      return;
    }

    if (!token) {
      setError("Authentication token is missing. Please log in again.");
      return;
    }

    setCreating(true);
    try {
      const response = await api.post(
        "/weightlog/",
        { weight: Number(weight) },
        { headers: authHeaders }
      );

      setWeightLogs((current) => [response.data, ...current]);
      setWeight("");
      setSuccess("Weight entry added.");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Unable to add weight log."
      );
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteLog(id) {
    setError("");
    setSuccess("");
    setDeletingId(id);

    try {
      await api.delete(`/weightlog/${id}`, { headers: authHeaders });
      setWeightLogs((current) => current.filter((log) => log.id !== id));
      setSuccess("Weight log deleted.");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Unable to delete weight log."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8 xl:px-6 space-y-6">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl shadow-black/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-blue-400">Weight logs</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Bodyweight Progress</h1>
              <p className="mt-2 text-zinc-400">
                Add new weight entries and preview the latest metric from your weightlog history.
              </p>
            </div>
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

          <form onSubmit={handleAddWeight} className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
            <label className="sr-only" htmlFor="weight-input">
              Weight in kg
            </label>
            <input
              id="weight-input"
              type="number"
              min="20"
              max="300"
              step="0.1"
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
              placeholder="Enter weight in kg"
              className="w-full rounded-2xl bg-zinc-800 border border-zinc-700 px-4 py-3 outline-none"
            />
            <button
              type="submit"
              disabled={creating}
              className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-500/60"
            >
              {creating ? "Adding..." : "Add Weight"}
            </button>
          </form>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-sm shadow-black/20">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Weight History</h2>
              <p className="text-zinc-400">All weight log entries from your account.</p>
            </div>
            {latestWeight && (
              <div className="rounded-3xl bg-zinc-950 px-4 py-3 text-right text-zinc-200">
                <div className="text-sm text-zinc-400">Latest Weight</div>
                <div className="mt-2 text-2xl font-semibold text-white">{latestWeight.weight} kg</div>
              </div>
            )}
          </div>

          {loading ? (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-center text-zinc-400">
              Loading weight logs...
            </div>
          ) : weightLogs.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-950 p-8 text-center text-zinc-400">
              No weight logs found yet. Add your first entry above.
            </div>
          ) : (
            <div className="space-y-4">
              {weightLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-950 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-lg font-semibold text-white">{log.weight} kg</p>
                    <p className="mt-1 text-sm text-zinc-400">
                      {new Date(log.recorded_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteLog(log.id)}
                    disabled={deletingId === log.id}
                    className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-500/70"
                  >
                    {deletingId === log.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WeightLogsPage;
