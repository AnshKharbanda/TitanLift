import { useEffect, useMemo, useState } from "react";

import {
  Activity,
  BarChart3,
  Dumbbell,
  Loader2,
  TrendingUp,
  Weight,
} from "lucide-react";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import AppShell from "../components/AppShell";

import { getExercises } from "../services/workout";
import { getExerciseProgress } from "../services/progress";


function formatDate(dateString) {
  return new Date(
    dateString
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}


function formatMuscleGroup(group) {
  if (!group) {
    return "";
  }

  return (
    group.charAt(0).toUpperCase() +
    group.slice(1).toLowerCase()
  );
}


function Progress() {

  const [exercises, setExercises] =
    useState([]);

  const [selectedExerciseId, setSelectedExerciseId] =
    useState("");

  const [progress, setProgress] =
    useState(null);

  const [loadingExercises, setLoadingExercises] =
    useState(true);

  const [loadingProgress, setLoadingProgress] =
    useState(false);

  const [error, setError] =
    useState("");


  // =========================================================
  // LOAD EXERCISES
  // =========================================================

  useEffect(() => {

    async function loadExercises() {

      try {

        setLoadingExercises(true);
        setError("");

        const data =
          await getExercises();

        setExercises(data);

        if (
          data.length > 0
          && !selectedExerciseId
        ) {
          setSelectedExerciseId(
            String(data[0].id)
          );
        }

      } catch (err) {

        console.error(err);

        setError(
          err.response?.data?.detail ||
          "Could not load exercises."
        );

      } finally {

        setLoadingExercises(false);

      }
    }

    loadExercises();

  }, []);


  // =========================================================
  // LOAD PROGRESS
  // =========================================================

  useEffect(() => {

    if (!selectedExerciseId) {
      return;
    }

    async function loadProgress() {

      try {

        setLoadingProgress(true);
        setError("");

        const data =
          await getExerciseProgress(
            selectedExerciseId
          );

        setProgress(data);

      } catch (err) {

        console.error(err);

        setProgress(null);

        setError(
          err.response?.data?.detail ||
          "Could not load exercise progress."
        );

      } finally {

        setLoadingProgress(false);

      }
    }

    loadProgress();

  }, [selectedExerciseId]);


  // =========================================================
  // CHART DATA
  // =========================================================

  const chartData = useMemo(() => {

    if (!progress?.sessions) {
      return [];
    }

    return progress.sessions.map(
      (session) => ({
        date: formatDate(
          session.date
        ),

        weight: session.weight,

        volume: session.volume,

        fullDate: session.date,
      })
    );

  }, [progress]);


  return (
    <AppShell
      eyebrow="PROGRESS"
      title="Exercise Progress"
    >

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <section className="mb-8">

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-lime-400/20 bg-lime-400/10">

                  <TrendingUp
                    size={20}
                    className="text-lime-400"
                  />

                </div>


                <div>

                  <p className="text-[10px] font-bold tracking-[0.2em] text-lime-400">
                    PERFORMANCE TRACKING
                  </p>

                  <h1 className="mt-1 text-3xl font-black">
                    Exercise Progress
                  </h1>

                </div>

              </div>


              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/35">
                Choose an exercise to track
                your strength, volume, and
                performance over time.
              </p>

            </div>


            <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">

              <Dumbbell
                size={16}
                className="text-lime-400"
              />

              <span className="text-xs text-white/35">
                {exercises.length} exercises
              </span>

            </div>

          </div>

        </section>


        {/* =================================================
            EXERCISE SELECTOR
        ================================================= */}

        <section className="mb-6 rounded-2xl border border-white/[0.06] bg-[#0b0d0d] p-5">

          <label className="mb-3 block text-[10px] font-bold tracking-[0.2em] text-lime-400">
            SELECT EXERCISE
          </label>


          {loadingExercises ? (

            <div className="flex h-12 items-center gap-2 rounded-xl border border-white/[0.06] px-4 text-sm text-white/30">

              <Loader2
                size={16}
                className="animate-spin"
              />

              Loading exercises...

            </div>

          ) : (

            <select
              value={selectedExerciseId}
              onChange={(event) =>
                setSelectedExerciseId(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-white/10 bg-[#050606] px-4 py-3 text-sm text-white outline-none transition focus:border-lime-400/30"
            >

              {exercises.length === 0 ? (

                <option value="">
                  No exercises available
                </option>

              ) : (

                exercises.map((exercise) => (

                  <option
                    key={exercise.id}
                    value={exercise.id}
                  >
                    {exercise.name}
                  </option>

                ))

              )}

            </select>

          )}

        </section>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="mb-6 rounded-xl border border-red-500/10 bg-red-500/[0.04] px-4 py-3 text-sm text-red-400">
            {error}
          </div>

        )}


        {/* =================================================
            LOADING
        ================================================= */}

        {loadingProgress ? (

          <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-white/[0.06] bg-[#0b0d0d]">

            <div className="flex items-center gap-3 text-sm text-white/30">

              <Loader2
                size={20}
                className="animate-spin text-lime-400"
              />

              Loading progress...

            </div>

          </div>

        ) : progress ? (

          <>

            {/* =================================================
                EXERCISE TITLE
            ================================================= */}

            <div className="mb-6 flex items-end justify-between">

              <div>

                <p className="text-[10px] font-bold tracking-[0.2em] text-white/25">
                  SELECTED EXERCISE
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  {progress.exercise_name}
                </h2>

                <p className="mt-1 text-xs text-white/30">
                  {formatMuscleGroup(
                    progress.muscle_group
                  )}
                </p>

              </div>

            </div>


            {/* =================================================
                STAT CARDS
            ================================================= */}

            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <ProgressStat
                icon={Weight}
                label="Latest Weight"
                value={
                  progress.latest_weight !== null
                    ? `${progress.latest_weight} kg`
                    : "—"
                }
              />


              <ProgressStat
                icon={Dumbbell}
                label="Best Weight"
                value={
                  progress.best_weight !== null
                    ? `${progress.best_weight} kg`
                    : "—"
                }
              />


              <ProgressStat
                icon={BarChart3}
                label="Total Volume"
                value={`${progress.total_volume.toLocaleString()} kg`}
              />


              <ProgressStat
                icon={Activity}
                label="Sessions"
                value={progress.total_sessions}
              />

            </div>


            {/* =================================================
                PERFORMANCE CHART
            ================================================= */}

            <section className="mb-6 rounded-2xl border border-white/[0.06] bg-[#0b0d0d] p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[10px] font-bold tracking-[0.2em] text-lime-400">
                    STRENGTH TREND
                  </p>

                  <h3 className="mt-1 text-xl font-bold">
                    Weight Over Time
                  </h3>

                </div>


                {progress.progress_percentage !== null && (

                  <div className="rounded-xl bg-lime-400/10 px-3 py-2">

                    <p className="text-[10px] font-bold text-lime-400">
                      PROGRESS
                    </p>

                    <p className="text-sm font-black text-lime-400">
                      {progress.progress_percentage > 0
                        ? "+"
                        : ""}
                      {progress.progress_percentage}%
                    </p>

                  </div>

                )}

              </div>


              {chartData.length === 0 ? (

                <div className="mt-6 flex h-[300px] items-center justify-center rounded-xl border border-dashed border-white/[0.08]">

                  <p className="text-sm text-white/30">
                    No recorded progress yet.
                  </p>

                </div>

              ) : (

                <div className="mt-6 h-[300px]">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <LineChart
                      data={chartData}
                      margin={{
                        top: 10,
                        right: 10,
                        left: -20,
                        bottom: 0,
                      }}
                    >

                      <CartesianGrid
                        stroke="rgba(255,255,255,0.05)"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="date"
                        tick={{
                          fill:
                            "rgba(255,255,255,0.3)",
                          fontSize: 10,
                        }}
                        axisLine={false}
                        tickLine={false}
                        minTickGap={25}
                      />

                      <YAxis
                        tick={{
                          fill:
                            "rgba(255,255,255,0.3)",
                          fontSize: 10,
                        }}
                        axisLine={false}
                        tickLine={false}
                        width={45}
                      />

                      <Tooltip
                        contentStyle={{
                          background:
                            "#0b0d0d",
                          border:
                            "1px solid rgba(255,255,255,0.08)",
                          borderRadius:
                            "12px",
                        }}
                        labelStyle={{
                          color:
                            "rgba(255,255,255,0.5)",
                        }}
                      />

                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#a3e635"
                        strokeWidth={3}
                        dot={{
                          r: 3,
                          fill: "#a3e635",
                          strokeWidth: 0,
                        }}
                        activeDot={{
                          r: 6,
                          fill: "#a3e635",
                          stroke: "#050606",
                          strokeWidth: 3,
                        }}
                      />

                    </LineChart>

                  </ResponsiveContainer>

                </div>

              )}

            </section>


            {/* =================================================
                SESSION HISTORY
            ================================================= */}

            <section className="rounded-2xl border border-white/[0.06] bg-[#0b0d0d]">

              <div className="border-b border-white/[0.06] p-6">

                <p className="text-[10px] font-bold tracking-[0.2em] text-lime-400">
                  TRAINING HISTORY
                </p>

                <h3 className="mt-1 text-xl font-bold">
                  Recent Sessions
                </h3>

              </div>


              {progress.sessions.length === 0 ? (

                <div className="p-8 text-center text-sm text-white/30">
                  No sessions recorded for
                  this exercise yet.
                </div>

              ) : (

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[600px]">

                    <thead>

                      <tr className="border-b border-white/[0.06] text-left">

                        <th className="px-6 py-4 text-[10px] font-bold tracking-[0.12em] text-white/25">
                          DATE
                        </th>

                        <th className="px-6 py-4 text-[10px] font-bold tracking-[0.12em] text-white/25">
                          WORKOUT
                        </th>

                        <th className="px-6 py-4 text-[10px] font-bold tracking-[0.12em] text-white/25">
                          SETS
                        </th>

                        <th className="px-6 py-4 text-[10px] font-bold tracking-[0.12em] text-white/25">
                          REPS
                        </th>

                        <th className="px-6 py-4 text-[10px] font-bold tracking-[0.12em] text-white/25">
                          WEIGHT
                        </th>

                        <th className="px-6 py-4 text-[10px] font-bold tracking-[0.12em] text-white/25">
                          VOLUME
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {[...progress.sessions]
                        .reverse()
                        .map((session) => (

                          <tr
                            key={`${session.workout_id}-${session.date}`}
                            className="border-b border-white/[0.04] last:border-b-0"
                          >

                            <td className="px-6 py-4 text-sm text-white/50">
                              {new Date(
                                session.date
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </td>


                            <td className="px-6 py-4 text-sm font-medium text-white/70">
                              {session.workout_title}
                            </td>


                            <td className="px-6 py-4 text-sm text-white/45">
                              {session.sets}
                            </td>


                            <td className="px-6 py-4 text-sm text-white/45">
                              {session.reps}
                            </td>


                            <td className="px-6 py-4 text-sm font-semibold text-white/70">
                              {session.weight} kg
                            </td>


                            <td className="px-6 py-4 text-sm text-white/45">
                              {session.volume.toLocaleString()} kg
                            </td>

                          </tr>

                        ))}

                    </tbody>

                  </table>

                </div>

              )}

            </section>

          </>

        ) : (

          <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-[#0b0d0d]">

            <div className="text-center">

              <TrendingUp
                size={32}
                className="mx-auto text-lime-400/40"
              />

              <p className="mt-4 text-sm text-white/40">
                Select an exercise to
                see your progress.
              </p>

            </div>

          </div>

        )}

      </div>

    </AppShell>
  );
}


function ProgressStat({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0b0d0d] p-5">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400/10">

        <Icon
          size={18}
          className="text-lime-400"
        />

      </div>


      <p className="mt-5 text-[10px] font-bold tracking-[0.15em] text-white/25">
        {label}
      </p>


      <p className="mt-1 text-xl font-black">
        {value}
      </p>

    </div>
  );
}


export default Progress;