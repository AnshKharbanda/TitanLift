import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setSubmitting(true);

      await login(
        formData.email,
        formData.password
      );

      navigate("/dashboard", { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        "Invalid email or password.";

      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050606] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT SIDE */}

        <div className="relative hidden overflow-hidden lg:block">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('/src/assets/home/hero.jpg')",
            }}
          />

          <div className="absolute inset-0 bg-black/55" />

          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-[#050606]" />

          <div className="relative flex h-full flex-col justify-between p-10">

            {/* Logo */}

            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-lime-400/40 bg-lime-400/10">
                <Dumbbell
                  size={20}
                  className="text-lime-400"
                />
              </div>

              <span className="text-xl font-black tracking-[0.18em]">
                TITAN
                <span className="text-lime-400">
                  LIFT
                </span>
              </span>
            </Link>

            {/* Quote */}

            <div className="max-w-lg">
              <p className="text-4xl font-black leading-tight">
                Train harder.
                <br />

                <span className="text-lime-400">
                  Train smarter.
                </span>
              </p>

              <p className="mt-5 max-w-md text-sm leading-6 text-white/50">
                Your AI-powered fitness companion for
                smarter workouts, better form and
                measurable progress.
              </p>
            </div>

            <p className="text-xs text-white/30">
              © 2026 TitanLift
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">

            {/* Mobile logo */}

            <Link
              to="/"
              className="mb-12 flex items-center gap-3 lg:hidden"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-lime-400/40 bg-lime-400/10">
                <Dumbbell
                  size={20}
                  className="text-lime-400"
                />
              </div>

              <span className="text-xl font-black tracking-[0.18em]">
                TITAN
                <span className="text-lime-400">
                  LIFT
                </span>
              </span>
            </Link>

            {/* Heading */}

            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-lime-400">
                WELCOME BACK
              </p>

              <h1 className="mt-3 text-4xl font-black">
                Sign in to TitanLift
              </h1>

              <p className="mt-3 text-sm text-white/40">
                Continue your journey toward becoming
                stronger.
              </p>
            </div>

            {/* Error */}

            {error && (
              <div className="mt-7 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-semibold text-white/60"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-lime-400/50 focus:bg-white/[0.05]"
                />
              </div>

              {/* Password */}

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-semibold text-white/60"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 pr-12 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-lime-400/50 focus:bg-white/[0.05]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white/30 transition hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={submitting}
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-lime-400 px-5 py-3.5 text-sm font-bold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? "Signing in..."
                  : "Sign In"}

                {!submitting && (
                  <ArrowRight
                    size={17}
                    className="transition group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            {/* Signup */}

            <p className="mt-8 text-center text-sm text-white/35">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-lime-400 transition hover:text-lime-300"
              >
                Create one
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;