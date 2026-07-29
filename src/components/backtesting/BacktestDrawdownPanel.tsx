"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import type { BacktestResult } from "@/services/datacaptain/endpoints";
import { formatPct, formatUsdPrecise } from "@/lib/backtest/metrics";
import { buildDrawdownFromEquity, sampleSeries } from "@/lib/backtest/chartHelpers";

export default function BacktestDrawdownPanel({ result }: { result: BacktestResult }) {
  const data = useMemo(() => {
    const src =
      result.drawdownCurve?.length
        ? result.drawdownCurve.map((d) => ({
            date: d.date,
            drawdown: -Math.abs(d.drawdown),
            peak: d.peak,
            value: d.value,
          }))
        : buildDrawdownFromEquity(result.equityCurve);
    return sampleSeries(src, 1800);
  }, [result]);

  const maxDd = result.maxDrawdown;
  const recovery = result.maxDrawdownRecoveryDays;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-4 text-sm">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-white/35">Max drawdown</p>
          <p className="font-semibold tabular-nums text-rose-400">{formatPct(-Math.abs(maxDd))}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-white/35">Recovery days</p>
          <p className="font-semibold tabular-nums text-white/80">
            {recovery != null ? recovery.toLocaleString() : "—"}
          </p>
        </div>
      </div>
      <div className="h-[320px] w-full sm:h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="btDdFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fb7185" stopOpacity={0.05} />
                <stop offset="100%" stopColor="#fb7185" stopOpacity={0.45} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
              minTickGap={48}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
              tickFormatter={(v) => `${Number(v).toFixed(0)}%`}
              width={44}
              axisLine={false}
              tickLine={false}
              domain={["dataMin", 0]}
            />
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const row = payload[0]?.payload as (typeof data)[number];
                return (
                  <div className="rounded-lg border border-white/15 bg-[#0b0b14]/95 px-3 py-2 text-xs shadow-xl">
                    <p className="mb-1 font-medium text-white/70">{label}</p>
                    <p className="tabular-nums text-rose-300">
                      Current DD {formatPct(row.drawdown)}
                    </p>
                    <p className="tabular-nums text-amber-200">
                      Max DD {formatPct(-Math.abs(maxDd))}
                    </p>
                    <p className="tabular-nums text-white/60">
                      Peak {formatUsdPrecise(row.peak)} · Value {formatUsdPrecise(row.value)}
                    </p>
                    <p className="tabular-nums text-white/50">
                      Recovery days {recovery != null ? recovery : "—"}
                    </p>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="drawdown"
              stroke="#fb7185"
              fill="url(#btDdFill)"
              strokeWidth={2}
              dot={false}
              isAnimationActive
              animationDuration={700}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
