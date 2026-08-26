import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Dumbbell,
  FileText,
  Loader2,
  Trash2,
  Layers3,
  Weight,
  Pencil,
  Check,
  X,
} from "lucide-react";

import {
  getWorkout,
  getWorkoutExercises,
  getExercises,
  deleteWorkout,
  deleteExerciseFromWorkout,
  updateWorkout,
  updateExerciseInWorkout,
} from "../services/workout";


function formatWorkoutDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now - date;
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}


function WorkoutCard({ workout, onDeleted }) {
  const [expanded, setExpanded] = useState(false);

  const [details, setDetails] = useState(null);
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [exerciseMap, setExerciseMap] = useState({});

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // Workout editing
  const [editingWorkout, setEditingWorkout] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editNotes, setEditNotes] = useState("");

  // Exercise editing
  const [editingExerciseId, setEditingExerciseId] =
    useState(null);

  const [editExerciseValues, setEditExerciseValues] =
    useState({
      sets: 0,
      reps: 0,
      weight: 0,
    });


  async function loadDetails() {
    try {
      setLoading(true);
      setError("");

      const [
        workoutData,
        workoutExerciseData,
        exerciseData,
      ] = await Promise.all([
        getWorkout(workout.id),
        getWorkoutExercises(workout.id),
        getExercises(),
      ]);

      const lookup = {};

      exerciseData.forEach((exercise) => {
        lookup[exercise.id] = exercise;
      });

      setDetails(workoutData);
      setWorkoutExercises(workoutExerciseData);
      setExerciseMap(lookup);

      setEditTitle(workoutData.title);
      setEditNotes(workoutData.notes || "");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Could not load workout details."
      );
    } finally {
      setLoading(false);
    }
  }


  async function handleToggle() {
    if (!expanded && !details) {
      await loadDetails();
    }

    setExpanded((previous) => !previous);
  }


  function startWorkoutEditing() {
    setEditTitle(details?.title || workout.title);
    setEditNotes(details?.notes || "");
    setEditingWorkout(true);
  }


  function cancelWorkoutEditing() {
    setEditTitle(details?.title || workout.title);
    setEditNotes(details?.notes || "");
    setEditingWorkout(false);
  }


  async function saveWorkoutChanges() {
    if (!editTitle.trim()) {
      setError("Workout title cannot be empty.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const updatedWorkout = await updateWorkout(
        workout.id,
        {
          title: editTitle.trim(),
          notes: editNotes,
        }
      );

      setDetails(updatedWorkout);
      setEditingWorkout(false);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Could not update workout."
      );
    } finally {
      setSaving(false);
    }
  }


  function startExerciseEditing(item) {
    setEditingExerciseId(item.exercise_id);

    setEditExerciseValues({
      sets: item.sets,
      reps: item.reps,
      weight: item.weight,
    });
  }


  function cancelExerciseEditing() {
    setEditingExerciseId(null);

    setEditExerciseValues({
      sets: 0,
      reps: 0,
      weight: 0,
    });
  }


  async function saveExerciseEditing(item) {
    const sets = Number(editExerciseValues.sets);
    const reps = Number(editExerciseValues.reps);
    const weight = Number(editExerciseValues.weight);

    if (sets < 1 || sets > 20) {
      setError("Sets must be between 1 and 20.");
      return;
    }

    if (reps < 1 || reps > 100) {
      setError("Reps must be between 1 and 100.");
      return;
    }

    if (weight < 0) {
      setError("Weight cannot be negative.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const updatedExercise =
        await updateExerciseInWorkout(
          workout.id,
          item.exercise_id,
          {
            sets,
            reps,
            weight,
          }
        );

      setWorkoutExercises((previous) =>
        previous.map((exercise) =>
          exercise.id === updatedExercise.id
            ? updatedExercise
            : exercise
        )
      );

      setEditingExerciseId(null);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Could not update exercise."
      );
    } finally {
      setSaving(false);
    }
  }


  async function handleDeleteExercise(item) {
    const exerciseName =
      exerciseMap[item.exercise_id]?.name ||
      "this exercise";

    const confirmed = window.confirm(
      `Remove ${exerciseName} from this workout?`
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      setError("");

      const updatedExercises =
        await deleteExerciseFromWorkout(
          workout.id,
          item.exercise_id
        );

      setWorkoutExercises(updatedExercises);

      if (
        editingExerciseId === item.exercise_id
      ) {
        setEditingExerciseId(null);
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Could not remove exercise from workout."
      );
    } finally {
      setSaving(false);
    }
  }


  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${workout.title}"?`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      await deleteWorkout(workout.id);

      onDeleted(workout.id);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Could not delete workout."
      );

      setDeleting(false);
    }
  }


  const summary = useMemo(() => {
    const totalSets = workoutExercises.reduce(
      (sum, item) => sum + item.sets,
      0
    );

    const totalVolume = workoutExercises.reduce(
      (sum, item) =>
        sum +
        item.sets *
          item.reps *
          item.weight,
      0
    );

    return {
      exercises: workoutExercises.length,
      sets: totalSets,
      volume: totalVolume,
    };
  }, [workoutExercises]);


  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0b0d0d] transition hover:border-lime-400/10">

      {/* ==================================================
          HEADER
      ================================================== */}

      <button
        type="button"
        onClick={handleToggle}
        className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-white/[0.015]"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lime-400/10">
          <Dumbbell
            size={18}
            className="text-lime-400"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold sm:text-base">
            {details?.title || workout.title}
          </p>

          <p className="mt-1 text-xs text-white/30">
            {formatWorkoutDate(workout.created_at)}
          </p>
        </div>

        {expanded ? (
          <ArrowUp
            size={18}
            className="shrink-0 text-white/30"
          />
        ) : (
          <ArrowDown
            size={18}
            className="shrink-0 text-white/30"
          />
        )}
      </button>


      {/* ==================================================
          EXPANDED
      ================================================== */}

      {expanded && (
        <div className="border-t border-white/[0.06] bg-[#090b0b]">

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2
                size={24}
                className="animate-spin text-lime-400"
              />
            </div>
          ) : (
            <div className="p-5 sm:p-6">

              {error && (
                <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                  {error}
                </div>
              )}


              {/* ==================================================
                  WORKOUT DETAILS
              ================================================== */}

              <div className="flex items-start justify-between gap-4">

                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] text-lime-400">
                    WORKOUT
                  </p>

                  <h4 className="mt-1 text-xl font-bold">
                    {details?.title || workout.title}
                  </h4>
                </div>

                {!editingWorkout && (
                  <button
                    type="button"
                    onClick={startWorkoutEditing}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-white/40 transition hover:bg-white/[0.05] hover:text-lime-400"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                )}

              </div>


              {editingWorkout && (
                <div className="mt-5 rounded-xl border border-lime-400/10 bg-lime-400/[0.02] p-4">

                  <label className="block">
                    <span className="text-[10px] font-bold tracking-[0.15em] text-white/30">
                      WORKOUT NAME
                    </span>

                    <input
                      value={editTitle}
                      onChange={(e) =>
                        setEditTitle(e.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-white/10 bg-[#050606] px-4 py-3 text-sm outline-none focus:border-lime-400/40"
                    />
                  </label>


                  <label className="mt-4 block">
                    <span className="text-[10px] font-bold tracking-[0.15em] text-white/30">
                      NOTES
                    </span>

                    <textarea
                      value={editNotes}
                      onChange={(e) =>
                        setEditNotes(e.target.value)
                      }
                      rows={3}
                      className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-[#050606] px-4 py-3 text-sm outline-none focus:border-lime-400/40"
                    />
                  </label>


                  <div className="mt-4 flex justify-end gap-2">

                    <button
                      type="button"
                      onClick={cancelWorkoutEditing}
                      disabled={saving}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-white/35 hover:text-white disabled:opacity-40"
                    >
                      <X size={14} />
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={saveWorkoutChanges}
                      disabled={saving}
                      className="flex items-center gap-1.5 rounded-lg bg-lime-400 px-3 py-2 text-xs font-bold text-black disabled:opacity-50"
                    >
                      {saving ? (
                        <Loader2
                          size={14}
                          className="animate-spin"
                        />
                      ) : (
                        <Check size={14} />
                      )}

                      Save
                    </button>

                  </div>
                </div>
              )}


              {/* ==================================================
                  SUMMARY
              ================================================== */}

              <div className="mt-6 grid gap-3 sm:grid-cols-3">

                <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2">
                    <Dumbbell
                      size={15}
                      className="text-lime-400"
                    />
                    <p className="text-[10px] font-bold tracking-[0.16em] text-white/30">
                      EXERCISES
                    </p>
                  </div>

                  <p className="mt-3 text-2xl font-black">
                    {summary.exercises}
                  </p>
                </div>


                <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2">
                    <Layers3
                      size={15}
                      className="text-lime-400"
                    />
                    <p className="text-[10px] font-bold tracking-[0.16em] text-white/30">
                      TOTAL SETS
                    </p>
                  </div>

                  <p className="mt-3 text-2xl font-black">
                    {summary.sets}
                  </p>
                </div>


                <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2">
                    <Weight
                      size={15}
                      className="text-lime-400"
                    />
                    <p className="text-[10px] font-bold tracking-[0.16em] text-white/30">
                      VOLUME
                    </p>
                  </div>

                  <p className="mt-3 text-2xl font-black">
                    {summary.volume.toLocaleString()}
                    <span className="ml-1 text-xs font-medium text-white/30">
                      kg
                    </span>
                  </p>
                </div>

              </div>


              {/* ==================================================
                  EXERCISES
              ================================================== */}

              <div className="mt-7">

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.2em] text-lime-400">
                      PERFORMANCE
                    </p>

                    <h4 className="mt-1 text-lg font-bold">
                      Exercises
                    </h4>
                  </div>

                  <p className="text-xs text-white/25">
                    {summary.exercises} recorded
                  </p>
                </div>


                <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.05]">

                  <div className="hidden grid-cols-[1fr_120px_120px_90px] border-b border-white/[0.05] bg-white/[0.02] px-4 py-3 text-[10px] font-bold tracking-[0.15em] text-white/25 sm:grid">
                    <span>EXERCISE</span>
                    <span className="text-center">
                      SETS × REPS
                    </span>
                    <span className="text-right">
                      LOAD
                    </span>
                    <span className="text-right">
                      ACTIONS
                    </span>
                  </div>


                  {workoutExercises.length === 0 ? (
                    <div className="p-8 text-center text-sm text-white/30">
                      No exercises were recorded.
                    </div>
                  ) : (
                    workoutExercises.map(
                      (item, index) => {
                        const exercise =
                          exerciseMap[
                            item.exercise_id
                          ];

                        const isEditing =
                          editingExerciseId ===
                          item.exercise_id;

                        const volume =
                          item.sets *
                          item.reps *
                          item.weight;

                        return (
                          <div
                            key={item.id}
                            className={`p-4 ${
                              index !==
                              workoutExercises.length - 1
                                ? "border-b border-white/[0.04]"
                                : ""
                            }`}
                          >

                            {!isEditing ? (
                              <div className="grid gap-3 sm:grid-cols-[1fr_120px_120px_90px] sm:items-center">

                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold">
                                    {exercise?.name ||
                                      `Exercise #${item.exercise_id}`}
                                  </p>

                                  <p className="mt-1 text-[10px] tracking-[0.12em] text-white/25">
                                    {exercise?.muscle_group ||
                                      "EXERCISE"}
                                  </p>

                                  <p className="mt-2 text-xs text-white/25 sm:hidden">
                                    {item.sets} sets ×{" "}
                                    {item.reps} reps ·{" "}
                                    {item.weight} kg
                                  </p>
                                </div>


                                <div className="hidden text-center sm:block">
                                  <p className="text-sm font-bold">
                                    {item.sets} ×{" "}
                                    {item.reps}
                                  </p>

                                  <p className="mt-1 text-[10px] text-white/25">
                                    {volume.toLocaleString()} kg
                                  </p>
                                </div>


                                <div className="hidden text-right sm:block">
                                  <p className="text-sm font-bold">
                                    {item.weight} kg
                                  </p>
                                </div>


                                <div className="flex items-center justify-end gap-1">

                                  <button
                                    type="button"
                                    onClick={() =>
                                      startExerciseEditing(
                                        item
                                      )
                                    }
                                    className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-white/30 transition hover:bg-white/[0.05] hover:text-lime-400"
                                  >
                                    <Pencil size={14} />

                                    <span className="sm:hidden">
                                      Edit
                                    </span>
                                  </button>


                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteExercise(
                                        item
                                      )
                                    }
                                    disabled={saving}
                                    title="Remove exercise"
                                    className="rounded-lg px-2.5 py-2 text-white/25 transition hover:bg-red-400/10 hover:text-red-400 disabled:opacity-40"
                                  >
                                    <X size={15} />
                                  </button>

                                </div>

                              </div>
                            ) : (

                              <div>

                                <div className="flex items-center justify-between">

                                  <div>
                                    <p className="text-sm font-semibold">
                                      {exercise?.name ||
                                        `Exercise #${item.exercise_id}`}
                                    </p>

                                    <p className="mt-1 text-[10px] tracking-[0.12em] text-white/25">
                                      {exercise?.muscle_group ||
                                        "EXERCISE"}
                                    </p>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={
                                      cancelExerciseEditing
                                    }
                                    className="text-white/30 hover:text-white"
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
                                      value={
                                        editExerciseValues.sets
                                      }
                                      onChange={(e) =>
                                        setEditExerciseValues(
                                          (previous) => ({
                                            ...previous,
                                            sets: e.target.value,
                                          })
                                        )
                                      }
                                      className="mt-1 w-full rounded-lg border border-white/10 bg-[#050606] px-3 py-2 text-sm outline-none focus:border-lime-400/40"
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
                                      value={
                                        editExerciseValues.reps
                                      }
                                      onChange={(e) =>
                                        setEditExerciseValues(
                                          (previous) => ({
                                            ...previous,
                                            reps: e.target.value,
                                          })
                                        )
                                      }
                                      className="mt-1 w-full rounded-lg border border-white/10 bg-[#050606] px-3 py-2 text-sm outline-none focus:border-lime-400/40"
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
                                      value={
                                        editExerciseValues.weight
                                      }
                                      onChange={(e) =>
                                        setEditExerciseValues(
                                          (previous) => ({
                                            ...previous,
                                            weight: e.target.value,
                                          })
                                        )
                                      }
                                      className="mt-1 w-full rounded-lg border border-white/10 bg-[#050606] px-3 py-2 text-sm outline-none focus:border-lime-400/40"
                                    />
                                  </label>

                                </div>


                                <div className="mt-4 flex justify-end gap-2">

                                  <button
                                    type="button"
                                    onClick={
                                      cancelExerciseEditing
                                    }
                                    disabled={saving}
                                    className="rounded-lg px-3 py-2 text-xs font-semibold text-white/35 hover:text-white"
                                  >
                                    Cancel
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      saveExerciseEditing(
                                        item
                                      )
                                    }
                                    disabled={saving}
                                    className="flex items-center gap-1.5 rounded-lg bg-lime-400 px-3 py-2 text-xs font-bold text-black disabled:opacity-50"
                                  >

                                    {saving ? (
                                      <Loader2
                                        size={14}
                                        className="animate-spin"
                                      />
                                    ) : (
                                      <Check size={14} />
                                    )}

                                    Save

                                  </button>

                                </div>

                              </div>
                            )}

                          </div>
                        );
                      }
                    )
                  )}

                </div>

              </div>


              {/* ==================================================
                  NOTES
              ================================================== */}

              {!editingWorkout && (
                <div className="mt-7">

                  <div className="flex items-center gap-2">
                    <FileText
                      size={15}
                      className="text-lime-400"
                    />

                    <p className="text-[10px] font-bold tracking-[0.2em] text-lime-400">
                      NOTES
                    </p>
                  </div>

                  <div className="mt-3 rounded-xl border border-white/[0.05] bg-white/[0.015] p-4">
                    <p className="text-sm leading-6 text-white/55">
                      {details?.notes?.trim()
                        ? details.notes
                        : "No notes added for this workout."}
                    </p>
                  </div>

                </div>
              )}


              {/* ==================================================
                  FOOTER
              ================================================== */}

              <div className="mt-6 flex items-center justify-between">

                <p className="text-xs text-white/20">
                  Logged{" "}
                  {formatWorkoutDate(
                    workout.created_at
                  )}
                </p>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting || saving}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-400/10 disabled:opacity-50"
                >
                  {deleting ? (
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />
                  ) : (
                    <Trash2 size={14} />
                  )}

                  Delete Workout
                </button>

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default WorkoutCard;