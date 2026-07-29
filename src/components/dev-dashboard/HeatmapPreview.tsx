"use client";

import Link from "next/link";
import type { EtfHeatmapCell } from "@/services/datacaptain/endpoints";
import { returnToColor, formatPct } from "@/lib/heatmap/colors";

export default function HeatmapPreview({
  cells,
  loading,
}: {
  cells: EtfHeatmapCell[];
  loading?: boolean;
}) {
  const top = cells.slice(0, 12);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/80 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-white/40">ETF Heatmap</p>
          <h3 className="mt-0.5 text-lg font-semibold">Preview</h3>
        </div>
        <Link href="/dashboard/etf/heatmap" className="text-xs text-violet-300 hover:underline">
          Open full →
        </Link>
      </div>
      {loading ? (
        <div className="mt-4 grid grid-cols-4 gap-1.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-3 gap-1.5 sm:grid-cols-4">
          {top.map((c) => (
            <Link
              key={c.symbol}
              href="/dashboard/etf/heatmap"
              className="rounded-lg p-2 transition hover:scale-[1.03]"
              style={{ backgroundColor: returnToColor(c.returnPct) }}
            >
              <p className="font-mono text-xs font-bold text-white">{c.symbol}</p>
              <p className="text-[10px] tabular-nums text-white/90">{formatPct(c.returnPct)}</p>
            </Link>
          ))}
          {!top.length && <p className="col-span-full text-xs text-white/40">No heatmap data yet.</p>}
        </div>
      )}
    </div>
  );
}
