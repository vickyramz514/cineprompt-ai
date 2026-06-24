"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import { datacaptainEndpoints, getDataCaptainErrorMessage } from "@/services/datacaptain/endpoints";
import type { BacktestResult } from "@/services/datacaptain/endpoints";

function MetricCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4">
      <p className="text-xs uppercase tracking-wider text-white/40">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tabular-nums ${accent ?? "text-white"}`}>{value}</p>
    </div>
  );
}

function EquityChart({ curve }: { curve: BacktestResult["equityCurve"] }) {
  if (!curve.length) return null;
  const values = curve.map((c) => c.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4">
      <p className="text-xs uppercase tracking-wider text-white/40">Equity curve</p>
      <div className="mt-4 flex h-32 items-end gap-px">
        {curve.map((point, i) => {
          const h = ((point.value - min) / range) * 100;
          const show = i % Math.max(1, Math.floor(curve.length / 48)) === 0 || i === curve.length - 1;
          if (!show) return null;
          return (
            <div
              key={point.date}
              className="min-w-[2px] flex-1 rounded-t bg-gradient-to-t from-indigo-600 to-violet-400"
              style={{ height: `${Math.max(h, 4)}%` }}
              title={`${point.date}: $${point.value.toLocaleString()}`}
            />
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-white/35">
        <span>{curve[0]?.date}</span>
        <span>{curve[curve.length - 1]?.date}</span>
      </div>
    </div>
  );
}

type Props = {
  compact?: boolean;
};

export default function BacktestingView({ compact = false }: Props) {
  const { apiKey } = useDataCaptainKey();
  const [symbol, setSymbol] = useState("SPY");
  const [investment, setInvestment] = useState("10000");
  const [startDate, setStartDate] = useState("2015-01-01");
  const [endDate, setEndDate] = useState("2025-01-01");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BacktestResult | null>(null);

  const runBacktest = async () => {
    if (!apiKey) {
      setError("Sign in and set your API key to run backtests.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await datacaptainEndpoints.backtestBuyAndHold(apiKey, {
        symbol: symbol.trim().toUpperCase(),
        investment: Number(investment),
        startDate,
        endDate,
        strategy: "buy_and_hold",
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
    <div className={compact ? "space-y-6" : "mx-auto max-w-5xl space-y-8 px-4 pb-20 sm:px-6 lg:px-8"}>
      {!compact && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-medium uppercase tracking-widest text-emerald-300/80">Platform</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">ETF Backtesting</h1>
          <p className="mt-2 max-w-2xl text-white/55">
            Run buy-and-hold simulations on your historical data. Same login, same database, same API key.
          </p>
        </motion.div>
      )}

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-6">
          <h2 className="text-lg font-semibold">Run backtest</h2>
          <p className="mt-1 text-sm text-white/45">Strategy: Buy and hold</p>

          <div className="mt-6 space-y-4">
            <label className="block text-sm">
              <span className="text-white/50">ETF / Symbol</span>
              <input
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 font-mono text-white focus:border-indigo-500/50 focus:outline-none"
                placeholder="SPY"
              />
            </label>
            <label className="block text-sm">
              <span className="text-white/50">Investment (USD)</span>
              <input
                type="number"
                value={investment}
                onChange={(e) => setInvestment(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-white focus:border-indigo-500/50 focus:outline-none"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm">
                <span className="text-white/50">Start</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-white focus:border-indigo-500/50 focus:outline-none"
                />
              </label>
              <label className="block text-sm">
                <span className="text-white/50">End</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-white focus:border-indigo-500/50 focus:outline-none"
                />
              </label>
            </div>
          </div>

          <button
            type="button"
            onClick={runBacktest}
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Running…" : "Run backtest"}
          </button>

          {!apiKey && (
            <p className="mt-4 text-center text-sm text-white/45">
              <Link href="/auth/signup" className="text-indigo-400 hover:underline">
                Sign up
              </Link>{" "}
              and add your API key in{" "}
              <Link href="/dashboard/api-keys" className="text-indigo-400 hover:underline">
                API Keys
              </Link>
            </p>
          )}
        </div>

        <div className="space-y-4">
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {!result && !loading && (
            <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-center text-sm text-white/45">
              Configure your ETF and date range, then run a backtest to see returns, drawdown, and risk metrics.
            </div>
          )}

          {result && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-5">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-mono text-xl font-bold text-emerald-300">{result.symbol}</span>
                  <span className="text-sm text-white/50">{result.name}</span>
                </div>
                <p className="mt-1 text-xs text-white/35">
                  {result.startDate} → {result.endDate} · ${result.initialInvestment.toLocaleString()} invested
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <MetricCard
                  label="Total return"
                  value={`${result.totalReturn >= 0 ? "+" : ""}${result.totalReturn}%`}
                  accent={result.totalReturn >= 0 ? "text-emerald-400" : "text-red-400"}
                />
                <MetricCard label="Annual return" value={`${result.annualReturn}%`} accent="text-indigo-300" />
                <MetricCard label="Max drawdown" value={`${result.maxDrawdown}%`} accent="text-amber-300" />
                <MetricCard
                  label="Final value"
                  value={`$${result.finalValue.toLocaleString()}`}
                />
                <MetricCard
                  label="Dividend yield"
                  value={result.dividendYield != null ? `${result.dividendYield}%` : "N/A"}
                />
                <MetricCard label="Risk score" value={`${result.riskScore}/100`} accent="text-violet-300" />
              </div>

              <EquityChart curve={result.equityCurve} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
