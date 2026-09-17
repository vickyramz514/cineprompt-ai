"use client";

import Link from "next/link";
import type { EtfHeatmapCell } from "@/services/datacaptain/endpoints";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState";
import { returnToColor, formatPct } from "@/lib/heatmap/colors";

export default function HeatmapPreview({
  cells,
  loading,
  hasKey = true,
}: {
  cells: EtfHeatmapCell[];
  loading?: boolean;
  hasKey?: boolean;
}) {
  const top = cells.slice(0, 15);

  return (
    <section className="rounded-2xl border border-white/10 bg-[#0c0c14]/80 p-5 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-white/40">ETF Performance Heatmap</p>
          <h3 className="mt-0.5 text-lg font-semibold">Top 15 pulse</h3>
        </div>
        <Link
          href="/dashboard/etf/heatmap"
          className="rounded-lg border border-violet-500/30 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-violet-200 hover:bg-violet-500/25"
        >
          Open Full Heatmap →
        </Link>
      </div>
      {loading ? (
        <div className="mt-4 grid grid-cols-3 gap-1.5 sm:grid-cols-5">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-white/5" />
          ))}
        </div>
      ) : top.length ? (
        <div className="mt-4 grid grid-cols-3 gap-1.5 sm:grid-cols-5">
          {top.map((c) => (
            <Link
              key={c.symbol}
              href={`/dashboard/etf/${c.symbol}`}
              className="rounded-lg p-2.5 transition hover:scale-[1.03] hover:ring-1 hover:ring-white/30"
              style={{ backgroundColor: returnToColor(c.returnPct) }}
            >
              <p className="font-mono text-xs font-bold text-white drop-shadow">{c.symbol}</p>
              <p className="text-[11px] font-semibold tabular-nums text-white/95">{formatPct(c.returnPct)}</p>
            </Link>
          ))}
        </div>
      ) : (
        <DashboardEmptyState
          className="mt-4"
          title={hasKey ? "No heatmap data yet" : "API key required for heatmap"}
          description={
            hasKey
              ? "Heatmap needs ETF returns from your key. Open the full heatmap or make a screener call first."
              : "Add your API key, then the broad-market pulse will load here."
          }
          primaryHref={hasKey ? "/dashboard/etf/heatmap" : "/dashboard/api-keys"}
          primaryLabel={hasKey ? "Open heatmap" : "Get API key"}
          secondaryHref="/dashboard/api-explorer"
          secondaryLabel="API explorer"
        />
      )}
    </section>
  );
}
