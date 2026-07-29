"use client";

type Props = {
  data?: number[] | null;
  width?: number;
  height?: number;
  className?: string;
  strokeWidth?: number;
};

export default function Sparkline({
  data,
  width = 72,
  height = 24,
  className = "",
  strokeWidth = 1.5,
}: Props) {
  if (!data || data.length < 2) {
    return (
      <span
        className={`inline-block rounded bg-white/5 ${className}`}
        style={{ width, height }}
        aria-hidden
      />
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = pad + (height - pad * 2) - ((v - min) / range) * (height - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");
  const up = data[data.length - 1] >= data[0];
  const stroke = up ? "#34d399" : "#fb7185";
  const fill = up ? "rgba(52,211,153,0.12)" : "rgba(251,113,133,0.12)";
  const area = `0,${height} ${pts} ${width},${height}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} style={{ width, height }} aria-hidden>
      <polygon fill={fill} points={area} />
      <polyline fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" points={pts} />
    </svg>
  );
}
