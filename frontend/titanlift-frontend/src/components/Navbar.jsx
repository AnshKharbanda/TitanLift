import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("access_token");
    navigate("/login", { replace: true });
  }

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div>
          <Link to="/dashboard" className="text-xl font-semibold text-white">
            TitanLift
          </Link>
          <p className="text-sm text-zinc-500">Fitness tracking dashboard</p>
        </div>

        <nav className="flex flex-wrap items-center gap-3 text-sm text-zinc-300">
          <Link
            to="/dashboard"
            className="rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 transition hover:border-blue-500 hover:text-white"
          >
            Dashboard
          </Link>
          <Link
            to="/workouts"
            className="rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 transition hover:border-blue-500 hover:text-white"
          >
            Workouts
          </Link>
          <Link
            to="/weight-logs"
            className="rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 transition hover:border-blue-500 hover:text-white"
          >
            Weight Logs
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-full bg-red-600 px-4 py-2 text-white transition hover:bg-red-500"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
