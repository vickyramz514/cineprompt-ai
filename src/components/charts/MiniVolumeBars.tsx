"use client";

type Props = {
  volumes?: number[] | null;
  closes?: number[] | null;
  width?: number;
  height?: number;
  className?: string;
};

export default function MiniVolumeBars({
  volumes,
  closes,
  width = 72,
  height = 20,
  className = "",
}: Props) {
  if (!volumes || volumes.length < 2) {
    return (
      <span
        className={`inline-block rounded bg-white/5 ${className}`}
        style={{ width, height }}
        aria-hidden
      />
    );
  }

  const max = Math.max(...volumes) || 1;
  const n = volumes.length;
  const gap = 0.5;
  const barW = Math.max(1, (width - gap * (n - 1)) / n);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} style={{ width, height }} aria-hidden>
      {volumes.map((v, i) => {
        const h = Math.max(1, (v / max) * height);
        const x = i * (barW + gap);
        const up = !closes || i === 0 ? true : closes[i] >= closes[i - 1];
        return (
          <rect
            key={i}
            x={x}
            y={height - h}
            width={barW}
            height={h}
            rx={0.5}
            fill={up ? "rgba(52,211,153,0.55)" : "rgba(251,113,133,0.55)"}
          />
        );
      })}
    </svg>
  );
}
