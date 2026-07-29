"use client";

import type { RankingsStats } from "@/lib/rankings/helpers";
import { formatPct } from "@/lib/rankings/helpers";

export default function RankingsSummaryCards({ stats }: { stats: RankingsStats }) {
  const cards = [
    {
      label: "Top ETF",
      value: stats.top ? `${stats.top.symbol} · #${stats.top.rank}` : "—",
      accent: "text-amber-300",
    },
    {
      label: "Average Return",
      value: formatPct(stats.avgReturn),
      accent: "text-indigo-300",
    },
    {
      label: "Highest Dividend",
      value: stats.highestDividend
        ? `${stats.highestDividend.symbol} ${formatPct(stats.highestDividend.dividendYieldTtm)}`
        : "—",
      accent: "text-emerald-300",
    },
    {
      label: "Lowest Volatility",
      value: stats.lowestVol
        ? `${stats.lowestVol.symbol} ${formatPct(stats.lowestVol.volatility1y)}`
        : "—",
      accent: "text-cyan-300",
    },
    {
      label: "Total ETFs",
      value: String(stats.total),
      accent: "text-white",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl border border-white/10 bg-black/30 p-4 shadow-[0_8px_28px_-18px_rgba(0,0,0,0.55)]"
        >
          <p className="text-[11px] uppercase tracking-wider text-white/40">{c.label}</p>
          <p className={`mt-1.5 text-lg font-semibold tabular-nums ${c.accent}`}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}
