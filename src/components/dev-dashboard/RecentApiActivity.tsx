"use client";

import type { DeveloperUsage } from "@/services/datacaptain/endpoints";

export default function RecentApiActivity({ usage }: { usage: DeveloperUsage | null }) {
  const items = usage?.recentActivity ?? [];

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/80 p-5 backdrop-blur-md">
      <p className="text-[11px] uppercase tracking-wider text-white/40">Recent API Activity</p>
      <h3 className="mt-0.5 text-lg font-semibold">Timeline</h3>
      <ul className="mt-4 space-y-2">
        {items.map((item, i) => {
          const ok = item.statusCode < 400;
          const t = item.at ? new Date(item.at).toLocaleTimeString() : "—";
          return (
            <li
              key={`${item.endpoint}-${i}`}
              className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5"
            >
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${ok ? "bg-emerald-400" : "bg-rose-400"}`}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-xs text-white/80">
                  <span className="text-white/40">{item.method}</span> {item.endpoint}
                </p>
                <p className="mt-0.5 text-[11px] text-white/40">
                  {t} · {item.statusCode} · {item.durationMs}ms
                </p>
              </div>
            </li>
          );
        })}
        {!items.length && (
          <li className="text-xs text-white/40">No recent requests logged for this key.</li>
        )}
      </ul>
    </div>
  );
}
