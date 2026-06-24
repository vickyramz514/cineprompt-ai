import { MarketingShell } from "@/components/MarketingShell";
import PortfolioView from "@/components/dashboard/PortfolioView";

export const metadata = {
  title: "Portfolio Rebalancer & Compare | Data Captain",
  description: "Rebalance ETF allocations toward target weights or compare VOO vs SPY vs QQQ historically.",
};

export default function PortfolioPage() {
  return (
    <MarketingShell active="portfolio">
      <PortfolioView />
    </MarketingShell>
  );
}
