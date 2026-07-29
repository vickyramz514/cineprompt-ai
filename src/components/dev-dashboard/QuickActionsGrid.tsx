"use client";

import Link from "next/link";

const ACTIONS = [
  { href: "/dashboard/etf", title: "Explore ETFs", tone: "from-indigo-500/25" },
  { href: "/dashboard/backtesting", title: "Run Backtest", tone: "from-emerald-500/25" },
  { href: "/dashboard/portfolio", title: "Compare Portfolio", tone: "from-amber-500/25" },
  { href: "/dashboard/etf/heatmap", title: "Heatmap", tone: "from-rose-500/25" },
  { href: "/dashboard/api-docs", title: "API Docs", tone: "from-sky-500/25" },
  { href: "/dashboard/api-explorer", title: "Playground", tone: "from-violet-500/25" },
];

export default function QuickActionsGrid() {
  return (
    <section>
      <p className="text-[11px] uppercase tracking-wider text-white/40">Quick Actions</p>
      <h3 className="mt-0.5 text-lg font-semibold">Jump in</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {ACTIONS.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className={`rounded-xl border border-white/10 bg-gradient-to-br ${a.tone} to-transparent px-4 py-2.5 text-sm font-medium text-white transition hover:border-white/25 hover:brightness-110`}
          >
            {a.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
