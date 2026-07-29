"use client";

import Link from "next/link";

const ACTIONS = [
  { href: "/dashboard/backtesting", title: "Run Backtest", desc: "Simulate strategies", tone: "from-emerald-500/20" },
  { href: "/dashboard/etf", title: "ETF Explorer", desc: "Browse the universe", tone: "from-indigo-500/20" },
  { href: "/dashboard/etf/screener", title: "ETF Screener", desc: "Filter & discover", tone: "from-cyan-500/20" },
  { href: "/dashboard/etf/rankings", title: "Rankings", desc: "Leaderboards", tone: "from-violet-500/20" },
  { href: "/dashboard/portfolio", title: "Portfolio", desc: "Rebalance tools", tone: "from-amber-500/20" },
  { href: "/dashboard/api-explorer", title: "API Explorer", desc: "Try endpoints live", tone: "from-pink-500/20" },
  { href: "/docs", title: "Documentation", desc: "Guides & reference", tone: "from-sky-500/20" },
  { href: "/dashboard/etf/heatmap", title: "Heatmap", desc: "Visual market map", tone: "from-rose-500/20" },
];

export default function QuickActionsGrid() {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-white/40">Quick Actions</p>
      <h3 className="mt-0.5 text-lg font-semibold">Jump in</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ACTIONS.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className={`group rounded-2xl border border-white/10 bg-gradient-to-br ${a.tone} to-transparent p-4 transition hover:border-white/25 hover:bg-white/[0.04]`}
          >
            <p className="font-semibold text-white group-hover:text-indigo-200">{a.title}</p>
            <p className="mt-1 text-xs text-white/45">{a.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
