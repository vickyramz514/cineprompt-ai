"use client";

import type { ScreenerStats } from "@/lib/screener/presets";
import { formatPct } from "@/lib/screener/presets";

export default function ScreenerSummaryCards({
  stats,
  total,
}: {
  stats: ScreenerStats;
  total: number;
}) {
  const cards = [
    { label: "Matching ETFs", value: String(total), accent: "text-white" },
    { label: "Average Return", value: formatPct(stats.avgReturn), accent: "text-indigo-300" },
    { label: "Avg Dividend Yield", value: formatPct(stats.avgYield), accent: "text-amber-300" },
    { label: "Avg Volatility", value: formatPct(stats.avgVol), accent: "text-rose-300" },
    {
      label: "Highest Return",
      value: stats.highestReturn
        ? `${stats.highestReturn.symbol} ${formatPct(stats.highestReturn.returnPct ?? stats.highestReturn.return1y)}`
        : "—",
      accent: "text-emerald-300",
    },
    {
      label: "Highest Dividend",
      value: stats.highestYield
        ? `${stats.highestYield.symbol} ${formatPct(stats.highestYield.dividendYieldTtm)}`
        : "—",
      accent: "text-cyan-300",
    },
    {
      label: "Lowest Expense",
      value: stats.lowestExpense
        ? `${stats.lowestExpense.symbol} ${stats.lowestExpense.expenseRatio ?? "—"}%`
        : "—",
      accent: "text-violet-300",
    },
    {
      label: "Largest AUM",
      value: stats.largestAum
        ? `${stats.largestAum.symbol}${stats.largestAum.aumBillions != null ? ` · $${stats.largestAum.aumBillions}B` : ""}`
        : "—",
      accent: "text-sky-300",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl border border-white/10 bg-black/30 p-4 shadow-[0_8px_28px_-18px_rgba(0,0,0,0.6)]"
        >
          <p className="text-[11px] uppercase tracking-wider text-white/40">{c.label}</p>
          <p className={`mt-1.5 text-lg font-semibold tabular-nums ${c.accent}`}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}
