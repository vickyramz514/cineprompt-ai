"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import { usePlanAccess } from "@/hooks/usePlanAccess";
import {
  datacaptainEndpoints,
  getDataCaptainErrorMessage,
  type EtfRankingsResponse,
} from "@/services/datacaptain/endpoints";

const CATEGORIES = [
  { id: "return", label: "Top return" },
  { id: "yield", label: "Top dividend yield" },
  { id: "volatility", label: "Lowest volatility" },
] as const;

export default function EtfRankingsView() {
  const { apiKey } = useDataCaptainKey();
  const { isFree } = usePlanAccess();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]["id"]>("return");
  const [period, setPeriod] = useState("1y");
  const [result, setResult] = useState<EtfRankingsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runRankings = useCallback(async () => {
    if (!apiKey) {
      setError("Set your API key in API Keys to load rankings.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await datacaptainEndpoints.etfRankings(apiKey, {
        category,
        period,
        limit: isFree ? "10" : "25",
      });
      setResult(data);
    } catch (err) {
      setError(getDataCaptainErrorMessage(err));
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [apiKey, category, period, isFree]);

  useEffect(() => {
    runRankings();
  }, [runRankings]);

  const returnField = (row: EtfRankingsResponse["data"][0]) => {
    if (period === "ytd") return row.returnYtd;
    if (period === "3y") return row.return3y;
    if (period === "5y") return row.return5y;
    return row.return1y;
  };

  const highlightValue = (row: EtfRankingsResponse["data"][0]) => {
    if (category === "yield") {
      return row.dividendYieldTtm != null ? `${row.dividendYieldTtm.toFixed(2)}%` : "—";
    }
    if (category === "volatility") {
      return row.volatility1y != null ? `${row.volatility1y.toFixed(1)}%` : "—";
    }
    const ret = returnField(row);
    return ret != null ? `${ret.toFixed(1)}%` : "—";
  };

  const categoryLabel =
    CATEGORIES.find((c) => c.id === category)?.label ?? "Top return";

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pb-20 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-medium uppercase tracking-widest text-violet-300/80">Platform</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">ETF Rankings</h1>
        <p className="mt-2 max-w-2xl text-white/55">
          Leaderboards for top-performing US ETFs — embed in your app via{" "}
          <code className="text-violet-300/80">GET /api/etf/rankings</code>.
        </p>
      </motion.div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
              category === c.id
                ? "border-violet-500/50 bg-violet-500/15 text-white"
                : "border-white/10 bg-white/5 text-white/60 hover:border-violet-500/30 hover:text-white"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {category === "return" && (
            <label className="block text-sm">
              <span className="text-white/50">Return period</span>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-white"
              >
                <option value="ytd">YTD</option>
                <option value="1y">1 Year</option>
                <option value="3y">3 Year</option>
                <option value="5y">5 Year</option>
              </select>
            </label>
          )}
          <div className="flex items-end">
            <button
              type="button"
              onClick={runRankings}
              disabled={loading}
              className="w-full rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50"
            >
              {loading ? "Loading…" : "Refresh rankings"}
            </button>
          </div>
        </div>
      </div>

      {isFree && (
        <p className="text-xs text-amber-300/80">
          Free plan: top 10 ranked ETFs. Upgrade for full leaderboards.
        </p>
      )}

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      {result && result.data.length === 0 && !loading && (
        <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-white/45">
          No ranking data yet. Run{" "}
          <code className="text-violet-300/80">npm run etf:compute-metrics</code> on the API if you
          just seeded price data.
        </div>
      )}

      {result && result.data.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <div className="border-b border-white/10 bg-white/[0.03] px-4 py-3">
            <p className="text-sm font-medium text-white">{categoryLabel}</p>
            <p className="text-xs text-white/40">
              As of {result.data[0]?.asOf ?? "—"} · {result.total} ETFs ranked
            </p>
          </div>
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.02] text-xs uppercase tracking-wider text-white/45">
              <tr>
                <th className="w-12 px-4 py-3">#</th>
                <th className="px-4 py-3">Symbol</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3 text-right">
                  {category === "yield"
                    ? "Yield"
                    : category === "volatility"
                      ? "Volatility"
                      : "Return"}
                </th>
                <th className="px-4 py-3 text-right">Yield</th>
                <th className="px-4 py-3 text-right">Volatility</th>
              </tr>
            </thead>
            <tbody>
              {result.data.map((row) => (
                <tr key={row.symbol} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 tabular-nums text-white/40">{row.rank}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/etf/${row.symbol}`}
                      className="font-mono font-semibold text-violet-300 hover:underline"
                    >
                      {row.symbol}
                    </Link>
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-white/60">{row.name}</td>
                  <td className="px-4 py-3 text-right tabular-nums font-medium text-white">
                    {highlightValue(row)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-white/70">
                    {row.dividendYieldTtm != null ? `${row.dividendYieldTtm.toFixed(1)}%` : "—"}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-white/50">
                    {row.volatility1y != null ? `${row.volatility1y.toFixed(1)}%` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/dashboard/etf/screener" className="text-cyan-400 hover:underline">
          ETF Screener →
        </Link>
        <Link href="/dashboard/etf/heatmap" className="text-violet-400 hover:underline">
          ETF Heatmap →
        </Link>
      </div>
    </div>
  );
}
