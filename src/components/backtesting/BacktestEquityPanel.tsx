"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Scatter,
  ComposedChart,
  Line,
} from "recharts";
import type { BacktestResult, BacktestTradeEvent } from "@/services/datacaptain/endpoints";
import { formatPct, formatUsdPrecise, type EquityPoint } from "@/lib/backtest/metrics";
import { EQUITY_ZOOM, filterByZoom, sampleSeries, type EquityZoomId } from "@/lib/backtest/chartHelpers";

type Props = {
  result: BacktestResult;
  compareSymbol?: string | null;
  compareCurve?: EquityPoint[] | null;
};

export default function BacktestEquityPanel({ result, compareSymbol, compareCurve }: Props) {
  const [zoom, setZoom] = useState<EquityZoomId>("Max");

  const drawdownByDate = useMemo(() => {
    const src = result.drawdownCurve?.length
      ? result.drawdownCurve
      : (() => {
          let peak = result.equityCurve[0]?.value ?? 0;
          return result.equityCurve.map((p) => {
            if (p.value > peak) peak = p.value;
            return {
              date: p.date,
              drawdown: peak > 0 ? ((peak - p.value) / peak) * 100 : 0,
            };
          });
        })();
    return new Map(src.map((d) => [d.date, d.drawdown]));
  }, [result]);

  const tradesByDate = useMemo(() => {
    const m = new Map<string, BacktestTradeEvent[]>();
    for (const t of result.tradeEvents || []) {
      const list = m.get(t.date) || [];
      list.push(t);
      m.set(t.date, list);
    }
    return m;
  }, [result.tradeEvents]);

  const data = useMemo(() => {
    const filtered = filterByZoom(result.equityCurve, zoom);
    const compareMap = new Map((compareCurve || []).map((p) => [p.date, p.value]));
    const rows = filtered.map((p) => {
      const profit = p.value - result.initialInvestment;
      const cagrApprox =
        result.years && result.years > 0
          ? (Math.pow(Math.max(p.value / result.initialInvestment, 1e-12), 1 / result.years) - 1) * 100
          : result.cagr ?? result.annualReturn;
      const trades = tradesByDate.get(p.date) || [];
      const buy = trades.find((t) => t.side === "BUY");
      const sell = trades.find((t) => t.side === "SELL");
      return {
        date: p.date,
        value: p.value,
        profit,
        cagr: cagrApprox,
        drawdown: drawdownByDate.get(p.date) ?? 0,
        compare: compareMap.get(p.date) ?? null,
        buyMarker: buy ? p.value : null,
        sellMarker: sell ? p.value : null,
        trade: buy || sell || null,
      };
    });
    return sampleSeries(rows, 1800);
  }, [result, zoom, compareCurve, drawdownByDate, tradesByDate]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1">
        {EQUITY_ZOOM.map((z) => (
          <button
            key={z.id}
            type="button"
            onClick={() => setZoom(z.id)}
            className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition ${
              zoom === z.id ? "bg-violet-600 text-white" : "text-white/45 hover:bg-white/5"
            }`}
          >
            {z.id}
          </button>
        ))}
      </div>
      <div className="h-[360px] w-full sm:h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="btEquityFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
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
              tickFormatter={(v) => `$${Math.round(Number(v) / 1000)}k`}
              width={52}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const row = payload[0]?.payload as (typeof data)[number];
                return (
                  <div className="rounded-lg border border-white/15 bg-[#0b0b14]/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
                    <p className="mb-1.5 font-medium text-white/70">{label}</p>
                    <p className="tabular-nums text-indigo-200">
                      Portfolio {formatUsdPrecise(row.value)}
                    </p>
                    <p className="tabular-nums text-white/70">Profit {formatUsdPrecise(row.profit)}</p>
                    <p className="tabular-nums text-white/70">CAGR ~{formatPct(row.cagr)}</p>
                    <p className="tabular-nums text-amber-300">Drawdown {formatPct(-Math.abs(row.drawdown))}</p>
                    {row.trade && (
                      <div className="mt-1.5 border-t border-white/10 pt-1.5 text-white/65">
                        <p className={row.trade.side === "BUY" ? "text-emerald-400" : "text-rose-400"}>
                          {row.trade.side} @ {formatUsdPrecise(row.trade.price)}
                        </p>
                        <p>Shares {row.trade.shares.toFixed(4)}</p>
                        <p>Amount {formatUsdPrecise(row.trade.amount)}</p>
                      </div>
                    )}
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              name={result.symbol}
              stroke="#818cf8"
              fill="url(#btEquityFill)"
              strokeWidth={2}
              dot={false}
              isAnimationActive
              animationDuration={700}
            />
            {compareSymbol && compareCurve?.length ? (
              <Line
                type="monotone"
                dataKey="compare"
                name={compareSymbol}
                stroke="#34d399"
                strokeWidth={2}
                dot={false}
                connectNulls
              />
            ) : null}
            <Scatter dataKey="buyMarker" fill="#34d399" name="Buy" />
            <Scatter dataKey="sellMarker" fill="#fb7185" name="Sell" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[10px] text-white/30">
        Green dots = buys · Red dots = sells · Zoom filters the visible window without reloading.
      </p>
    </div>
  );
}
