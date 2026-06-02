"use client";

import UsageView from "@/components/dashboard/UsageView";
import { useApiUsage } from "@/hooks/useApiUsage";

export default function UsagePage() {
  const { stats, isLoading, error, refetch } = useApiUsage();

  return <UsageView stats={stats} isLoading={isLoading} error={error} onRefresh={refetch} />;
}
