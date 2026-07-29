"use client";

import dynamic from "next/dynamic";
import type { EtfScreenerRow } from "@/services/datacaptain/endpoints";

const Charts = dynamic(() => import("./ScreenerChartsInner"), {
  ssr: false,
  loading: () => <div className="h-52 animate-pulse rounded-2xl bg-white/5" />,
});

export default function ScreenerAnalytics({ rows }: { rows: EtfScreenerRow[] }) {
  const histMap = new Map<string, number>();
  for (const r of rows) {
    const v = r.returnPct ?? r.return1y;
    if (v == null) continue;
    const b = Math.floor(v / 5) * 5;
    histMap.set(String(b), (histMap.get(String(b)) || 0) + 1);
  }
  const histogram = [...histMap.entries()]
    .map(([k, count]) => ({ label: `${k}%`, bucket: Number(k), count }))
    .sort((a, b) => a.bucket - b.bucket);

  const catMap = new Map<string, { count: number; sum: number }>();
  for (const r of rows) {
    const c = r.category || "Other";
    const cur = catMap.get(c) || { count: 0, sum: 0 };
    cur.count += 1;
    cur.sum += r.returnPct ?? r.return1y ?? 0;
    catMap.set(c, cur);
  }
  const categories = [...catMap.entries()].map(([name, v]) => ({
    name,
    value: v.count,
    avgReturn: v.count ? v.sum / v.count : 0,
  }));

  const volMap = new Map<string, number>();
  for (const r of rows) {
    if (r.volatility1y == null) continue;
    const b = Math.floor(r.volatility1y / 5) * 5;
    volMap.set(String(b), (volMap.get(String(b)) || 0) + 1);
  }
  const volHist = [...volMap.entries()]
    .map(([k, count]) => ({ label: `${k}%`, bucket: Number(k), count }))
    .sort((a, b) => a.bucket - b.bucket);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-4">
        <p className="text-[11px] uppercase tracking-wider text-white/40">Performance distribution</p>
        <Charts mode="hist" data={histogram} />
      </div>
      <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-4">
        <p className="text-[11px] uppercase tracking-wider text-white/40">Category allocation</p>
        <Charts mode="category" data={categories} />
      </div>
      <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-4">
        <p className="text-[11px] uppercase tracking-wider text-white/40">Volatility distribution</p>
        <Charts mode="hist" data={volHist} />
      </div>
    </div>
  );
}
