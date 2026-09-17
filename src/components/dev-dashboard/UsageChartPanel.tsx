"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { DeveloperUsage } from "@/services/datacaptain/endpoints";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState";

const Chart = dynamic(() => import("./UsageChartInner"), {
  ssr: false,
  loading: () => <div className="h-56 animate-pulse rounded-xl bg-white/5" />,
});

type Range = "daily" | "weekly" | "monthly";

export default function UsageChartPanel({
  usage,
  hasKey = true,
}: {
  usage: DeveloperUsage | null;
  hasKey?: boolean;
}) {
  const [range, setRange] = useState<Range>("daily");

  const data = useMemo(() => {
    if (!usage?.series) return [];
    if (range === "weekly") {
      return usage.series.weekly.map((d) => ({
        label: d.label || d.date.slice(5),
        count: d.count,
      }));
    }
    if (range === "monthly") {
      return usage.series.monthly.map((d) => ({
        label: d.label || d.date.slice(0, 7),
        count: d.count,
      }));
    }
    return usage.series.daily.map((d) => ({ label: d.date.slice(5), count: d.count }));
  }, [usage, range]);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/80 p-5 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-white/40">API Usage</p>
          <h3 className="mt-0.5 text-lg font-semibold">Request volume</h3>
        </div>
        <div className="flex rounded-xl border border-white/10 bg-black/30 p-1">
          {(["daily", "weekly", "monthly"] as Range[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize ${
                range === r ? "bg-indigo-600 text-white" : "text-white/50 hover:text-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      {!hasKey || !usage || data.length === 0 ? (
        <DashboardEmptyState
          className="mt-4"
          title={!hasKey ? "Usage appears after your first keyed request" : "No usage series yet"}
          description={
            !hasKey
              ? "Add an API key and call any free endpoint to start the chart."
              : "Make a few API calls (dashboard widgets or API explorer), then refresh."
          }
          primaryHref={!hasKey ? "/dashboard/api-keys" : "/dashboard/api-explorer"}
          primaryLabel={!hasKey ? "Get API key" : "Make a request"}
          secondaryHref="/dashboard/usage"
          secondaryLabel="Usage page"
        />
      ) : (
        <div className="mt-4">
          <Chart data={data} />
        </div>
      )}
    </div>
  );
}
