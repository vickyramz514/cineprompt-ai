"use client";

import Link from "next/link";
import Sparkline from "@/components/charts/Sparkline";
import { formatPct } from "@/lib/heatmap/colors";

export type SnapshotCard = {
  label: string;
  symbol: string;
  price: number | null;
  changePct: number | null;
  sparkline?: number[];
  href?: string;
};

export default function MarketSnapshot({
  cards,
  loading,
}: {
  cards: SnapshotCard[];
  loading?: boolean;
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-4 backdrop-blur-md">
      <div className="mb-3">
        <p className="text-[11px] uppercase tracking-wider text-white/40">Market Snapshot</p>
        <h3 className="mt-0.5 text-base font-semibold">Live movers</h3>
      </div>
      <div className="grid flex-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[72px] animate-pulse rounded-xl bg-white/5" />
            ))
          : cards.map((c) => {
              const up = (c.changePct ?? 0) >= 0;
              return (
                <Link
                  key={c.label}
                  href={c.href || `/dashboard/etf/${c.symbol}`}
                  className="group rounded-xl border border-white/8 bg-gradient-to-br from-white/[0.05] to-transparent p-3 transition hover:border-cyan-500/30 hover:from-cyan-500/10"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-white/40">{c.label}</p>
                      <p className="mt-0.5 font-mono text-sm font-semibold text-indigo-200 group-hover:text-cyan-200">
                        {c.symbol}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                        up ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"
                      }`}
                    >
                      {formatPct(c.changePct)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-end justify-between gap-2">
                    <p className="text-sm font-semibold tabular-nums text-white/90">
                      {c.price != null ? `$${c.price.toFixed(2)}` : "—"}
                    </p>
                    <Sparkline data={c.sparkline} width={64} height={22} />
                  </div>
                </Link>
              );
            })}
        {!loading && !cards.length && (
          <p className="text-xs text-white/40">Connect an API key to load movers.</p>
        )}
      </div>
    </div>
  );
}
