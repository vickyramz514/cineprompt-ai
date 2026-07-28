"use client";

import dynamic from "next/dynamic";
import type { EtfHeatmapBasket, EtfHeatmapCell } from "@/services/datacaptain/endpoints";
import { formatPct, formatCompact } from "@/lib/heatmap/colors";
import { buildReturnHistogram } from "@/lib/heatmap/stats";

const Charts = dynamic(() => import("@/components/heatmap/HeatmapChartsInner"), {
  ssr: false,
  loading: () => <div className="h-56 animate-pulse rounded-2xl bg-white/5" />,
});

export function TopMoversTables({ cells }: { cells: EtfHeatmapCell[] }) {
  const ranked = [...cells]
    .filter((c) => c.returnPct != null)
    .sort((a, b) => (b.returnPct ?? 0) - (a.returnPct ?? 0));
  const gainers = ranked.slice(0, 5);
  const losers = [...ranked].reverse().slice(0, 5);

  const Table = ({ title, rows, tone }: { title: string; rows: EtfHeatmapCell[]; tone: string }) => (
    <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-4">
      <p className={`text-[11px] font-medium uppercase tracking-wider ${tone}`}>{title}</p>
      <table className="mt-3 w-full text-left text-sm">
        <thead className="text-[10px] uppercase tracking-wider text-white/35">
          <tr>
            <th className="pb-2 font-medium">Ticker</th>
            <th className="pb-2 font-medium">Return</th>
            <th className="pb-2 font-medium">Price</th>
            <th className="pb-2 font-medium">Volume</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {rows.map((r) => (
            <tr key={r.symbol}>
              <td className="py-1.5 font-mono text-white/85">{r.symbol}</td>
              <td className="py-1.5 tabular-nums">{formatPct(r.returnPct)}</td>
              <td className="py-1.5 tabular-nums text-white/70">
                {r.latestPrice != null ? `$${r.latestPrice.toFixed(2)}` : "—"}
              </td>
              <td className="py-1.5 tabular-nums text-white/55">{formatCompact(r.avgVolume30d)}</td>
            </tr>
          ))}
          {!rows.length && (
            <tr>
              <td colSpan={4} className="py-3 text-xs text-white/40">
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Table title="Top Gainers" rows={gainers} tone="text-emerald-300/80" />
      <Table title="Top Losers" rows={losers} tone="text-rose-300/80" />
    </div>
  );
}

export function HeatmapAnalytics({
  cells,
  baskets,
  basketId,
}: {
  cells: EtfHeatmapCell[];
  baskets: EtfHeatmapBasket[];
  basketId: string;
}) {
  const hist = buildReturnHistogram(cells, 5);
  const category =
    baskets.length > 0
      ? baskets.map((b) => ({
          name: b.label.replace(/ ETFs$/i, ""),
          value: b.symbols.length,
        }))
      : [{ name: basketId, value: cells.length }];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
          Performance distribution
        </p>
        <Charts mode="histogram" histogram={hist} category={category} />
      </div>
      <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
          Category breakdown
        </p>
        <Charts mode="category" histogram={hist} category={category} />
        <p className="mt-2 text-xs text-white/40">
          Universe size by preset basket (symbol count). Switch filters to load a category heatmap.
        </p>
      </div>
    </div>
  );
}
