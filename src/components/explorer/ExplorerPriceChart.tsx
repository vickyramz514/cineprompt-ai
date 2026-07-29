"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export type HistoryPoint = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

const RANGES = [
  { id: "1D", days: 2 },
  { id: "1W", days: 7 },
  { id: "1M", days: 31 },
  { id: "6M", days: 183 },
  { id: "YTD", days: null },
  { id: "1Y", days: 365 },
  { id: "5Y", days: 365 * 5 },
  { id: "MAX", days: null },
] as const;

type RangeId = (typeof RANGES)[number]["id"];

export default function ExplorerPriceChart({
  history,
  symbol,
}: {
  history: HistoryPoint[];
  symbol: string;
}) {
  const [range, setRange] = useState<RangeId>("1Y");

  const data = useMemo(() => {
    if (!history.length) return [];
    const last = history[history.length - 1];
    let filtered = history;
    if (range === "YTD") {
      const y = last.date.slice(0, 4);
      filtered = history.filter((p) => p.date >= `${y}-01-01`);
    } else if (range !== "MAX") {
      const def = RANGES.find((r) => r.id === range);
      if (def?.days) {
        const cut = new Date(last.date);
        cut.setUTCDate(cut.getUTCDate() - def.days);
        const cutStr = cut.toISOString().slice(0, 10);
        filtered = history.filter((p) => p.date >= cutStr);
      }
    }
    if (filtered.length > 600) {
      const step = Math.ceil(filtered.length / 600);
      return filtered.filter((_, i) => i % step === 0 || i === filtered.length - 1);
    }
    return filtered;
  }, [history, range]);

  const first = data[0]?.close;
  const lastClose = data[data.length - 1]?.close;
  const change =
    first != null && lastClose != null && first !== 0
      ? ((lastClose - first) / first) * 100
      : null;
  const up = (change ?? 0) >= 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-4 sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
            Historical price
          </p>
          <p className="mt-1 text-sm text-white/55">
            {symbol}
            {change != null && (
              <span className={`ml-2 font-semibold tabular-nums ${up ? "text-emerald-400" : "text-rose-400"}`}>
                {up ? "+" : ""}
                {change.toFixed(2)}% ({range})
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          {RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRange(r.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                range === r.id
                  ? "bg-violet-600 text-white"
                  : "border border-white/10 text-white/50 hover:text-white/80"
              }`}
            >
              {r.id}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 h-72 w-full sm:h-96">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-white/40">
            No price history available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="etfPriceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={up ? "#34d399" : "#fb7185"} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={up ? "#34d399" : "#fb7185"} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                minTickGap={40}
              />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={56}
                tickFormatter={(v) => `$${Number(v).toFixed(0)}`}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(11,11,20,0.95)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "rgba(255,255,255,0.6)" }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Close"]}
              />
              <Area
                type="monotone"
                dataKey="close"
                stroke={up ? "#34d399" : "#fb7185"}
                fill="url(#etfPriceFill)"
                strokeWidth={2}
                dot={false}
                isAnimationActive
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
