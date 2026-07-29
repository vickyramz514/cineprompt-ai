"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

export default function UsageChartInner({
  data,
}: {
  data: Array<{ label: string; count: number }>;
}) {
  return (
    <div className="mt-4 h-56">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="usageFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#818cf8" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} interval="preserveStartEnd" />
          <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} width={32} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              background: "#0b0b14",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Area type="monotone" dataKey="count" name="Requests" stroke="#a5b4fc" fill="url(#usageFill)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
