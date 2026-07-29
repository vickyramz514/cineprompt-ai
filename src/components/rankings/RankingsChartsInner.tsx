"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

const COLORS = ["#a78bfa", "#34d399", "#22d3ee", "#f472b6", "#fbbf24", "#60a5fa", "#fb7185"];

type Datum = Record<string, string | number>;

export default function RankingsChartsInner({
  mode,
  data,
}: {
  mode: "top10" | "hist" | "category" | "scatter";
  data: Datum[];
  metric: string;
}) {
  const tip = {
    background: "#0b0b14",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    fontSize: 12,
  };

  if (mode === "scatter") {
    return (
      <div className="mt-3 h-52">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ left: 4, right: 8, top: 8, bottom: 4 }}>
            <XAxis
              type="number"
              dataKey="x"
              name="Volatility"
              tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
              unit="%"
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Return"
              tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
              unit="%"
              width={36}
            />
            <ZAxis range={[40, 40]} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={tip}
              formatter={(value: number, name: string) => [`${value.toFixed(1)}%`, name]}
              labelFormatter={(_, payload) =>
                payload?.[0]?.payload?.symbol ? String(payload[0].payload.symbol) : ""
              }
            />
            <Scatter data={data} fill="#a78bfa" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (mode === "category") {
    return (
      <div className="mt-3 h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 4, right: 8 }}>
            <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="name"
              width={78}
              tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 10 }}
            />
            <Tooltip contentStyle={tip} />
            <Bar dataKey="value" name="ETFs" radius={[0, 4, 4, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (mode === "hist") {
    return (
      <div className="mt-3 h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} allowDecimals={false} width={28} />
            <Tooltip contentStyle={tip} />
            <Bar dataKey="count" name="ETFs" fill="#22d3ee" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="mt-3 h-52">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="symbol" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} />
          <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} width={36} />
          <Tooltip contentStyle={tip} />
          <Bar dataKey="value" name="Score" fill="#a78bfa" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
