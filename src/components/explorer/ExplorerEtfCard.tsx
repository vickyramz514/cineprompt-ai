"use client";

import Link from "next/link";
import type { EtfItem } from "@/services/datacaptain/endpoints";
import { formatPct, type ExplorerViewMode } from "@/lib/explorer/helpers";

export default function ExplorerEtfCard({
  etf,
  mode,
  favorited,
  onToggleFavorite,
  onCompare,
}: {
  etf: EtfItem;
  mode: ExplorerViewMode;
  favorited: boolean;
  onToggleFavorite: (symbol: string) => void;
  onCompare: (etf: EtfItem) => void;
}) {
  const change = etf.change1d;
  const up = (change ?? 0) >= 0;

  if (mode === "compact") {
    return (
      <Link
        href={`/dashboard/etf/${etf.symbol}`}
        className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 hover:bg-white/[0.06]"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="font-mono text-sm font-semibold text-violet-300">{etf.symbol}</span>
          <span className="truncate text-xs text-white/45">{etf.name}</span>
        </div>
        <div className="flex shrink-0 items-center gap-3 text-sm tabular-nums">
          <span>{etf.price != null ? `$${etf.price.toFixed(2)}` : "—"}</span>
          <span className={up ? "text-emerald-400" : "text-rose-400"}>{formatPct(change)}</span>
        </div>
      </Link>
    );
  }

  if (mode === "list") {
    return (
      <div className="group flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-4 hover:border-violet-500/30">
        <Link href={`/dashboard/etf/${etf.symbol}`} className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold text-violet-300">{etf.symbol}</span>
            <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-white/50">
              {etf.category ?? "ETF"}
            </span>
          </div>
          <p className="mt-0.5 truncate text-sm text-white/55">{etf.name}</p>
          <p className="mt-1 text-xs text-white/35">{etf.issuer ?? "—"}</p>
        </Link>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-right text-sm sm:grid-cols-4">
          <div>
            <p className="text-[10px] text-white/35">Price</p>
            <p className="font-semibold tabular-nums">{etf.price != null ? `$${etf.price.toFixed(2)}` : "—"}</p>
          </div>
          <div>
            <p className="text-[10px] text-white/35">1D</p>
            <p className={`tabular-nums ${up ? "text-emerald-400" : "text-rose-400"}`}>{formatPct(change)}</p>
          </div>
          <div>
            <p className="text-[10px] text-white/35">Yield</p>
            <p className="tabular-nums">{formatPct(etf.dividendYieldTtm)}</p>
          </div>
          <div>
            <p className="text-[10px] text-white/35">AUM</p>
            <p className="tabular-nums">{etf.aumBillions != null ? `$${etf.aumBillions}B` : "—"}</p>
          </div>
        </div>
        <div className="flex gap-1 opacity-80 group-hover:opacity-100">
          <ActionLinks etf={etf} favorited={favorited} onToggleFavorite={onToggleFavorite} onCompare={onCompare} />
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/10 via-[#0c0c14] to-[#0c0c14] p-5 transition hover:border-violet-500/35">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/dashboard/etf/${etf.symbol}`} className="min-w-0">
          <span className="rounded-lg border border-violet-500/30 bg-violet-500/15 px-2.5 py-1 font-mono text-sm font-semibold text-violet-200">
            {etf.symbol}
          </span>
          <p className="mt-3 line-clamp-2 text-sm text-white/65">{etf.name}</p>
        </Link>
        <button
          type="button"
          onClick={() => onToggleFavorite(etf.symbol)}
          className="text-amber-300/80 hover:text-amber-200"
          aria-label={favorited ? "Unfavorite" : "Favorite"}
        >
          {favorited ? "★" : "☆"}
        </button>
      </div>
      <p className="mt-2 text-[11px] text-white/40">
        {etf.issuer ?? "—"} · {etf.category ?? "ETF"}
      </p>
      <div className="mt-4 flex items-end justify-between gap-2">
        <p className="text-2xl font-bold tabular-nums">
          {etf.price != null ? `$${etf.price.toFixed(2)}` : "—"}
        </p>
        <p className={`text-sm font-semibold tabular-nums ${up ? "text-emerald-400" : "text-rose-400"}`}>
          {formatPct(change)}
        </p>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-white/50">
        <span>Exp {etf.expenseRatio != null ? `${etf.expenseRatio}%` : "—"}</span>
        <span>Yld {formatPct(etf.dividendYieldTtm)}</span>
        <span>AUM {etf.aumBillions != null ? `$${etf.aumBillions}B` : "—"}</span>
      </div>
      <div className="mt-3 hidden gap-1 group-hover:flex">
        <ActionLinks etf={etf} favorited={favorited} onToggleFavorite={onToggleFavorite} onCompare={onCompare} />
      </div>
      {(etf.badges || []).slice(0, 2).length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {(etf.badges || []).slice(0, 2).map((b) => (
            <span key={b} className="rounded-full border border-white/10 px-1.5 py-0.5 text-[9px] text-white/50">
              {b}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ActionLinks({
  etf,
  favorited,
  onToggleFavorite,
  onCompare,
}: {
  etf: EtfItem;
  favorited: boolean;
  onToggleFavorite: (s: string) => void;
  onCompare: (e: EtfItem) => void;
}) {
  return (
    <>
      <Link
        href={`/dashboard/etf/${etf.symbol}`}
        className="rounded bg-violet-500/15 px-2 py-1 text-[10px] text-violet-200"
      >
        View
      </Link>
      <button
        type="button"
        onClick={() => onCompare(etf)}
        className="rounded bg-cyan-500/15 px-2 py-1 text-[10px] text-cyan-200"
      >
        Compare
      </button>
      <Link href="/dashboard/backtesting" className="rounded bg-emerald-500/15 px-2 py-1 text-[10px] text-emerald-200">
        Backtest
      </Link>
      <Link href="/docs" className="rounded bg-white/5 px-2 py-1 text-[10px] text-white/70">
        API
      </Link>
      <button
        type="button"
        onClick={() => onToggleFavorite(etf.symbol)}
        className="rounded bg-white/5 px-2 py-1 text-[10px] text-amber-200"
      >
        {favorited ? "★" : "☆"}
      </button>
    </>
  );
}
