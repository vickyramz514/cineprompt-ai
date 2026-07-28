"use client";

export function MetricCard({
  label,
  value,
  accent,
  hint,
}: {
  label: string;
  value: string;
  accent?: string;
  hint?: string;
}) {
  return (
    <div className="group flex h-full min-h-[5.5rem] flex-col rounded-xl border border-white/10 bg-black/30 p-4 shadow-[0_8px_30px_-18px_rgba(0,0,0,0.6)] transition duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-black/40">
      <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">{label}</p>
      <p className={`mt-1.5 text-xl font-semibold tabular-nums sm:text-2xl ${accent ?? "text-white"}`}>{value}</p>
      {hint && <p className="mt-auto pt-2 text-[10px] text-white/35">{hint}</p>}
    </div>
  );
}
