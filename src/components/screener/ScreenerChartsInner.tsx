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

const COLORS = ["#22d3ee", "#34d399", "#a78bfa", "#f472b6", "#fbbf24", "#60a5fa"];

export default function ScreenerChartsInner({
  mode,
  data,
}: {
  mode: "hist" | "category";
  data: Array<{ label?: string; name?: string; count?: number; value?: number; avgReturn?: number }>;
}) {
  if (mode === "hist") {
    return (
      <div className="mt-3 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} allowDecimals={false} width={28} />
            <Tooltip
              contentStyle={{
                background: "#0b0b14",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey="count" name="ETFs" fill="#22d3ee" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  const cats = data.map((d) => ({ name: d.name, value: d.value ?? 0 }));

  return (
    <div className="mt-3 h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={cats} layout="vertical" margin={{ left: 4, right: 8 }}>
          <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="name"
            width={78}
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
            {cats.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
