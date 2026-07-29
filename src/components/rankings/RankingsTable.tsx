"use client";

import Link from "next/link";
import type { EtfRankingsRow } from "@/services/datacaptain/endpoints";
import ScreenerSparkline from "@/components/screener/ScreenerSparkline";
import { formatPct, formatScore, scoreLabel } from "@/lib/rankings/helpers";

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span
        className="inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-600 text-xs font-bold text-black shadow"
        title="1st"
      >
        1
      </span>
    );
  }
  if (rank === 2) {
    return (
      <span
        className="inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-400 text-xs font-bold text-black shadow"
        title="2nd"
      >
        2
      </span>
    );
  }
  if (rank === 3) {
    return (
      <span
        className="inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-full bg-gradient-to-br from-orange-300 to-orange-700 text-xs font-bold text-black shadow"
        title="3rd"
      >
        3
      </span>
    );
  }
  if (rank <= 10) {
    return (
      <span className="inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-full border border-violet-400/40 bg-violet-500/20 px-1.5 text-xs font-semibold text-violet-200">
        {rank}
      </span>
    );
  }
  return <span className="tabular-nums text-white/40">{rank}</span>;
}

function Movement({ delta }: { delta: number | null | undefined }) {
  if (delta == null || delta === 0) {
    return <span className="text-[10px] text-white/30">—</span>;
  }
  if (delta > 0) {
    return <span className="text-[10px] font-medium text-emerald-400">↑{delta}</span>;
  }
  return <span className="text-[10px] font-medium text-rose-400">↓{Math.abs(delta)}</span>;
}

type Props = {
  rows: EtfRankingsRow[];
  loading: boolean;
  metric: string;
  sort: string;
  sortDir: "asc" | "desc";
  onSort: (col: string) => void;
  selected: Set<string>;
  onToggleSelect: (symbol: string) => void;
  onSelectAll: (on: boolean) => void;
  favorites: Set<string>;
  onToggleFavorite: (symbol: string) => void;
  onOpen: (row: EtfRankingsRow) => void;
};

const SORTABLE = new Set([
  "rank",
  "symbol",
  "name",
  "price",
  "category",
  "aum",
  "expense",
  "cagr",
  "sharpe",
  "score",
]);

export default function RankingsTable({
  rows,
  loading,
  metric,
  sort,
  sortDir,
  onSort,
  selected,
  onToggleSelect,
  onSelectAll,
  favorites,
  onToggleFavorite,
  onOpen,
}: Props) {
  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.symbol));
  const arrow = (col: string) => (sort === col ? (sortDir === "asc" ? " ↑" : " ↓") : "");

  const Th = ({ id, label, align }: { id: string; label: string; align?: "right" }) => (
    <th
      className={`whitespace-nowrap px-3 py-3 ${align === "right" ? "text-right" : ""} ${
        SORTABLE.has(id) ? "cursor-pointer hover:text-white" : ""
      }`}
      onClick={() => SORTABLE.has(id) && onSort(id)}
    >
      {label}
      {arrow(id)}
    </th>
  );

  return (
    <>
      <div className="hidden overflow-auto rounded-2xl border border-white/10 md:block" style={{ maxHeight: "70vh" }}>
        <table className="w-full min-w-[1200px] border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 border-b border-white/10 bg-[#0f0f18]/95 text-[10px] uppercase tracking-wider text-white/45 backdrop-blur">
            <tr>
              <th className="px-3 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  aria-label="Select all"
                />
              </th>
              <Th id="rank" label="#" />
              <th className="px-3 py-3">Δ</th>
              <Th id="symbol" label="Ticker" />
              <Th id="name" label="ETF Name" />
              <th className="px-3 py-3">Trend</th>
              <Th id="price" label="Price" align="right" />
              <Th id="category" label="Category" />
              <Th id="score" label={scoreLabel(metric)} align="right" />
              <Th id="cagr" label="CAGR" align="right" />
              <Th id="sharpe" label="Sharpe" align="right" />
              <Th id="expense" label="Expense" align="right" />
              <Th id="aum" label="AUM" align="right" />
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td colSpan={14} className="px-3 py-3">
                    <div className="h-8 animate-pulse rounded-lg bg-white/5" />
                  </td>
                </tr>
              ))}
            {!loading &&
              rows.map((row) => (
                <tr
                  key={row.symbol}
                  className="group border-b border-white/5 transition hover:bg-white/[0.03]"
                  onClick={() => onOpen(row)}
                >
                  <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected.has(row.symbol)}
                      onChange={() => onToggleSelect(row.symbol)}
                      aria-label={`Select ${row.symbol}`}
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    <RankBadge rank={row.rank} />
                  </td>
                  <td className="px-3 py-2.5">
                    <Movement delta={row.rankDelta} />
                  </td>
                  <td className="px-3 py-2.5 font-mono font-semibold text-violet-300">{row.symbol}</td>
                  <td className="max-w-[180px] truncate px-3 py-2.5 text-white/70" title={row.name}>
                    {row.name}
                  </td>
                  <td className="px-3 py-2.5">
                    <ScreenerSparkline data={row.sparkline} />
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums">
                    {row.latestPrice != null ? `$${row.latestPrice.toFixed(2)}` : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-white/60">{row.category ?? "—"}</td>
                  <td className="px-3 py-2.5 text-right font-medium tabular-nums text-white">
                    {formatScore(row, metric)}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{formatPct(row.cagr)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">
                    {row.sharpeRatio != null ? row.sharpeRatio.toFixed(2) : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums">
                    {row.expenseRatio != null ? `${row.expenseRatio}%` : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums">
                    {row.aumBillions != null ? `$${row.aumBillions}B` : "—"}
                  </td>
                  <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-wrap gap-1 opacity-80 group-hover:opacity-100">
                      <Link
                        href="/dashboard/backtesting"
                        className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] text-emerald-200"
                      >
                        Backtest
                      </Link>
                      <Link
                        href="/dashboard/etf/heatmap"
                        className="rounded bg-violet-500/15 px-1.5 py-0.5 text-[10px] text-violet-200"
                      >
                        Heatmap
                      </Link>
                      <Link
                        href={`/dashboard/etf/${row.symbol}`}
                        className="rounded bg-cyan-500/15 px-1.5 py-0.5 text-[10px] text-cyan-200"
                      >
                        Explorer
                      </Link>
                      <Link href="/docs" className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-white/70">
                        API
                      </Link>
                      <button
                        type="button"
                        onClick={() => onToggleFavorite(row.symbol)}
                        className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-amber-200"
                      >
                        {favorites.has(row.symbol) ? "★" : "☆"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/5" />
          ))}
        {!loading &&
          rows.map((row) => (
            <button
              key={row.symbol}
              type="button"
              onClick={() => onOpen(row)}
              className="w-full rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-4 text-left"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <RankBadge rank={row.rank} />
                  <div>
                    <p className="font-mono text-lg font-bold text-violet-300">{row.symbol}</p>
                    <p className="line-clamp-1 text-xs text-white/50">{row.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold tabular-nums">{formatScore(row, metric)}</p>
                  <Movement delta={row.rankDelta} />
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <ScreenerSparkline data={row.sparkline} />
                <span className="text-xs text-white/45">{row.category}</span>
              </div>
            </button>
          ))}
      </div>
    </>
  );
}
