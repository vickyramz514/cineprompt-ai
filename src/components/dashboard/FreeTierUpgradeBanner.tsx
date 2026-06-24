"use client";

import Link from "next/link";
import { usePlanAccess } from "@/hooks/usePlanAccess";
import { useApiUsage } from "@/hooks/useApiUsage";

export default function FreeTierUpgradeBanner() {
  const { isFree, displayName } = usePlanAccess();
  const { stats } = useApiUsage();

  if (!isFree) return null;

  const remaining = stats?.remainingToday;
  const limit = stats?.dailyLimit ?? 50;

  return (
    <div className="rounded-2xl border border-indigo-500/25 bg-gradient-to-r from-indigo-500/10 via-[#0c0c14] to-violet-500/10 p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-indigo-300/80">
            {displayName} plan
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">
            Free tier — upgrade when you need history & backtests
          </h2>
          <p className="mt-2 max-w-xl text-sm text-white/50">
            Included today: ETF list, batch ETF prices, and market status.
            Starter unlocks historical ETF data, backtesting, portfolio compare, and 1,000 requests/day.
          </p>
          {remaining != null && (
            <p className="mt-2 text-xs text-white/40">
              {remaining.toLocaleString()} of {limit.toLocaleString()} API requests left today
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Link
            href="/dashboard/wallet"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Upgrade — from ₹1,500/mo
          </Link>
          <Link
            href="/pricing"
            className="rounded-xl border border-white/15 px-5 py-2.5 text-sm text-white/70 hover:bg-white/5"
          >
            Compare plans
          </Link>
        </div>
      </div>
    </div>
  );
}
