"use client";

import type { ReactNode } from "react";
import type { PlanFeature } from "@/lib/plan-access";
import { usePlanAccess } from "@/hooks/usePlanAccess";
import UpgradePrompt from "@/components/dashboard/UpgradePrompt";

type PlanGateProps = {
  feature: PlanFeature;
  children: ReactNode;
};

export default function PlanGate({ feature, children }: PlanGateProps) {
  const { hasAccess, isLoading } = usePlanAccess();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse rounded-2xl bg-white/5" />
        <div className="h-64 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  if (!hasAccess(feature)) {
    return <UpgradePrompt feature={feature} />;
  }

  return <>{children}</>;
}
