"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

const COLORS = ["#8b5cf6", "#34d399", "#f43f5e", "#38bdf8", "#fbbf24", "#a3e635", "#fb7185", "#67e8f9"];

export default function HeatmapChartsInner({
  mode,
  histogram,
  category,
}: {
  mode: "histogram" | "category";
  histogram: Array<{ bucket: number; label: string; count: number }>;
  category: Array<{ name: string; value: number }>;
}) {
  if (mode === "histogram") {
    return (
      <div className="mt-3 h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={histogram}>
            <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
              allowDecimals={false}
              width={28}
            />
            <Tooltip
              contentStyle={{
                background: "#0b0b14",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey="count" name="ETFs" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  const top = [...category].sort((a, b) => b.value - a.value).slice(0, 10);

  return (
    <div className="mt-3 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={top} layout="vertical" margin={{ left: 8, right: 12 }}>
          <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="name"
            width={88}
            tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{
              background: "#0b0b14",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Bar dataKey="value" name="ETFs" radius={[0, 4, 4, 0]}>
            {top.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
