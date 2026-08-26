import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

import { BarChart3 } from "lucide-react";


const MUSCLE_COLORS = [
  "#a3e635",
  "#84cc16",
  "#65a30d",
  "#bef264",
  "#4d7c0f",
  "#d9f99d",
  "#3f6212",
];


function formatMuscleName(name) {
  return (
    name.charAt(0) +
    name.slice(1).toLowerCase()
  );
}


function MuscleTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const item = payload[0];

  return (
    <div className="rounded-xl border border-white/10 bg-[#111414] px-4 py-3 shadow-xl">

      <p className="text-xs text-white/40">
        {formatMuscleName(item.name)}
      </p>

      <p className="mt-1 text-lg font-black text-lime-400">
        {item.value}
        <span className="ml-1 text-xs font-medium text-white/30">
          sets
        </span>
      </p>

    </div>
  );
}


function MuscleDistribution({
  data = {},
  loading = false,
}) {

  const chartData = Object.entries(data)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value,
    }));


  const totalSets = chartData.reduce(
    (total, item) => total + item.value,
    0
  );


  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0b0d0d] p-6">

      {/* Header */}

      <div>

        <p className="text-xs font-semibold tracking-[0.18em] text-lime-400">
          TRAINING ANALYTICS
        </p>

        <h3 className="mt-1 text-xl font-bold">
          Muscle Distribution
        </h3>

      </div>


      {/* Content */}

      <div className="mt-5">

        {loading ? (

          <div className="flex h-[250px] animate-pulse items-center justify-center">

            <div className="h-48 w-48 rounded-full border-[28px] border-white/[0.04]" />

          </div>

        ) : chartData.length === 0 ? (

          <div className="flex h-[250px] flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08]">

            <BarChart3
              size={28}
              className="text-lime-400/40"
            />

            <p className="mt-3 text-sm text-white/40">
              No training data yet
            </p>

            <p className="mt-1 text-xs text-white/25">
              Complete workouts to see muscle distribution
            </p>

          </div>

        ) : (

          <div className="grid items-center gap-5 sm:grid-cols-2">

            {/* Donut */}

            <div className="relative h-[230px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={88}
                    paddingAngle={3}
                    stroke="none"
                  >

                    {chartData.map(
                      (entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={
                            MUSCLE_COLORS[
                              index %
                                MUSCLE_COLORS.length
                            ]
                          }
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip
                    content={<MuscleTooltip />}
                  />

                </PieChart>

              </ResponsiveContainer>


              {/* Center */}

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">

                <div className="text-center">

                  <p className="text-2xl font-black">
                    {totalSets}
                  </p>

                  <p className="text-[10px] uppercase tracking-[0.15em] text-white/30">
                    Total Sets
                  </p>

                </div>

              </div>

            </div>


            {/* Legend */}

            <div className="space-y-2">

              {chartData.map(
                (item, index) => {

                  const percentage =
                    totalSets > 0
                      ? Math.round(
                          (item.value /
                            totalSets) *
                            100
                        )
                      : 0;

                  return (
                    <div
                      key={item.name}
                      className="flex items-center gap-3"
                    >

                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{
                          backgroundColor:
                            MUSCLE_COLORS[
                              index %
                                MUSCLE_COLORS.length
                            ],
                        }}
                      />

                      <span className="min-w-0 flex-1 truncate text-xs text-white/50">
                        {formatMuscleName(
                          item.name
                        )}
                      </span>

                      <span className="text-xs font-semibold text-white/70">
                        {percentage}%
                      </span>

                    </div>
                  );
                }
              )}

            </div>

          </div>

        )}

      </div>

    </div>
  );
}


export default MuscleDistribution;