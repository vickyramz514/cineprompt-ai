"use client";

export default function ScreenerSparkline({ data }: { data?: number[] }) {
  if (!data || data.length < 2) {
    return <span className="inline-block h-5 w-14 rounded bg-white/5" aria-hidden />;
  }
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 56;
  const h = 20;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(" ");
  const up = data[data.length - 1] >= data[0];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-5 w-14" aria-hidden>
      <polyline
        fill="none"
        stroke={up ? "#34d399" : "#fb7185"}
        strokeWidth="1.5"
        points={pts}
      />
    </svg>
  );
}
