"use client";

import Link from "next/link";
import type { EtfScreenerRow } from "@/services/datacaptain/endpoints";
import { formatCompact, formatPct } from "@/lib/screener/presets";
import ScreenerSparkline from "./ScreenerSparkline";

type Col = { id: string; label: string; align?: "right" | "left" };

const COLS: Col[] = [
  { id: "symbol", label: "Ticker" },
  { id: "name", label: "ETF Name" },
  { id: "spark", label: "Trend" },
  { id: "category", label: "Category" },
  { id: "issuer", label: "Issuer" },
  { id: "price", label: "Price", align: "right" },
  { id: "return1d", label: "1D", align: "right" },
  { id: "return1m", label: "1M", align: "right" },
  { id: "returnYtd", label: "YTD", align: "right" },
  { id: "return1y", label: "1Y", align: "right" },
  { id: "return3y", label: "3Y", align: "right" },
  { id: "return5y", label: "5Y", align: "right" },
  { id: "cagr", label: "CAGR", align: "right" },
  { id: "yield", label: "Div Yield", align: "right" },
  { id: "expense", label: "Expense", align: "right" },
  { id: "aum", label: "AUM", align: "right" },
  { id: "volume", label: "Volume", align: "right" },
  { id: "volatility", label: "Vol", align: "right" },
  { id: "sharpe", label: "Sharpe", align: "right" },
  { id: "actions", label: "Actions" },
];

const SORT_MAP: Record<string, string> = {
  symbol: "symbol",
  name: "name",
  price: "price",
  returnYtd: "return",
  return1y: "return",
  return3y: "return",
  return5y: "return",
  cagr: "return",
  yield: "yield",
  expense: "expense",
  aum: "aum",
  volume: "volume",
  volatility: "volatility",
  sharpe: "sharpe",
  issuer: "issuer",
  category: "category",
};

function Badge({ label }: { label: string }) {
  const tone = label.includes("Leveraged")
    ? "border-amber-400/40 bg-amber-500/15 text-amber-200"
    : label.includes("Inverse")
      ? "border-rose-400/40 bg-rose-500/15 text-rose-200"
      : label.includes("Dividend")
        ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-200"
        : "border-white/15 bg-white/5 text-white/65";
  return (
    <span className={`mr-1 inline-block rounded-full border px-1.5 py-0.5 text-[9px] font-medium ${tone}`}>
      {label}
    </span>
  );
}

type Props = {
  rows: EtfScreenerRow[];
  loading: boolean;
  sort: string;
  sortDir: "asc" | "desc";
  onSort: (sort: string) => void;
  selected: Set<string>;
  onToggleSelect: (symbol: string) => void;
  onSelectAll: (on: boolean) => void;
  favorites: Set<string>;
  onToggleFavorite: (symbol: string) => void;
  onOpen: (row: EtfScreenerRow) => void;
  onCompareAdd: (row: EtfScreenerRow) => void;
};

export default function ScreenerTable({
  rows,
  loading,
  sort,
  sortDir,
  onSort,
  selected,
  onToggleSelect,
  onSelectAll,
  favorites,
  onToggleFavorite,
  onOpen,
  onCompareAdd,
}: Props) {
  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.symbol));

  const headerClick = (colId: string) => {
    const mapped = SORT_MAP[colId];
    if (!mapped) return;
    onSort(mapped);
  };

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-auto rounded-2xl border border-white/10 md:block" style={{ maxHeight: "70vh" }}>
        <table className="w-full min-w-[1400px] border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 border-b border-white/10 bg-[#0f0f18]/95 text-[10px] uppercase tracking-wider text-white/45 backdrop-blur">
            <tr>
              <th className="sticky left-0 z-20 bg-[#0f0f18]/95 px-3 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  aria-label="Select all"
                />
              </th>
              {COLS.map((c) => (
                <th
                  key={c.id}
                  className={`whitespace-nowrap px-3 py-3 ${c.align === "right" ? "text-right" : ""} ${
                    SORT_MAP[c.id] ? "cursor-pointer hover:text-white" : ""
                  } ${c.id === "symbol" ? "sticky left-8 z-20 bg-[#0f0f18]/95" : ""}`}
                  onClick={() => headerClick(c.id)}
                  style={{ minWidth: c.id === "name" ? 160 : c.id === "actions" ? 200 : 72 }}
                >
                  {c.label}
                  {SORT_MAP[c.id] === sort ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td colSpan={COLS.length + 1} className="px-3 py-3">
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
                  <td className="sticky left-0 bg-[#0c0c14]/90 px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected.has(row.symbol)}
                      onChange={() => onToggleSelect(row.symbol)}
                      aria-label={`Select ${row.symbol}`}
                    />
                  </td>
                  <td className="sticky left-8 bg-[#0c0c14]/90 px-3 py-2.5 font-mono font-semibold text-cyan-300">
                    {row.symbol}
                  </td>
                  <td className="max-w-[180px] truncate px-3 py-2.5 text-white/70" title={row.name}>
                    {row.name}
                    <div className="mt-0.5">
                      {(row.badges || []).slice(0, 2).map((b) => (
                        <Badge key={b} label={b} />
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <ScreenerSparkline data={row.sparkline} />
                  </td>
                  <td className="px-3 py-2.5 text-white/60">{row.category ?? "—"}</td>
                  <td className="px-3 py-2.5 text-white/60">{row.issuer ?? "—"}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">
                    {row.latestPrice != null ? `$${row.latestPrice.toFixed(2)}` : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{formatPct(row.return1d)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{formatPct(row.return1m)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{formatPct(row.returnYtd)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{formatPct(row.return1y)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{formatPct(row.return3y)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{formatPct(row.return5y)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{formatPct(row.cagr)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{formatPct(row.dividendYieldTtm)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">
                    {row.expenseRatio != null ? `${row.expenseRatio}%` : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums">
                    {row.aumBillions != null ? `$${row.aumBillions}B` : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{formatCompact(row.avgVolume30d)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{formatPct(row.volatility1y)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">
                    {row.sharpeRatio != null ? row.sharpeRatio.toFixed(2) : "—"}
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
                        href={`/dashboard/etf/${row.symbol}`}
                        className="rounded bg-violet-500/15 px-1.5 py-0.5 text-[10px] text-violet-200"
                      >
                        Explorer
                      </Link>
                      <button
                        type="button"
                        onClick={() => onCompareAdd(row)}
                        className="rounded bg-cyan-500/15 px-1.5 py-0.5 text-[10px] text-cyan-200"
                      >
                        Compare
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleFavorite(row.symbol)}
                        className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-amber-200"
                        aria-label={favorites.has(row.symbol) ? "Unfavorite" : "Favorite"}
                      >
                        {favorites.has(row.symbol) ? "★" : "☆"}
                      </button>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard?.writeText(row.symbol)}
                        className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-white/70"
                      >
                        Copy
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
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
                <div>
                  <p className="font-mono text-lg font-bold text-cyan-300">{row.symbol}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-white/55">{row.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold tabular-nums">
                    {formatPct(row.returnPct ?? row.return1y)}
                  </p>
                  <ScreenerSparkline data={row.sparkline} />
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {(row.badges || []).slice(0, 3).map((b) => (
                  <Badge key={b} label={b} />
                ))}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-white/55">
                <span>Yield {formatPct(row.dividendYieldTtm)}</span>
                <span>Vol {formatPct(row.volatility1y)}</span>
                <span>
                  {row.latestPrice != null ? `$${row.latestPrice.toFixed(2)}` : "—"}
                </span>
              </div>
            </button>
          ))}
      </div>
    </>
  );
}
