"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import LivePricingGrid from "@/components/LivePricingGrid";
import Footer from "@/components/Footer";
import { SiteHeader, SITE_HEADER_OFFSET } from "@/components/SiteHeader";
import { SUPPORT_EMAIL, SALES_EMAIL, STATUS_PAGE_PATH, mailtoSupport, mailtoSales } from "@/lib/site";

export default function PricingPage() {
  const { isAuthenticated } = useAuth();

  const handleSelectPlan = (idOrSlug: string) => {
    if (idOrSlug === "free") {
      window.location.href = isAuthenticated ? "/dashboard" : "/auth/signup";
      return;
    }
    if (idOrSlug === "enterprise") {
      window.location.href = mailtoSales("Enterprise / Scale plan");
      return;
    }
    if (!isAuthenticated) {
      window.location.href = `/auth/signup?redirect=${encodeURIComponent(`/dashboard/wallet?subscribe=${idOrSlug}`)}`;
      return;
    }
    window.location.href = `/dashboard/wallet?subscribe=${idOrSlug}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <SiteHeader active="pricing" isAuthenticated={isAuthenticated} />

      <section className={`px-4 pb-20 sm:px-6 lg:px-8 ${SITE_HEADER_OFFSET}`}>
        <div className="mx-auto max-w-6xl">
          <h1 className="text-center text-3xl font-bold sm:text-4xl">
            US ETF API pricing that scales with you
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-center text-white/60">
            Free: <strong className="text-white/80">50 requests/day</strong> — ETF list, screener,
            rankings, heatmap, batch prices, market status. No historical data, no backtests, no
            card required. Paid plans unlock history and higher limits. Prices below are live from
            billing.
          </p>

          <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-indigo-500/25 bg-indigo-500/10 p-4 text-center text-sm text-white/70">
            <strong className="text-indigo-200">Starter unlocks:</strong> historical OHLCV ·
            backtesting · portfolio tools · higher daily limits · email support
          </div>

          <div className="mx-auto mt-4 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-sm text-white/50">
            <a href={mailtoSupport("Data Captain — pricing question")} className="text-indigo-400 hover:underline">
              {SUPPORT_EMAIL}
            </a>
            <span className="hidden text-white/20 sm:inline">·</span>
            <a href={mailtoSales("Enterprise / Scale plan")} className="text-indigo-400 hover:underline">
              {SALES_EMAIL}
            </a>
            <span className="hidden text-white/20 sm:inline">·</span>
            <Link href={STATUS_PAGE_PATH} className="text-emerald-400/90 hover:underline">
              API status
            </Link>
          </div>

          <LivePricingGrid
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            onSelect={handleSelectPlan}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
