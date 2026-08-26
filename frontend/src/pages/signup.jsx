import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Dumbbell,
  Eye,
  EyeOff,
} from "lucide-react";
import { registerUser } from "../services/auth";

const goals = [
  {
    value: "HYPERTROPHY",
    label: "Build Muscle",
    description: "Increase muscle size and physique",
  },
  {
    value: "STRENGTH",
    label: "Get Stronger",
    description: "Increase strength and lifting performance",
  },
  {
    value: "FAT_LOSS",
    label: "Lose Fat",
    description: "Reduce body fat while maintaining muscle",
  },
  {
    value: "ENDURANCE",
    label: "Improve Endurance",
    description: "Build stamina and cardiovascular fitness",
  },
  {
    value: "NOT_SURE",
    label: "Not Sure",
    description: "Let TitanLift help me figure it out",
  },
];

function Signup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    height: "",
    gender: "",
    goal: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  }

  function validateStepOne() {
    if (!formData.name.trim()) {
      return "Please enter your name.";
    }

    if (!formData.email.trim()) {
      return "Please enter your email.";
    }

    if (!formData.password) {
      return "Please enter a password.";
    }

    if (formData.password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    return null;
  }

  function validateStepTwo() {
    if (!formData.age) {
      return "Please enter your age.";
    }

    const age = Number(formData.age);

    if (age < 16 || age >= 100) {
      return "Age must be between 16 and 99.";
    }

    if (!formData.height) {
      return "Please enter your height.";
    }

    if (Number(formData.height) <= 0) {
      return "Please enter a valid height.";
    }

    if (!formData.gender) {
      return "Please select your gender.";
    }

    if (!formData.goal) {
      return "Please select your fitness goal.";
    }

    return null;
  }

  function handleNext() {
    const validationError = validateStepOne();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setStep(2);
  }

  function handleBack() {
    setError("");
    setStep(1);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationError = validateStepTwo();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        age: Number(formData.age),
        height: Number(formData.height),
        gender: formData.gender,
        goal: formData.goal,
      });

      navigate("/login", {
        replace: true,
        state: {
          message:
            "Account created successfully. Please sign in.",
        },
      });
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        "Unable to create your account.";

      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050606] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* ================= LEFT ================= */}

        <div className="relative hidden overflow-hidden lg:block">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('/src/assets/home/hero.jpg')",
            }}
          />

          <div className="absolute inset-0 bg-black/50" />

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

            {/* Message */}

            <div className="max-w-lg">
              <p className="text-4xl font-black leading-tight">
                Your strength.
                <br />

                <span className="text-lime-400">
                  Your journey.
                </span>
              </p>

              <p className="mt-5 max-w-md text-sm leading-6 text-white/50">
                Tell TitanLift about yourself and we'll
                personalize your training experience
                around your goals.
              </p>
            </div>

            <p className="text-xs text-white/30">
              © 2026 TitanLift
            </p>
          </div>
        </div>

        {/* ================= RIGHT ================= */}

        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">

            {/* Mobile logo */}

            <Link
              to="/"
              className="mb-10 flex items-center gap-3 lg:hidden"
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
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold tracking-[0.3em] text-lime-400">
                  STEP {step} OF 2
                </p>

                <span className="text-xs text-white/30">
                  {step === 1
                    ? "Account"
                    : "About You"}
                </span>
              </div>

              <h1 className="mt-3 text-4xl font-black">
                {step === 1
                  ? "Create your account"
                  : "Tell us about yourself"}
              </h1>

              <p className="mt-3 text-sm text-white/40">
                {step === 1
                  ? "Start your TitanLift journey."
                  : "This helps us personalize your experience."}
              </p>
            </div>

            {/* Progress */}

            <div className="mt-7 flex gap-2">
              <div className="h-1 flex-1 rounded-full bg-lime-400" />

              <div
                className={`h-1 flex-1 rounded-full ${
                  step === 2
                    ? "bg-lime-400"
                    : "bg-white/10"
                }`}
              />
            </div>

            {/* Error */}

            {error && (
              <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <form
              onSubmit={
                step === 1
                  ? (event) => {
                      event.preventDefault();
                      handleNext();
                    }
                  : handleSubmit
              }
              className="mt-7"
            >
              {/* ================= STEP 1 ================= */}

              {step === 1 && (
                <div className="space-y-5">

                  {/* Name */}

                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-xs font-semibold text-white/60"
                    >
                      Full Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      autoComplete="name"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm outline-none transition placeholder:text-white/20 focus:border-lime-400/50"
                    />
                  </div>

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
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm outline-none transition placeholder:text-white/20 focus:border-lime-400/50"
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
                        placeholder="At least 6 characters"
                        autoComplete="new-password"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 pr-12 text-sm outline-none transition placeholder:text-white/20 focus:border-lime-400/50"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (previous) => !previous
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white/30 hover:text-white"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm password */}

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-xs font-semibold text-white/60"
                    >
                      Confirm Password
                    </label>

                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        value={
                          formData.confirmPassword
                        }
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 pr-12 text-sm outline-none transition placeholder:text-white/20 focus:border-lime-400/50"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (previous) => !previous
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white/30 hover:text-white"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="group mt-2 flex w-full items-center justify-center gap-3 rounded-xl bg-lime-400 px-5 py-3.5 text-sm font-bold text-black transition hover:bg-lime-300"
                  >
                    Continue

                    <ArrowRight
                      size={17}
                      className="transition group-hover:translate-x-1"
                    />
                  </button>
                </div>
              )}

              {/* ================= STEP 2 ================= */}

              {step === 2 && (
                <div className="space-y-5">

                  {/* Age + Height */}

                  <div className="grid grid-cols-2 gap-4">

                    <div>
                      <label
                        htmlFor="age"
                        className="mb-2 block text-xs font-semibold text-white/60"
                      >
                        Age
                      </label>

                      <input
                        id="age"
                        name="age"
                        type="number"
                        min="16"
                        max="99"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="22"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm outline-none transition placeholder:text-white/20 focus:border-lime-400/50"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="height"
                        className="mb-2 block text-xs font-semibold text-white/60"
                      >
                        Height (cm)
                      </label>

                      <input
                        id="height"
                        name="height"
                        type="number"
                        min="1"
                        step="0.1"
                        value={formData.height}
                        onChange={handleChange}
                        placeholder="180"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm outline-none transition placeholder:text-white/20 focus:border-lime-400/50"
                      />
                    </div>
                  </div>

                  {/* Gender */}

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-white/60">
                      Gender
                    </label>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        {
                          value: "MALE",
                          label: "Male",
                        },
                        {
                          value: "FEMALE",
                          label: "Female",
                        },
                        {
                          value: "OTHER",
                          label: "Other",
                        },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setFormData(
                              (previous) => ({
                                ...previous,
                                gender:
                                  option.value,
                              })
                            );

                            setError("");
                          }}
                          className={`rounded-xl border px-3 py-3 text-sm transition ${
                            formData.gender ===
                            option.value
                              ? "border-lime-400 bg-lime-400/10 text-lime-400"
                              : "border-white/10 bg-white/[0.03] text-white/50 hover:border-white/20"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Goal */}

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-white/60">
                      Primary Goal
                    </label>

                    <div className="space-y-2">
                      {goals.map((goal) => (
                        <button
                          key={goal.value}
                          type="button"
                          onClick={() => {
                            setFormData(
                              (previous) => ({
                                ...previous,
                                goal: goal.value,
                              })
                            );

                            setError("");
                          }}
                          className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                            formData.goal ===
                            goal.value
                              ? "border-lime-400 bg-lime-400/10"
                              : "border-white/10 bg-white/[0.03] hover:border-white/20"
                          }`}
                        >
                          <div
                            className={`text-sm font-semibold ${
                              formData.goal ===
                              goal.value
                                ? "text-lime-400"
                                : "text-white/80"
                            }`}
                          >
                            {goal.label}
                          </div>

                          <div className="mt-1 text-xs text-white/35">
                            {goal.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Buttons */}

                  <div className="flex gap-3 pt-2">

                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3.5 text-sm font-semibold text-white/60 transition hover:border-white/20 hover:text-white"
                    >
                      <ArrowLeft size={16} />
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="group flex flex-1 items-center justify-center gap-3 rounded-xl bg-lime-400 px-5 py-3.5 text-sm font-bold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting
                        ? "Creating..."
                        : "Create Account"}

                      {!submitting && (
                        <ArrowRight
                          size={17}
                          className="transition group-hover:translate-x-1"
                        />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* Login */}

            <p className="mt-8 text-center text-sm text-white/35">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-lime-400 transition hover:text-lime-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;