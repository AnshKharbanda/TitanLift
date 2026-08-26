import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Plus,
  Search,
} from "lucide-react";

import AppShell from "../components/AppShell";
import ExerciseCard from "../components/ExerciseCard";
import CreateExerciseModal from "../components/CreateExerciseModal";

import {
  getExercises,
  deleteExercise,
} from "../services/exercise";


const FILTERS = [
  "ALL",
  "CHEST",
  "BACK",
  "LEGS",
  "SHOULDERS",
  "BICEPS",
  "TRICEPS",
  "ABS",
];


function formatMuscleGroup(group) {
  return group === "ALL"
    ? "All"
    : group.charAt(0) +
        group.slice(1).toLowerCase();
}


function Exercises() {
  const [exercises, setExercises] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("ALL");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [showCreateModal, setShowCreateModal] =
    useState(false);


  async function loadExercises() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getExercises();

      setExercises(
        [...data].sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      );

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Could not load exercises."
      );
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadExercises();
  }, []);


  const filteredExercises = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return exercises.filter(
      (exercise) => {
        const matchesSearch =
          !normalizedSearch ||
          exercise.name
            .toLowerCase()
            .includes(normalizedSearch) ||
          (
            exercise.description || ""
          )
            .toLowerCase()
            .includes(normalizedSearch);

        const matchesFilter =
          filter === "ALL" ||
          exercise.muscle_group ===
            filter;

        return (
          matchesSearch &&
          matchesFilter
        );
      }
    );
  }, [exercises, search, filter]);


  function handleCreated(exercise) {
    setExercises((previous) =>
      [...previous, exercise].sort(
        (a, b) =>
          a.name.localeCompare(b.name)
      )
    );
  }


  async function handleDelete(id) {
    await deleteExercise(id);

    setExercises((previous) =>
      previous.filter(
        (exercise) =>
          exercise.id !== id
      )
    );
  }


  return (
    <>
      <AppShell
        eyebrow="TRAINING"
        title="Exercises"
      >

        <div className="mx-auto max-w-7xl">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <p className="text-sm text-white/35">
                Explore and manage your exercise library
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight">
                Exercise Library
              </h2>

              <p className="mt-2 text-sm text-white/30">
                {exercises.length} exercise
                {exercises.length !== 1
                  ? "s"
                  : ""} available
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
              Create Exercise
            </button>

          </div>


          {/* =================================================
              CONTROLS
          ================================================= */}

          <section className="rounded-2xl border border-white/[0.06] bg-[#0b0d0d] p-5 sm:p-6">

            {/* Search */}

            <div className="relative">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search exercises..."
                className="w-full rounded-xl border border-white/10 bg-[#050606] py-3.5 pl-12 pr-4 text-sm outline-none placeholder:text-white/20 focus:border-lime-400/40"
              />

            </div>


            {/* Filters */}

            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">

              {FILTERS.map(
                (item) => {

                  const active =
                    filter === item;

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setFilter(item)
                      }
                      className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold transition ${
                        active
                          ? "border-lime-400/40 bg-lime-400/10 text-lime-400"
                          : "border-white/10 text-white/35 hover:text-white"
                      }`}
                    >
                      {formatMuscleGroup(
                        item
                      )}
                    </button>
                  );
                }
              )}

            </div>

          </section>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}


          {/* =================================================
              RESULT HEADER
          ================================================= */}

          <div className="mt-6 flex items-center justify-between">

            <div>

              <p className="text-[10px] font-bold tracking-[0.2em] text-lime-400">
                EXERCISE DATABASE
              </p>

              <h3 className="mt-1 text-xl font-bold">
                {filteredExercises.length} result
                {filteredExercises.length !== 1
                  ? "s"
                  : ""}
              </h3>

            </div>

            {filter !== "ALL" && (
              <button
                type="button"
                onClick={() =>
                  setFilter("ALL")
                }
                className="text-xs font-semibold text-white/30 transition hover:text-lime-400"
              >
                Clear filter
              </button>
            )}

          </div>


          {/* =================================================
              CONTENT
          ================================================= */}

          {loading ? (

            <div className="mt-5 grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">

              {[1, 2, 3, 4, 5, 6].map(
                (item) => (
                  <div
                    key={item}
                    className="h-40 animate-pulse rounded-2xl border border-white/[0.05] bg-[#0b0d0d]"
                  />
                )
              )}

            </div>

          ) : filteredExercises.length === 0 ? (

            <div className="mt-5 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] py-16">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400/10">
                <Activity
                  size={24}
                  className="text-lime-400"
                />
              </div>

              <p className="mt-5 font-semibold">
                No exercises found
              </p>

              <p className="mt-1 text-center text-sm text-white/30">
                Try another search or muscle group.
              </p>

              {(search || filter !== "ALL") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setFilter("ALL");
                  }}
                  className="mt-5 rounded-xl bg-white/[0.05] px-4 py-2.5 text-xs font-semibold text-white/50 transition hover:bg-white/[0.08] hover:text-white"
                >
                  Reset Search
                </button>
              )}

            </div>

          ) : (

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">

              {filteredExercises.map(
                (exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    onDelete={
                      handleDelete
                    }
                  />
                )
              )}

            </div>

          )}

        </div>

      </AppShell>


      {/* Create modal */}

      <CreateExerciseModal
        isOpen={showCreateModal}
        onClose={() =>
          setShowCreateModal(false)
        }
        onCreated={handleCreated}
      />
    </>
  );
}

export default Exercises;