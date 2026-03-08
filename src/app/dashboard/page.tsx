"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useApiKey } from "@/hooks/useApiKey";
import { useApiUsage } from "@/hooks/useApiUsage";
import Loader from "@/components/Loader";

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);
  return (
    <button
      onClick={handleCopy}
      className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
    >
      {copied ? "Copied!" : label}
    </button>
  );
}

const EXAMPLE_RESPONSE = {
  symbol: "AAPL",
  date: "2024-03-01",
  open: 182.2,
  high: 185.1,
  low: 180.5,
  close: 184.7,
  volume: 120000000,
};

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

  const displayKey = apiKey?.key ?? "sdata_92hs8dh29shd9s";

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">Developer Dashboard</h1>
        <p className="mt-1 text-white/60">Manage your API access and usage</p>
      </div>

      {/* 1. API Key Section */}
      <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider">API Key</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
          <code className="font-mono text-sm text-white/90 break-all">{displayKey}</code>
          <CopyButton text={displayKey} label="Copy API Key" />
        </div>
        <p className="mt-4 text-sm text-amber-400/90">
          Keep your API key secret. Do not expose it in public repositories.
        </p>
      </section>

      {/* 2. Usage Statistics */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Usage Statistics</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
            <p className="text-sm text-white/60">Requests Today</p>
            <p className="mt-1 text-2xl font-bold">{stats?.requestsToday ?? 124}</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
            <p className="text-sm text-white/60">Requests This Month</p>
            <p className="mt-1 text-2xl font-bold">{stats?.requestsThisMonth ?? 2345}</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
            <p className="text-sm text-white/60">Remaining Daily Quota</p>
            <p className="mt-1 text-2xl font-bold text-emerald-400">{stats?.remainingToday ?? 9876}</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
            <p className="text-sm text-white/60">Subscription Plan</p>
            <p className="mt-1 text-xl font-semibold">Starter</p>
            <Link href="/pricing" className="mt-2 inline-block text-sm text-indigo-400 hover:underline">
              Upgrade →
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Quick API Examples */}
      <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <h2 className="text-lg font-semibold">Quick API Example</h2>
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-sm text-white/60 mb-2">Request</p>
            <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-emerald-400">
              GET /api/stocks/history?symbol=AAPL
            </pre>
          </div>
          <div>
            <p className="text-sm text-white/60 mb-2">Headers</p>
            <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/80">
              x-api-key: YOUR_API_KEY
            </pre>
          </div>
          <div>
            <p className="text-sm text-white/60 mb-2">Example Response</p>
            <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/80">
              {JSON.stringify(EXAMPLE_RESPONSE, null, 2)}
            </pre>
          </div>
        </div>
        <Link
          href="/dashboard/api-docs"
          className="mt-4 inline-flex items-center text-sm text-indigo-400 hover:underline"
        >
          Full API Documentation →
        </Link>
      </section>

      {/* 4. Supported Data */}
      <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <h2 className="text-lg font-semibold">Supported Data</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-white/5 bg-black/20 p-5">
            <h3 className="font-semibold text-indigo-400">Stocks</h3>
            <p className="mt-2 text-sm text-white/60">
              Daily historical price data for US equities.
            </p>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/20 p-5">
            <h3 className="font-semibold text-indigo-400">ETFs</h3>
            <p className="mt-2 text-sm text-white/60">
              Historical price data for major exchange traded funds.
            </p>
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-white/5 bg-black/20 px-4 py-3">
          <p className="text-sm text-white/70">
            <span className="font-medium">Market Coverage:</span> NYSE, NASDAQ, Major ETF providers.
          </p>
        </div>
      </section>
    </div>
  );
}
