import type { Metadata } from "next";
import { MarketingShell } from "@/components/MarketingShell";
import PortfolioView from "@/components/dashboard/PortfolioView";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "ETF Portfolio Rebalancer & Compare",
  description:
    "Rebalance ETF allocations toward target weights or compare VOO vs SPY vs QQQ with Data Captain historical data.",
  path: "/portfolio",
  keywords: ["ETF portfolio rebalancer", "compare ETFs", "VOO vs SPY"],
});

export default function PortfolioPage() {
  return (
    <MarketingShell active="portfolio">
      <PortfolioView />
    </MarketingShell>
  );
}
