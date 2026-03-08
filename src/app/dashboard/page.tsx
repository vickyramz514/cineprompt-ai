"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useApiKey } from "@/hooks/useApiKey";
import { useApiUsage } from "@/hooks/useApiUsage";
import Loader from "@/components/Loader";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);
  return (
    <button
      onClick={handleCopy}
      className="rounded-lg border border-white/20 px-3 py-1.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export default function DashboardPage() {
  const { apiKey, isLoading: keyLoading } = useApiKey();
  const { stats, isLoading: usageLoading } = useApiUsage();

  const isLoading = keyLoading || usageLoading;

  if (isLoading && !apiKey && !stats) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-white/60">Your Stock Market Data API overview</p>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
          <p className="text-sm text-white/60">Requests today</p>
          <p className="mt-1 text-2xl font-bold">{stats?.requestsToday ?? 0}</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
          <p className="text-sm text-white/60">Requests this month</p>
          <p className="mt-1 text-2xl font-bold">{stats?.requestsThisMonth ?? 0}</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
          <p className="text-sm text-white/60">Remaining today</p>
          <p className="mt-1 text-2xl font-bold text-emerald-400">{stats?.remainingToday ?? 0}</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
          <p className="text-sm text-white/60">Subscription plan</p>
          <p className="mt-1 text-lg font-semibold">Free</p>
          <Link href="/pricing" className="mt-2 inline-block text-sm text-indigo-400 hover:underline">
            Upgrade →
          </Link>
        </div>
      </div>

      {/* API Key */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <h2 className="text-lg font-semibold">API Key</h2>
        <p className="mt-1 text-sm text-white/60">Use this key in the x-api-key header for all API requests</p>
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
          <code className="font-mono text-sm text-white/90 break-all">
            {apiKey?.key ?? "sdata_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}
          </code>
          <CopyButton text={apiKey?.key ?? "sdata_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"} />
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-4">
        <Link
          href="/dashboard/api-docs"
          className="rounded-xl bg-indigo-500 px-6 py-2.5 font-medium text-white hover:bg-indigo-600"
        >
          View API Docs
        </Link>
        <Link
          href="/pricing"
          className="rounded-xl border border-white/20 px-6 py-2.5 font-medium text-white hover:bg-white/5"
        >
          Upgrade Plan
        </Link>
      </div>
    </div>
  );
}
