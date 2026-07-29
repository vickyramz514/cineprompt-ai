"use client";

import type { DeveloperUsage } from "@/services/datacaptain/endpoints";

export default function ApiHealthCards({ usage }: { usage: DeveloperUsage | null }) {
  const h = usage?.health;
  const cards = [
    { label: "Uptime", value: h ? `${h.uptimePct}%` : "—" },
    { label: "Avg latency", value: h ? `${h.avgLatencyMs}ms` : "—" },
    { label: "Errors (7d)", value: h ? String(h.errorCount) : "—" },
    { label: "Database", value: h?.database ?? "—" },
    { label: "Cache", value: h?.cache ?? "—" },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/80 p-5 backdrop-blur-md">
      <p className="text-[11px] uppercase tracking-wider text-white/40">API Health</p>
      <h3 className="mt-0.5 text-lg font-semibold">Platform status</h3>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-white/10 bg-black/30 p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-white/40">{c.label}</p>
            <p className="mt-1 text-sm font-semibold capitalize tabular-nums text-emerald-300/90">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
