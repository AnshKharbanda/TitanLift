import { useEffect, useState } from "react";
import { Dumbbell, Plus } from "lucide-react";

import AppShell from "../components/AppShell";
import WorkoutCard from "../components/WorkoutCard";
import CreateWorkoutModal from "../components/CreateWorkoutModal";

import { getWorkouts } from "../services/workout";


function Workouts() {
  const [workouts, setWorkouts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [showCreateModal, setShowCreateModal] =
    useState(false);


  async function loadWorkouts() {
    try {
      setLoading(true);
      setError("");

      const data = await getWorkouts();

      setWorkouts(
        [...data].sort(
          (a, b) =>
            new Date(b.created_at) -
            new Date(a.created_at)
        )
      );
    } catch (err) {
      console.error(
        "Failed to load workouts:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Could not load workouts."
      );
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadWorkouts();
  }, []);


  function handleWorkoutCreated(workout) {
    setWorkouts((previous) => [
      workout,
      ...previous,
    ]);
  }


  function handleWorkoutDeleted(workoutId) {
    setWorkouts((previous) =>
      previous.filter(
        (workout) =>
          workout.id !== workoutId
      )
    );
  }


  return (
    <>
      <AppShell
        eyebrow="TRAINING"
        title="Workouts"
      >

        <div className="mx-auto max-w-7xl">

          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <p className="text-sm text-white/35">
                Build, track and review your training
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight">
                Your Workouts
              </h2>

              <p className="mt-2 text-sm text-white/30">
                {workouts.length} workout
                {workouts.length !== 1
                  ? "s"
                  : ""}
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                setShowCreateModal(true)
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-lime-300"
            >
              <Plus size={17} />
              Create Workout
            </button>

          </div>


          {/* =================================================
              WORKOUT HISTORY
          ================================================= */}

          <section className="rounded-2xl border border-white/[0.06] bg-[#0b0d0d] p-5 sm:p-6">

            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">

              <div>

                <p className="text-[10px] font-bold tracking-[0.2em] text-lime-400">
                  WORKOUT HISTORY
                </p>

                <h3 className="mt-1 text-xl font-bold">
                  Recent Workouts
                </h3>

              </div>


              <p className="text-xs text-white/25">
                Click a workout to view details
              </p>

            </div>


            {/* Error */}

            {error && (
              <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                {error}
              </div>
            )}


            {/* Loading */}

            {loading ? (

              <div className="mt-5 space-y-3">

                {[1, 2, 3, 4].map(
                  (item) => (
                    <div
                      key={item}
                      className="h-20 animate-pulse rounded-xl bg-white/[0.03]"
                    />
                  )
                )}

              </div>

            ) : workouts.length === 0 ? (

              /* Empty state */

              <div className="mt-5 flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] py-16">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400/10">
                  <Dumbbell
                    size={24}
                    className="text-lime-400"
                  />
                </div>

                <p className="mt-5 font-semibold">
                  No workouts yet
                </p>

                <p className="mt-1 text-center text-sm text-white/30">
                  Create your first workout to start tracking your training.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setShowCreateModal(true)
                  }
                  className="mt-5 flex items-center gap-2 rounded-xl bg-lime-400 px-5 py-2.5 text-sm font-bold text-black transition hover:bg-lime-300"
                >
                  <Plus size={16} />
                  Create Workout
                </button>

              </div>

            ) : (

              /* Workout cards */

              <div className="mt-5 space-y-3">

                {workouts.map(
                  (workout) => (
                    <WorkoutCard
                      key={workout.id}
                      workout={workout}
                      onDeleted={
                        handleWorkoutDeleted
                      }
                    />
                  )
                )}

              </div>

            )}

          </section>


          {/* =================================================
              FOOTER NOTE
          ================================================= */}

          {!loading && workouts.length > 0 && (
            <div className="mt-5 flex items-center gap-2 text-xs text-white/20">
              <Dumbbell size={13} />
              <span>
                Keep logging every session to build your training history.
              </span>
            </div>
          )}

        </div>

      </AppShell>


      {/* =====================================================
          CREATE WORKOUT MODAL
      ===================================================== */}

      <CreateWorkoutModal
        isOpen={showCreateModal}
        onClose={() =>
          setShowCreateModal(false)
        }
        onCreated={
          handleWorkoutCreated
        }
      />
    </>
  );
}

export default Workouts;