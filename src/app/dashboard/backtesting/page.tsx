"use client";

import PlanGate from "@/components/dashboard/PlanGate";
import BacktestingView from "@/components/dashboard/BacktestingView";

export default function DashboardBacktestingPage() {
  return (
    <PlanGate feature="backtesting">
      <BacktestingView />
    </PlanGate>
  );
}
