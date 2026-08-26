import { Flame, Trophy } from "lucide-react";

function TrainingStreak({
  currentStreak = 0,
  longestStreak = 0,
  loading,
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0b0d0d] p-6">

      <p className="text-xs font-semibold tracking-[0.18em] text-lime-400">
        CONSISTENCY
      </p>

      <h3 className="mt-1 text-xl font-bold">
        Training Streak
      </h3>

      {loading ? (

        <div className="mt-8 h-[190px] animate-pulse rounded-xl bg-white/[0.03]" />

      ) : (

        <div className="mt-6">

          {/* Current streak */}

          <div className="rounded-xl border border-lime-400/10 bg-lime-400/[0.04] p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400/10">
                <Flame
                  size={20}
                  className="text-lime-400"
                />
              </div>

              <div>
                <p className="text-xs text-white/35">
                  Current streak
                </p>

                <p className="mt-0.5 text-3xl font-black text-white">
                  {currentStreak}
                  <span className="ml-2 text-sm font-medium text-white/30">
                    days
                  </span>
                </p>
              </div>

            </div>

          </div>

          {/* Longest streak */}

          <div className="mt-3 flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.015] px-4 py-4">

            <div className="flex items-center gap-3">

              <Trophy
                size={17}
                className="text-white/40"
              />

              <span className="text-sm text-white/50">
                Longest streak
              </span>

            </div>

            <span className="text-sm font-bold text-white">
              {longestStreak} days
            </span>

          </div>

        </div>

      )}

    </div>
  );
}

export default TrainingStreak;