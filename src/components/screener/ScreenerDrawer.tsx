"use client";

import Link from "next/link";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import type { EtfScreenerRow } from "@/services/datacaptain/endpoints";
import { formatCompact, formatPct } from "@/lib/screener/presets";

const MiniChart = dynamic(() => import("@/components/heatmap/HeatmapMiniChart"), {
  ssr: false,
  loading: () => <div className="h-40 animate-pulse rounded-xl bg-white/5" />,
});

export default function ScreenerDrawer({
  row,
  onClose,
}: {
  row: EtfScreenerRow | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!row) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [row, onClose]);

  if (!row) return null;

  const history = (row.sparkline || []).map((close, i) => ({ date: `t${i}`, close }));

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <button type="button" className="absolute inset-0 bg-black/60" aria-label="Close drawer" onClick={onClose} />
      <aside
        className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-white/10 bg-[#0b0b14] shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={`${row.symbol} details`}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-white/10 bg-[#0b0b14]/95 px-5 py-4 backdrop-blur">
          <div>
            <p className="font-mono text-2xl font-bold text-cyan-300">{row.symbol}</p>
            <p className="mt-1 text-sm text-white/60">{row.name}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-white/50 hover:bg-white/10" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          <div className="flex flex-wrap gap-1.5">
            {(row.badges || []).map((b) => (
              <span key={b} className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] text-white/70">
                {b}
              </span>
            ))}
          </div>

          <p className="text-sm text-white/60">
            {row.name}
            {row.issuer ? ` · Issuer: ${row.issuer}` : ""}. Category: {row.category ?? "—"}.{" "}
            {row.country ?? "US"} / {row.currency ?? "USD"}.
          </p>

          <dl className="grid grid-cols-2 gap-2 text-sm">
            {[
              ["Price", row.latestPrice != null ? `$${row.latestPrice.toFixed(2)}` : "—"],
              ["1Y Return", formatPct(row.return1y)],
              ["Expense", row.expenseRatio != null ? `${row.expenseRatio}%` : "—"],
              ["Div Yield", formatPct(row.dividendYieldTtm)],
              ["AUM", row.aumBillions != null ? `$${row.aumBillions}B` : "—"],
              ["Volume", formatCompact(row.avgVolume30d)],
              ["Volatility", formatPct(row.volatility1y)],
              ["Sharpe", row.sharpeRatio != null ? row.sharpeRatio.toFixed(2) : "—"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-white/10 bg-black/25 px-3 py-2">
                <dt className="text-[10px] uppercase text-white/40">{k}</dt>
                <dd className="mt-0.5 tabular-nums text-white/85">{v}</dd>
              </div>
            ))}
          </dl>

          <div>
            <p className="text-[11px] uppercase tracking-wider text-white/40">Risk rating</p>
            <p className="mt-1 text-sm text-white/65">
              {row.leveraged || row.inverse
                ? "Elevated — leveraged/inverse products can move sharply vs underlying markets."
                : row.volatility1y != null && row.volatility1y > 25
                  ? "Higher volatility vs broad market ETFs."
                  : "Moderate — typical broad/sector ETF risk profile (estimate)."}
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wider text-white/40">Holdings / sectors</p>
            <p className="mt-1 text-sm text-white/45">
              Full holdings and sector weights are not in the current metrics dataset. Use ETF Explorer
              for deeper research.
            </p>
          </div>

          <div>
            <p className="mb-2 text-[11px] uppercase tracking-wider text-white/40">Historical path</p>
            <MiniChart data={history} />
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard/backtesting" className="rounded-lg bg-emerald-500/20 px-3 py-2 text-xs text-emerald-200">
              Run Backtest
            </Link>
            <Link href={`/dashboard/etf/${row.symbol}`} className="rounded-lg bg-violet-500/20 px-3 py-2 text-xs text-violet-200">
              Open Explorer
            </Link>
            <Link href="/docs" className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/70">
              View API
            </Link>
            <Link href="/dashboard/etf/heatmap" className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/70">
              Heatmap
            </Link>
            <Link href="/dashboard/etf/rankings" className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/70">
              Rankings
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
