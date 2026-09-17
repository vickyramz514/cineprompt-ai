"use client";

import Link from "next/link";
import type { DeveloperUsage } from "@/services/datacaptain/endpoints";

type Props = {
  usage: DeveloperUsage | null;
  hasKey: boolean;
  loading?: boolean;
};

export default function QuotaStatusBar({ usage, hasKey, loading }: Props) {
  if (!hasKey) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-amber-100">API quota</p>
          <p className="text-xs text-white/55">Add an API key to track remaining daily requests.</p>
        </div>
        <Link
          href="/dashboard/api-keys"
          className="rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-semibold text-black hover:bg-amber-300"
        >
          Get API key
        </Link>
      </div>
    );
  }

  const limit = usage?.dailyLimit ?? 0;
  const remaining = usage?.requestsRemaining ?? Math.max(0, limit - (usage?.requestsToday ?? 0));
  const used = usage?.requestsToday ?? 0;
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const low = limit > 0 && remaining / limit <= 0.15;

  return (
    <div
      className={`rounded-2xl border px-4 py-3 ${
        low
          ? "border-rose-500/30 bg-rose-500/10"
          : "border-indigo-500/25 bg-indigo-500/10"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">
            {loading && !usage ? "Loading quota…" : `${remaining.toLocaleString()} requests left today`}
          </p>
          <p className="text-xs text-white/50">
            {used.toLocaleString()} / {limit ? limit.toLocaleString() : "—"} used
            {usage?.plan ? ` · ${usage.plan} plan` : ""}
            {" · "}
            Headers: <code className="text-white/40">X-RateLimit-Remaining</code>
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/usage" className="text-xs text-indigo-300 hover:underline">
            Usage details
          </Link>
          {low ? (
            <Link
              href="/dashboard/wallet"
              className="rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-400"
            >
              Upgrade
            </Link>
          ) : null}
        </div>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/30">
        <div
          className={`h-full rounded-full transition-all ${low ? "bg-rose-400" : "bg-indigo-400"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
