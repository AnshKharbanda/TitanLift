function WorkoutCard({ workout, onOpen, onDelete, deleting }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm shadow-black/20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">{workout.title}</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Created {new Date(workout.created_at).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onOpen}
            className="rounded-2xl bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm text-white transition hover:bg-zinc-700"
          >
            Open
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-500/70"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkoutCard;
