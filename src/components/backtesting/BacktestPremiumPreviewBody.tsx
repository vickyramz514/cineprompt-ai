"use client";

import LockedMetricGrid, { PREVIEW_METRIC_ITEMS } from "@/components/paywall/LockedMetricGrid";

/** Blurred preview body for locked backtesting analytics */
export default function BacktestPremiumPreviewBody() {
  return (
    <div className="space-y-5 p-4 sm:p-6" aria-hidden>
      <LockedMetricGrid items={PREVIEW_METRIC_ITEMS} />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <p className="text-[11px] uppercase tracking-wider text-white/40">Equity curve</p>
          <div className="mt-3 flex h-40 items-end gap-1">
            {[32, 38, 35, 48, 52, 45, 58, 62, 55, 70, 68, 78, 74, 88, 92].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-violet-600/40 to-indigo-400/70"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <p className="text-[11px] uppercase tracking-wider text-white/40">Monthly returns</p>
          <div className="mt-3 grid grid-cols-6 gap-1.5">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className={`h-8 rounded-md ${
                  i % 5 === 0 ? "bg-rose-500/40" : i % 3 === 0 ? "bg-emerald-500/45" : "bg-emerald-500/25"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <p className="text-[11px] uppercase tracking-wider text-white/40">Trade history</p>
          <div className="mt-3 space-y-2 text-sm text-white/60">
            {["BUY SPY · 42.18 sh", "SELL SPY · 20.00 sh", "BUY QQQ · 18.40 sh", "DIV SPY · $0.42"].map(
              (row) => (
                <div key={row} className="flex justify-between rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2">
                  <span>{row}</span>
                  <span className="font-mono text-white/40">2024-06-12</span>
                </div>
              )
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <p className="text-[11px] uppercase tracking-wider text-white/40">Portfolio allocation</p>
          <div className="mt-4 flex items-center gap-4">
            <div className="h-28 w-28 rounded-full border-[14px] border-violet-500/70 border-r-emerald-400/70 border-b-sky-400/60 border-l-amber-400/50" />
            <ul className="space-y-1.5 text-sm text-white/60">
              <li>Equities 72%</li>
              <li>Bonds 18%</li>
              <li>Cash 10%</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
