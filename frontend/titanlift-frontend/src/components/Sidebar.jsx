import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="hidden xl:block xl:w-72">
      <div className="sticky top-4 space-y-4">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm shadow-black/20">
          <h2 className="text-lg font-semibold text-white">Quick Menu</h2>
          <div className="mt-4 space-y-3">
            <Link
              to="/dashboard"
              className="block rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-200 transition hover:border-blue-500"
            >
              Dashboard
            </Link>
            <Link
              to="/workouts"
              className="block rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-200 transition hover:border-blue-500"
            >
              Workouts
            </Link>
            <Link
              to="/weight-logs"
              className="block rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-200 transition hover:border-blue-500"
            >
              Weight Logs
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
