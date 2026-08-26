import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  Dumbbell,
  Activity,
  ScanLine,
  TrendingUp,
  Bot,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  BarChart3,
  Layers3,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import {
  getDashboardStats,
  getDashboardSummary,
  getWorkoutStreak,
  getLongestStreak,
  getWeightProgress,
  getMuscleDistribution,
} from "../services/dashboard";

import StatCard from "./StatCard";
import RecentWorkouts from "./RecentWorkouts";
import TrainingStreak from "./TrainingStreak";
import WeightProgress from "./WeightProgress";
import MuscleDistribution from "./MuscleDistribution";


const navigation = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Workouts",
    path: "/workouts",
    icon: Dumbbell,
  },
  {
    label: "Exercises",
    path: "/exercises",
    icon: Activity,
  },
  {
    label: "AI Analysis",
    path: "/ai-analysis",
    icon: ScanLine,
  },
  {
    label: "Progress",
    path: "/progress",
    icon: TrendingUp,
  },
  {
    label: "AI Coach",
    path: "/coach",
    icon: Bot,
  },
];


function Dashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dashboard data
  const [stats, setStats] = useState(null);
  const [summary, setSummary] = useState(null);
  const [streak, setStreak] = useState(null);
  const [longestStreak, setLongestStreak] = useState(null);
  const [weightProgress, setWeightProgress] = useState([]);
  const [muscleDistribution, setMuscleDistribution] =
    useState({});

  // Loading states
  const [statsLoading, setStatsLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [streakLoading, setStreakLoading] = useState(true);
  const [weightLoading, setWeightLoading] = useState(true);
  const [muscleLoading, setMuscleLoading] = useState(true);

  // Error
  const [statsError, setStatsError] = useState("");


  useEffect(() => {
    async function loadDashboard() {
      try {
        setStatsLoading(true);
        setSummaryLoading(true);
        setStreakLoading(true);
        setWeightLoading(true);
        setMuscleLoading(true);
        setStatsError("");

        const [
          statsData,
          summaryData,
          streakData,
          longestStreakData,
          weightData,
          muscleData,
        ] = await Promise.all([
          getDashboardStats(),
          getDashboardSummary(),
          getWorkoutStreak(),
          getLongestStreak(),
          getWeightProgress(),
          getMuscleDistribution(),
        ]);

        setStats(statsData);
        setSummary(summaryData);
        setStreak(streakData);
        setLongestStreak(longestStreakData);
        setWeightProgress(weightData);
        setMuscleDistribution(
          muscleData?.muscle_distribution || {}
        );

      } catch (error) {
        console.error(
          "Failed to load dashboard:",
          error
        );

        setStatsError(
          "Unable to load your dashboard data."
        );

      } finally {
        setStatsLoading(false);
        setSummaryLoading(false);
        setStreakLoading(false);
        setWeightLoading(false);
        setMuscleLoading(false);
      }
    }

    loadDashboard();
  }, []);


  function handleLogout() {
    logout();
  }


  const firstLetter =
    user?.email?.charAt(0).toUpperCase() || "U";


  return (
    <div className="min-h-screen bg-[#050606] text-white">

      {/* =====================================================
          MOBILE MENU BUTTON
      ===================================================== */}

      <button
        type="button"
        onClick={() => setMobileMenuOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0b0d0d] text-white lg:hidden"
      >
        <Menu size={20} />
      </button>


      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}


      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col
          border-r border-white/[0.06] bg-[#080a0a]
          transition-transform duration-300
          lg:translate-x-0
          ${
            mobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* Logo */}

        <div className="flex h-20 items-center justify-between px-6">

          <Link
            to="/"
            className="flex items-center gap-3"
          >

            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-lime-400/30 bg-lime-400/10">
              <Dumbbell
                size={18}
                className="text-lime-400"
              />
            </div>

            <span className="text-lg font-black tracking-[0.16em]">
              TITAN
              <span className="text-lime-400">
                LIFT
              </span>
            </span>

          </Link>


          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(false)
            }
            className="text-white/30 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>

        </div>


        {/* Navigation */}

        <nav className="flex-1 overflow-y-auto px-3 py-6">

          <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.25em] text-white/25">
            MENU
          </p>


          <div className="space-y-1">

            {navigation.map((item) => {

              const Icon = item.icon;

              const active =
                location.pathname === item.path;


              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className={`
                    group flex items-center gap-3
                    rounded-xl px-3 py-3
                    text-sm font-medium
                    transition
                    ${
                      active
                        ? "bg-lime-400/10 text-lime-400"
                        : "text-white/40 hover:bg-white/[0.04] hover:text-white"
                    }
                  `}
                >

                  <Icon
                    size={18}
                    className={
                      active
                        ? "text-lime-400"
                        : "text-white/30 group-hover:text-white/70"
                    }
                  />

                  {item.label}


                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-lime-400" />
                  )}

                </Link>
              );

            })}

          </div>


          {/* Account */}

          <div className="mt-8">

            <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.25em] text-white/25">
              ACCOUNT
            </p>


            <Link
              to="/settings"
              className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/40 transition hover:bg-white/[0.04] hover:text-white"
            >

              <Settings
                size={18}
                className="text-white/30 group-hover:text-white/70"
              />

              Settings

            </Link>

          </div>

        </nav>


        {/* User */}

        <div className="border-t border-white/[0.06] p-4">

          <div className="flex items-center gap-3 rounded-xl p-2">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lime-400 text-sm font-black text-black">
              {firstLetter}
            </div>


            <div className="min-w-0 flex-1">

              <p className="truncate text-sm font-semibold text-white">
                {user?.email || "User"}
              </p>

              <p className="text-xs text-white/30">
                TitanLift Member
              </p>

            </div>


            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="text-white/25 transition hover:text-red-400"
            >
              <LogOut size={17} />
            </button>

          </div>

        </div>

      </aside>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="min-h-screen lg:ml-64">


        {/* ===================================================
            TOP BAR
        =================================================== */}

        <header className="flex h-20 items-center justify-between border-b border-white/[0.06] px-6 pl-16 lg:px-8 lg:pl-8">

          <div>

            <p className="text-xs font-semibold tracking-[0.2em] text-lime-400">
              DASHBOARD
            </p>

            <h1 className="mt-1 text-lg font-bold">
              Overview
            </h1>

          </div>


          <button
            type="button"
            className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 transition hover:bg-white/[0.04]"
          >

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lime-400 text-xs font-black text-black">
              {firstLetter}
            </div>


            <span className="hidden max-w-32 truncate text-sm text-white/70 sm:block">
              {user?.email || "User"}
            </span>


            <ChevronDown
              size={15}
              className="text-white/30"
            />

          </button>

        </header>


        {/* ===================================================
            CONTENT
        ===================================================== */}

        <div className="p-6 lg:p-8">


          {/* Welcome */}

          <section className="mb-8">

            <p className="text-sm text-white/35">
              Welcome back
            </p>

            <h2 className="mt-1 text-3xl font-black tracking-tight">
              Good to see you.
            </h2>

            <p className="mt-2 text-sm text-white/35">
              Your training progress, all in one place.
            </p>

          </section>


          {/* Error */}

          {statsError && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {statsError}
            </div>
          )}


          {/* =================================================
              STATS
          ================================================= */}

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              label="Total Workouts"
              value={
                statsLoading
                  ? "—"
                  : stats?.total_workouts ?? 0
              }
              suffix="workouts"
              icon={Dumbbell}
            />


            <StatCard
              label="Exercises"
              value={
                statsLoading
                  ? "—"
                  : stats?.total_exercises ?? 0
              }
              suffix="completed"
              icon={Activity}
            />


            <StatCard
              label="Total Sets"
              value={
                statsLoading
                  ? "—"
                  : stats?.total_sets ?? 0
              }
              suffix="sets"
              icon={Layers3}
            />


            <StatCard
              label="Total Volume"
              value={
                statsLoading
                  ? "—"
                  : `${Number(
                      stats?.total_volume ?? 0
                    ).toLocaleString()} kg`
              }
              suffix="lifted"
              icon={BarChart3}
            />

          </section>


          {/* =================================================
              TRAINING
          ================================================= */}

          <section className="mt-6 grid gap-6 xl:grid-cols-3">

            <RecentWorkouts
              workouts={
                summary?.recent_workouts || []
              }
              loading={summaryLoading}
            />


            <TrainingStreak
              currentStreak={
                streak?.current_streak || 0
              }
              longestStreak={
                longestStreak?.longest_streak || 0
              }
              loading={streakLoading}
            />

          </section>


          {/* =================================================
              ANALYTICS
          ================================================= */}

          <section className="mt-6 grid gap-6 lg:grid-cols-2">

            {/* Weight Progress */}

            <WeightProgress
              data={weightProgress}
              loading={weightLoading}
            />


            {/* Muscle Distribution */}

            <MuscleDistribution
              data={muscleDistribution}
              loading={muscleLoading}
            />

          </section>


        </div>

      </main>

    </div>
  );
}

export default Dashboard;