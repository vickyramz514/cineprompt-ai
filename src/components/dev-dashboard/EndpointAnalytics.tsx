"use client";

import dynamic from "next/dynamic";
import type { DeveloperUsage } from "@/services/datacaptain/endpoints";

const Pie = dynamic(() => import("./EndpointPieInner"), {
  ssr: false,
  loading: () => <div className="h-44 animate-pulse rounded-xl bg-white/5" />,
});

export default function EndpointAnalytics({ usage }: { usage: DeveloperUsage | null }) {
  const endpoints = usage?.endpoints ?? [];
  const analytics = usage?.analytics;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/80 p-5 backdrop-blur-md">
      <p className="text-[11px] uppercase tracking-wider text-white/40">Endpoint Analytics</p>
      <h3 className="mt-0.5 text-lg font-semibold">Traffic mix</h3>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Pie data={endpoints.slice(0, 6).map((e) => ({ name: e.endpoint.replace(/^\/api/, ""), value: e.count }))} />
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-center">
              <p className="text-[10px] uppercase text-white/40">Avg latency</p>
              <p className="mt-1 text-sm font-semibold tabular-nums">
                {analytics?.avgLatencyMs != null ? `${analytics.avgLatencyMs}ms` : "—"}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-center">
              <p className="text-[10px] uppercase text-white/40">Success</p>
              <p className="mt-1 text-sm font-semibold tabular-nums text-emerald-300">
                {analytics?.successRate != null ? `${analytics.successRate}%` : "—"}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-center">
              <p className="text-[10px] uppercase text-white/40">Errors</p>
              <p className="mt-1 text-sm font-semibold tabular-nums text-rose-300">
                {analytics?.errorRate != null ? `${analytics.errorRate}%` : "—"}
              </p>
            </div>
          </div>
          <ul className="max-h-40 space-y-1.5 overflow-y-auto text-sm">
            {endpoints.slice(0, 8).map((e) => (
              <li key={e.endpoint} className="flex items-center justify-between gap-2 rounded-lg bg-white/[0.03] px-2.5 py-1.5">
                <span className="truncate font-mono text-xs text-white/70">{e.endpoint}</span>
                <span className="shrink-0 tabular-nums text-white/85">{e.count}</span>
              </li>
            ))}
            {!endpoints.length && (
              <li className="text-xs text-white/40">No endpoint traffic yet — make your first API call.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
