import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { TrendingUp } from "lucide-react";


function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}


function WeightTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const item = payload[0].payload;

  return (
    <div className="rounded-xl border border-white/10 bg-[#111414] px-4 py-3 shadow-xl">

      <p className="text-xs text-white/40">
        {new Date(item.recorded_at).toLocaleDateString(
          "en-IN",
          {
            day: "numeric",
            month: "short",
            year: "numeric",
          }
        )}
      </p>

      <p className="mt-1 text-lg font-black text-lime-400">
        {item.weight} kg
      </p>

    </div>
  );
}


function WeightProgress({
  data = [],
  loading = false,
}) {

  const chartData = data.map((item) => ({
    ...item,
    date: formatDate(item.recorded_at),
  }));



  const latestWeight =
    data.length > 0
      ? data[data.length - 1].weight
      : null;


  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0b0d0d] p-6">

      {/* Header */}

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs font-semibold tracking-[0.18em] text-lime-400">
            PROGRESS
          </p>

          <h3 className="mt-1 text-xl font-bold">
            Weight Progress
          </h3>

        </div>


        {latestWeight !== null && (
          <div className="text-right">

            <p className="text-xs text-white/30">
              Current
            </p>

            <p className="mt-1 text-xl font-black text-white">
              {latestWeight}

              <span className="ml-1 text-xs font-medium text-white/30">
                kg
              </span>
            </p>

          </div>
        )}

      </div>


      {/* Chart */}

      <div className="mt-6 h-[230px]">

        {loading ? (

          <div className="flex h-full animate-pulse items-center justify-center rounded-xl bg-white/[0.02]">

            <div className="h-2/3 w-full rounded-xl bg-white/[0.03]" />

          </div>

        ) : data.length === 0 ? (

          <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08]">

            <TrendingUp
              size={28}
              className="text-lime-400/40"
            />

            <p className="mt-3 text-sm text-white/40">
              No weight data yet
            </p>

            <p className="mt-1 text-xs text-white/25">
              Start logging your weight to track progress
            </p>

          </div>

        ) : (

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
                  fill: "rgba(255,255,255,0.3)",
                  fontSize: 10,
                }}
                axisLine={false}
                tickLine={false}
                minTickGap={25}
              />

              <YAxis
                domain={[80, 86]}
                tick={{
                    fill: "rgba(255,255,255,0.3)",
                    fontSize: 10,
                }}
                axisLine={false}
                tickLine={false}
                width={40}
              />

              <Tooltip
                content={<WeightTooltip />}
                cursor={{
                  stroke: "rgba(255,255,255,0.1)",
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

        )}

      </div>

    </div>
  );
}


export default WeightProgress;