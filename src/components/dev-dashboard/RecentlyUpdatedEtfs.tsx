"use client";

import Link from "next/link";
import { formatPct } from "@/lib/heatmap/colors";

export type RecentEtfRow = {
  symbol: string;
  name: string;
  updated: string | null;
  price: number | null;
  changePct: number | null;
};

function relativeTime(iso: string | null) {
  if (!iso) return "—";
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return iso.slice(0, 10);
  const mins = Math.round((Date.now() - t) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 48) return `${hrs}h ago`;
  return new Date(t).toLocaleDateString();
}

export default function RecentlyUpdatedEtfs({
  rows,
  loading,
}: {
  rows: RecentEtfRow[];
  loading?: boolean;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#0c0c14]/80 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-white/40">Recently Updated</p>
          <h3 className="mt-0.5 text-lg font-semibold">Fresh market data</h3>
        </div>
        <Link href="/dashboard/etf" className="text-xs text-indigo-300 hover:underline">
          All ETFs →
        </Link>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-white/35">
              <th className="pb-2 font-medium">Symbol</th>
              <th className="pb-2 font-medium">Name</th>
              <th className="pb-2 font-medium">Updated</th>
              <th className="pb-2 text-right font-medium">Price</th>
              <th className="pb-2 text-right font-medium">Change</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={5} className="py-2">
                    <div className="h-8 animate-pulse rounded-lg bg-white/5" />
                  </td>
                </tr>
              ))}
            {!loading &&
              rows.map((r) => {
                const up = (r.changePct ?? 0) >= 0;
                return (
                  <tr key={r.symbol} className="border-b border-white/5 hover:bg-white/[0.03]">
                    <td className="py-2.5">
                      <Link
                        href={`/dashboard/etf/${r.symbol}`}
                        className="font-mono font-semibold text-indigo-300 hover:text-cyan-200"
                      >
                        {r.symbol}
                      </Link>
                    </td>
                    <td className="max-w-[220px] truncate py-2.5 text-white/55">{r.name}</td>
                    <td className="py-2.5 tabular-nums text-white/45">{relativeTime(r.updated)}</td>
                    <td className="py-2.5 text-right tabular-nums">
                      {r.price != null ? `$${r.price.toFixed(2)}` : "—"}
                    </td>
                    <td
                      className={`py-2.5 text-right font-medium tabular-nums ${
                        up ? "text-emerald-300" : "text-rose-300"
                      }`}
                    >
                      {formatPct(r.changePct)}
                    </td>
                  </tr>
                );
              })}
            {!loading && !rows.length && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-xs text-white/40">
                  No recent updates yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
