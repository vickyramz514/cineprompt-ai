"use client";

import PlanGate from "@/components/dashboard/PlanGate";
import PortfolioView from "@/components/dashboard/PortfolioView";

export default function DashboardPortfolioPage() {
  return (
    <PlanGate feature="portfolio">
      <PortfolioView />
    </PlanGate>
  );
}
