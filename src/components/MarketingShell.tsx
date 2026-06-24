"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import { SiteHeader, SITE_HEADER_OFFSET } from "@/components/SiteHeader";
import { useAuth } from "@/hooks/useAuth";

export function MarketingShell({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: "home" | "apis" | "backtesting" | "portfolio" | "pricing" | "docs";
}) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <SiteHeader active={active} isAuthenticated={isAuthenticated} />
      <main className={`relative ${SITE_HEADER_OFFSET}`}>{children}</main>
      <Footer />
    </div>
  );
}

export function PlatformPillars() {
  const items = [
    { title: "ETF Screener", desc: "Filter by return & yield", href: "/auth/signup" },
    { title: "ETF Rankings", desc: "Top performers leaderboard", href: "/auth/signup" },
    { title: "ETF Heatmap", desc: "Basket performance at a glance", href: "/auth/signup" },
    { title: "Backtesting", desc: "Buy & hold on ETF history", href: "/backtesting" },
    { title: "Portfolio", desc: "Rebalance & compare ETFs", href: "/portfolio" },
    { title: "REST API", desc: "Universe, prices, Swagger docs", href: "/docs" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className="rounded-2xl border border-white/10 bg-[#0c0c14]/80 p-5 transition-colors hover:border-indigo-500/30 hover:bg-indigo-500/5"
        >
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-white">{item.title}</h3>
            {item.badge && (
              <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/45">
                {item.badge}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-white/50">{item.desc}</p>
        </Link>
      ))}
    </div>
  );
}
