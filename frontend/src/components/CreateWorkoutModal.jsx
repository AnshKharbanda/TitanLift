import { useEffect, useState } from "react";
import {
  Check,
  Loader2,
  Plus,
  X,
} from "lucide-react";

import {
  addExerciseToWorkout,
  createWorkout,
  getExercises,
} from "../services/workout";


function CreateWorkoutModal({
  isOpen,
  onClose,
  onCreated,
}) {
  const [title, setTitle] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [exercises, setExercises] =
    useState([]);

  const [selected, setSelected] =
    useState([]);

  const [loadingExercises, setLoadingExercises] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");


  useEffect(() => {
    if (!isOpen) {
      return;
    }

    async function loadExercises() {
      try {
        setLoadingExercises(true);

        const data =
          await getExercises();

        setExercises(data);
      } catch (err) {
        console.error(err);

        setError(
          "Could not load exercises."
        );
      } finally {
        setLoadingExercises(false);
      }
    }

    loadExercises();
  }, [isOpen]);


  function reset() {
    setTitle("");
    setNotes("");
    setSelected([]);
    setError("");
  }


  function handleClose() {
    if (saving) return;

    reset();
    onClose();
  }


  function addExercise(exercise) {
    setSelected((previous) => {

      if (
        previous.some(
          (item) =>
            item.exercise_id ===
            exercise.id
        )
      ) {
        return previous;
      }

      return [
        ...previous,
        {
          exercise_id: exercise.id,
          name: exercise.name,
          muscle_group:
            exercise.muscle_group,
          sets: 3,
          reps: 10,
          weight: 0,
        },
      ];
    });
  }


  function removeExercise(exerciseId) {
    setSelected((previous) =>
      previous.filter(
        (item) =>
          item.exercise_id !==
          exerciseId
      )
    );
  }


  function updateSelected(
    exerciseId,
    field,
    value
  ) {
    setSelected((previous) =>
      previous.map((item) =>
        item.exercise_id === exerciseId
          ? {
              ...item,
              [field]: Number(value),
            }
          : item
      )
    );
  }


  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      setError(
        "Workout title is required."
      );

      return;
    }

    if (selected.length === 0) {
      setError(
        "Add at least one exercise."
      );

      return;
    }

    try {
      setSaving(true);
      setError("");

      // Create workout
      const workout =
        await createWorkout({
          title: title.trim(),
          notes: notes.trim() || null,
        });


      // Add exercises
      for (const item of selected) {
        await addExerciseToWorkout(
          workout.id,
          {
            exercise_id:
              item.exercise_id,
            sets: item.sets,
            reps: item.reps,
            weight: item.weight,
          }
        );
      }


      onCreated(workout);

      reset();
      onClose();

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Could not create workout."
      );
    } finally {
      setSaving(false);
    }
  }


  if (!isOpen) {
    return null;
  }


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">

      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0d0d] shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">

          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-lime-400">
              TRAINING
            </p>

            <h2 className="mt-1 text-xl font-bold">
              Create Workout
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="text-white/30 hover:text-white"
          >
            <X size={20} />
          </button>

        </div>


        {/* Body */}

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6"
        >

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}


          {/* Title */}

          <label className="block">

            <span className="text-xs font-semibold text-white/50">
              Workout name
            </span>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="e.g. Push Strength"
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#050606] px-4 py-3 text-sm outline-none placeholder:text-white/20 focus:border-lime-400/40"
            />

          </label>


          {/* Notes */}

          <label className="mt-5 block">

            <span className="text-xs font-semibold text-white/50">
              Notes
            </span>

            <textarea
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              placeholder="How did the workout feel?"
              rows={3}
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-[#050606] px-4 py-3 text-sm outline-none placeholder:text-white/20 focus:border-lime-400/40"
            />

          </label>


          {/* Exercise Library */}

          <div className="mt-6">

            <div className="flex items-center justify-between">

              <div>
                <span className="text-xs font-semibold text-white/50">
                  Add exercises
                </span>

                <p className="mt-1 text-xs text-white/25">
                  Choose exercises for this workout.
                </p>
              </div>

              {loadingExercises && (
                <Loader2
                  size={16}
                  className="animate-spin text-lime-400"
                />
              )}

            </div>


            <div className="mt-3 grid max-h-48 gap-2 overflow-y-auto sm:grid-cols-2">

              {exercises.map((exercise) => {

                const alreadySelected =
                  selected.some(
                    (item) =>
                      item.exercise_id ===
                      exercise.id
                  );

                return (
                  <button
                    key={exercise.id}
                    type="button"
                    onClick={() =>
                      alreadySelected
                        ? removeExercise(
                            exercise.id
                          )
                        : addExercise(
                            exercise
                          )
                    }
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                      alreadySelected
                        ? "border-lime-400/20 bg-lime-400/10"
                        : "border-white/[0.06] bg-white/[0.015] hover:bg-white/[0.03]"
                    }`}
                  >

                    <div className="min-w-0">

                      <p className="truncate text-sm font-semibold">
                        {exercise.name}
                      </p>

                      <p className="mt-1 text-[10px] tracking-[0.1em] text-white/25">
                        {exercise.muscle_group}
                      </p>

                    </div>

                    {alreadySelected ? (
                      <Check
                        size={16}
                        className="shrink-0 text-lime-400"
                      />
                    ) : (
                      <Plus
                        size={16}
                        className="shrink-0 text-white/30"
                      />
                    )}

                  </button>
                );
              })}

            </div>

          </div>


          {/* Selected */}

          <div className="mt-6">

            <span className="text-xs font-semibold text-white/50">
              Selected exercises
            </span>

            <div className="mt-3 space-y-3">

              {selected.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/[0.08] p-5 text-center text-sm text-white/25">
                  No exercises selected yet.
                </div>
              ) : (
                selected.map((item) => (
                  <div
                    key={item.exercise_id}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                  >

                    <div className="flex items-center justify-between">

                      <div>
                        <p className="text-sm font-semibold">
                          {item.name}
                        </p>

                        <p className="mt-1 text-xs text-white/25">
                          {item.muscle_group}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeExercise(
                            item.exercise_id
                          )
                        }
                        className="text-white/25 hover:text-red-400"
                      >
                        <X size={16} />
                      </button>

                    </div>


                    <div className="mt-4 grid grid-cols-3 gap-2">

                      <label>
                        <span className="text-[10px] text-white/30">
                          SETS
                        </span>

                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={item.sets}
                          onChange={(e) =>
                            updateSelected(
                              item.exercise_id,
                              "sets",
                              e.target.value
                            )
                          }
                          className="mt-1 w-full rounded-lg border border-white/10 bg-[#050606] px-3 py-2 text-sm outline-none"
                        />
                      </label>


                      <label>
                        <span className="text-[10px] text-white/30">
                          REPS
                        </span>

                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={item.reps}
                          onChange={(e) =>
                            updateSelected(
                              item.exercise_id,
                              "reps",
                              e.target.value
                            )
                          }
                          className="mt-1 w-full rounded-lg border border-white/10 bg-[#050606] px-3 py-2 text-sm outline-none"
                        />
                      </label>


                      <label>
                        <span className="text-[10px] text-white/30">
                          WEIGHT KG
                        </span>

                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={item.weight}
                          onChange={(e) =>
                            updateSelected(
                              item.exercise_id,
                              "weight",
                              e.target.value
                            )
                          }
                          className="mt-1 w-full rounded-lg border border-white/10 bg-[#050606] px-3 py-2 text-sm outline-none"
                        />
                      </label>

                    </div>

                  </div>
                ))
              )}

            </div>

          </div>

        </form>


        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-white/[0.06] px-6 py-4">

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white/40 hover:text-white disabled:opacity-40"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-lime-400 px-5 py-2.5 text-sm font-bold text-black hover:bg-lime-300 disabled:opacity-50"
          >

            {saving && (
              <Loader2
                size={16}
                className="animate-spin"
              />
            )}

            {saving
              ? "Creating..."
              : "Create Workout"}

          </button>

        </div>

      </div>

    </div>
  );
}

export default CreateWorkoutModal;