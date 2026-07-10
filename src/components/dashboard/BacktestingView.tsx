"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import { datacaptainEndpoints, getDataCaptainErrorMessage } from "@/services/datacaptain/endpoints";
import type { BacktestResult } from "@/services/datacaptain/endpoints";
import type { EtfItem } from "@/services/datacaptain/endpoints";
import DatePickerField from "@/components/dashboard/DatePickerField";
import DataFreshnessLabel from "@/components/DataFreshnessLabel";
import { getDefaultBacktestDates } from "@/lib/date-utils";

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

const RECENT_ETF_KEY = "dc_backtest_recent_etfs";
const POPULAR_ETFS = ["SPY", "VOO", "QQQ", "VTI", "IWM", "DIA", "ARKK", "XLK"];
const INITIAL_POOL_LIMIT = 250;

export default function BacktestingView({ compact = false }: Props) {
  const { apiKey } = useDataCaptainKey();
  const [symbol, setSymbol] = useState("SPY");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [symbolPool, setSymbolPool] = useState<EtfItem[]>([]);
  const [remoteMatches, setRemoteMatches] = useState<EtfItem[]>([]);
  const [recentSymbols, setRecentSymbols] = useState<string[]>([]);
  const [symbolLoading, setSymbolLoading] = useState(false);
  const [investment, setInvestment] = useState("10000");
  const [startDate, setStartDate] = useState(() => getDefaultBacktestDates(5).startDate);
  const [endDate, setEndDate] = useState(() => getDefaultBacktestDates(5).endDate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BacktestResult | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const queryCacheRef = useRef<Map<string, EtfItem[]>>(new Map());

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(RECENT_ETF_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as string[];
      if (Array.isArray(parsed)) setRecentSymbols(parsed.slice(0, 6));
    } catch {
      // No-op: local cache is optional.
    }
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) setPickerOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    queryCacheRef.current.clear();
    if (!apiKey) {
      setSymbolPool([]);
      return;
    }
    const warmup = async () => {
      setSymbolLoading(true);
      try {
        const res = await datacaptainEndpoints.etfList(apiKey, {
          limit: String(INITIAL_POOL_LIMIT),
          offset: "0",
          hasPrice: "1",
        });
        setSymbolPool(res.data);
      } catch {
        setSymbolPool([]);
      } finally {
        setSymbolLoading(false);
      }
    };
    void warmup();
  }, [apiKey]);

  useEffect(() => {
    if (!apiKey) return;
    const q = symbol.trim();
    if (q.length < 2) {
      setRemoteMatches([]);
      return;
    }
    const key = q.toLowerCase();
    const cached = queryCacheRef.current.get(key);
    if (cached) {
      setRemoteMatches(cached);
      return;
    }
    const handle = setTimeout(async () => {
      try {
        const res = await datacaptainEndpoints.etfList(apiKey, {
          limit: "40",
          offset: "0",
          search: q,
          hasPrice: "1",
        });
        queryCacheRef.current.set(key, res.data);
        setRemoteMatches(res.data);
      } catch {
        setRemoteMatches([]);
      }
    }, 180);
    return () => clearTimeout(handle);
  }, [apiKey, symbol]);

  const localMatches = useMemo(() => {
    const q = symbol.trim().toLowerCase();
    if (!q) return symbolPool.slice(0, 16);
    return symbolPool
      .filter(
        (etf) => etf.symbol.toLowerCase().includes(q) || etf.name.toLowerCase().includes(q)
      )
      .slice(0, 16);
  }, [symbol, symbolPool]);

  const mergedMatches = useMemo(() => {
    const merged = [...localMatches, ...remoteMatches];
    const seen = new Set<string>();
    return merged.filter((etf) => {
      if (seen.has(etf.symbol)) return false;
      seen.add(etf.symbol);
      return true;
    });
  }, [localMatches, remoteMatches]);

  const saveRecentSymbol = (nextSymbol: string) => {
    const normalized = nextSymbol.trim().toUpperCase();
    if (!normalized) return;
    const next = [normalized, ...recentSymbols.filter((s) => s !== normalized)].slice(0, 6);
    setRecentSymbols(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(RECENT_ETF_KEY, JSON.stringify(next));
    }
  };

  const selectSymbol = (nextSymbol: string) => {
    setSymbol(nextSymbol.trim().toUpperCase());
    saveRecentSymbol(nextSymbol);
    setPickerOpen(false);
  };

  const runBacktest = async () => {
    if (!apiKey) {
      setError("Sign in and set your API key to run backtests.");
      return;
    }
    if (startDate >= endDate) {
      setError("Start date must be before end date.");
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
      saveRecentSymbol(symbol);
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
          <DataFreshnessLabel className="mt-2" />
        </motion.div>
      )}

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-6">
          <h2 className="text-lg font-semibold">Run backtest</h2>
          <p className="mt-1 text-sm text-white/45">Strategy: Buy and hold</p>

          <div className="mt-6 space-y-4">
            <label className="block text-sm">
              <span className="text-white/50">ETF / Symbol</span>
              <div className="relative mt-1.5" ref={panelRef}>
                <input
                  value={symbol}
                  onFocus={() => setPickerOpen(true)}
                  onChange={(e) => {
                    setSymbol(e.target.value);
                    setPickerOpen(true);
                  }}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 pr-10 font-mono text-white focus:border-indigo-500/50 focus:outline-none"
                  placeholder="Search symbol or ETF name"
                />
                <button
                  type="button"
                  onClick={() => setPickerOpen((v) => !v)}
                  className="absolute inset-y-0 right-2 text-white/50 hover:text-white"
                  aria-label="Toggle ETF dropdown"
                >
                  ▾
                </button>
                {pickerOpen && (
                  <div className="absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-white/10 bg-[#0b0b14] p-2 shadow-2xl">
                    {!symbol.trim() && (
                      <div className="mb-2">
                        <p className="px-2 pb-1 text-[10px] uppercase tracking-wider text-white/35">Popular</p>
                        <div className="flex flex-wrap gap-1 px-1">
                          {POPULAR_ETFS.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => selectSymbol(tag)}
                              className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-indigo-500/20"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {recentSymbols.length > 0 && !symbol.trim() && (
                      <div className="mb-2">
                        <p className="px-2 pb-1 text-[10px] uppercase tracking-wider text-white/35">Recent</p>
                        <div className="flex flex-wrap gap-1 px-1">
                          {recentSymbols.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => selectSymbol(tag)}
                              className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-200 hover:bg-emerald-500/20"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="space-y-1">
                      {mergedMatches.map((etf) => (
                        <button
                          key={etf.symbol}
                          type="button"
                          onClick={() => selectSymbol(etf.symbol)}
                          className="w-full rounded-lg px-2 py-2 text-left hover:bg-white/10"
                        >
                          <p className="font-mono text-sm text-white">{etf.symbol}</p>
                          <p className="truncate text-xs text-white/55">{etf.name}</p>
                        </button>
                      ))}
                      {!symbolLoading && mergedMatches.length === 0 && symbol.trim().length >= 2 && (
                        <p className="px-2 py-2 text-xs text-white/45">No ETF matches found</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <p className="mt-1 text-xs text-white/40">
                {symbolLoading ? "Loading ETF universe..." : "Instant suggestions with smart search"}
              </p>
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
              <DatePickerField
                label="Start"
                value={startDate}
                max={endDate}
                onChange={setStartDate}
              />
              <DatePickerField
                label="End"
                value={endDate}
                min={startDate}
                onChange={setEndDate}
              />
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
