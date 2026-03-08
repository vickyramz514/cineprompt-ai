"use client";

import { useApiUsage } from "@/hooks/useApiUsage";
import Loader from "@/components/Loader";

export default function UsagePage() {
  const { stats, isLoading, error } = useApiUsage();

  if (isLoading && !stats) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Usage</h1>
        <p className="mt-1 text-white/60">Monitor your API request usage and remaining quota</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <p className="text-sm font-medium text-white/60">Requests Today</p>
          <p className="mt-2 text-3xl font-bold">{stats?.requestsToday ?? 0}</p>
          <p className="mt-1 text-sm text-white/50">
            of {stats?.dailyLimit ?? 100} daily limit
          </p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <p className="text-sm font-medium text-white/60">Requests This Month</p>
          <p className="mt-2 text-3xl font-bold">{stats?.requestsThisMonth ?? 0}</p>
          <p className="mt-1 text-sm text-white/50">
            of {stats?.monthlyLimit ?? 3000} monthly limit
          </p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <p className="text-sm font-medium text-white/60">Remaining Quota</p>
          <p className="mt-2 text-3xl font-bold text-emerald-400">
            {stats?.remainingToday ?? 0} today
          </p>
          <p className="mt-1 text-sm text-white/50">
            {stats?.remainingThisMonth ?? 0} this month
          </p>
        </div>
      </div>

      {/* Usage bar */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <h2 className="text-lg font-semibold">Daily Usage</h2>
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all"
            style={{
              width: stats
                ? `${Math.min(100, (stats.requestsToday / stats.dailyLimit) * 100)}%`
                : "0%",
            }}
          />
        </div>
        <p className="mt-2 text-sm text-white/60">
          {stats?.requestsToday ?? 0} / {stats?.dailyLimit ?? 100} requests used today
        </p>
      </div>
    </div>
  );
}
