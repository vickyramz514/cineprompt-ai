"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import {
  datacaptainEndpoints,
  getDataCaptainErrorMessage,
  type BatchPrice,
  type DeveloperUsage,
  type EtfHeatmapCell,
  type EtfRankingsRow,
  type MarketStatus,
} from "@/services/datacaptain/endpoints";
import FreeTierUpgradeBanner from "@/components/dashboard/FreeTierUpgradeBanner";
import CompactApiKeyCard from "@/components/dev-dashboard/CompactApiKeyCard";
import HeroOverviewCards from "@/components/dev-dashboard/HeroOverviewCards";
import UsageChartPanel from "@/components/dev-dashboard/UsageChartPanel";
import EndpointAnalytics from "@/components/dev-dashboard/EndpointAnalytics";
import MarketOverview from "@/components/dev-dashboard/MarketOverview";
import HeatmapPreview from "@/components/dev-dashboard/HeatmapPreview";
import TrendingEtfs from "@/components/dev-dashboard/TrendingEtfs";
import RecentApiActivity from "@/components/dev-dashboard/RecentApiActivity";
import QuickActionsGrid from "@/components/dev-dashboard/QuickActionsGrid";
import ApiHealthCards from "@/components/dev-dashboard/ApiHealthCards";
import GettingStartedChecklist from "@/components/dev-dashboard/GettingStartedChecklist";
import DeveloperUpdates from "@/components/dev-dashboard/DeveloperUpdates";
import FavoriteEtfsStrip from "@/components/dev-dashboard/FavoriteEtfsStrip";

const BENCHMARKS = "SPY,QQQ,DIA,VTI";

export default function DashboardPage() {
  const { apiKey, saveKey } = useDataCaptainKey();
  const [usage, setUsage] = useState<DeveloperUsage | null>(null);
  const [marketStatus, setMarketStatus] = useState<MarketStatus | null>(null);
  const [prices, setPrices] = useState<BatchPrice[]>([]);
  const [heatmap, setHeatmap] = useState<EtfHeatmapCell[]>([]);
  const [trending, setTrending] = useState<EtfRankingsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [marketLoading, setMarketLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCore = useCallback(async () => {
    if (!apiKey) {
      setLoading(false);
      setMarketLoading(false);
      setUsage(null);
      setMarketStatus(null);
      setPrices([]);
      setHeatmap([]);
      setTrending([]);
      return;
    }
    setLoading(true);
    setMarketLoading(true);
    setError(null);
    try {
      const [usageRes, marketRes] = await Promise.all([
        datacaptainEndpoints.developerUsage(apiKey),
        datacaptainEndpoints.marketStatus(apiKey),
      ]);
      setUsage(usageRes);
      setMarketStatus(marketRes);
    } catch (err) {
      setError(getDataCaptainErrorMessage(err));
    } finally {
      setLoading(false);
      setMarketLoading(false);
    }

    // Secondary widgets — fail soft
    try {
      const [priceRes, heatRes, rankRes] = await Promise.all([
        datacaptainEndpoints.batchPrices(apiKey, BENCHMARKS).catch(() => [] as BatchPrice[]),
        datacaptainEndpoints
          .etfHeatmap(apiKey, { basket: "broad", period: "1y" })
          .catch(() => null),
        datacaptainEndpoints
          .etfRankings(apiKey, { metric: "return", period: "1y", limit: "6" })
          .catch(() => null),
      ]);
      setPrices(Array.isArray(priceRes) ? priceRes : []);
      setHeatmap(heatRes?.cells ?? []);
      setTrending(rankRes?.data ?? []);
    } catch {
      /* optional widgets */
    }
  }, [apiKey]);

  useEffect(() => {
    fetchCore();
  }, [fetchCore]);

  const handleSaveKey = useCallback(
    (key: string) => {
      saveKey(key);
    },
    [saveKey]
  );

  const heroCards = useMemo(() => {
    const asOf =
      marketStatus?.asOf ||
      (usage?.asOf ? new Date(usage.asOf).toLocaleString() : "—");
    return [
      {
        label: "API Requests Today",
        value: usage?.requestsToday ?? 0,
        numeric: true,
        sub: `of ${usage?.dailyLimit ?? "—"} daily`,
        accent: "text-indigo-300",
      },
      {
        label: "Monthly Requests",
        value: usage?.requestsThisMonth ?? 0,
        numeric: true,
        sub: usage?.monthlyLimit ? `limit ~${usage.monthlyLimit}` : undefined,
        accent: "text-cyan-300",
      },
      {
        label: "Active API Key",
        value: apiKey ? "Connected" : "None",
        accent: apiKey ? "text-emerald-300" : "text-amber-300",
      },
      {
        label: "Current Plan",
        value: usage?.plan ? String(usage.plan) : "—",
        accent: "text-violet-300",
      },
      {
        label: "Market Status",
        value: marketStatus?.status ?? "—",
        sub: marketStatus?.session ?? undefined,
        accent: marketStatus?.status === "OPEN" ? "text-emerald-300" : "text-white",
      },
      {
        label: "Data Last Updated",
        value: typeof asOf === "string" ? asOf.slice(0, 16) : "—",
        accent: "text-white/80",
      },
    ];
  }, [usage, apiKey, marketStatus]);

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 pb-16">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-medium uppercase tracking-widest text-indigo-300/80">Overview</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Developer Dashboard</h1>
        <p className="mt-2 max-w-2xl text-white/55">
          Analytics, market pulse, and shortcuts — built for shipping with the Data Captain ETF API.
        </p>
      </motion.div>

      <CompactApiKeyCard apiKey={apiKey} onSaveKey={handleSaveKey} />

      <FreeTierUpgradeBanner />

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}{" "}
          <Link href="/dashboard/api-keys" className="text-indigo-300 underline">
            Manage API Keys
          </Link>
        </div>
      )}

      <HeroOverviewCards cards={heroCards} loading={loading && !!apiKey} />

      <div className="grid gap-6 lg:grid-cols-2">
        <UsageChartPanel usage={usage} />
        <EndpointAnalytics usage={usage} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <MarketOverview prices={prices} status={marketStatus} loading={marketLoading} />
        <HeatmapPreview cells={heatmap} loading={loading} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TrendingEtfs rows={trending} loading={loading} />
        <RecentApiActivity usage={usage} />
      </div>

      <QuickActionsGrid />

      <ApiHealthCards usage={usage} />

      <div className="grid gap-6 lg:grid-cols-2">
        <GettingStartedChecklist hasKey={!!apiKey} />
        <DeveloperUpdates />
      </div>

      <FavoriteEtfsStrip />
    </div>
  );
}
