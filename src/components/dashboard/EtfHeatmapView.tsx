"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import {
  datacaptainEndpoints,
  getDataCaptainErrorMessage,
  type EtfHeatmapBasket,
  type EtfHeatmapResponse,
} from "@/services/datacaptain/endpoints";

const PERIODS = [
  { id: "ytd", label: "YTD" },
  { id: "1y", label: "1 Year" },
  { id: "3y", label: "3 Year" },
  { id: "5y", label: "5 Year" },
] as const;

function returnColor(pct: number | null): string {
  if (pct == null) return "bg-white/5 border-white/10";
  if (pct >= 15) return "bg-emerald-500/35 border-emerald-400/40";
  if (pct >= 5) return "bg-emerald-500/20 border-emerald-500/30";
  if (pct >= 0) return "bg-emerald-500/10 border-emerald-500/20";
  if (pct >= -5) return "bg-rose-500/10 border-rose-500/20";
  if (pct >= -15) return "bg-rose-500/20 border-rose-500/30";
  return "bg-rose-500/35 border-rose-400/40";
}

function formatPct(pct: number | null) {
  if (pct == null) return "—";
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}

export default function EtfHeatmapView() {
  const { apiKey } = useDataCaptainKey();
  const [baskets, setBaskets] = useState<EtfHeatmapBasket[]>([]);
  const [basketId, setBasketId] = useState("broad");
  const [period, setPeriod] = useState("1y");
  const [data, setData] = useState<EtfHeatmapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      const res = await datacaptainEndpoints.etfHeatmap(apiKey, { basket: basketId, period });
      setData(res);
    } catch (err) {
      setError(getDataCaptainErrorMessage(err));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [apiKey, basketId, period]);

  useEffect(() => {
    loadHeatmap();
  }, [loadHeatmap]);

  const sortedCells = useMemo(() => {
    if (!data?.cells) return [];
    return [...data.cells].sort((a, b) => (b.returnPct ?? -999) - (a.returnPct ?? -999));
  }, [data]);

  const best = sortedCells[0];
  const worst = sortedCells[sortedCells.length - 1];

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pb-20 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-medium uppercase tracking-widest text-violet-300/80">Platform</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">ETF Heatmap</h1>
        <p className="mt-2 max-w-2xl text-white/55">
          Visualize ETF performance at a glance — green for gains, red for losses. Pick a basket and
          time period.
        </p>
      </motion.div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {(baskets.length ? baskets : [{ id: "broad", label: "Broad Market", symbols: [] }]).map(
            (b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBasketId(b.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  basketId === b.id
                    ? "border-violet-500/50 bg-violet-500/20 text-violet-200"
                    : "border-white/10 bg-white/5 text-white/55 hover:border-white/20"
                }`}
              >
                {b.label}
              </button>
            )
          )}
        </div>
        <div className="ml-auto flex gap-1 rounded-xl border border-white/10 bg-black/30 p-1">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriod(p.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                period === p.id ? "bg-violet-600 text-white" : "text-white/50 hover:text-white/80"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      {data && !loading && (
        <p className="text-xs text-white/40">
          As of {data.asOf} · {data.basket?.label ?? "Custom"} · {data.cells.length} ETFs
        </p>
      )}

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : (
        <motion.div
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {sortedCells.map((cell) => (
            <Link
              key={cell.symbol}
              href={`/dashboard/etf/${cell.symbol}`}
              className={`group rounded-2xl border p-4 transition-transform hover:scale-[1.02] ${returnColor(cell.returnPct)}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-lg font-bold text-white">{cell.symbol}</span>
                <span className="text-lg font-semibold tabular-nums text-white">
                  {formatPct(cell.returnPct)}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-white/60">{cell.name}</p>
              {cell.dividendYieldTtm != null && (
                <p className="mt-2 text-[10px] uppercase tracking-wider text-white/45">
                  Yield {cell.dividendYieldTtm.toFixed(1)}%
                </p>
              )}
            </Link>
          ))}
        </motion.div>
      )}

      {sortedCells.length > 0 && !loading && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="text-xs uppercase tracking-wider text-emerald-300/70">Top performer</p>
            <p className="mt-1 font-mono text-xl font-bold text-white">
              {best.symbol}{" "}
              <span className="text-emerald-300">{formatPct(best.returnPct)}</span>
            </p>
          </div>
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4">
            <p className="text-xs uppercase tracking-wider text-rose-300/70">Weakest</p>
            <p className="mt-1 font-mono text-xl font-bold text-white">
              {worst.symbol}{" "}
              <span className="text-rose-300">{formatPct(worst.returnPct)}</span>
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/dashboard/etf/screener" className="text-violet-400 hover:underline">
          Open ETF Screener →
        </Link>
        <Link href="/dashboard/etf/rankings" className="text-cyan-400 hover:underline">
          ETF Rankings →
        </Link>
        <Link href="/dashboard/etf" className="text-white/45 hover:text-white/70">
          ETF Explorer
        </Link>
      </div>
    </div>
  );
}
