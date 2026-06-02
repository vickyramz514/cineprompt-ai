"use client";

import { motion } from "framer-motion";
import { useId, useMemo } from "react";

type UsageSparklineProps = {
  used: number;
  limit: number;
  className?: string;
};

function buildChartPaths(used: number, limit: number) {
  const ratio = limit > 0 ? Math.min(used / limit, 1) : 0;
  const w = 400;
  const h = 120;
  const baseY = h - 8;
  const count = 24;

  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const target = 0.2 + ratio * 0.65 * t;
    const wave = Math.sin(i * 0.55) * 0.04 * (1 - t * 0.5);
    const y = baseY - target * (h - 16) - wave * h;
    points.push({ x: (i / (count - 1)) * w, y });
  }

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L${w},${baseY} L0,${baseY} Z`;

  const last = points[points.length - 1];
  return { line, area, w, h, ratio, lastX: last.x, lastY: last.y };
}

export default function UsageSparkline({ used, limit, className }: UsageSparklineProps) {
  const uid = useId().replace(/:/g, "");
  const { line, area, w, h, lastX, lastY } = useMemo(() => buildChartPaths(used, limit), [used, limit]);

  return (
    <div className={className} aria-hidden>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`usage-area-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(52, 211, 153)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="rgb(52, 211, 153)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`usage-line-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgb(99, 102, 241)" />
            <stop offset="50%" stopColor="rgb(129, 140, 248)" />
            <stop offset="100%" stopColor="rgb(52, 211, 153)" />
          </linearGradient>
        </defs>

        {[30, 60, 90].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2={w}
            y2={y}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
        ))}

        <motion.path
          d={area}
          fill={`url(#usage-area-${uid})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        <motion.path
          d={line}
          fill="none"
          stroke={`url(#usage-line-${uid})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />

        <motion.circle
          cx={lastX}
          cy={lastY}
          r="5"
          fill="rgb(52, 211, 153)"
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
        />
      </svg>
    </div>
  );
}
