"use client";

import Link from "next/link";
import type { EtfRankingsRow } from "@/services/datacaptain/endpoints";
import ScreenerSparkline from "@/components/screener/ScreenerSparkline";
import { formatPct } from "@/lib/rankings/helpers";

export default function TrendingEtfs({
  rows,
  loading,
}: {
  rows: EtfRankingsRow[];
  loading?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/80 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-white/40">Trending ETFs</p>
          <h3 className="mt-0.5 text-lg font-semibold">Top performers</h3>
        </div>
        <Link href="/dashboard/etf/rankings" className="text-xs text-violet-300 hover:underline">
          Rankings →
        </Link>
      </div>
      <div className="mt-4 space-y-2">
        {loading &&
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-white/5" />
          ))}
        {!loading &&
          rows.slice(0, 6).map((r) => {
            const ret = r.return1y;
            const up = (ret ?? 0) >= 0;
            return (
              <Link
                key={r.symbol}
                href={`/dashboard/etf/${r.symbol}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5 transition hover:bg-white/[0.06]"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-violet-300">{r.symbol}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${
                        up ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"
                      }`}
                    >
                      {up ? "Up" : "Down"}
                    </span>
                  </div>
                  <p className="truncate text-[11px] text-white/40">{r.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <ScreenerSparkline data={r.sparkline} />
                  <span className="w-14 text-right text-sm font-semibold tabular-nums">{formatPct(ret)}</span>
                </div>
              </Link>
            );
          })}
        {!loading && !rows.length && (
          <p className="text-xs text-white/40">No ranking data available.</p>
        )}
      </div>
    </div>
  );
}
