"use client";

import type { HeatmapStats } from "@/lib/heatmap/stats";
import { formatPct } from "@/lib/heatmap/colors";

export default function HeatmapSummary({ stats }: { stats: HeatmapStats }) {
  const cards = [
    {
      label: "Best Performing",
      value: stats.best ? `${stats.best.symbol} ${formatPct(stats.best.returnPct)}` : "—",
      accent: "text-emerald-300",
    },
    {
      label: "Worst Performing",
      value: stats.worst ? `${stats.worst.symbol} ${formatPct(stats.worst.returnPct)}` : "—",
      accent: "text-rose-300",
    },
    { label: "Average Return", value: formatPct(stats.avgReturn), accent: "text-indigo-300" },
    { label: "Median Return", value: formatPct(stats.medianReturn), accent: "text-cyan-300" },
    { label: "ETFs", value: String(stats.count), accent: "text-white" },
    { label: "Green / Red", value: `${stats.greenCount} / ${stats.redCount}`, accent: "text-white" },
    {
      label: "Largest ETF",
      value: stats.largest
        ? `${stats.largest.symbol}${stats.largest.aumBillions != null ? ` · $${stats.largest.aumBillions}B` : ""}`
        : "—",
      accent: "text-amber-300",
    },
    {
      label: "Highest Gain / Loss",
      value: `${formatPct(stats.highestGain)} / ${formatPct(stats.largestLoss)}`,
      accent: "text-white/80",
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

export function MarketStatStrip({ stats }: { stats: HeatmapStats }) {
  const items = [
    ["Avg", formatPct(stats.avgReturn)],
    ["Median", formatPct(stats.medianReturn)],
    ["Positive", String(stats.greenCount)],
    ["Negative", String(stats.redCount)],
    ["Gain", formatPct(stats.highestGain)],
    ["Loss", formatPct(stats.largestLoss)],
    ["Total", String(stats.count)],
  ];
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
      {items.map(([k, v]) => (
        <div key={k} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-center">
          <p className="text-[10px] uppercase tracking-wider text-white/40">{k}</p>
          <p className="mt-0.5 text-sm font-semibold tabular-nums text-white/85">{v}</p>
        </div>
      ))}
    </div>
  );
}
