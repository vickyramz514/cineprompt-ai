"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#818cf8", "#34d399", "#22d3ee", "#f472b6", "#fbbf24", "#fb7185"];

export default function EndpointPieInner({
  data,
}: {
  data: Array<{ name: string; value: number }>;
}) {
  if (!data.length) {
    return <div className="flex h-44 items-center justify-center text-xs text-white/40">No data</div>;
  }
  return (
    <div className="h-44">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={40} outerRadius={68} paddingAngle={2}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#0b0b14",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
