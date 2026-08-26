import { useEffect, useState } from "react";
import { Flame, TrendingDown } from "lucide-react";
import AppShell from "../components/AppShell";
import WeightProgress from "../components/WeightProgress";
import MuscleDistribution from "../components/MuscleDistribution";
import {
  getDashboardStats,
  getWorkoutStreak,
  getWeightProgress,
  getMuscleDistribution,
} from "../services/dashboard";

function Progress() {
  const [stats, setStats] = useState(null);
  const [streak, setStreak] = useState(null);
  const [weights, setWeights] = useState([]);
  const [muscles, setMuscles] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsData, streakData, weightData, muscleData] =
          await Promise.all([
            getDashboardStats(),
            getWorkoutStreak(),
            getWeightProgress(),
            getMuscleDistribution(),
          ]);

        setStats(statsData);
        setStreak(streakData);
        setWeights(weightData);
        setMuscles(
          muscleData?.muscle_distribution || {}
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const currentWeight =
    weights.at(-1)?.weight ?? "—";

  const firstWeight = weights[0]?.weight;

  const weightChange =
    firstWeight != null &&
    currentWeight !== "—"
      ? (currentWeight - firstWeight).toFixed(1)
      : null;

  return (
    <AppShell eyebrow="ANALYTICS" title="Progress">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm text-white/35">
            Track how your training is changing
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Your Progress
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/[0.06] bg-[#0b0d0d] p-5">
            <p className="text-xs text-white/35">
              CURRENT WEIGHT
            </p>
            <p className="mt-3 text-3xl font-black">
              {loading ? "—" : `${currentWeight} kg`}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-[#0b0d0d] p-5">
            <p className="text-xs text-white/35">
              WEIGHT CHANGE
            </p>
            <p className="mt-3 flex items-center gap-2 text-3xl font-black">
              {loading || weightChange === null
                ? "—"
                : `${weightChange} kg`}
              <TrendingDown
                size={19}
                className="text-lime-400"
              />
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-[#0b0d0d] p-5">
            <p className="text-xs text-white/35">
              TOTAL VOLUME
            </p>
            <p className="mt-3 text-3xl font-black">
              {loading
                ? "—"
                : `${Number(
                    stats?.total_volume || 0
                  ).toLocaleString()} kg`}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-[#0b0d0d] p-5">
            <p className="text-xs text-white/35">
              STREAK
            </p>
            <p className="mt-3 flex items-center gap-2 text-3xl font-black">
              {loading
                ? "—"
                : `${streak?.current_streak || 0} days`}
              <Flame
                size={19}
                className="text-lime-400"
              />
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <WeightProgress
            data={weights}
            loading={loading}
          />

          <MuscleDistribution
            data={muscles}
            loading={loading}
          />
        </div>
      </div>
    </AppShell>
  );
}

export default Progress;