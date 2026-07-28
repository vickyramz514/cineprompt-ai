"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import {
  datacaptainEndpoints,
  getDataCaptainErrorMessage,
  type EtfHeatmapBasket,
  type EtfHeatmapCell,
  type EtfHeatmapResponse,
} from "@/services/datacaptain/endpoints";
import HeatmapTile from "@/components/heatmap/HeatmapTile";
import HeatmapLegend from "@/components/heatmap/HeatmapLegend";
import HeatmapToolbar from "@/components/heatmap/HeatmapToolbar";
import HeatmapSummary, { MarketStatStrip } from "@/components/heatmap/HeatmapSummary";
import EtfDrawer from "@/components/heatmap/EtfDrawer";
import { HeatmapAnalytics, TopMoversTables } from "@/components/heatmap/HeatmapAnalytics";
import HeatmapApiExample from "@/components/heatmap/HeatmapApiExample";
import { tileSpan } from "@/lib/heatmap/colors";
import {
  computeHeatmapStats,
  sortHeatmapCells,
  type HeatmapSort,
} from "@/lib/heatmap/stats";
import {
  exportHeatmapCsv,
  exportHeatmapJson,
  exportHeatmapPng,
  shareHeatmap,
} from "@/lib/heatmap/export";

export default function EtfHeatmapView() {
  const { apiKey } = useDataCaptainKey();
  const [baskets, setBaskets] = useState<EtfHeatmapBasket[]>([]);
  const [basketId, setBasketId] = useState("broad");
  const [period, setPeriod] = useState("1y");
  const [sort, setSort] = useState<HeatmapSort>("best");
  const [search, setSearch] = useState("");
  const [symbolFocus, setSymbolFocus] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [data, setData] = useState<EtfHeatmapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<EtfHeatmapCell | null>(null);
  const [shareNote, setShareNote] = useState<string | null>(null);

  useEffect(() => {
    if (!apiKey) return;
    datacaptainEndpoints
      .etfHeatmapBaskets(apiKey)
      .then((res) => setBaskets(res.baskets))
      .catch(() => {});
  }, [apiKey]);

  const loadHeatmap = useCallback(async () => {
    if (!apiKey) {
      setLoading(false);
      setError("Set your API key in API Keys to view the heatmap.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = symbolFocus
        ? await datacaptainEndpoints.etfHeatmap(apiKey, { symbols: symbolFocus, period })
        : await datacaptainEndpoints.etfHeatmap(apiKey, { basket: basketId, period });
      setData(res);
    } catch (err) {
      setError(getDataCaptainErrorMessage(err));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [apiKey, basketId, period, symbolFocus]);

  useEffect(() => {
    loadHeatmap();
  }, [loadHeatmap]);

  const filtered = useMemo(() => {
    const cells = data?.cells ?? [];
    const q = search.trim().toLowerCase();
    const matched = !q
      ? cells
      : cells.filter(
          (c) => c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
        );
    return sortHeatmapCells(matched, sort);
  }, [data, search, sort]);

  const stats = useMemo(() => computeHeatmapStats(filtered), [filtered]);
  const maxSize = useMemo(
    () => Math.max(...filtered.map((c) => c.sizeScore || 0), 1),
    [filtered]
  );

  const resetFilters = () => {
    setSearch("");
    setSymbolFocus(null);
    setBasketId("broad");
    setPeriod("1y");
    setSort("best");
  };

  const handleSelectSymbol = (symbol: string) => {
    const upper = symbol.toUpperCase();
    setSearch(upper);
    const inView = data?.cells?.some((c) => c.symbol === upper);
    if (inView) setSymbolFocus(null);
    else setSymbolFocus(upper);
  };

  const handleBasket = (id: string) => {
    setBasketId(id);
    setSymbolFocus(null);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 pb-24 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-medium uppercase tracking-widest text-violet-300/80">Markets</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">ETF Heatmap</h1>
        <p className="mt-2 max-w-3xl text-white/55">
          Finviz-style performance map sized by AUM/volume — green for gains, red for losses. Search,
          filter, compare movers, and open any ETF for research actions.
        </p>
      </motion.div>

      <HeatmapToolbar
        apiKey={apiKey}
        localCells={data?.cells ?? []}
        baskets={baskets}
        basketId={basketId}
        onBasket={handleBasket}
        period={period}
        onPeriod={setPeriod}
        sort={sort}
        onSort={setSort}
        search={search}
        onSearch={(q) => {
          setSearch(q);
          if (!q.trim()) setSymbolFocus(null);
        }}
        onSelectSymbol={handleSelectSymbol}
        filtersOpen={filtersOpen}
        onToggleFilters={() => setFiltersOpen((v) => !v)}
      />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => data && exportHeatmapCsv(filtered, period)}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/75 hover:bg-white/10"
        >
          Export CSV
        </button>
        <button
          type="button"
          onClick={() => data && exportHeatmapJson(filtered, period, basketId)}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/75 hover:bg-white/10"
        >
          Export JSON
        </button>
        <button
          type="button"
          onClick={() => exportHeatmapPng("heatmap-board")}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/75 hover:bg-white/10"
        >
          Export PNG
        </button>
        <button
          type="button"
          onClick={async () => {
            await shareHeatmap(filtered, period);
            setShareNote("Share ready / copied");
            setTimeout(() => setShareNote(null), 1600);
          }}
          className="rounded-lg border border-violet-400/30 bg-violet-500/15 px-3 py-1.5 text-xs text-violet-200 hover:bg-violet-500/25"
        >
          Share Heatmap
        </button>
        {shareNote && <span className="text-xs text-emerald-300/80">{shareNote}</span>}
        {data && (
          <span className="ml-auto text-xs text-white/40">
            As of {data.asOf} ·{" "}
            {symbolFocus ? `Symbol ${symbolFocus}` : (data.basket?.label ?? "Custom")} · {filtered.length}{" "}
            ETFs
          </span>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <>
          <HeatmapSummary stats={stats} />
          <MarketStatStrip stats={stats} />
        </>
      )}

      <div id="heatmap-board">
        {loading ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-6 lg:auto-rows-[minmax(92px,auto)]">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className={`h-24 min-w-0 animate-pulse rounded-xl bg-white/5 ${i % 4 === 0 ? "col-span-2 lg:col-span-2" : "col-span-1"}`}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
            <svg
              width="72"
              height="72"
              viewBox="0 0 72 72"
              className="mb-3 opacity-60"
              aria-hidden
            >
              <rect x="8" y="28" width="16" height="28" rx="3" fill="#34d399" opacity="0.5" />
              <rect x="28" y="16" width="16" height="40" rx="3" fill="#8b5cf6" opacity="0.45" />
              <rect x="48" y="34" width="16" height="22" rx="3" fill="#f43f5e" opacity="0.5" />
            </svg>
            <p className="text-lg font-semibold text-white">No ETFs found</p>
            <p className="mt-2 max-w-md text-sm text-white/45">
              Try another category, period, or clear your search.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 rounded-xl bg-violet-500/20 px-4 py-2 text-sm text-violet-200 hover:bg-violet-500/30"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-6 lg:auto-rows-[minmax(92px,auto)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {filtered.map((cell) => (
              <HeatmapTile
                key={cell.symbol}
                cell={cell}
                span={tileSpan(cell.sizeScore || 1, maxSize)}
                onSelect={setSelected}
                onKeyActivate={setSelected}
              />
            ))}
          </motion.div>
        )}
      </div>

      {!loading && filtered.length > 0 && (
        <>
          <HeatmapLegend />
          <HeatmapAnalytics cells={filtered} baskets={baskets} basketId={basketId} />
          <TopMoversTables cells={filtered} />
          <HeatmapApiExample period={period} basketId={basketId} />
        </>
      )}

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/dashboard/etf/screener" className="text-violet-400 hover:underline">
          Open ETF Screener →
        </Link>
        <Link href="/dashboard/etf/rankings" className="text-cyan-400 hover:underline">
          ETF Rankings →
        </Link>
        <Link href="/dashboard/backtesting" className="text-emerald-400 hover:underline">
          Run Backtest →
        </Link>
        <Link href="/dashboard/etf" className="text-white/45 hover:text-white/70">
          ETF Explorer
        </Link>
      </div>

      <EtfDrawer cell={selected} apiKey={apiKey} onClose={() => setSelected(null)} />
    </div>
  );
}
