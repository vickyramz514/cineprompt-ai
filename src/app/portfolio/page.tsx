import { MarketingShell } from "@/components/MarketingShell";
import PortfolioView from "@/components/dashboard/PortfolioView";

export const metadata = {
  title: "Portfolio Simulator | Data Captain",
  description: "Compare ETF performance — VOO vs SPY vs QQQ and more.",
};

export default function PortfolioPage() {
  return (
    <MarketingShell active="portfolio">
      <PortfolioView />
    </MarketingShell>
  );
}
