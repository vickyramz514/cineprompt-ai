"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function ExplorerDividendChart({
  dividends,
}: {
  dividends: Array<{ exDate: string; amount: number | null }>;
}) {
  const data = [...dividends]
    .filter((d) => d.amount != null)
    .reverse()
    .map((d) => ({
      date: String(d.exDate).slice(0, 10),
      amount: d.amount as number,
    }));

  if (!data.length) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-white/10 text-sm text-white/40">
        No dividend history on file
      </div>
    );
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            minTickGap={28}
          />
          <YAxis
            tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={40}
            tickFormatter={(v) => `$${Number(v).toFixed(2)}`}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(11,11,20,0.95)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value: number) => [`$${value.toFixed(4)}`, "Dividend"]}
          />
          <Bar dataKey="amount" fill="#a78bfa" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
