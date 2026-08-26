import { Dumbbell, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function formatWorkoutDate(dateString) {
  const date = new Date(dateString);

  const now = new Date();

  const diffMs = now - date;
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  if (diffHours < 24) {
    return `${diffHours} hr ago`;
  }

  if (diffDays === 1) {
    return "Yesterday";
  }

  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function RecentWorkouts({ workouts = [], loading }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0b0d0d] p-6 xl:col-span-2">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-lime-400">
            TRAINING
          </p>

          <h3 className="mt-1 text-xl font-bold">
            Recent Workouts
          </h3>
        </div>

        <Link
          to="/workouts"
          className="flex items-center gap-1 text-xs font-semibold text-white/35 transition hover:text-lime-400"
        >
          View all
          <ArrowRight size={13} />
        </Link>

      </div>

      <div className="mt-6 max-h-[280px] space-y-2 overflow-y-auto pr-1">

        {loading ? (
          <>
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[70px] animate-pulse rounded-xl bg-white/[0.03]"
              />
            ))}
          </>
        ) : workouts.length === 0 ? (

          <div className="flex min-h-[190px] flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08]">

            <Dumbbell
              size={28}
              className="text-lime-400/40"
            />

            <p className="mt-3 text-sm text-white/40">
              No workouts yet
            </p>

            <Link
              to="/workouts"
              className="mt-3 text-xs font-semibold text-lime-400 hover:text-lime-300"
            >
              Start your first workout →
            </Link>

          </div>

        ) : (

          workouts.slice(0, 5).map((workout) => (

            <div
              key={`${workout.title}-${workout.created_at}`}
              className="group flex items-center gap-4 rounded-xl border border-transparent px-3 py-3 transition hover:border-white/[0.06] hover:bg-white/[0.02]"
            >

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime-400/10">
                <Dumbbell
                  size={17}
                  className="text-lime-400"
                />
              </div>

              <div className="min-w-0 flex-1">

                <p className="truncate text-sm font-semibold text-white">
                  {workout.title}
                </p>

                <p className="mt-1 text-xs text-white/30">
                  Completed workout
                </p>

              </div>

              <span className="shrink-0 text-xs text-white/30">
                {formatWorkoutDate(workout.created_at)}
              </span>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default RecentWorkouts;