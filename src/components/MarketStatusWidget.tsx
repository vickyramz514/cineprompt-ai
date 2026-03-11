"use client";

import type { MarketStatus } from "@/services/datacaptain/endpoints";

interface MarketStatusWidgetProps {
  data: MarketStatus | null;
  isLoading?: boolean;
  error?: string | null;
}

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function MarketStatusWidget({ data, isLoading, error }: MarketStatusWidgetProps) {
  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-24 rounded bg-white/10" />
          <div className="h-6 w-32 rounded bg-white/10" />
          <div className="h-3 w-full rounded bg-white/10" />
        </div>
      </div>
    );
  }

  const isOpen = data.status === "OPEN";

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/60">US Market</p>
          <p className="mt-1 text-xl font-semibold">Market Status</p>
        </div>
        <span
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            isOpen
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {data.status}
        </span>
      </div>
      <div className="mt-4 space-y-2 text-sm text-white/70">
        <p>
          <span className="text-white/50">Next open:</span>{" "}
          {formatTime(data.nextOpen)}
        </p>
        <p>
          <span className="text-white/50">Next close:</span>{" "}
          {formatTime(data.nextClose)}
        </p>
      </div>
    </div>
  );
}
