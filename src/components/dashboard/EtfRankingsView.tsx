"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import { usePlanAccess } from "@/hooks/usePlanAccess";
import {
  datacaptainEndpoints,
  getDataCaptainErrorMessage,
  type EtfRankingsRow,
  type EtfRankingsResponse,
} from "@/services/datacaptain/endpoints";
import RankingsSummaryCards from "@/components/rankings/RankingsSummaryCards";
import RankingsTable from "@/components/rankings/RankingsTable";
import RankingsAnalytics from "@/components/rankings/RankingsAnalytics";
import RankingsApiExample from "@/components/rankings/RankingsApiExample";
import ScreenerDrawer from "@/components/screener/ScreenerDrawer";
import ScreenerCompareModal from "@/components/screener/ScreenerCompareModal";
import {
  RANKING_BASKETS,
  RANKING_METRICS,
  computeRankingsStats,
  exportRankingsCsv,
  exportRankingsJson,
  shareRankings,
  type RankingMetric,
} from "@/lib/rankings/helpers";
import { loadFavorites, toggleFavorite } from "@/lib/screener/storage";

export default function EtfRankingsView() {
  const { apiKey } = useDataCaptainKey();
  const { isFree } = usePlanAccess();

  const [metric, setMetric] = useState<RankingMetric>("return");
  const [period, setPeriod] = useState("1y");
  const [basket, setBasket] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("rank");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [offset, setOffset] = useState(0);
  const [result, setResult] = useState<EtfRankingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [drawer, setDrawer] = useState<EtfRankingsRow | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  const pageSize = isFree ? 10 : 25;

  useEffect(() => {
    setFavorites(loadFavorites());
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
  }, [metric, period, basket, debouncedSearch, sort, sortDir]);

  const queryKey = useMemo(
    () =>
      JSON.stringify({
        metric,
        period,
        basket,
        search: debouncedSearch,
        sort,
        sortDir,
        offset,
        pageSize,
      }),
    [metric, period, basket, debouncedSearch, sort, sortDir, offset, pageSize]
  );

  useEffect(() => {
    if (!apiKey) {
      setLoading(false);
      setError("Set your API key in API Keys to load rankings.");
      return;
    }

    let cancelled = false;
    if (!hasLoadedRef.current) setLoading(true);
    else setSearching(true);
    setError(null);

    (async () => {
      try {
        const data = await datacaptainEndpoints.etfRankings(apiKey, {
          metric,
          category: metric,
          period,
          basket: basket || undefined,
          search: debouncedSearch || undefined,
          sort: sort !== "rank" ? sort : undefined,
          sortDir: sort !== "rank" ? sortDir : undefined,
          limit: String(pageSize),
          offset: String(offset),
        });
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
  }, [apiKey, queryKey, metric, period, basket, debouncedSearch, sort, sortDir, pageSize, offset]);

  const rows = useMemo(() => {
    let data = result?.data ?? [];
    const q = search.trim().toLowerCase();
    if (q && q !== debouncedSearch.toLowerCase()) {
      data = data.filter(
        (r) =>
          r.symbol.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          (r.issuer || "").toLowerCase().includes(q)
      );
    }
    return data;
  }, [result, search, debouncedSearch]);

  const stats = useMemo(
    () => computeRankingsStats(rows, result?.total ?? rows.length),
    [rows, result]
  );

  const page = Math.floor(offset / pageSize) + 1;
  const pageCount = Math.max(1, Math.ceil((result?.total ?? 0) / pageSize));

  const onSort = (col: string) => {
    if (col === "score") {
      setSort("rank");
      setSortDir("asc");
      return;
    }
    setSort((prev) => {
      if (prev === col) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        return prev;
      }
      setSortDir(col === "rank" ? "asc" : "desc");
      return col;
    });
  };

  const flash = (msg: string) => {
    setNote(msg);
    setTimeout(() => setNote(null), 1600);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 pb-24 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-medium uppercase tracking-widest text-violet-300/80">Markets</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">ETF Rankings</h1>
        <p className="mt-2 max-w-3xl text-white/55">
          Premium ETF leaderboard — medals for top performers, risk metrics, sparklines, and one-click
          research actions across Data Captain.
        </p>
      </motion.div>

      <div className="space-y-3 rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1 sm:max-w-md">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ticker, name, issuer..."
              aria-label="Search rankings"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 pr-9 text-sm text-white placeholder:text-white/35 focus:border-violet-500/50 focus:outline-none"
            />
            {searching && (
              <span className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
            )}
          </div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            aria-label="Period"
            className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white"
          >
            <option value="ytd">YTD</option>
            <option value="1y">1 Year</option>
            <option value="3y">3 Year</option>
            <option value="5y">5 Year</option>
          </select>
        </div>

        <div>
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-white/35">
            Ranking type
          </p>
          <div className="flex flex-wrap gap-2">
            {RANKING_METRICS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMetric(m.id)}
                className={`rounded-full border px-3 py-1.5 text-xs transition ${
                  metric === m.id
                    ? "border-violet-500/50 bg-violet-500/20 text-violet-100"
                    : "border-white/10 bg-white/5 text-white/60 hover:border-violet-500/30 hover:text-white"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-white/35">
            Category filter
          </p>
          <div className="flex flex-wrap gap-2">
            {RANKING_BASKETS.map((b) => (
              <button
                key={b.id || "all"}
                type="button"
                onClick={() => setBasket(b.id)}
                className={`rounded-full border px-3 py-1.5 text-xs transition ${
                  basket === b.id
                    ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-100"
                    : "border-white/10 bg-white/5 text-white/55 hover:border-white/25"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => result && exportRankingsCsv(rows, metric, period)}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/75 hover:bg-white/10"
        >
          Export CSV
        </button>
        <button
          type="button"
          onClick={() => result && exportRankingsCsv(rows, metric, `${period}-excel`)}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/75 hover:bg-white/10"
        >
          Export Excel
        </button>
        <button
          type="button"
          onClick={() => result && exportRankingsJson(rows, metric, period)}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/75 hover:bg-white/10"
        >
          Export JSON
        </button>
        <button
          type="button"
          onClick={async () => {
            await shareRankings(result?.total ?? rows.length, metric, period);
            flash("Share ready / copied");
          }}
          className="rounded-lg border border-violet-400/30 bg-violet-500/15 px-3 py-1.5 text-xs text-violet-200"
        >
          Share Rankings
        </button>
        <button
          type="button"
          disabled={selected.size < 2}
          onClick={() => setShowCompare(true)}
          className="rounded-lg border border-cyan-400/30 bg-cyan-500/15 px-3 py-1.5 text-xs text-cyan-200 disabled:opacity-40"
        >
          Compare ({selected.size})
        </button>
        {note && <span className="text-xs text-emerald-300/80">{note}</span>}
        {isFree && (
          <span className="ml-auto text-xs text-amber-300/80">Free plan: top 10</span>
        )}
        {result && !isFree && (
          <span className="ml-auto text-xs text-white/40">
            {result.total} ranked · page {page}/{pageCount}
          </span>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      {!loading && rows.length > 0 && (
        <>
          <RankingsSummaryCards stats={stats} />
          <RankingsAnalytics rows={rows} metric={metric} />
        </>
      )}

      {!loading && rows.length === 0 ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
          <p className="text-lg font-semibold text-white">No rankings match</p>
          <p className="mt-2 max-w-md text-sm text-white/45">
            Try another metric, category, or clear your search.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setBasket("");
              setMetric("return");
            }}
            className="mt-4 rounded-xl bg-violet-500/20 px-4 py-2 text-sm text-violet-200"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <RankingsTable
          rows={rows}
          loading={loading}
          metric={metric}
          sort={sort}
          sortDir={sortDir}
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
          onSelectAll={(on) => setSelected(on ? new Set(rows.map((r) => r.symbol)) : new Set())}
          favorites={new Set(favorites)}
          onToggleFavorite={(sym) => setFavorites(toggleFavorite(sym))}
          onOpen={setDrawer}
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

      {rows.length > 0 && (
        <RankingsApiExample metric={metric} period={period} basket={basket} />
      )}

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/dashboard/etf/screener" className="text-cyan-400 hover:underline">
          ETF Screener →
        </Link>
        <Link href="/dashboard/etf/heatmap" className="text-violet-400 hover:underline">
          ETF Heatmap →
        </Link>
        <Link href="/dashboard/backtesting" className="text-emerald-400 hover:underline">
          Backtesting →
        </Link>
        <Link href="/dashboard/etf" className="text-white/45 hover:text-white/70">
          ETF Explorer
        </Link>
        <Link href="/docs" className="text-white/45 hover:text-white/70">
          API Docs
        </Link>
      </div>

      <ScreenerDrawer row={drawer} onClose={() => setDrawer(null)} />
      {showCompare && (
        <ScreenerCompareModal
          rows={rows.filter((r) => selected.has(r.symbol))}
          onClose={() => setShowCompare(false)}
        />
      )}
    </div>
  );
}
