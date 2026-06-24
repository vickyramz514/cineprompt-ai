"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import { datacaptainEndpoints, getDataCaptainErrorMessage } from "@/services/datacaptain/endpoints";
import type { CompareResult } from "@/services/datacaptain/endpoints";

const PRESETS = [
  { label: "VOO vs SPY vs QQQ", symbols: ["VOO", "SPY", "QQQ"] },
  { label: "Growth vs Value", symbols: ["QQQ", "VTV", "IWM"] },
  { label: "Sector leaders", symbols: ["XLK", "XLF", "XLE"] },
];

export default function PortfolioView() {
  const { apiKey } = useDataCaptainKey();
  const [symbols, setSymbols] = useState("VOO,SPY,QQQ");
  const [investment, setInvestment] = useState("10000");
  const [startDate, setStartDate] = useState("2015-01-01");
  const [endDate, setEndDate] = useState("2025-01-01");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompareResult | null>(null);

  const runCompare = async () => {
    if (!apiKey) {
      setError("Sign in and set your API key to compare portfolios.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const list = symbols.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
      const data = await datacaptainEndpoints.backtestCompare(apiKey, {
        symbols: list,
        investment: Number(investment),
        startDate,
        endDate,
      });
      setResult(data);
    } catch (err) {
      setError(getDataCaptainErrorMessage(err));
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 pb-20 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-medium uppercase tracking-widest text-sky-300/80">Platform</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Portfolio Simulator</h1>
        <p className="mt-2 max-w-2xl text-white/55">
          Compare ETFs side-by-side — see which would have performed better over the same period.
        </p>
      </motion.div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setSymbols(p.symbols.join(","))}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:border-sky-500/30 hover:text-white"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-6">
          <h2 className="text-lg font-semibold">Compare symbols</h2>
          <div className="mt-6 space-y-4">
            <label className="block text-sm">
              <span className="text-white/50">Symbols (comma-separated)</span>
              <input
                value={symbols}
                onChange={(e) => setSymbols(e.target.value.toUpperCase())}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 font-mono text-white focus:border-sky-500/50 focus:outline-none"
              />
            </label>
            <label className="block text-sm">
              <span className="text-white/50">Investment each (USD)</span>
              <input
                type="number"
                value={investment}
                onChange={(e) => setInvestment(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-white focus:border-sky-500/50 focus:outline-none"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm">
                <span className="text-white/50">Start</span>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-white" />
              </label>
              <label className="block text-sm">
                <span className="text-white/50">End</span>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-white" />
              </label>
            </div>
          </div>
          <button
            type="button"
            onClick={runCompare}
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Comparing…" : "Compare"}
          </button>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
          )}

          {result && (
            <div className="space-y-3">
              {result.winner && (
                <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  Best performer: <strong className="font-mono">{result.winner}</strong>
                </div>
              )}
              {result.results.map((row) =>
                "error" in row ? (
                  <div key={row.symbol} className="rounded-xl border border-red-500/20 bg-black/30 p-4 text-sm text-red-300">
                    {row.symbol}: {row.error}
                  </div>
                ) : (
                  <div
                    key={row.symbol}
                    className={`rounded-xl border p-4 ${
                      row.symbol === result.winner
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : "border-white/10 bg-black/30"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="font-mono font-bold text-white">{row.symbol}</span>
                        <p className="text-xs text-white/45">{row.name}</p>
                      </div>
                      <span className={`text-lg font-semibold tabular-nums ${row.totalReturn >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {row.totalReturn >= 0 ? "+" : ""}
                        {row.totalReturn}%
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-white/50">
                      <span>Annual: {row.annualReturn}%</span>
                      <span>Drawdown: {row.maxDrawdown}%</span>
                      <span>Final: ${row.finalValue?.toLocaleString()}</span>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {!result && !loading && (
            <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-center text-sm text-white/45">
              Try VOO vs SPY vs QQQ to see which ETF performed best.
            </div>
          )}
        </div>
      </div>

      <section className="rounded-2xl border border-white/10 bg-[#0c0c14]/60 p-6">
        <h2 className="text-lg font-semibold">Coming in Phase 2</h2>
        <ul className="mt-3 space-y-2 text-sm text-white/55">
          <li>SIP calculator — monthly investments over time</li>
          <li>Weighted portfolio builder — custom allocations</li>
          <li>ETF screener — filter by expense ratio, asset class, returns</li>
        </ul>
        <Link href="/dashboard/backtesting" className="mt-4 inline-block text-sm text-indigo-400 hover:underline">
          Open backtesting →
        </Link>
      </section>
    </div>
  );
}
