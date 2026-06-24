"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import { datacaptainEndpoints, getDataCaptainErrorMessage } from "@/services/datacaptain/endpoints";
import type { EtfItem } from "@/services/datacaptain/endpoints";
import { getPublicApiOrigin } from "@/lib/public-env";
import JsonHighlight from "@/components/dashboard/JsonHighlight";

const PAGE_SIZE = 100;

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-5">
      <div className="h-5 w-14 animate-pulse rounded bg-white/10" />
      <div className="mt-3 h-4 w-full animate-pulse rounded bg-white/10" />
      <div className="mt-4 h-7 w-20 animate-pulse rounded bg-white/10" />
    </div>
  );
}

export default function EtfExplorerView() {
  const { apiKey } = useDataCaptainKey();
  const [etfs, setEtfs] = useState<EtfItem[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setSearch(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const fetchEtfs = useCallback(
    async (opts: { append?: boolean; nextOffset?: number } = {}) => {
      if (!apiKey) {
        setLoading(false);
        setError("Set your API key in API Keys to browse ETFs.");
        return;
      }

      const nextOffset = opts.nextOffset ?? 0;
      const append = opts.append ?? false;

      if (append) setLoadingMore(true);
      else setError(null);

      try {
        const res = await datacaptainEndpoints.etfList(apiKey, {
          limit: String(PAGE_SIZE),
          offset: String(nextOffset),
          ...(search ? { search } : {}),
        });
        setTotal(res.total);
        setOffset(nextOffset + res.data.length);
        setEtfs((prev) => (append ? [...prev, ...res.data] : res.data));
      } catch (err) {
        setError(getDataCaptainErrorMessage(err));
        if (!append) setEtfs([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [apiKey, search]
  );

  useEffect(() => {
    setLoading(true);
    setOffset(0);
    fetchEtfs({ nextOffset: 0 });
  }, [fetchEtfs]);

  const withPrice = useMemo(() => etfs.filter((e) => e.price != null).length, [etfs]);
  const hasMore = etfs.length < total;

  const onRefresh = () => {
    setRefreshing(true);
    setLoading(true);
    setOffset(0);
    fetchEtfs({ nextOffset: 0 });
  };

  const onLoadMore = () => {
    if (!hasMore || loadingMore) return;
    fetchEtfs({ append: true, nextOffset: offset });
  };

  const baseUrl = getPublicApiOrigin();
  const exampleJson = JSON.stringify(
    {
      data: etfs.slice(0, 3).length
        ? etfs.slice(0, 3)
        : [
            { symbol: "SPY", name: "SPDR S&P 500 ETF Trust", price: 512.34 },
            { symbol: "QQQ", name: "Invesco QQQ Trust", price: 445.12 },
          ],
      total: total || 3842,
      limit: PAGE_SIZE,
      offset: 0,
    },
    null,
    2
  );

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-violet-300/80">Funds</p>
          <h1 className="mt-0.5 text-2xl font-semibold sm:text-3xl">ETF Explorer</h1>
          <p className="mt-1 max-w-xl text-sm text-white/50">
            Browse ETFs from your database — search by symbol or name, paginated via the API
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading || !apiKey}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 disabled:opacity-50"
          >
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
          <Link
            href="/dashboard/api-docs"
            className="rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2.5 text-sm font-medium text-violet-200 hover:bg-violet-500/20"
          >
            API docs
          </Link>
        </div>
      </motion.div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
          {!apiKey && (
            <Link href="/dashboard/api-keys" className="mt-2 inline-block text-sm text-indigo-400 hover:underline">
              Go to API Keys →
            </Link>
          )}
        </div>
      )}

      {!loading && etfs.length > 0 && (
        <div className="flex flex-wrap gap-3">
          <div className="rounded-xl border border-white/10 bg-[#0c0c14]/90 px-4 py-3">
            <p className="text-xs uppercase tracking-wider text-white/35">In database</p>
            <p className="mt-0.5 text-xl font-semibold tabular-nums text-white">{total.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0c0c14]/90 px-4 py-3">
            <p className="text-xs uppercase tracking-wider text-white/35">Showing</p>
            <p className="mt-0.5 text-xl font-semibold tabular-nums text-white">{etfs.length.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-3">
            <p className="text-xs uppercase tracking-wider text-white/35">With price</p>
            <p className="mt-0.5 text-xl font-semibold tabular-nums text-violet-200">{withPrice}</p>
          </div>
        </div>
      )}

      <div className="relative">
        <svg
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" d="M21 21l-4.35-4.35M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z" />
        </svg>
        <input
          type="search"
          placeholder="Search by symbol or name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/35 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        />
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : etfs.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {etfs.map((etf, i) => (
              <motion.div
                key={etf.symbol}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.3) }}
              >
                <Link
                  href={`/dashboard/etf/${encodeURIComponent(etf.symbol)}`}
                  className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/10 via-[#0c0c14] to-[#0c0c14] p-5 transition-all hover:border-violet-500/35 hover:shadow-lg hover:shadow-violet-500/10"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-lg border border-violet-500/30 bg-violet-500/15 px-2.5 py-1 font-mono text-sm font-semibold text-violet-200">
                      {etf.symbol}
                    </span>
                    <span className="text-xs text-white/30 transition-colors group-hover:text-violet-300/80">
                      View →
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-snug text-white/65">{etf.name}</p>
                  {etf.price != null ? (
                    <p className="mt-4 text-2xl font-bold tabular-nums text-white">
                      ${etf.price.toFixed(2)}
                    </p>
                  ) : (
                    <p className="mt-4 text-sm text-white/35">Price unavailable</p>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={onLoadMore}
                disabled={loadingMore}
                className="rounded-xl border border-violet-500/30 bg-violet-500/10 px-6 py-2.5 text-sm font-medium text-violet-200 hover:bg-violet-500/20 disabled:opacity-50"
              >
                {loadingMore ? "Loading…" : `Load more (${etfs.length} of ${total.toLocaleString()})`}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-white/10 bg-black/20 px-6 py-12 text-center">
          <p className="text-sm text-white/50">
            {search ? `No ETFs match "${search}"` : "No ETFs found in database."}
          </p>
          {search && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-2 text-sm font-medium text-violet-400 hover:text-violet-300"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c14]/90"
      >
        <div className="border-b border-white/10 bg-white/[0.03] px-5 py-4">
          <h2 className="text-lg font-semibold">API endpoints</h2>
          <p className="mt-1 text-sm text-white/45">Paginated ETF list — cached ~60s per query</p>
        </div>
        <div className="grid gap-0 lg:grid-cols-2">
          <div className="space-y-4 border-b border-white/10 p-5 lg:border-b-0 lg:border-r">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-white/35">List</p>
              <pre className="mt-2 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs text-white/80">
                {`GET ${baseUrl}/api/etf/list?limit=100&offset=0&search=SPY\nx-api-key: YOUR_API_KEY`}
              </pre>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-white/35">By symbol</p>
              <pre className="mt-2 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs text-white/80">
                {`GET ${baseUrl}/api/etf/SPY\nx-api-key: YOUR_API_KEY`}
              </pre>
            </div>
          </div>
          <div className="p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-white/35">Sample response</p>
            <div className="mt-2 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs">
              <JsonHighlight json={exampleJson} />
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 px-5 py-4">
          <Link href="/dashboard/api-explorer" className="text-sm text-indigo-400/90 hover:text-indigo-300">
            Try in API Explorer →
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
