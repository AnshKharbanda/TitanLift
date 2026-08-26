import { ArrowUpRight } from "lucide-react";

function StatCard({ label, value, suffix, icon: Icon }) {
  return (
    <div className="group rounded-2xl border border-white/[0.06] bg-[#0b0d0d] p-5 transition duration-300 hover:border-lime-400/20 hover:bg-[#0d100e]">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400/10">
          <Icon size={19} className="text-lime-400" />
        </div>

        <ArrowUpRight
          size={16}
          className="text-white/15 transition group-hover:text-lime-400/60"
        />
      </div>

      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.15em] text-white/35">
        {label}
      </p>

      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-3xl font-black tracking-tight text-white">
          {value}
        </span>

        {suffix && (
          <span className="text-xs text-white/30">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export default StatCard;