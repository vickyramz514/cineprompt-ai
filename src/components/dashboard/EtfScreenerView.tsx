"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import { usePlanAccess } from "@/hooks/usePlanAccess";
import {
  datacaptainEndpoints,
  getDataCaptainErrorMessage,
  type EtfScreenerRow,
  type EtfScreenerResponse,
} from "@/services/datacaptain/endpoints";
import DataFreshnessLabel from "@/components/DataFreshnessLabel";
import ScreenerFilterBar from "@/components/screener/ScreenerFilterBar";
import ScreenerSummaryCards from "@/components/screener/ScreenerSummaryCards";
import ScreenerTable from "@/components/screener/ScreenerTable";
import ScreenerDrawer from "@/components/screener/ScreenerDrawer";
import ScreenerCompareModal from "@/components/screener/ScreenerCompareModal";
import ScreenerApiExample from "@/components/screener/ScreenerApiExample";
import ScreenerAnalytics from "@/components/screener/ScreenerAnalytics";
import {
  DEFAULT_FILTERS,
  computeScreenerStats,
  filtersToParams,
  type ScreenerFilters,
} from "@/lib/screener/presets";
import {
  deleteSavedScreen,
  exportScreenerCsv,
  exportScreenerExcel,
  exportScreenerJson,
  loadFavorites,
  loadSavedScreens,
  saveScreen,
  shareScreen,
  toggleFavorite,
  type SavedScreen,
} from "@/lib/screener/storage";
import { getPublicApiOrigin } from "@/lib/public-env";

export default function EtfScreenerView() {
  const { apiKey } = useDataCaptainKey();
  const { isFree } = usePlanAccess();
  const searchParams = useSearchParams();
  const favoritesOnly = searchParams.get("favorites") === "1";

  const [filters, setFilters] = useState<ScreenerFilters>(DEFAULT_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [result, setResult] = useState<EtfScreenerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [drawer, setDrawer] = useState<EtfScreenerRow | null>(null);
  const [compare, setCompare] = useState<EtfScreenerRow[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [savedScreens, setSavedScreens] = useState<SavedScreen[]>([]);
  const [saveName, setSaveName] = useState("");
  const [note, setNote] = useState<string | null>(null);

  const pageSize = isFree ? 10 : 50;

  // Query fingerprint excludes live search text — only debounced search triggers refetch
  const queryKey = useMemo(
    () =>
      JSON.stringify({
        search: debouncedSearch,
        period: filters.period,
        returnMin: filters.returnMin,
        returnMax: filters.returnMax,
        dividendYieldMin: filters.dividendYieldMin,
        dividendYieldMax: filters.dividendYieldMax,
        volatilityMin: filters.volatilityMin,
        volatilityMax: filters.volatilityMax,
        volumeMin: filters.volumeMin,
        priceMin: filters.priceMin,
        priceMax: filters.priceMax,
        expenseMax: filters.expenseMax,
        aumMin: filters.aumMin,
        sharpeMin: filters.sharpeMin,
        category: filters.category,
        issuer: filters.issuer,
        assetClass: filters.assetClass,
        leveraged: filters.leveraged,
        inverse: filters.inverse,
        esg: filters.esg,
        sort: filters.sort,
        sortDir: filters.sortDir,
        offset,
        pageSize,
      }),
    [
      debouncedSearch,
      filters.period,
      filters.returnMin,
      filters.returnMax,
      filters.dividendYieldMin,
      filters.dividendYieldMax,
      filters.volatilityMin,
      filters.volatilityMax,
      filters.volumeMin,
      filters.priceMin,
      filters.priceMax,
      filters.expenseMax,
      filters.aumMin,
      filters.sharpeMin,
      filters.category,
      filters.issuer,
      filters.assetClass,
      filters.leveraged,
      filters.inverse,
      filters.esg,
      filters.sort,
      filters.sortDir,
      offset,
      pageSize,
    ]
  );

  useEffect(() => {
    setFavorites(loadFavorites());
    setSavedScreens(loadSavedScreens());
  }, []);

  // Debounce search input (400ms) — typing alone must not hit the API
  useEffect(() => {
    const next = filters.search.trim();
    const t = setTimeout(() => {
      setDebouncedSearch(next);
      setSearching(false);
    }, 400);
    setSearching(true);
    return () => clearTimeout(t);
  }, [filters.search]);

  useEffect(() => {
    setOffset(0);
  }, [
    debouncedSearch,
    filters.period,
    filters.returnMin,
    filters.returnMax,
    filters.dividendYieldMin,
    filters.dividendYieldMax,
    filters.volatilityMax,
    filters.volatilityMin,
    filters.expenseMax,
    filters.aumMin,
    filters.sharpeMin,
    filters.category,
    filters.issuer,
    filters.leveraged,
    filters.inverse,
    filters.esg,
    filters.sort,
    filters.sortDir,
    filters.volumeMin,
    filters.priceMin,
    filters.priceMax,
    filters.assetClass,
  ]);

  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (!apiKey) {
      setLoading(false);
      setError("Set your API key in API Keys to run the screener.");
      return;
    }

    let cancelled = false;
    const soft = hasLoadedRef.current;
    if (!soft) setLoading(true);
    else setSearching(true);
    setError(null);

    const active: ScreenerFilters = { ...filters, search: debouncedSearch };

    (async () => {
      try {
        const data = await datacaptainEndpoints.etfScreener(
          apiKey,
          filtersToParams(active, pageSize, offset)
        );
        if (cancelled) return;
        setResult(data);
        hasLoadedRef.current = true;
      } catch (err) {
        if (cancelled) return;
        setError(getDataCaptainErrorMessage(err));
        setResult(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setSearching(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // queryKey encodes all server-facing filters; live filters.search is excluded on purpose
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, queryKey]);

  const rows = useMemo(() => {
    let data = result?.data ?? [];
    const q = filters.search.trim().toLowerCase();
    // Instant client filter of current page while debounce waits
    if (q && q !== debouncedSearch.toLowerCase()) {
      data = data.filter(
        (r) =>
          r.symbol.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          (r.issuer || "").toLowerCase().includes(q) ||
          (r.category || "").toLowerCase().includes(q)
      );
    }
    if (!favoritesOnly) return data;
    const fav = new Set(favorites);
    return data.filter((r) => fav.has(r.symbol));
  }, [result, favoritesOnly, favorites, filters.search, debouncedSearch]);

  // Favorites mode: broaden query so starred symbols can appear
  useEffect(() => {
    if (favoritesOnly) {
      setFilters((f) => ({
        ...DEFAULT_FILTERS,
        search: f.search,
        period: f.period,
        sort: "symbol",
        sortDir: "asc",
      }));
    }
  }, [favoritesOnly]);

  const stats = useMemo(() => computeScreenerStats(rows), [rows]);
  const total = favoritesOnly ? rows.length : result?.total ?? 0;
  const page = Math.floor(offset / pageSize) + 1;
  const pageCount = Math.max(1, Math.ceil((result?.total ?? 0) / pageSize));

  const applyPreset = (partial: Partial<ScreenerFilters>) => {
    setFilters((f) => ({ ...DEFAULT_FILTERS, ...partial, search: f.search, period: partial.period || f.period }));
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setOffset(0);
  };

  const onSort = (sort: string) => {
    setFilters((f) => ({
      ...f,
      sort,
      sortDir: f.sort === sort && f.sortDir === "desc" ? "asc" : "desc",
    }));
  };

  const flash = (msg: string) => {
    setNote(msg);
    setTimeout(() => setNote(null), 1600);
  };

  const copyApiRequest = async () => {
    const origin = getPublicApiOrigin();
    const params = filtersToParams({ ...filters, search: debouncedSearch }, pageSize, offset);
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v) qs.set(k, v);
    }
    await navigator.clipboard?.writeText(`${origin}/v1/etf/screener?${qs.toString()}`);
    flash("API request copied");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 pb-24 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-medium uppercase tracking-widest text-cyan-300/80">Markets</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
          {favoritesOnly ? "My Favorite ETFs" : "ETF Screener"}
        </h1>
        <p className="mt-2 max-w-3xl text-white/55">
          Professional ETF discovery — filter by return, yield, risk, expense, AUM, and category.
          Compare funds, save screens, and jump into backtests or the explorer.
        </p>
        <DataFreshnessLabel className="mt-2" />
      </motion.div>

      <ScreenerFilterBar
        filters={filters}
        onChange={setFilters}
        onApplyPreset={applyPreset}
        filtersOpen={filtersOpen}
        onToggleFilters={() => setFiltersOpen((v) => !v)}
        searching={searching || (loading && hasLoadedRef.current)}
      />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => result && exportScreenerCsv(rows, filters.period)}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/75 hover:bg-white/10"
        >
          Export CSV
        </button>
        <button
          type="button"
          onClick={() => result && exportScreenerExcel(rows, filters.period)}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/75 hover:bg-white/10"
        >
          Export Excel
        </button>
        <button
          type="button"
          onClick={() => result && exportScreenerJson(rows, filters.period, filters)}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/75 hover:bg-white/10"
        >
          Export JSON
        </button>
        <button
          type="button"
          onClick={copyApiRequest}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/75 hover:bg-white/10"
        >
          Copy API Request
        </button>
        <button
          type="button"
          onClick={async () => {
            await shareScreen(total, filters.period);
            flash("Share ready / copied");
          }}
          className="rounded-lg border border-cyan-400/30 bg-cyan-500/15 px-3 py-1.5 text-xs text-cyan-200"
        >
          Share Screen
        </button>
        <button
          type="button"
          disabled={selected.size < 2}
          onClick={() => {
            const picked = rows.filter((r) => selected.has(r.symbol));
            setCompare(picked.slice(0, 6));
            setShowCompare(true);
          }}
          className="rounded-lg border border-violet-400/30 bg-violet-500/15 px-3 py-1.5 text-xs text-violet-200 disabled:opacity-40"
        >
          Compare ({selected.size})
        </button>
        {note && <span className="text-xs text-emerald-300/80">{note}</span>}
        {isFree && (
          <span className="ml-auto text-xs text-amber-300/80">Free plan: top 10 results</span>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-3">
        <label className="text-xs text-white/45">
          Save screen
          <input
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder="e.g. High Growth"
            className="mt-1 block rounded-lg border border-white/10 bg-black/40 px-2.5 py-1.5 text-sm text-white"
          />
        </label>
        <button
          type="button"
          onClick={() => {
            if (!saveName.trim()) return;
            setSavedScreens(saveScreen(saveName.trim(), filters));
            setSaveName("");
            flash("Screen saved");
          }}
          className="rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-cyan-500"
        >
          Save
        </button>
        {savedScreens.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setFilters(s.filters)}
            onContextMenu={(e) => {
              e.preventDefault();
              setSavedScreens(deleteSavedScreen(s.id));
            }}
            title="Click to load · right-click to delete"
            className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] text-white/70 hover:bg-white/10"
          >
            {s.name}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      {!loading && rows.length > 0 && (
        <>
          <ScreenerSummaryCards stats={stats} total={total} />
          <ScreenerAnalytics rows={rows} />
        </>
      )}

      {!loading && rows.length === 0 ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
          <svg width="72" height="72" viewBox="0 0 72 72" className="mb-3 opacity-55" aria-hidden>
            <rect x="10" y="20" width="52" height="8" rx="2" fill="#22d3ee" opacity="0.4" />
            <rect x="10" y="34" width="40" height="8" rx="2" fill="#a78bfa" opacity="0.35" />
            <rect x="10" y="48" width="28" height="8" rx="2" fill="#34d399" opacity="0.35" />
          </svg>
          <p className="text-lg font-semibold text-white">No ETFs match your criteria</p>
          <p className="mt-2 max-w-md text-sm text-white/45">
            Try clearing filters or searching a different symbol, issuer, or category.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl bg-cyan-500/20 px-4 py-2 text-sm text-cyan-200 hover:bg-cyan-500/30"
            >
              Clear Filters
            </button>
            <button
              type="button"
              onClick={() => setFilters((f) => ({ ...f, search: "" }))}
              className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/70 hover:bg-white/5"
            >
              Reset Search
            </button>
          </div>
        </div>
      ) : (
        <ScreenerTable
          rows={rows}
          loading={loading}
          sort={filters.sort}
          sortDir={filters.sortDir}
          onSort={onSort}
          selected={selected}
          onToggleSelect={(sym) =>
            setSelected((prev) => {
              const next = new Set(prev);
              if (next.has(sym)) next.delete(sym);
              else next.add(sym);
              return next;
            })
          }
          onSelectAll={(on) =>
            setSelected(on ? new Set(rows.map((r) => r.symbol)) : new Set())
          }
          favorites={new Set(favorites)}
          onToggleFavorite={(sym) => setFavorites(toggleFavorite(sym))}
          onOpen={setDrawer}
          onCompareAdd={(row) => {
            setCompare((prev) => {
              if (prev.find((p) => p.symbol === row.symbol)) return prev;
              return [...prev, row].slice(-6);
            });
            setSelected((prev) => new Set(prev).add(row.symbol));
            flash(`${row.symbol} added to compare`);
          }}
        />
      )}

      {!isFree && result && result.total > pageSize && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-white/55">
          <span>
            Showing {offset + 1}–{Math.min(offset + pageSize, result.total)} of {result.total}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={offset === 0 || loading}
              onClick={() => setOffset((o) => Math.max(0, o - pageSize))}
              className="rounded-lg border border-white/15 px-3 py-1.5 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="px-2 py-1.5 tabular-nums">
              {page} / {pageCount}
            </span>
            <button
              type="button"
              disabled={offset + pageSize >= result.total || loading}
              onClick={() => setOffset((o) => o + pageSize)}
              className="rounded-lg border border-white/15 px-3 py-1.5 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {result && rows.length > 0 && <ScreenerApiExample filters={{ ...filters, search: debouncedSearch }} />}

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/dashboard/etf/heatmap" className="text-violet-400 hover:underline">
          ETF Heatmap →
        </Link>
        <Link href="/dashboard/etf/rankings" className="text-cyan-400 hover:underline">
          ETF Rankings →
        </Link>
        <Link href="/dashboard/backtesting" className="text-emerald-400 hover:underline">
          Backtesting →
        </Link>
        <Link href="/dashboard/etf" className="text-white/45 hover:text-white/70">
          ETF Explorer
        </Link>
        <Link href="/dashboard/etf/screener?favorites=1" className="text-amber-300/80 hover:underline">
          My Favorites ★
        </Link>
        <Link href="/docs" className="text-white/45 hover:text-white/70">
          API Docs
        </Link>
      </div>

      <ScreenerDrawer row={drawer} onClose={() => setDrawer(null)} />
      {showCompare && (
        <ScreenerCompareModal
          rows={compare.length >= 2 ? compare : rows.filter((r) => selected.has(r.symbol))}
          onClose={() => setShowCompare(false)}
        />
      )}
    </div>
  );
}
