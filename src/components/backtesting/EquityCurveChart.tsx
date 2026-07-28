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
  Legend,
  Brush,
} from "recharts";
import { mergeEquityCurves, formatUsdPrecise, type EquityPoint } from "@/lib/backtest/metrics";

type Props = {
  primarySymbol: string;
  primaryCurve: EquityPoint[];
  compareSymbol?: string | null;
  compareCurve?: EquityPoint[] | null;
};

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/15 bg-[#0b0b14]/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
      <p className="mb-1.5 font-medium text-white/70">{label}</p>
      {payload.map((p) => (
        <p key={String(p.name)} className="tabular-nums" style={{ color: p.color }}>
          {p.name}: {typeof p.value === "number" ? formatUsdPrecise(p.value) : "—"}
        </p>
      ))}
    </div>
  );
}

export default function EquityCurveChart({
  primarySymbol,
  primaryCurve,
  compareSymbol,
  compareCurve,
}: Props) {
  const [brush, setBrush] = useState<{ startIndex?: number; endIndex?: number }>({});

  const data = useMemo(() => {
    if (compareSymbol && compareCurve?.length) {
      return mergeEquityCurves(primaryCurve, compareCurve, primarySymbol, compareSymbol);
    }
    return primaryCurve.map((p) => ({ date: p.date, [primarySymbol]: p.value }));
  }, [primaryCurve, compareCurve, primarySymbol, compareSymbol]);

  const sampled = useMemo(() => {
    if (data.length <= 800) return data;
    const step = Math.ceil(data.length / 800);
    return data.filter((_, i) => i % step === 0 || i === data.length - 1);
  }, [data]);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-4 shadow-[0_12px_40px_-24px_rgba(99,102,241,0.35)] sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">Equity curve</p>
          <p className="mt-1 text-sm text-white/55">
            Portfolio value over time{compareSymbol ? ` · ${primarySymbol} vs ${compareSymbol}` : ""}
          </p>
        </div>
        <p className="text-[10px] text-white/35">Drag the brush below to zoom</p>
      </div>

      <div className="mt-4 h-64 w-full sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sampled} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="eqPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="eqCompare" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
              tickMargin={8}
              minTickGap={48}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
              tickFormatter={(v) => `$${Math.round(Number(v) / 1000)}k`}
              width={48}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }} />
            <Area
              type="monotone"
              dataKey={primarySymbol}
              name={primarySymbol}
              stroke="#818cf8"
              fill="url(#eqPrimary)"
              strokeWidth={2}
              dot={false}
              isAnimationActive
              animationDuration={900}
            />
            {compareSymbol && compareCurve?.length ? (
              <Area
                type="monotone"
                dataKey={compareSymbol}
                name={compareSymbol}
                stroke="#34d399"
                fill="url(#eqCompare)"
                strokeWidth={2}
                dot={false}
                isAnimationActive
                animationDuration={900}
              />
            ) : null}
            <Brush
              dataKey="date"
              height={28}
              stroke="rgba(129,140,248,0.5)"
              fill="rgba(99,102,241,0.08)"
              travellerWidth={8}
              startIndex={brush.startIndex}
              endIndex={brush.endIndex}
              onChange={(next) => {
                if (next && typeof next === "object") {
                  setBrush({
                    startIndex: (next as { startIndex?: number }).startIndex,
                    endIndex: (next as { endIndex?: number }).endIndex,
                  });
                }
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
