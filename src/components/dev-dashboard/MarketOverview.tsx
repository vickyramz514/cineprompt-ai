"use client";

import Link from "next/link";
import type { BatchPrice, MarketStatus } from "@/services/datacaptain/endpoints";

export default function MarketOverview({
  prices,
  status,
  loading,
}: {
  prices: BatchPrice[];
  status: MarketStatus | null;
  loading?: boolean;
}) {
  const open = status?.status === "OPEN";

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/80 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-white/40">US Market Overview</p>
          <h3 className="mt-0.5 text-lg font-semibold">Benchmarks</h3>
        </div>
        <span
          className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${
            open
              ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
              : "border-white/15 bg-white/5 text-white/55"
          }`}
        >
          {status?.status ?? "—"}
        </span>
      </div>

      {loading ? (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {prices.map((p) => (
            <Link
              key={p.symbol}
              href={`/dashboard/etf/${p.symbol}`}
              className="rounded-xl border border-white/10 bg-black/30 p-3 transition hover:border-indigo-500/30"
            >
              <p className="font-mono text-sm font-semibold text-indigo-300">{p.symbol}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {p.price != null ? `$${Number(p.price).toFixed(2)}` : "—"}
              </p>
            </Link>
          ))}
          {!prices.length && (
            <p className="col-span-full text-xs text-white/40">Connect an API key to load quotes.</p>
          )}
        </div>
      )}
      <p className="mt-3 text-[11px] text-white/35">
        Latest close / quote · session {status?.session ?? "—"}
        {status?.asOf ? ` · as of ${status.asOf}` : ""}
      </p>
    </div>
  );
}
