"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import { usePlanAccess } from "@/hooks/usePlanAccess";
import {
  datacaptainEndpoints,
  getDataCaptainErrorMessage,
  type EtfScreenerResponse,
} from "@/services/datacaptain/endpoints";

const PRESETS = [
  { label: "High return (10%+)", returnMin: "10", dividendYieldMin: "" },
  { label: "Dividend yield (2%+)", returnMin: "", dividendYieldMin: "2" },
  { label: "Growth + yield", returnMin: "10", dividendYieldMin: "2" },
];

export default function EtfScreenerView() {
  const { apiKey } = useDataCaptainKey();
  const { isFree } = usePlanAccess();
  const [period, setPeriod] = useState("1y");
  const [returnMin, setReturnMin] = useState("10");
  const [dividendYieldMin, setDividendYieldMin] = useState("");
  const [result, setResult] = useState<EtfScreenerResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runScreen = useCallback(async () => {
    if (!apiKey) {
      setError("Set your API key in API Keys to run the screener.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await datacaptainEndpoints.etfScreener(apiKey, {
        period,
        ...(returnMin ? { returnMin } : {}),
        ...(dividendYieldMin ? { dividendYieldMin } : {}),
        sort: "return",
        limit: isFree ? "10" : "50",
      });
      setResult(data);
    } catch (err) {
      setError(getDataCaptainErrorMessage(err));
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [apiKey, period, returnMin, dividendYieldMin, isFree]);

  useEffect(() => {
    runScreen();
  }, [runScreen]);

  const returnField = (row: EtfScreenerResponse["data"][0]) => {
    if (period === "ytd") return row.returnYtd;
    if (period === "3y") return row.return3y;
    if (period === "5y") return row.return5y;
    return row.return1y;
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pb-20 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-medium uppercase tracking-widest text-cyan-300/80">Platform</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">ETF Screener</h1>
        <p className="mt-2 max-w-2xl text-white/55">
          Filter ETFs by return and dividend yield. Expense ratio filters coming when fundamentals
          data is loaded.
        </p>
      </motion.div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setReturnMin(p.returnMin);
              setDividendYieldMin(p.dividendYieldMin);
            }}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:border-cyan-500/30 hover:text-white"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block text-sm">
            <span className="text-white/50">Min return (%)</span>
            <input
              type="number"
              step="0.1"
              value={returnMin}
              onChange={(e) => setReturnMin(e.target.value)}
              placeholder="e.g. 10"
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-white"
            />
          </label>
          <label className="block text-sm">
            <span className="text-white/50">Min dividend yield (%)</span>
            <input
              type="number"
              step="0.1"
              value={dividendYieldMin}
              onChange={(e) => setDividendYieldMin(e.target.value)}
              placeholder="e.g. 2"
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-white"
            />
          </label>
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
          <div className="flex items-end">
            <button
              type="button"
              onClick={runScreen}
              disabled={loading}
              className="w-full rounded-xl bg-cyan-600 py-2.5 text-sm font-semibold text-white hover:bg-cyan-500 disabled:opacity-50"
            >
              {loading ? "Screening…" : "Run screener"}
            </button>
          </div>
        </div>
      </div>

      {isFree && (
        <p className="text-xs text-amber-300/80">
          Free plan: top 10 results. Upgrade for full screener results.
        </p>
      )}

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      {result && result.data.length === 0 && !loading && (
        <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-white/45">
          No ETFs match your filters. Run{" "}
          <code className="text-cyan-300/80">npm run etf:compute-metrics</code> on the API if you
          just seeded price data.
        </div>
      )}

      {result && result.data.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-white/45">
              <tr>
                <th className="px-4 py-3">Symbol</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3 text-right">Return</th>
                <th className="px-4 py-3 text-right">Yield</th>
                <th className="px-4 py-3 text-right">Volatility</th>
              </tr>
            </thead>
            <tbody>
              {result.data.map((row) => (
                <tr key={row.symbol} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/etf/${row.symbol}`}
                      className="font-mono font-semibold text-cyan-300 hover:underline"
                    >
                      {row.symbol}
                    </Link>
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-white/60">{row.name}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-white">
                    {returnField(row) != null ? `${returnField(row)!.toFixed(1)}%` : "—"}
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
          <p className="border-t border-white/10 px-4 py-2 text-xs text-white/40">
            {result.total} matching · showing {result.data.length}
          </p>
        </div>
      )}

      <Link href="/dashboard/etf/heatmap" className="text-sm text-violet-400 hover:underline">
        View ETF Heatmap →
      </Link>
    </div>
  );
}
