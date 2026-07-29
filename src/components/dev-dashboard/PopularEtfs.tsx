"use client";

import Link from "next/link";
import Sparkline from "@/components/charts/Sparkline";
import { formatPct } from "@/lib/heatmap/colors";

export type PopularEtfCard = {
  symbol: string;
  name?: string | null;
  price: number | null;
  changePct: number | null;
  sparkline?: number[];
};

export default function PopularEtfs({
  items,
  loading,
}: {
  items: PopularEtfCard[];
  loading?: boolean;
}) {
  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-white/40">Popular ETFs</p>
          <h3 className="mt-0.5 text-lg font-semibold">Benchmarks &amp; favorites</h3>
        </div>
        <Link href="/dashboard/etf" className="text-xs text-indigo-300 hover:underline">
          Explorer →
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-28 w-40 shrink-0 animate-pulse rounded-2xl bg-white/5" />
            ))
          : items.map((item) => {
              const up = (item.changePct ?? 0) >= 0;
              return (
                <Link
                  key={item.symbol}
                  href={`/dashboard/etf/${item.symbol}`}
                  className="group w-40 shrink-0 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-transparent p-3 transition hover:-translate-y-0.5 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-indigo-500/15 font-mono text-[10px] font-bold text-indigo-200">
                      {item.symbol.slice(0, 2)}
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono text-sm font-semibold text-white group-hover:text-cyan-200">
                        {item.symbol}
                      </p>
                      <p className="truncate text-[10px] text-white/40">{item.name || "ETF"}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-lg font-semibold tabular-nums">
                    {item.price != null ? `$${item.price.toFixed(2)}` : "—"}
                  </p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-semibold tabular-nums ${
                        up ? "text-emerald-300" : "text-rose-300"
                      }`}
                    >
                      {formatPct(item.changePct)}
                    </span>
                    <Sparkline data={item.sparkline} width={56} height={18} />
                  </div>
                </Link>
              );
            })}
        {!loading && !items.length && (
          <p className="text-xs text-white/40">No popular ETF quotes yet.</p>
        )}
      </div>
    </section>
  );
}
