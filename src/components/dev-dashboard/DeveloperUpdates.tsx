"use client";

import Link from "next/link";

const UPDATES = [
  {
    title: "ETF Rankings leaderboard",
    body: "Medals, Sharpe/CAGR metrics, sparklines, and movement indicators.",
    href: "/dashboard/etf/rankings",
    date: "Jul 2026",
  },
  {
    title: "ETF Screener 2.0",
    body: "Advanced filters, compare mode, saved screens, and live search suggestions.",
    href: "/dashboard/etf/screener",
    date: "Jul 2026",
  },
  {
    title: "Finviz-style Heatmap",
    body: "Sized tiles, multi-period returns, drawer research actions.",
    href: "/dashboard/etf/heatmap",
    date: "Jul 2026",
  },
  {
    title: "Backtesting strategies",
    body: "SMA/EMA, RSI, MACD, DCA, and equity-curve exports.",
    href: "/dashboard/backtesting",
    date: "Jul 2026",
  },
];

export default function DeveloperUpdates() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/80 p-5 backdrop-blur-md">
      <p className="text-[11px] uppercase tracking-wider text-white/40">Developer Updates</p>
      <h3 className="mt-0.5 text-lg font-semibold">What&apos;s new</h3>
      <ul className="mt-4 space-y-3">
        {UPDATES.map((u) => (
          <li key={u.title} className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
            <div className="flex items-start justify-between gap-2">
              <Link href={u.href} className="font-medium text-white hover:text-indigo-200">
                {u.title}
              </Link>
              <span className="shrink-0 text-[10px] text-white/35">{u.date}</span>
            </div>
            <p className="mt-1 text-xs text-white/45">{u.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
