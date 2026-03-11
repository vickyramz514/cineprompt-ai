"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import { datacaptainEndpoints, getDataCaptainErrorMessage } from "@/services/datacaptain/endpoints";
import type { DeveloperUsage, MarketStatus } from "@/services/datacaptain/endpoints";
import DashboardCards from "@/components/DashboardCards";
import MarketStatusWidget from "@/components/MarketStatusWidget";

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
  const { apiKey, saveKey } = useDataCaptainKey();
  const [usage, setUsage] = useState<DeveloperUsage | null>(null);
  const [marketStatus, setMarketStatus] = useState<MarketStatus | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [usageLoading, setUsageLoading] = useState(true);
  const [marketLoading, setMarketLoading] = useState(true);
  const [usageError, setUsageError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!apiKey) {
      setUsageLoading(false);
      setMarketLoading(false);
      return;
    }
    setUsageLoading(true);
    setMarketLoading(true);
    setUsageError(null);
    try {
      const [usageRes, marketRes] = await Promise.all([
        datacaptainEndpoints.developerUsage(apiKey),
        datacaptainEndpoints.marketStatus(apiKey),
      ]);
      setUsage(usageRes);
      setMarketStatus(marketRes);
    } catch (err) {
      setUsageError(getDataCaptainErrorMessage(err));
    } finally {
      setUsageLoading(false);
      setMarketLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveKey = () => {
    if (apiKeyInput.trim()) {
      saveKey(apiKeyInput.trim());
      setApiKeyInput("");
      fetchData();
    }
  };

  const displayKey = apiKey ? `${apiKey.slice(0, 12)}...` : "";

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">Developer Dashboard</h1>
        <p className="mt-1 text-white/60">Manage your API access and usage</p>
      </div>

      {/* API Key Section */}
      <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider">API Key</h2>
        {apiKey ? (
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
            <code className="font-mono text-sm text-white/90 break-all">{displayKey}</code>
            <CopyButton text={apiKey} label="Copy API Key" />
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap gap-3">
            <input
              type="password"
              placeholder="Enter your DataCaptain API key (sdata_...)"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="rounded-lg border border-white/20 bg-black/30 px-4 py-2 font-mono text-sm text-white placeholder:text-white/40 focus:border-indigo-500 focus:outline-none"
            />
            <button
              onClick={handleSaveKey}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Save Key
            </button>
          </div>
        )}
        <p className="mt-4 text-sm text-amber-400/90">
          Keep your API key secret. Do not expose it in public repositories.
        </p>
      </section>

      {/* Usage Cards + Market Status */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Usage & Market</h2>
        {usageError && (
          <p className="mb-4 text-sm text-red-400">{usageError}</p>
        )}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DashboardCards
              requestsToday={usage?.requestsToday ?? 0}
              requestsRemaining={usage?.requestsRemaining ?? 0}
              dailyLimit={usage?.dailyLimit ?? 1000}
              plan={usage?.plan ?? "—"}
              isLoading={usageLoading}
            />
          </div>
          <div>
            <MarketStatusWidget
              data={marketStatus}
              isLoading={marketLoading}
              error={usageError}
            />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <h2 className="text-lg font-semibold">Quick Links</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/dashboard/tools/prices"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          >
            Batch Prices
          </Link>
          <Link
            href="/dashboard/etf"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          >
            ETF Explorer
          </Link>
          <Link
            href="/dashboard/economy"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          >
            Economic Indicators
          </Link>
          <Link
            href="/dashboard/api-explorer"
            className="rounded-lg border border-indigo-500/50 bg-indigo-500/20 px-4 py-2 text-sm text-indigo-300 hover:bg-indigo-500/30"
          >
            API Explorer
          </Link>
        </div>
      </section>

      {/* Quick API Example */}
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

      {/* Supported Data */}
      <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <h2 className="text-lg font-semibold">Supported Data</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/5 bg-black/20 p-5">
            <h3 className="font-semibold text-indigo-400">Stocks</h3>
            <p className="mt-2 text-sm text-white/60">Daily historical price data for US equities.</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/20 p-5">
            <h3 className="font-semibold text-indigo-400">ETFs</h3>
            <p className="mt-2 text-sm text-white/60">Historical price data for major exchange traded funds.</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/20 p-5">
            <h3 className="font-semibold text-indigo-400">Options</h3>
            <p className="mt-2 text-sm text-white/60">Options chain data (calls & puts).</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/20 p-5">
            <h3 className="font-semibold text-indigo-400">Insiders</h3>
            <p className="mt-2 text-sm text-white/60">Insider trading activity.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
