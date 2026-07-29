"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import {
  datacaptainEndpoints,
  getDataCaptainErrorMessage,
  type DeveloperUsage,
  type EtfHeatmapCell,
  type EtfListStats,
  type EtfRankingsRow,
  type MarketStatus,
} from "@/services/datacaptain/endpoints";
import FreeTierUpgradeBanner from "@/components/dashboard/FreeTierUpgradeBanner";
import CompactApiKeyCard from "@/components/dev-dashboard/CompactApiKeyCard";
import HeroOverviewCards from "@/components/dev-dashboard/HeroOverviewCards";
import FeaturedMarket from "@/components/dev-dashboard/FeaturedMarket";
import type { SnapshotCard } from "@/components/dev-dashboard/MarketSnapshot";
import PopularEtfs, { type PopularEtfCard } from "@/components/dev-dashboard/PopularEtfs";
import HeatmapPreview from "@/components/dev-dashboard/HeatmapPreview";
import FeatureDiscovery from "@/components/dev-dashboard/FeatureDiscovery";
import UsageChartPanel from "@/components/dev-dashboard/UsageChartPanel";
import EndpointAnalytics from "@/components/dev-dashboard/EndpointAnalytics";
import RecentlyUpdatedEtfs, {
  type RecentEtfRow,
} from "@/components/dev-dashboard/RecentlyUpdatedEtfs";
import PlatformTimeline from "@/components/dev-dashboard/PlatformTimeline";
import QuickActionsGrid from "@/components/dev-dashboard/QuickActionsGrid";
import FavoriteEtfsStrip from "@/components/dev-dashboard/FavoriteEtfsStrip";
import { formatCompact } from "@/lib/heatmap/colors";

const POPULAR = ["SPY", "QQQ", "DIA", "VTI", "VOO", "XLK", "XLE", "ARKK"] as const;

function relativeUpdated(iso?: string | null) {
  if (!iso) return "—";
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return String(iso).slice(0, 16);
  const mins = Math.max(0, Math.round((Date.now() - t) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 48) return `${hrs}h ago`;
  return new Date(t).toLocaleDateString();
}

function moverPct(m: { change_percent?: number; changePercent?: number }) {
  const v = m.change_percent ?? m.changePercent;
  return typeof v === "number" ? v : null;
}

export default function DashboardPage() {
  const { apiKey, saveKey } = useDataCaptainKey();
  const [usage, setUsage] = useState<DeveloperUsage | null>(null);
  const [marketStatus, setMarketStatus] = useState<MarketStatus | null>(null);
  const [stats, setStats] = useState<EtfListStats | null>(null);
  const [heatmap, setHeatmap] = useState<EtfHeatmapCell[]>([]);
  const [snapshot, setSnapshot] = useState<SnapshotCard[]>([]);
  const [popular, setPopular] = useState<PopularEtfCard[]>([]);
  const [recent, setRecent] = useState<RecentEtfRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [marketLoading, setMarketLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCore = useCallback(async () => {
    if (!apiKey) {
      setLoading(false);
      setMarketLoading(false);
      setUsage(null);
      setMarketStatus(null);
      setStats(null);
      setHeatmap([]);
      setSnapshot([]);
      setPopular([]);
      setRecent([]);
      return;
    }

    setLoading(true);
    setMarketLoading(true);
    setError(null);

    try {
      const [usageRes, marketRes, listRes] = await Promise.all([
        datacaptainEndpoints.developerUsage(apiKey),
        datacaptainEndpoints.marketStatus(apiKey),
        datacaptainEndpoints.etfList(apiKey, { limit: "12", sort: "volume", sortDir: "desc" }),
      ]);
      setUsage(usageRes);
      setMarketStatus(marketRes);
      setStats(listRes.stats ?? null);

      const recentRows: RecentEtfRow[] = (listRes.data ?? []).slice(0, 10).map((e) => ({
        symbol: e.symbol,
        name: e.name,
        updated: listRes.stats?.asOf ?? null,
        price: e.price,
        changePct: e.change1d ?? e.returnYtd ?? null,
      }));
      setRecent(recentRows);
    } catch (err) {
      setError(getDataCaptainErrorMessage(err));
    } finally {
      setLoading(false);
    }

    try {
      const [heatRes, gainers, losers, active, volRank, yieldRank, aumRank, popHeat] =
        await Promise.all([
          datacaptainEndpoints
            .etfHeatmap(apiKey, { basket: "broad", period: "1d" })
            .catch(() => null),
          datacaptainEndpoints.topGainers(apiKey, 1).catch(() => [] as Awaited<ReturnType<typeof datacaptainEndpoints.topGainers>>),
          datacaptainEndpoints.topLosers(apiKey, 1).catch(() => [] as Awaited<ReturnType<typeof datacaptainEndpoints.topLosers>>),
          datacaptainEndpoints.mostActive(apiKey, 1).catch(() => [] as Awaited<ReturnType<typeof datacaptainEndpoints.mostActive>>),
          datacaptainEndpoints
            .etfRankings(apiKey, { metric: "volatility", period: "1y", limit: "1" })
            .catch(() => null),
          datacaptainEndpoints
            .etfRankings(apiKey, { metric: "yield", period: "1y", limit: "1" })
            .catch(() => null),
          datacaptainEndpoints
            .etfRankings(apiKey, { metric: "aum", period: "1y", limit: "1" })
            .catch(() => null),
          datacaptainEndpoints
            .etfHeatmap(apiKey, {
              symbols: POPULAR.join(","),
              period: "1d",
            })
            .catch(() => null),
        ]);

      setHeatmap(heatRes?.cells ?? []);

      const pickRank = (
        rows: EtfRankingsRow[] | null | undefined,
        pctPick: (r: EtfRankingsRow) => number | null | undefined
      ): SnapshotCard | null => {
        const r = rows?.[0];
        if (!r) return null;
        return {
          label: "",
          symbol: r.symbol,
          price: r.latestPrice,
          changePct: pctPick(r) ?? null,
          sparkline: r.sparkline,
        };
      };

      const g = Array.isArray(gainers) ? gainers[0] : null;
      const l = Array.isArray(losers) ? losers[0] : null;
      const a = Array.isArray(active) ? active[0] : null;
      const vol = pickRank(volRank?.data, (r) => r.volatility1y);
      const yld = pickRank(yieldRank?.data, (r) => r.dividendYieldTtm);
      const held = pickRank(aumRank?.data, (r) => r.return1d ?? r.return1y);

      const cards: SnapshotCard[] = [
        g
          ? {
              label: "Top Gainer",
              symbol: g.symbol,
              price: g.price,
              changePct: moverPct(g),
              sparkline: heatRes?.cells?.find((c) => c.symbol === g.symbol)?.sparkline,
            }
          : null,
        l
          ? {
              label: "Top Loser",
              symbol: l.symbol,
              price: l.price,
              changePct: moverPct(l),
              sparkline: heatRes?.cells?.find((c) => c.symbol === l.symbol)?.sparkline,
            }
          : null,
        a
          ? {
              label: "Highest Volume",
              symbol: a.symbol,
              price: a.price,
              changePct: moverPct(a),
              sparkline: heatRes?.cells?.find((c) => c.symbol === a.symbol)?.sparkline,
            }
          : null,
        vol ? { ...vol, label: "Most Volatile", changePct: vol.changePct } : null,
        yld ? { ...yld, label: "Best Dividend", changePct: yld.changePct } : null,
        held ? { ...held, label: "Most Held (AUM)", changePct: held.changePct } : null,
      ].filter(Boolean) as SnapshotCard[];

      // Fallback from heatmap if movers empty
      if (!cards.length && heatRes?.cells?.length) {
        const sorted = [...heatRes.cells].sort(
          (x, y) => (y.returnPct ?? -999) - (x.returnPct ?? -999)
        );
        const top = sorted[0];
        const bot = sorted[sorted.length - 1];
        if (top) {
          cards.push({
            label: "Top Gainer",
            symbol: top.symbol,
            price: top.latestPrice,
            changePct: top.returnPct,
            sparkline: top.sparkline,
          });
        }
        if (bot && bot.symbol !== top?.symbol) {
          cards.push({
            label: "Top Loser",
            symbol: bot.symbol,
            price: bot.latestPrice,
            changePct: bot.returnPct,
            sparkline: bot.sparkline,
          });
        }
      }

      setSnapshot(cards);

      const popCells = popHeat?.cells ?? [];
      const popItems: PopularEtfCard[] = POPULAR.map((sym) => {
        const cell = popCells.find((c) => c.symbol === sym);
        return {
          symbol: sym,
          name: cell?.name,
          price: cell?.latestPrice ?? null,
          changePct: cell?.returnPct ?? cell?.return1d ?? null,
          sparkline: cell?.sparkline,
        };
      });
      setPopular(popItems);
    } catch {
      /* optional widgets */
    } finally {
      setMarketLoading(false);
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
    const open = marketStatus?.status === "OPEN";
    const bars = stats?.priceBars ?? 0;
    return [
      {
        label: "Requests Today",
        value: usage?.requestsToday ?? 0,
        numeric: true,
        sub: `of ${usage?.dailyLimit?.toLocaleString() ?? "—"} daily`,
        accent: "text-indigo-300",
        icon: "requests",
      },
      {
        label: "Monthly",
        value: usage?.requestsThisMonth ?? 0,
        numeric: true,
        sub: usage?.monthlyLimit ? `limit ~${formatCompact(usage.monthlyLimit)}` : "this month",
        accent: "text-cyan-300",
        icon: "monthly",
      },
      {
        label: "Available ETFs",
        value: stats?.totalEtfs ?? 0,
        numeric: true,
        sub: stats?.withHistory ? `${stats.withHistory.toLocaleString()} with history` : "universe",
        accent: "text-violet-300",
        icon: "etfs",
      },
      {
        label: "Price History",
        value: bars > 0 ? formatCompact(bars) : "—",
        sub: bars > 0 ? "OHLCV records" : "loading…",
        accent: "text-amber-200",
        icon: "history",
      },
      {
        label: "Market",
        value: marketStatus?.status ?? "—",
        sub: marketStatus?.session ?? undefined,
        accent: open ? "text-emerald-300" : "text-white/80",
        icon: "market",
      },
      {
        label: "Updated",
        value: relativeUpdated(marketStatus?.asOf || stats?.asOf),
        sub: "market data",
        accent: "text-white/85",
        icon: "updated",
      },
    ];
  }, [usage, stats, marketStatus]);

  return (
    <div className="mx-auto max-w-[1440px] space-y-8 pb-16">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-medium uppercase tracking-widest text-indigo-300/80">Overview</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Developer Dashboard</h1>
        <p className="mt-2 max-w-2xl text-white/55">
          Live ETF markets, charts, and API tools — open this every day to explore DataCaptain data.
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

      <FeaturedMarket apiKey={apiKey} snapshot={snapshot} snapshotLoading={marketLoading} />

      <PopularEtfs items={popular} loading={marketLoading} />

      <HeatmapPreview cells={heatmap} loading={marketLoading} />

      <FeatureDiscovery />

      <div className="grid gap-6 lg:grid-cols-2">
        <UsageChartPanel usage={usage} />
        <EndpointAnalytics usage={usage} />
      </div>

      <RecentlyUpdatedEtfs rows={recent} loading={loading} />

      <PlatformTimeline />

      <QuickActionsGrid />

      <FavoriteEtfsStrip />
    </div>
  );
}
