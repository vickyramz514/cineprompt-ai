"use client";

import Link from "next/link";

const FEATURES = [
  {
    title: "ETF Explorer",
    desc: "Search the US ETF universe with prices, returns, and research profiles.",
    endpoint: "GET /v1/etf/list",
    href: "/dashboard/etf",
    tone: "from-indigo-500/25",
    icon: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5",
  },
  {
    title: "Backtesting",
    desc: "Simulate SMA, RSI, MACD, DCA and more on real OHLCV history.",
    endpoint: "POST /v1/backtest/*",
    href: "/dashboard/backtesting",
    tone: "from-emerald-500/25",
    icon: "M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941",
  },
  {
    title: "Portfolio Comparison",
    desc: "Compare baskets, allocation drift, and rebalance suggestions.",
    endpoint: "POST /v1/portfolio/*",
    href: "/dashboard/portfolio",
    tone: "from-amber-500/25",
    icon: "M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z",
  },
  {
    title: "ETF Screener",
    desc: "Filter by return, yield, volatility, AUM, expense, and more.",
    endpoint: "GET /v1/etf/screener",
    href: "/dashboard/etf/screener",
    tone: "from-cyan-500/25",
    icon: "M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z",
  },
  {
    title: "Rankings",
    desc: "Leaderboards by return, Sharpe, CAGR, yield, and drawdown.",
    endpoint: "GET /v1/etf/rankings",
    href: "/dashboard/etf/rankings",
    tone: "from-violet-500/25",
    icon: "M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-4.5A3.375 3.375 0 0012.75 9.75h-1.5A3.375 3.375 0 007.5 13.125V18.75m9 0h.008v.008H16.5V18.75zm-9 0h.008v.008H7.5V18.75z",
  },
  {
    title: "Batch Prices",
    desc: "Fetch latest quotes for dozens of symbols in one request.",
    endpoint: "GET /v1/stocks/prices",
    href: "/dashboard/tools/prices",
    tone: "from-rose-500/25",
    icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
  },
] as const;

export default function FeatureDiscovery() {
  return (
    <section>
      <div className="mb-3">
        <p className="text-[11px] uppercase tracking-wider text-white/40">API Feature Discovery</p>
        <h3 className="mt-0.5 text-lg font-semibold">What you can build</h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {FEATURES.map((f) => (
          <Link
            key={f.title}
            href={f.href}
            className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${f.tone} to-transparent p-4 transition hover:border-white/25 hover:shadow-xl hover:shadow-black/30`}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-black/30">
                <svg className="h-5 w-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                </svg>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Live
              </span>
            </div>
            <h4 className="mt-3 text-base font-semibold text-white group-hover:text-cyan-100">{f.title}</h4>
            <p className="mt-1 text-xs leading-relaxed text-white/50">{f.desc}</p>
            <code className="mt-3 block truncate font-mono text-[10px] text-white/35">{f.endpoint}</code>
            <span className="mt-3 inline-flex text-xs font-medium text-indigo-300 group-hover:underline">
              Explore →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
