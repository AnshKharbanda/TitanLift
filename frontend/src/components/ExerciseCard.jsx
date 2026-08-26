import {
  Activity,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  Trash2,
} from "lucide-react";

import { useState } from "react";


function formatMuscleGroup(group) {
  return group
    .charAt(0)
    .toUpperCase() + group.slice(1).toLowerCase();
}


function ExerciseCard({
  exercise,
  onDelete,
}) {
  const [expanded, setExpanded] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);


  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${exercise.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      await onDelete(exercise.id);
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
    }
  }


  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-[#0b0d0d] transition ${
        expanded
          ? "border-lime-400/20"
          : "border-white/[0.06] hover:border-lime-400/10"
      }`}
    >

      {/* Main card */}

      <button
        type="button"
        onClick={() =>
          setExpanded((previous) => !previous)
        }
        className="w-full p-5 text-left"
      >

        <div className="flex items-start gap-4">

          {/* Icon */}

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lime-400/10">
            <Dumbbell
              size={20}
              className="text-lime-400"
            />
          </div>


          {/* Content */}

          <div className="min-w-0 flex-1">

            <h3 className="truncate text-base font-bold">
              {exercise.name}
            </h3>

            <div className="mt-2 inline-flex rounded-full bg-white/[0.04] px-3 py-1 text-[10px] font-semibold tracking-[0.12em] text-white/35">
              {formatMuscleGroup(
                exercise.muscle_group
              )}
            </div>

          </div>


          {expanded ? (
            <ChevronUp
              size={18}
              className="shrink-0 text-white/25"
            />
          ) : (
            <ChevronDown
              size={18}
              className="shrink-0 text-white/25"
            />
          )}

        </div>

      </button>


      {/* Expanded details */}

      {expanded && (
        <div className="border-t border-white/[0.06] px-5 pb-5">

          <div className="pt-5">

            <div className="flex items-center gap-2">

              <Activity
                size={15}
                className="text-lime-400"
              />

              <p className="text-[10px] font-bold tracking-[0.2em] text-lime-400">
                EXERCISE DETAILS
              </p>

            </div>


            <p className="mt-3 text-sm leading-6 text-white/50">
              {exercise.description?.trim()
                ? exercise.description
                : "No description available for this exercise."}
            </p>

          </div>


          {/* Footer actions */}

          <div className="mt-5 flex justify-end">

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-400/10 disabled:opacity-50"
            >

              <Trash2 size={14} />

              {deleting
                ? "Deleting..."
                : "Delete Exercise"}

            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default ExerciseCard;