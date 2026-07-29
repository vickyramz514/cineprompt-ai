"use client";

import dynamic from "next/dynamic";
import type { EtfRankingsRow } from "@/services/datacaptain/endpoints";

const Charts = dynamic(() => import("./RankingsChartsInner"), {
  ssr: false,
  loading: () => <div className="h-52 animate-pulse rounded-2xl bg-white/5" />,
});

export default function RankingsAnalytics({
  rows,
  metric,
}: {
  rows: EtfRankingsRow[];
  metric: string;
}) {
  const top10 = [...rows]
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 10)
    .map((r) => ({
      symbol: r.symbol,
      value: r.score ?? r.return1y ?? 0,
    }));

  const histMap = new Map<number, number>();
  for (const r of rows) {
    const v = r.return1y;
    if (v == null) continue;
    const b = Math.floor(v / 5) * 5;
    histMap.set(b, (histMap.get(b) || 0) + 1);
  }
  const histogram = [...histMap.entries()]
    .map(([bucket, count]) => ({ label: `${bucket}%`, bucket, count }))
    .sort((a, b) => a.bucket - b.bucket);

  const catMap = new Map<string, number>();
  for (const r of rows) {
    const c = r.category || "Other";
    catMap.set(c, (catMap.get(c) || 0) + 1);
  }
  const categories = [...catMap.entries()].map(([name, value]) => ({ name, value }));

  const scatter = rows
    .filter((r) => r.return1y != null && r.volatility1y != null)
    .map((r) => ({
      symbol: r.symbol,
      x: r.volatility1y as number,
      y: r.return1y as number,
    }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-4">
        <p className="text-[11px] uppercase tracking-wider text-white/40">Top 10 Performance</p>
        <Charts mode="top10" data={top10} metric={metric} />
      </div>
      <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-4">
        <p className="text-[11px] uppercase tracking-wider text-white/40">Return Distribution</p>
        <Charts mode="hist" data={histogram} metric={metric} />
      </div>
      <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-4">
        <p className="text-[11px] uppercase tracking-wider text-white/40">Category Breakdown</p>
        <Charts mode="category" data={categories} metric={metric} />
      </div>
      <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-4">
        <p className="text-[11px] uppercase tracking-wider text-white/40">Risk vs Return</p>
        <Charts mode="scatter" data={scatter} metric={metric} />
      </div>
    </div>
  );
}
