import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";

function DashboardPage() {
  const [workouts, setWorkouts] = useState([]);
  const [weightLogs, setWeightLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      setError("");

      if (!token) {
        setError("Authentication token is missing. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const [workoutsRes, weightLogsRes] = await Promise.all([
          api.get("/workout/", { headers: authHeaders }),
          api.get("/weightlog/", { headers: authHeaders }),
        ]);

        setWorkouts(workoutsRes.data || []);
        setWeightLogs(weightLogsRes.data || []);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            err.response?.data?.message ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [authHeaders, token]);

  const latestWeight = useMemo(() => {
    if (!weightLogs.length) return null;
    return [...weightLogs].sort(
      (a, b) => new Date(b.recorded_at) - new Date(a.recorded_at)
    )[0];
  }, [weightLogs]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 xl:grid-cols-[250px_1fr] xl:px-6">
        <Sidebar />

        <main className="space-y-6">
          <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl shadow-black/20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-blue-400">Dashboard</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">TitanLift Analytics</h1>
                <p className="mt-3 max-w-2xl text-sm text-zinc-400">
                  Real-time workout and weight log summaries based on your TitanLift backend.
                </p>
              </div>

              <div className="grid gap-3 sm:auto-cols-fr sm:grid-flow-col">
                <button
                  onClick={() => navigate("/workouts")}
                  className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  View Workouts
                </button>
                <button
                  onClick={() => navigate("/weight-logs")}
                  className="rounded-2xl bg-zinc-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
                >
                  Weight Logs
                </button>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <StatCard label="Total Workouts" value={loading ? "..." : workouts.length} helper="Your workout routines" />
            <StatCard label="Weight Entries" value={loading ? "..." : weightLogs.length} helper="Your recorded weight logs" />
            <StatCard
              label="Latest Weight"
              value={loading ? "..." : latestWeight ? `${latestWeight.weight} kg` : "—"}
              helper={latestWeight ? new Date(latestWeight.recorded_at).toLocaleDateString() : "No logs yet"}
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm shadow-black/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Overview</h2>
                <span className="text-sm text-zinc-400">Derived from available endpoints</span>
              </div>
              <div className="mt-6 space-y-4">
                <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
                  <p className="text-sm text-zinc-400">Workout routines</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{workouts.length}</p>
                </div>
                <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
                  <p className="text-sm text-zinc-400">Weight log entries</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{weightLogs.length}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm shadow-black/20">
              <h2 className="text-xl font-semibold text-white">Getting started</h2>
              <p className="mt-4 text-zinc-400">
                Use the navigation to enter workout routines or add weight logs. The dashboard displays your current account statistics.
              </p>
              {error && (
                <div className="mt-6 rounded-2xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-300">
                  {error}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;
