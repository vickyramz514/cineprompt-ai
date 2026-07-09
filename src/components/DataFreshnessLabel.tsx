"use client";

import { usePlatformStatus } from "@/hooks/usePlatformStatus";

type Props = {
  /** Use API date from a specific response instead of global status */
  asOf?: string | null;
  className?: string;
  compact?: boolean;
};

function formatAsOf(value: string | null | undefined) {
  if (!value) return null;
  return value.slice(0, 10);
}

export default function DataFreshnessLabel({ asOf, className = "", compact = false }: Props) {
  const { status, loading } = usePlatformStatus();

  const date =
    formatAsOf(asOf) ||
    formatAsOf(status?.data.latestPriceDate) ||
    formatAsOf(status?.data.etfMetricsAsOf);

  if (loading && !date) {
    return (
      <p className={`text-xs text-white/35 ${className}`}>Checking data freshness…</p>
    );
  }

  if (!date) return null;

  return (
    <p className={`text-xs text-white/45 ${className}`}>
      {compact ? `As of ${date}` : `Market prices as of ${date}`}
      {status?.data.historicalPriceRows != null && !compact && (
        <span className="text-white/30">
          {" "}
          · {status.data.historicalPriceRows.toLocaleString()} daily rows
        </span>
      )}
    </p>
  );
}
