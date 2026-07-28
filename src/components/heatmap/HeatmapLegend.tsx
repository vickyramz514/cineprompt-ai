"use client";

export default function HeatmapLegend() {
  const stops = [
    { label: "Strong Gain", color: "rgb(4, 120, 87)" },
    { label: "Gain", color: "rgb(16, 185, 129)" },
    { label: "Neutral", color: "rgb(75, 85, 99)" },
    { label: "Loss", color: "rgb(244, 63, 94)" },
    { label: "Strong Loss", color: "rgb(159, 18, 57)" },
  ];
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-4">
      <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">Legend</p>
      <div className="mt-3 flex flex-wrap gap-3">
        {stops.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-xs text-white/65">
            <span className="h-3 w-6 rounded" style={{ backgroundColor: s.color }} />
            {s.label}
          </div>
        ))}
      </div>
      <div
        className="mt-3 h-2 w-full rounded-full"
        style={{
          background:
            "linear-gradient(90deg, rgb(159,18,57), rgb(244,63,94), rgb(75,85,99), rgb(16,185,129), rgb(4,120,87))",
        }}
        aria-hidden
      />
      <div className="mt-1 flex justify-between text-[10px] text-white/35">
        <span>-35%</span>
        <span>0%</span>
        <span>+35%</span>
      </div>
    </div>
  );
}
