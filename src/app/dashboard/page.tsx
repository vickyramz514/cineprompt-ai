"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import { datacaptainEndpoints, getDataCaptainErrorMessage } from "@/services/datacaptain/endpoints";
import type { DeveloperUsage, MarketStatus } from "@/services/datacaptain/endpoints";
import FreeTierUpgradeBanner from "@/components/dashboard/FreeTierUpgradeBanner";
import ApiKeySection from "@/components/dashboard/ApiKeySection";
import DashboardCards from "@/components/DashboardCards";
import QuickLinks from "@/components/dashboard/QuickLinks";
import QuickApiExample from "@/components/dashboard/QuickApiExample";
import SupportedData from "@/components/dashboard/SupportedData";
import MarketStatusWidget from "@/components/MarketStatusWidget";

export default function DashboardPage() {
  const { apiKey, saveKey } = useDataCaptainKey();
  const [usage, setUsage] = useState<DeveloperUsage | null>(null);
  const [marketStatus, setMarketStatus] = useState<MarketStatus | null>(null);
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

  const handleSaveKey = useCallback(
    (key: string) => {
      saveKey(key);
      fetchData();
    },
    [saveKey, fetchData]
  );

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">Developer Dashboard</h1>
        <p className="mt-1 text-white/60">Manage your API access and usage</p>
      </div>

      <ApiKeySection apiKey={apiKey} onSaveKey={handleSaveKey} />

      <FreeTierUpgradeBanner />

      {/* Usage Cards + Market Status */}
      <section className="relative">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Usage & Market</h2>
            <p className="mt-1 text-sm text-white/50">
              Real-time API consumption and US market session
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Live
          </div>
        </div>
        {usageError && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
            <p className="text-sm text-red-400">{usageError}</p>
            <p className="mt-2 text-sm text-white/70">
              Regenerate your API key on the{" "}
              <Link href="/dashboard/api-keys" className="text-indigo-400 hover:underline">
                API Keys
              </Link>{" "}
              page to fix this.
            </p>
          </div>
        )}
        <div className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
          <div className="lg:col-span-2">
            <DashboardCards
              requestsToday={usage?.requestsToday ?? 0}
              requestsRemaining={usage?.requestsRemaining ?? 0}
              dailyLimit={usage?.dailyLimit ?? 50}
              plan={usage?.plan ?? "—"}
              isLoading={usageLoading}
            />
          </div>
          <div className="min-h-[280px]">
            <MarketStatusWidget
              data={marketStatus}
              isLoading={marketLoading}
              error={usageError}
            />
          </div>
        </div>
      </section>

      <QuickLinks />

      <QuickApiExample apiKey={apiKey} />

      <SupportedData />
    </div>
  );
}
