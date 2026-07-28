"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { EtfHeatmapCell } from "@/services/datacaptain/endpoints";
import { formatPct, formatCompact } from "@/lib/heatmap/colors";

const MiniChart = dynamic(() => import("@/components/heatmap/HeatmapMiniChart"), {
  ssr: false,
  loading: () => <div className="h-40 animate-pulse rounded-xl bg-white/5" />,
});

export default function EtfDrawer({
  cell,
  onClose,
}: {
  cell: EtfHeatmapCell | null;
  apiKey: string | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<Array<{ date: string; close: number }>>([]);

  useEffect(() => {
    if (!cell) {
      setHistory([]);
      return;
    }
    setHistory(
      (cell.sparkline || []).map((close, i) => ({
        date: `t${i}`,
        close,
      }))
    );
  }, [cell]);

  useEffect(() => {
    if (!cell) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cell, onClose]);

  if (!cell) return null;

  const copySymbol = async () => {
    await navigator.clipboard?.writeText(cell.symbol);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <button type="button" className="absolute inset-0 bg-black/60" aria-label="Close drawer" onClick={onClose} />
      <aside
        className="relative flex h-full w-full max-w-md animate-[fadeIn_0.2s_ease] flex-col overflow-y-auto border-l border-white/10 bg-[#0b0b14] shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={`${cell.symbol} details`}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-white/10 bg-[#0b0b14]/95 px-5 py-4 backdrop-blur">
          <div>
            <p className="font-mono text-2xl font-bold text-emerald-300">{cell.symbol}</p>
            <p className="mt-1 text-sm text-white/60">{cell.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-white/50 hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <p className="text-[10px] uppercase text-white/40">Price</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {cell.latestPrice != null ? `$${cell.latestPrice.toFixed(2)}` : "—"}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <p className="text-[10px] uppercase text-white/40">Performance</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">{formatPct(cell.returnPct)}</p>
            </div>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wider text-white/40">Performance</p>
            <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
              {[
                ["1D", cell.return1d],
                ["1W", cell.return1w],
                ["1M", cell.return1m],
                ["YTD", cell.returnYtd],
                ["1Y", cell.return1y],
                ["3Y", cell.return3y],
                ["5Y", cell.return5y],
                ["Max", cell.returnMax],
              ].map(([k, v]) => (
                <div key={String(k)} className="rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2">
                  <dt className="text-[10px] text-white/40">{k}</dt>
                  <dd className="tabular-nums text-white/85">{formatPct(v as number | null)}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg border border-white/10 bg-black/25 px-3 py-2">
              <p className="text-[10px] text-white/40">Expense ratio</p>
              <p className="tabular-nums">{cell.expenseRatio != null ? `${cell.expenseRatio}%` : "—"}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/25 px-3 py-2">
              <p className="text-[10px] text-white/40">Dividend yield</p>
              <p className="tabular-nums">
                {cell.dividendYieldTtm != null ? `${cell.dividendYieldTtm.toFixed(2)}%` : "—"}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/25 px-3 py-2">
              <p className="text-[10px] text-white/40">AUM (est.)</p>
              <p className="tabular-nums">
                {cell.aumBillions != null ? `$${cell.aumBillions}B` : "—"}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/25 px-3 py-2">
              <p className="text-[10px] text-white/40">Avg volume</p>
              <p className="tabular-nums">{formatCompact(cell.avgVolume30d)}</p>
            </div>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wider text-white/40">Description</p>
            <p className="mt-2 text-sm text-white/60">
              {cell.name}
              {cell.assetClass ? ` · ${cell.assetClass}` : ""}. Heatmap colors and sizing use Data
              Captain returns plus estimated AUM where available.
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wider text-white/40">Top holdings</p>
            <p className="mt-2 text-sm text-white/45">
              Holdings are not in the current metrics dataset. Use ETF Explorer for deeper research.
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wider text-white/40">Sector allocation</p>
            <p className="mt-2 text-sm text-white/45">
              Sector weights unavailable in this view. Filter by Technology, Healthcare, Energy, and
              other sector baskets on the heatmap.
            </p>
          </div>

          <div>
            <p className="mb-2 text-[11px] uppercase tracking-wider text-white/40">Performance chart</p>
            <MiniChart data={history} />
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard/backtesting"
              className="rounded-lg bg-emerald-500/20 px-3 py-2 text-xs font-medium text-emerald-200 hover:bg-emerald-500/30"
            >
              Run Backtest
            </Link>
            <Link
              href={`/dashboard/etf/${cell.symbol}`}
              className="rounded-lg bg-violet-500/20 px-3 py-2 text-xs font-medium text-violet-200 hover:bg-violet-500/30"
            >
              View ETF Explorer
            </Link>
            <Link
              href="/docs"
              className="rounded-lg border border-white/15 px-3 py-2 text-xs font-medium text-white/70 hover:bg-white/5"
            >
              API Docs
            </Link>
            <Link
              href="/dashboard/etf/rankings"
              className="rounded-lg border border-white/15 px-3 py-2 text-xs font-medium text-white/70 hover:bg-white/5"
            >
              ETF Rankings
            </Link>
            <button
              type="button"
              onClick={copySymbol}
              className="rounded-lg border border-white/15 px-3 py-2 text-xs font-medium text-white/70 hover:bg-white/5"
            >
              {copied ? "Copied" : "Copy Symbol"}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
