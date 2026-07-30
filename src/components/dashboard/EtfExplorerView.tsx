"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import {
  datacaptainEndpoints,
  getDataCaptainErrorMessage,
  type EtfHeatmapCell,
  type EtfItem,
  type EtfListStats,
  type EtfRankingsRow,
} from "@/services/datacaptain/endpoints";
import { getPublicApiOrigin } from "@/lib/public-env";
import ExplorerEtfCard from "@/components/explorer/ExplorerEtfCard";
import ScreenerCompareModal from "@/components/screener/ScreenerCompareModal";
import HeatmapSearch from "@/components/heatmap/HeatmapSearch";
import {
  EXPLORER_CATEGORIES,
  EXPLORER_ISSUERS,
  SORT_OPTIONS,
  filterParams,
  formatCompact,
  loadRecentEtfs,
  type ExplorerViewMode,
} from "@/lib/explorer/helpers";
import { loadFavorites, toggleFavorite } from "@/lib/screener/storage";
import { formatPct } from "@/lib/explorer/helpers";

const PAGE_SIZE = 48;

export default function EtfExplorerView() {
  const { apiKey } = useDataCaptainKey();
  const [etfs, setEtfs] = useState<EtfItem[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<EtfListStats | null>(null);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [issuer, setIssuer] = useState("");
  const [assetClass, setAssetClass] = useState("");
  const [leveraged, setLeveraged] = useState(false);
  const [inverse, setInverse] = useState(false);
  const [dividendMin, setDividendMin] = useState("");
  const [expenseMax, setExpenseMax] = useState("");
  const [aumMin, setAumMin] = useState("");
  const [volumeMin, setVolumeMin] = useState("");
  const [country, setCountry] = useState("");
  const [sort, setSort] = useState("symbol");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [hasPrice, setHasPrice] = useState(true);
  const [view, setView] = useState<ExplorerViewMode>("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [trending, setTrending] = useState<EtfRankingsRow[]>([]);
  const [compare, setCompare] = useState<EtfItem[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  useEffect(() => {
    setFavorites(loadFavorites());
    setRecent(loadRecentEtfs());
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setSearching(false);
    }, 400);
    setSearching(true);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setOffset(0);
  }, [
    debouncedSearch,
    category,
    issuer,
    assetClass,
    leveraged,
    inverse,
    dividendMin,
    expenseMax,
    aumMin,
    volumeMin,
    sort,
    sortDir,
    hasPrice,
  ]);

  const queryKey = useMemo(
    () =>
      JSON.stringify({
        debouncedSearch,
        category,
        issuer,
        assetClass,
        leveraged,
        inverse,
        dividendMin,
        expenseMax,
        aumMin,
        volumeMin,
        sort,
        sortDir,
        hasPrice,
        offset,
      }),
    [
      debouncedSearch,
      category,
      issuer,
      assetClass,
      leveraged,
      inverse,
      dividendMin,
      expenseMax,
      aumMin,
      volumeMin,
      sort,
      sortDir,
      hasPrice,
      offset,
    ]
  );

  const fetchEtfs = useCallback(async () => {
    if (!apiKey) {
      setLoading(false);
      setError("Set your API key in API Keys to browse ETFs.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await datacaptainEndpoints.etfList(
        apiKey,
        filterParams({
          search: debouncedSearch,
          category,
          issuer,
          assetClass,
          leveraged,
          inverse,
          dividendMin,
          expenseMax,
          aumMin,
          volumeMin,
          sort,
          sortDir,
          hasPrice,
          limit: PAGE_SIZE,
          offset,
        })
      );
      setEtfs(res.data);
      setTotal(res.total);
      setStats(res.stats ?? null);
    } catch (err) {
      setError(getDataCaptainErrorMessage(err));
      setEtfs([]);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, [
    apiKey,
    debouncedSearch,
    category,
    issuer,
    assetClass,
    leveraged,
    inverse,
    dividendMin,
    expenseMax,
    aumMin,
    volumeMin,
    sort,
    sortDir,
    hasPrice,
    offset,
  ]);

  useEffect(() => {
    fetchEtfs();
  }, [fetchEtfs, queryKey]);

  useEffect(() => {
    if (!apiKey) return;
    datacaptainEndpoints
      .etfRankings(apiKey, { metric: "return", period: "1y", limit: "5" })
      .then((r) => setTrending(r.data))
      .catch(() => {});
  }, [apiKey]);

  const page = Math.floor(offset / PAGE_SIZE) + 1;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const origin = getPublicApiOrigin();

  const visibleEtfs = useMemo(() => {
    if (!country) return etfs;
    return etfs.filter((e) => (e.country || "US").toUpperCase() === country.toUpperCase());
  }, [etfs, country]);

  const hero = [
    { label: "Total ETFs", value: (stats?.totalEtfs ?? total).toLocaleString() },
    {
      label: "With historical data",
      value: stats?.withHistory != null ? stats.withHistory.toLocaleString() : "—",
    },
    { label: "Showing results", value: `${visibleEtfs.length} / ${total.toLocaleString()}` },
    { label: "Categories", value: String(stats?.categories ?? EXPLORER_CATEGORIES.length - 1) },
    { label: "Data last updated", value: stats?.asOf ? String(stats.asOf).slice(0, 10) : "—" },
    { label: "Avg trading volume", value: formatCompact(stats?.avgVolume) },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-20">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-medium uppercase tracking-widest text-violet-300/80">Funds</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">ETF Explorer</h1>
        <p className="mt-2 max-w-2xl text-white/55">
          Research the US ETF universe — search, filter, compare, and open any fund for a full
          Bloomberg-style profile.
        </p>
      </motion.div>

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {hero.map((h) => (
          <div key={h.label} className="rounded-xl border border-white/10 bg-black/30 p-4">
            <p className="text-[11px] uppercase tracking-wider text-white/40">{h.label}</p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-white">{h.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <HeatmapSearch
            apiKey={apiKey}
            value={search}
            onChange={setSearch}
            onSelectSymbol={(sym) => {
              setSearch(sym);
              window.location.assign(`/dashboard/etf/${sym}`);
            }}
            localCells={etfs.map(
              (e): EtfHeatmapCell => ({
                symbol: e.symbol,
                name: e.name,
                returnPct: e.return1y ?? null,
                latestPrice: e.price,
                dividendYieldTtm: e.dividendYieldTtm ?? null,
                assetClass: e.assetClass ?? null,
              })
            )}
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white"
            aria-label="Sort"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                Sort: {o.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
            className="rounded-xl border border-white/15 px-3 py-2.5 text-xs text-white/70"
          >
            {sortDir === "asc" ? "Asc ↑" : "Desc ↓"}
          </button>
          <div className="flex rounded-xl border border-white/10 p-1">
            {(["grid", "list", "compact"] as ExplorerViewMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setView(m)}
                className={`rounded-lg px-2.5 py-1.5 text-xs capitalize ${
                  view === m ? "bg-violet-600 text-white" : "text-white/50"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className="rounded-xl border border-white/15 px-3 py-2.5 text-sm text-white/70 lg:hidden"
          >
            Filters
          </button>
          {searching && <span className="text-xs text-white/40">Searching…</span>}
        </div>

        <div className={`${filtersOpen ? "block" : "hidden"} lg:block`}>
          <div className="flex flex-wrap gap-2">
            {EXPLORER_CATEGORIES.map((c) => (
              <button
                key={c.id || "all"}
                type="button"
                onClick={() => setCategory(c.id)}
                className={`rounded-full border px-3 py-1 text-xs ${
                  category === c.id
                    ? "border-violet-500/50 bg-violet-500/20 text-violet-100"
                    : "border-white/10 text-white/55"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <select
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              className="rounded-lg border border-white/10 bg-black/40 px-2.5 py-2 text-sm text-white"
            >
              {EXPLORER_ISSUERS.map((i) => (
                <option key={i || "all"} value={i}>
                  {i || "All issuers"}
                </option>
              ))}
            </select>
            <input
              placeholder="Min dividend %"
              value={dividendMin}
              onChange={(e) => setDividendMin(e.target.value)}
              className="rounded-lg border border-white/10 bg-black/40 px-2.5 py-2 text-sm text-white"
            />
            <input
              placeholder="Max expense %"
              value={expenseMax}
              onChange={(e) => setExpenseMax(e.target.value)}
              className="rounded-lg border border-white/10 bg-black/40 px-2.5 py-2 text-sm text-white"
            />
            <input
              placeholder="Min AUM / market size $B"
              value={aumMin}
              onChange={(e) => setAumMin(e.target.value)}
              className="rounded-lg border border-white/10 bg-black/40 px-2.5 py-2 text-sm text-white"
            />
            <input
              placeholder="Min volume"
              value={volumeMin}
              onChange={(e) => setVolumeMin(e.target.value)}
              className="rounded-lg border border-white/10 bg-black/40 px-2.5 py-2 text-sm text-white"
            />
            <input
              placeholder="Asset class contains…"
              value={assetClass}
              onChange={(e) => setAssetClass(e.target.value)}
              className="rounded-lg border border-white/10 bg-black/40 px-2.5 py-2 text-sm text-white"
            />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="rounded-lg border border-white/10 bg-black/40 px-2.5 py-2 text-sm text-white"
            >
              <option value="">All countries</option>
              <option value="US">United States</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input type="checkbox" checked={leveraged} onChange={(e) => setLeveraged(e.target.checked)} />
              Leveraged
            </label>
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input type="checkbox" checked={inverse} onChange={(e) => setInverse(e.target.checked)} />
              Inverse
            </label>
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input type="checkbox" checked={hasPrice} onChange={(e) => setHasPrice(e.target.checked)} />
              With price history
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={compare.length < 2}
          onClick={() => setShowCompare(true)}
          className="rounded-lg border border-cyan-400/30 bg-cyan-500/15 px-3 py-1.5 text-xs text-cyan-200 disabled:opacity-40"
        >
          Compare ({compare.length})
        </button>
        <Link href="/dashboard/etf/screener" className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70">
          Screener
        </Link>
        <Link href="/dashboard/etf/rankings" className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70">
          Rankings
        </Link>
      </div>

      {(trending.length > 0 || recent.length > 0) && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-4">
            <p className="text-[11px] uppercase tracking-wider text-white/40">Trending ETFs</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {trending.map((t) => (
                <Link
                  key={t.symbol}
                  href={`/dashboard/etf/${t.symbol}`}
                  className="rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1.5 text-xs"
                >
                  <span className="font-mono text-violet-200">{t.symbol}</span>{" "}
                  <span className="text-white/50">{formatPct(t.return1y)}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-4">
            <p className="text-[11px] uppercase tracking-wider text-white/40">Recently viewed</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {recent.length ? (
                recent.map((s) => (
                  <Link
                    key={s}
                    href={`/dashboard/etf/${s}`}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-xs text-white/70"
                  >
                    {s}
                  </Link>
                ))
              ) : (
                <p className="text-xs text-white/40">Open an ETF to build history.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className={view === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-2"}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : visibleEtfs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
          <p className="text-lg font-semibold">No ETFs found</p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategory("");
              setIssuer("");
              setCountry("");
            }}
            className="mt-3 text-sm text-violet-300 hover:underline"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div
          className={
            view === "grid"
              ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "space-y-2"
          }
        >
          {visibleEtfs.map((etf) => (
            <ExplorerEtfCard
              key={etf.symbol}
              etf={etf}
              mode={view}
              favorited={favorites.includes(etf.symbol)}
              onToggleFavorite={(s) => setFavorites(toggleFavorite(s))}
              onCompare={(e) =>
                setCompare((prev) => {
                  if (prev.find((p) => p.symbol === e.symbol)) return prev;
                  return [...prev, e].slice(-6);
                })
              }
            />
          ))}
        </div>
      )}

      {total > PAGE_SIZE && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-white/55">
          <span>
            Page {page} of {pageCount}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={offset === 0 || loading}
              onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
              className="rounded-lg border border-white/15 px-3 py-1.5 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={offset + PAGE_SIZE >= total || loading}
              onClick={() => setOffset((o) => o + PAGE_SIZE)}
              className="rounded-lg border border-white/15 px-3 py-1.5 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold">API Example</h3>
          <button
            type="button"
            onClick={() =>
              navigator.clipboard?.writeText(
                `GET ${origin}/v1/etf/list?limit=48&search=SPY\nx-api-key: YOUR_API_KEY`
              )
            }
            className="rounded-lg border border-white/15 px-3 py-1 text-xs text-white/70"
          >
            Copy
          </button>
        </div>
        <pre className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-violet-300/90">
          {`GET ${origin}/v1/etf/list?limit=48&category=technology&sort=return&sortDir=desc`}
        </pre>
      </div>

      {showCompare && (
        <ScreenerCompareModal
          rows={compare.map((c) => ({
            ...c,
            latestPrice: c.price,
            asOf: c.asOf ?? null,
            returnYtd: c.returnYtd ?? null,
            return1y: c.return1y ?? null,
            return3y: c.return3y ?? null,
            return5y: c.return5y ?? null,
            dividendYieldTtm: c.dividendYieldTtm ?? null,
            volatility1y: c.volatility1y ?? null,
            avgVolume30d: c.avgVolume30d ?? null,
            assetClass: c.assetClass ?? null,
          }))}
          onClose={() => setShowCompare(false)}
        />
      )}
    </div>
  );
}
