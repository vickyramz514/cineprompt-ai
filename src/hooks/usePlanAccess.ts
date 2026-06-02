"use client";

import { useMemo } from "react";
import { useApiUsage } from "@/hooks/useApiUsage";
import { useAuthStore } from "@/store/useStore";
import {
  type PlanFeature,
  hasFeatureAccess,
  isApiPathFree,
  isFreePlan,
  normalizePlan,
  planDisplayName,
} from "@/lib/plan-access";

export function usePlanAccess() {
  const { stats, isLoading: usageLoading } = useApiUsage();
  const user = useAuthStore((s) => s.user);

  const plan = useMemo(
    () => normalizePlan(stats?.plan ?? user?.plan ?? "free"),
    [stats?.plan, user?.plan]
  );

  const isFree = isFreePlan(plan);
  const displayName = planDisplayName(plan);

  return {
    plan,
    displayName,
    isFree,
    isLoading: usageLoading && !stats && !user,
    hasAccess: (feature: PlanFeature) => hasFeatureAccess(plan, feature),
    canCallApiPath: (path: string) => !isFree || isApiPathFree(path),
  };
}
