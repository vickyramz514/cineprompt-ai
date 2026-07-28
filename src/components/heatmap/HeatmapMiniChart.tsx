"use client";

import { ResponsiveContainer, AreaChart, Area, YAxis } from "recharts";

export default function HeatmapMiniChart({ data }: { data: Array<{ date: string; close: number }> }) {
  if (!data.length) {
    return <div className="flex h-40 items-center justify-center rounded-xl border border-white/10 text-xs text-white/40">No chart data</div>;
  }
  return (
    <div className="h-40 rounded-xl border border-white/10 bg-black/30 p-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="hmMini" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <YAxis hide domain={["auto", "auto"]} />
          <Area type="monotone" dataKey="close" stroke="#c4b5fd" fill="url(#hmMini)" strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
