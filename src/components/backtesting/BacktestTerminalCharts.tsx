"use client";

import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BacktestResult } from "@/services/datacaptain/endpoints";
import {
  derivePortfolioStats,
  formatPct,
  formatUsdPrecise,
  type EquityPoint,
  type MonthCell,
} from "@/lib/backtest/metrics";
import { todayPortfolioChange } from "@/lib/backtest/chartHelpers";
import {
  exportBacktestCsv,
  exportBacktestJson,
  exportBacktestPdf,
} from "@/lib/backtest/export";
import BacktestEquityPanel from "@/components/backtesting/BacktestEquityPanel";
import BacktestDrawdownPanel from "@/components/backtesting/BacktestDrawdownPanel";
import BacktestLwcPanel from "@/components/backtesting/BacktestLwcPanel";
import MonthlyReturnsHeatmap from "@/components/backtesting/MonthlyReturnsHeatmap";

const TABS = [
  { id: "equity", label: "Equity Curve" },
  { id: "price", label: "Price Chart" },
  { id: "candle", label: "Candlestick" },
  { id: "drawdown", label: "Drawdown" },
  { id: "monthly", label: "Monthly Returns" },
] as const;

type TabId = (typeof TABS)[number]["id"];

type Props = {
  result: BacktestResult;
  compareResult?: BacktestResult | null;
  beta?: number | null;
  monthlyCells?: MonthCell[];
};

export default function BacktestTerminalCharts({
  result,
  compareResult,
  beta,
  monthlyCells,
}: Props) {
  const [tab, setTab] = useState<TabId>("equity");
  const chartHostRef = useRef<HTMLDivElement | null>(null);
  const stats = useMemo(() => derivePortfolioStats(result), [result]);
  const day = todayPortfolioChange(result);
  const cagr = result.cagr ?? result.annualReturn;

  const header = [
    { label: "Portfolio value", value: formatUsdPrecise(result.finalValue) },
    {
      label: "Total return",
      value: formatPct(result.totalReturn),
      tone: result.totalReturn >= 0,
    },
    { label: "CAGR", value: formatPct(cagr), tone: cagr >= 0 },
    {
      label: "Today's change",
      value:
        day.change != null
          ? `${formatUsdPrecise(day.change)} (${formatPct(day.pct ?? 0)})`
          : "—",
      tone: (day.pct ?? 0) >= 0,
    },
    {
      label: "Max drawdown",
      value: formatPct(-Math.abs(result.maxDrawdown)),
      tone: false,
    },
    {
      label: "Volatility",
      value: result.volatility != null ? `${result.volatility}%` : "—",
    },
    { label: "Sharpe", value: result.sharpe != null ? String(result.sharpe) : "—" },
    { label: "Sortino", value: result.sortino != null ? String(result.sortino) : "—" },
    {
      label: "Beta",
      value: beta != null ? String(beta) : compareResult ? "—" : "Compare to compute",
    },
  ];

  const exportPng = async () => {
    const host = chartHostRef.current;
    if (!host) return;
    // Prefer lightweight-charts canvas if present
    const canvas = host.querySelector("canvas");
    if (canvas) {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${result.symbol}-backtest-chart.png`;
        a.click();
        URL.revokeObjectURL(url);
      });
      return;
    }
    // Fallback: open print-friendly PDF which users can save as image/PDF
    exportBacktestPdf(result);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a12] shadow-[0_12px_40px_-24px_rgba(99,102,241,0.35)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-violet-300/80">
            Research terminal
          </p>
          <h3 className="mt-0.5 font-mono text-xl font-bold text-white">
            {result.symbol}
            {compareResult ? (
              <span className="text-white/40"> vs {compareResult.symbol}</span>
            ) : null}
          </h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => void exportPng()}
            className="rounded-lg border border-white/15 px-2.5 py-1 text-[11px] text-white/65 hover:bg-white/5"
          >
            PNG
          </button>
          <button
            type="button"
            onClick={() => exportBacktestCsv(result, compareResult)}
            className="rounded-lg border border-white/15 px-2.5 py-1 text-[11px] text-white/65 hover:bg-white/5"
          >
            CSV
          </button>
          <button
            type="button"
            onClick={() => exportBacktestJson(result, compareResult)}
            className="rounded-lg border border-white/15 px-2.5 py-1 text-[11px] text-white/65 hover:bg-white/5"
          >
            JSON
          </button>
          <button
            type="button"
            onClick={() => exportBacktestPdf(result)}
            className="rounded-lg border border-white/15 px-2.5 py-1 text-[11px] text-white/65 hover:bg-white/5"
          >
            PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px border-b border-white/10 bg-white/5 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9">
        {header.map((h) => (
          <div key={h.label} className="bg-[#0a0a12] px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-white/35">{h.label}</p>
            <p
              className={`mt-0.5 text-sm font-semibold tabular-nums ${
                h.tone === true
                  ? "text-emerald-400"
                  : h.tone === false
                    ? "text-rose-400"
                    : "text-white"
              }`}
            >
              {h.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-white/10 px-2 py-2 sm:px-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              tab === t.id
                ? "bg-violet-600 text-white"
                : "text-white/45 hover:bg-white/5 hover:text-white/80"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div ref={chartHostRef} className="overflow-x-auto p-3 sm:p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
          >
            {tab === "equity" && (
              <BacktestEquityPanel
                result={result}
                compareSymbol={compareResult?.symbol}
                compareCurve={compareResult?.equityCurve as EquityPoint[] | undefined}
              />
            )}
            {tab === "price" && <BacktestLwcPanel result={result} mode="price" />}
            {tab === "candle" && <BacktestLwcPanel result={result} mode="candle" />}
            {tab === "drawdown" && <BacktestDrawdownPanel result={result} />}
            {tab === "monthly" && (
              <MonthlyReturnsHeatmap
                cells={monthlyCells ?? stats.monthlyCells}
                embedded
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="border-t border-white/10 px-4 py-2 text-[10px] text-white/30 sm:px-5">
        {(result.tradeEvents?.length ?? 0) > 0
          ? `${result.tradeEvents!.length} trade markers`
          : "No trade events"}
        {" · "}
        {(result.dividendEvents?.length ?? 0) > 0
          ? `${result.dividendEvents!.length} dividend events`
          : "No dividends in range"}
        {" · "}
        Double-click chart to reset zoom
      </div>
    </div>
  );
}
