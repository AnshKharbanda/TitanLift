import { useState } from "react";
import {
  Loader2,
  Plus,
  X,
} from "lucide-react";

import { createExercise } from "../services/exercise";


const MUSCLE_GROUPS = [
  "CHEST",
  "BACK",
  "LEGS",
  "BICEPS",
  "TRICEPS",
  "SHOULDERS",
  "ABS",
];


function CreateExerciseModal({
  isOpen,
  onClose,
  onCreated,
}) {
  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] =
    useState("CHEST");
  const [description, setDescription] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");


  function resetForm() {
    setName("");
    setMuscleGroup("CHEST");
    setDescription("");
    setError("");
  }


  function handleClose() {
    if (saving) {
      return;
    }

    resetForm();
    onClose();
  }


  async function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim()) {
      setError(
        "Exercise name is required."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const exercise =
        await createExercise({
          name: name.trim(),
          muscle_group: muscleGroup,
          description:
            description.trim() || null,
        });

      onCreated(exercise);

      resetForm();
      onClose();

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Could not create exercise."
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

      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0b0d0d] shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">

          <div>

            <p className="text-[10px] font-bold tracking-[0.2em] text-lime-400">
              EXERCISE LIBRARY
            </p>

            <h2 className="mt-1 text-xl font-bold">
              Create Exercise
            </h2>

          </div>


          <button
            type="button"
            onClick={handleClose}
            className="text-white/30 transition hover:text-white"
          >
            <X size={20} />
          </button>

        </div>


        {/* Body */}

        <form
          onSubmit={handleSubmit}
          className="p-6"
        >

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}


          {/* Name */}

          <label className="block">

            <span className="text-xs font-semibold text-white/50">
              Exercise name
            </span>

            <input
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              maxLength={70}
              placeholder="e.g. Bulgarian Split Squat"
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#050606] px-4 py-3 text-sm outline-none placeholder:text-white/20 focus:border-lime-400/40"
            />

          </label>


          {/* Muscle group */}

          <label className="mt-5 block">

            <span className="text-xs font-semibold text-white/50">
              Muscle group
            </span>

            <select
              value={muscleGroup}
              onChange={(event) =>
                setMuscleGroup(
                  event.target.value
                )
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#050606] px-4 py-3 text-sm text-white outline-none focus:border-lime-400/40"
            >

              {MUSCLE_GROUPS.map(
                (group) => (
                  <option
                    key={group}
                    value={group}
                  >
                    {group}
                  </option>
                )
              )}

            </select>

          </label>


          {/* Description */}

          <label className="mt-5 block">

            <span className="text-xs font-semibold text-white/50">
              Description
            </span>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              rows={4}
              placeholder="Describe the movement or useful technique cues..."
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-[#050606] px-4 py-3 text-sm outline-none placeholder:text-white/20 focus:border-lime-400/40"
            />

          </label>


          {/* Footer */}

          <div className="mt-6 flex justify-end gap-3">

            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white/40 transition hover:text-white disabled:opacity-40"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-lime-400 px-5 py-2.5 text-sm font-bold text-black transition hover:bg-lime-300 disabled:opacity-50"
            >

              {saving ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <Plus size={16} />
              )}

              {saving
                ? "Creating..."
                : "Create Exercise"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default CreateExerciseModal;