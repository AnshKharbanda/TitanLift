import { useEffect, useState } from "react";

import {
  User,
  Save,
  Loader2,
  Mail,
  Ruler,
  Target,
} from "lucide-react";

import AppShell from "../components/AppShell";

import {
  getCurrentUser,
  updateProfile,
} from "../services/auth";


const goals = [
  {
    value: "HYPERTROPHY",
    label: "Hypertrophy",
  },
  {
    value: "STRENGTH",
    label: "Strength",
  },
  {
    value: "FAT_LOSS",
    label: "Fat Loss",
  },
  {
    value: "ENDURANCE",
    label: "Endurance",
  },
  {
    value: "NOT_SURE",
    label: "Not Sure",
  },
];


function Settings() {

  const [form, setForm] = useState({
    name: "",
    age: "",
    height: "",
    gender: "",
    goal: "",
    email: "",
  });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  // =========================================================
  // LOAD PROFILE
  // =========================================================

  useEffect(() => {

    async function loadProfile() {

      try {

        setLoading(true);

        const user =
          await getCurrentUser();

        setForm({
          name: user.name || "",
          age: user.age || "",
          height: user.height || "",
          gender: user.gender || "",
          goal: user.goal || "",
          email: user.email || "",
        });

      } catch (err) {

        console.error(err);

        setError(
          err.response?.data?.detail ||
          "Unable to load your profile."
        );

      } finally {

        setLoading(false);

      }
    }

    loadProfile();

  }, []);


  function handleChange(event) {

    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
    setError("");
  }


  // =========================================================
  // SAVE
  // =========================================================

  async function handleSubmit(event) {

    event.preventDefault();

    try {

      setSaving(true);
      setMessage("");
      setError("");


      const response =
        await updateProfile({
          name: form.name,
          age: Number(form.age),
          height: Number(form.height),
          gender: form.gender,
          goal: form.goal || null,
        });


      setMessage(
        response.message ||
        "Profile updated successfully."
      );

    } catch (err) {

      console.error(err);

      setError(
        err.response?.data?.detail ||
        "Unable to update your profile."
      );

    } finally {

      setSaving(false);

    }
  }


  if (loading) {

    return (
      <AppShell
        eyebrow="ACCOUNT"
        title="Settings"
      >

        <div className="flex min-h-[500px] items-center justify-center">

          <div className="flex items-center gap-3 text-sm text-white/30">

            <Loader2
              size={20}
              className="animate-spin text-lime-400"
            />

            Loading profile...

          </div>

        </div>

      </AppShell>
    );
  }


  return (
    <AppShell
      eyebrow="ACCOUNT"
      title="Settings"
    >

      <div className="mx-auto max-w-4xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400/10">

              <User
                size={20}
                className="text-lime-400"
              />

            </div>

            <div>

              <p className="text-[10px] font-bold tracking-[0.2em] text-lime-400">
                ACCOUNT
              </p>

              <h1 className="mt-1 text-3xl font-black">
                Your Profile
              </h1>

            </div>

          </div>

          <p className="mt-4 text-sm text-white/35">
            Keep your personal and training
            information up to date so TitanLift
            can give you better insights.
          </p>

        </div>


        {/* =================================================
            MESSAGES
        ================================================= */}

        {message && (

          <div className="mb-6 rounded-xl border border-lime-400/20 bg-lime-400/[0.05] px-4 py-3 text-sm text-lime-400">
            {message}
          </div>

        )}


        {error && (

          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/[0.05] px-4 py-3 text-sm text-red-400">
            {error}
          </div>

        )}


        {/* =================================================
            PROFILE FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/[0.06] bg-[#0b0d0d] p-6 lg:p-8"
        >

          <div className="mb-8">

            <p className="text-[10px] font-bold tracking-[0.2em] text-lime-400">
              PERSONAL INFORMATION
            </p>

            <h2 className="mt-1 text-xl font-bold">
              Training Profile
            </h2>

          </div>


          <div className="grid gap-6 md:grid-cols-2">

            {/* Name */}

            <div>

              <label className="mb-2 block text-xs font-semibold text-white/50">
                Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/10 bg-[#050606] px-4 py-3 text-sm text-white outline-none transition focus:border-lime-400/40"
              />

            </div>


            {/* Email */}

            <div>

              <label className="mb-2 block text-xs font-semibold text-white/50">
                Email
              </label>

              <div className="relative">

                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                />

                <input
                  type="email"
                  value={form.email}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-white/[0.06] bg-white/[0.02] py-3 pl-11 pr-4 text-sm text-white/35 outline-none"
                />

              </div>

              <p className="mt-2 text-[11px] text-white/20">
                Email is used for your login and
                cannot be changed here.
              </p>

            </div>


            {/* Age */}

            <div>

              <label className="mb-2 block text-xs font-semibold text-white/50">
                Age
              </label>

              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                min="1"
                max="120"
                required
                className="w-full rounded-xl border border-white/10 bg-[#050606] px-4 py-3 text-sm text-white outline-none transition focus:border-lime-400/40"
              />

            </div>


            {/* Height */}

            <div>

              <label className="mb-2 block text-xs font-semibold text-white/50">
                Height
              </label>

              <div className="relative">

                <Ruler
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                />

                <input
                  type="number"
                  name="height"
                  value={form.height}
                  onChange={handleChange}
                  min="50"
                  max="250"
                  step="0.1"
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#050606] py-3 pl-11 pr-14 text-sm text-white outline-none transition focus:border-lime-400/40"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/25">
                  cm
                </span>

              </div>

            </div>


            {/* Gender */}

            <div>

              <label className="mb-2 block text-xs font-semibold text-white/50">
                Gender
              </label>

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/10 bg-[#050606] px-4 py-3 text-sm text-white outline-none transition focus:border-lime-400/40"
              >

                <option value="">
                  Select gender
                </option>

                <option value="MALE">
                  Male
                </option>

                <option value="FEMALE">
                  Female
                </option>

                <option value="OTHER">
                  Other
                </option>

              </select>

            </div>


            {/* Goal */}

            <div>

              <label className="mb-2 block text-xs font-semibold text-white/50">
                Training Goal
              </label>

              <div className="relative">

                <Target
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                />

                <select
                  name="goal"
                  value={form.goal}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-[#050606] py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-lime-400/40"
                >

                  <option value="">
                    Select goal
                  </option>

                  {goals.map((goal) => (

                    <option
                      key={goal.value}
                      value={goal.value}
                    >
                      {goal.label}
                    </option>

                  ))}

                </select>

              </div>

            </div>

          </div>


          {/* =================================================
              SAVE
          ================================================= */}

          <div className="mt-8 flex justify-end border-t border-white/[0.06] pt-6">

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-lime-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {saving ? (

                <Loader2
                  size={16}
                  className="animate-spin"
                />

              ) : (

                <Save size={16} />

              )}

              {saving
                ? "Saving..."
                : "Save Changes"}

            </button>

          </div>

        </form>

      </div>

    </AppShell>
  );
}


export default Settings;