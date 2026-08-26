import { Link, useLocation, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";


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


function AppShell({
  children,
  eyebrow,
  title,
}) {
  const { user, logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] =
    useState(false);


  function handleLogout() {
    logout();

    navigate("/login", {
      replace: true,
    });
  }


  const initial =
    user?.email?.charAt(0).toUpperCase() ||
    "U";


  return (
    <div className="min-h-screen bg-[#050606] text-white">

      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          onClick={() =>
            setMobileOpen(false)
          }
        />
      )}


      {/* =================================================
          MOBILE MENU BUTTON
      ================================================= */}

      <button
        type="button"
        onClick={() =>
          setMobileOpen(true)
        }
        className="fixed left-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0b0d0d] lg:hidden"
      >
        <Menu size={20} />
      </button>


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/[0.06] bg-[#080a0a] transition-transform ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        } lg:translate-x-0`}
      >

        {/* =================================================
            LOGO
        ================================================= */}

        <div className="flex h-20 items-center justify-between px-6">

          <Link
            to="/"
            className="flex items-center gap-3"
          >

            <img
              src="/logo.png"
              alt="TitanLift"
              className="h-10 w-auto object-contain"
            />

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
              setMobileOpen(false)
            }
            className="text-white/30 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>

        </div>


        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="flex-1 overflow-y-auto px-3 py-6">

          <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.25em] text-white/25">
            MENU
          </p>


          <div className="space-y-1">

            {navigation.map((item) => {

              const Icon = item.icon;

              const active =
                location.pathname ===
                item.path;


              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() =>
                    setMobileOpen(false)
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


          {/* =================================================
              ACCOUNT
          ================================================= */}

          <div className="mt-8">

            <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.25em] text-white/25">
              ACCOUNT
            </p>


            <Link
              to="/settings"
              onClick={() =>
                setMobileOpen(false)
              }
              className={`
                group flex items-center gap-3
                rounded-xl px-3 py-3
                text-sm font-medium
                transition
                ${
                  location.pathname ===
                  "/settings"
                    ? "bg-lime-400/10 text-lime-400"
                    : "text-white/40 hover:bg-white/[0.04] hover:text-white"
                }
              `}
            >

              <Settings
                size={18}
                className={
                  location.pathname ===
                  "/settings"
                    ? "text-lime-400"
                    : "text-white/30 group-hover:text-white/70"
                }
              />

              Settings

            </Link>

          </div>

        </nav>


        {/* =================================================
            USER
        ================================================= */}

        <div className="border-t border-white/[0.06] p-4">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-lime-400 text-sm font-black text-black">
              {initial}
            </div>


            <div className="min-w-0 flex-1">

              <p className="truncate text-sm font-semibold">
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


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="min-h-screen lg:ml-64">

        <header className="flex min-h-20 items-center border-b border-white/[0.06] px-6 pl-16 lg:px-8 lg:pl-8">

          <div>

            <p className="text-xs font-semibold tracking-[0.2em] text-lime-400">
              {eyebrow}
            </p>

            <h1 className="mt-1 text-lg font-bold">
              {title}
            </h1>

          </div>

        </header>


        <div className="p-6 lg:p-8">
          {children}
        </div>

      </main>

    </div>
  );
}


export default AppShell;