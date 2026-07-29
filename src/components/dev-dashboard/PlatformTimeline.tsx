"use client";

import Link from "next/link";

const SHIPPED = [
  { title: "Candlestick Charts", body: "TradingView-style OHLCV with volume on the dashboard.", href: "/dashboard" },
  { title: "ETF Heatmap", body: "Finviz-style performance tiles by basket and period.", href: "/dashboard/etf/heatmap" },
  { title: "Portfolio Tool", body: "Compare baskets and rebalance with live prices.", href: "/dashboard/portfolio" },
  { title: "Ranking API", body: "Leaderboards by return, Sharpe, yield, and more.", href: "/dashboard/etf/rankings" },
  { title: "Backtesting", body: "Strategy simulation with equity curves and trade events.", href: "/dashboard/backtesting" },
];

const ROADMAP = [
  { title: "Options Chain", body: "Full chain + greeks for ETF underlyings.", href: "/dashboard/options" },
  { title: "Dark Pool", body: "Off-exchange print analytics.", href: "/dashboard/darkpool" },
  { title: "News", body: "Symbol news feed for research workflows.", href: "/dashboard/snapshot" },
  { title: "AI Signals", body: "Model-assisted rankings and alerts.", href: "/dashboard/etf/rankings" },
];

export default function PlatformTimeline() {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/80 p-5 backdrop-blur-md">
        <p className="text-[11px] uppercase tracking-wider text-emerald-300/70">Recently Added</p>
        <h3 className="mt-0.5 text-lg font-semibold">Shipped</h3>
        <ol className="relative mt-5 space-y-4 border-l border-emerald-500/25 pl-5">
          {SHIPPED.map((item, i) => (
            <li key={item.title} className="relative">
              <span className="absolute -left-[1.4rem] top-1.5 h-2.5 w-2.5 rounded-full border border-emerald-400/60 bg-emerald-500/40" />
              <Link href={item.href} className="font-medium text-white hover:text-emerald-200">
                {item.title}
              </Link>
              <p className="mt-0.5 text-xs text-white/45">{item.body}</p>
              <p className="mt-1 text-[10px] text-white/30">Update {SHIPPED.length - i}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/80 p-5 backdrop-blur-md">
        <p className="text-[11px] uppercase tracking-wider text-cyan-300/70">Future Roadmap</p>
        <h3 className="mt-0.5 text-lg font-semibold">Coming next</h3>
        <ol className="relative mt-5 space-y-4 border-l border-cyan-500/25 pl-5">
          {ROADMAP.map((item) => (
            <li key={item.title} className="relative">
              <span className="absolute -left-[1.4rem] top-1.5 h-2.5 w-2.5 rounded-full border border-cyan-400/50 bg-cyan-500/20" />
              <Link href={item.href} className="font-medium text-white hover:text-cyan-200">
                {item.title}
              </Link>
              <p className="mt-0.5 text-xs text-white/45">{item.body}</p>
              <span className="mt-1 inline-block rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/40">
                Planned
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
