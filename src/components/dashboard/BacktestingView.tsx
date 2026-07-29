"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import { usePlanAccess } from "@/hooks/usePlanAccess";
import {
  datacaptainEndpoints,
  getDataCaptainErrorMessage,
  type BacktestResult,
  type EtfItem,
} from "@/services/datacaptain/endpoints";
import DatePickerField from "@/components/dashboard/DatePickerField";
import DataFreshnessLabel from "@/components/DataFreshnessLabel";
import { getDefaultBacktestDates } from "@/lib/date-utils";
import { MetricCard } from "@/components/backtesting/MetricCard";
import { BacktestEmptyState, BacktestLoadingState } from "@/components/backtesting/BacktestStates";
import AnnualReturnsTable from "@/components/backtesting/AnnualReturnsTable";
import ApiExamplePanel from "@/components/backtesting/ApiExamplePanel";
import StrategySelector from "@/components/backtesting/StrategySelector";
import BacktestPremiumPreviewBody from "@/components/backtesting/BacktestPremiumPreviewBody";
import PremiumBlurSection from "@/components/paywall/PremiumBlurSection";
import FreeMarketChart from "@/components/market/FreeMarketChart";
import type { BacktestStrategyId } from "@/lib/backtest/strategies";
import { BACKTEST_STRATEGIES, defaultParamsFor } from "@/lib/backtest/strategies";
import {
  derivePortfolioStats,
  formatPct,
  formatUsd,
  formatUsdPrecise,
  computeBeta,
} from "@/lib/backtest/metrics";
import {
  exportBacktestCsv,
  exportBacktestJson,
  exportBacktestPdf,
  shareBacktestResult,
} from "@/lib/backtest/export";

const BACKTEST_PREMIUM_FEATURES = [
  "Buy & Hold Strategy",
  "Dollar Cost Averaging",
  "SMA Strategy",
  "EMA Strategy",
  "RSI Strategy",
  "MACD Strategy",
  "Strategy Comparison",
  "Portfolio Growth",
  "Drawdown Analysis",
  "Monthly Returns",
  "Dividend Reinvestment",
  "Export CSV",
  "Export PDF",
  "API Access",
];

const BacktestTerminalCharts = dynamic(
  () => import("@/components/backtesting/BacktestTerminalCharts"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[480px] animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]" />
    ),
  }
);

const RECENT_ETF_KEY = "dc_backtest_recent_etfs";
const POPULAR_ETFS = ["SPY", "VOO", "QQQ", "VTI", "IWM", "DIA", "ARKK", "XLK"];
const INITIAL_POOL_LIMIT = 250;

function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-start justify-between gap-3 rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-left transition hover:border-white/20"
    >
      <span>
        <span className="block text-sm text-white/80">{label}</span>
        {hint && <span className="mt-0.5 block text-[11px] text-white/40">{hint}</span>}
      </span>
      <span
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-emerald-500/80" : "bg-white/15"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? "left-5" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}

function SymbolField({
  label,
  value,
  onChange,
  apiKey,
  symbolPool,
  symbolLoading,
  recentSymbols,
  onSelect,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  apiKey: string | null;
  symbolPool: EtfItem[];
  symbolLoading: boolean;
  recentSymbols: string[];
  onSelect: (symbol: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [remote, setRemote] = useState<EtfItem[]>([]);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const cacheRef = useRef<Map<string, EtfItem[]>>(new Map());

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (!apiKey) return;
    const q = value.trim();
    if (q.length < 2) {
      setRemote([]);
      return;
    }
    const key = q.toLowerCase();
    const cached = cacheRef.current.get(key);
    if (cached) {
      setRemote(cached);
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
        cacheRef.current.set(key, res.data);
        setRemote(res.data);
      } catch {
        setRemote([]);
      }
    }, 180);
    return () => clearTimeout(handle);
  }, [apiKey, value]);

  const localMatches = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return symbolPool.slice(0, 16);
    return symbolPool
      .filter((etf) => etf.symbol.toLowerCase().includes(q) || etf.name.toLowerCase().includes(q))
      .slice(0, 16);
  }, [value, symbolPool]);

  const merged = useMemo(() => {
    const all = [...localMatches, ...remote];
    const seen = new Set<string>();
    return all.filter((etf) => {
      if (seen.has(etf.symbol)) return false;
      seen.add(etf.symbol);
      return true;
    });
  }, [localMatches, remote]);

  return (
    <label className="block text-sm">
      <span className="text-white/50">{label}</span>
      <div className="relative mt-1.5" ref={panelRef}>
        <input
          value={value}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 pr-10 font-mono text-white focus:border-indigo-500/50 focus:outline-none"
          placeholder="Search symbol or ETF name"
        />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="absolute inset-y-0 right-2 text-white/50 hover:text-white"
          aria-label="Toggle ETF dropdown"
        >
          ▾
        </button>
        {open && (
          <div className="absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-white/10 bg-[#0b0b14] p-2 shadow-2xl">
            {!value.trim() && (
              <div className="mb-2">
                <p className="px-2 pb-1 text-[10px] uppercase tracking-wider text-white/35">Popular</p>
                <div className="flex flex-wrap gap-1 px-1">
                  {POPULAR_ETFS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        onSelect(tag);
                        setOpen(false);
                      }}
                      className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-indigo-500/20"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {recentSymbols.length > 0 && !value.trim() && (
              <div className="mb-2">
                <p className="px-2 pb-1 text-[10px] uppercase tracking-wider text-white/35">Recent</p>
                <div className="flex flex-wrap gap-1 px-1">
                  {recentSymbols.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        onSelect(tag);
                        setOpen(false);
                      }}
                      className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-200 hover:bg-emerald-500/20"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-1">
              {merged.map((etf) => (
                <button
                  key={etf.symbol}
                  type="button"
                  onClick={() => {
                    onSelect(etf.symbol);
                    setOpen(false);
                  }}
                  className="w-full rounded-lg px-2 py-2 text-left hover:bg-white/10"
                >
                  <p className="font-mono text-sm text-white">{etf.symbol}</p>
                  <p className="truncate text-xs text-white/55">{etf.name}</p>
                </button>
              ))}
              {!symbolLoading && merged.length === 0 && value.trim().length >= 2 && (
                <p className="px-2 py-2 text-xs text-white/45">No ETF matches found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </label>
  );
}

type Props = { compact?: boolean };

export default function BacktestingView({ compact = false }: Props) {
  const { apiKey } = useDataCaptainKey();
  const { hasAccess, isLoading: planLoading } = usePlanAccess();
  const canBacktest = hasAccess("backtesting");
  const [symbol, setSymbol] = useState("SPY");
  const [compareSymbol, setCompareSymbol] = useState("");
  const [enableCompare, setEnableCompare] = useState(false);
  const [symbolPool, setSymbolPool] = useState<EtfItem[]>([]);
  const [recentSymbols, setRecentSymbols] = useState<string[]>([]);
  const [symbolLoading, setSymbolLoading] = useState(false);
  const [investment, setInvestment] = useState("10000");
  const [startDate, setStartDate] = useState(() => getDefaultBacktestDates(5).startDate);
  const [endDate, setEndDate] = useState(() => getDefaultBacktestDates(5).endDate);
  const [strategy, setStrategy] = useState<BacktestStrategyId>("buy_and_hold");
  const [strategyParams, setStrategyParams] = useState<Record<string, number>>(() =>
    defaultParamsFor("buy_and_hold")
  );
  const [reinvestDividends, setReinvestDividends] = useState(true);
  const [adjustForInflation, setAdjustForInflation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [compareResult, setCompareResult] = useState<BacktestResult | null>(null);
  const [shareNote, setShareNote] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(RECENT_ETF_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as string[];
      if (Array.isArray(parsed)) setRecentSymbols(parsed.slice(0, 6));
    } catch {
      /* optional */
    }
  }, []);

  useEffect(() => {
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
    if (!loading) {
      setProgress(0);
      return;
    }
    setProgress(8);
    const id = window.setInterval(() => {
      setProgress((p) => (p >= 92 ? p : p + Math.random() * 10 + 4));
    }, 280);
    return () => window.clearInterval(id);
  }, [loading]);

  const saveRecentSymbol = (nextSymbol: string) => {
    const normalized = nextSymbol.trim().toUpperCase();
    if (!normalized) return;
    const next = [normalized, ...recentSymbols.filter((s) => s !== normalized)].slice(0, 6);
    setRecentSymbols(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(RECENT_ETF_KEY, JSON.stringify(next));
    }
  };

  const stats = useMemo(() => (result ? derivePortfolioStats(result) : null), [result]);
  const cagr = result ? result.cagr ?? result.annualReturn : 0;
  const beta = useMemo(() => {
    if (!result?.equityCurve?.length || !compareResult?.equityCurve?.length) return null;
    return computeBeta(result.equityCurve, compareResult.equityCurve);
  }, [result, compareResult]);

  const runBacktest = async () => {
    if (!canBacktest) {
      setError("Upgrade to unlock strategy simulation.");
      return;
    }
    if (!apiKey) {
      setError("Sign in and set your API key to run backtests.");
      return;
    }
    if (startDate >= endDate) {
      setError("Start date must be before end date.");
      return;
    }
    const primary = symbol.trim().toUpperCase();
    const secondary = compareSymbol.trim().toUpperCase();
    if (enableCompare && secondary && secondary === primary) {
      setError("Compare symbol must be different from the primary ETF.");
      return;
    }

    setLoading(true);
    setError(null);
    setShareNote(null);
    try {
      const bodyBase = {
        investment: Number(investment),
        startDate,
        endDate,
        strategy,
        reinvestDividends,
        adjustForInflation,
        ...strategyParams,
      };

      const primaryPromise = datacaptainEndpoints.backtestBuyAndHold(apiKey, {
        ...bodyBase,
        symbol: primary,
      });

      const comparePromise =
        enableCompare && secondary
          ? datacaptainEndpoints.backtestBuyAndHold(apiKey, { ...bodyBase, symbol: secondary })
          : Promise.resolve(null);

      const [primaryData, compareData] = await Promise.all([primaryPromise, comparePromise]);
      setResult(primaryData);
      setCompareResult(compareData);
      saveRecentSymbol(primary);
      if (secondary) saveRecentSymbol(secondary);
      setProgress(100);
    } catch (err) {
      setError(getDataCaptainErrorMessage(err));
      setResult(null);
      setCompareResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={compact ? "space-y-6" : "mx-auto max-w-7xl space-y-8 px-4 pb-24 sm:px-6 lg:px-8"}>
      {!compact && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-medium uppercase tracking-widest text-emerald-300/80">Research</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">ETF Backtesting</h1>
          <p className="mt-2 max-w-2xl text-white/55">
            Explore professional historical charts for free. Upgrade to simulate strategies, measure risk,
            and export institutional-grade research.
          </p>
          <DataFreshnessLabel className="mt-2" />
        </motion.div>
      )}

      {/* Section 1 — Free market chart for everyone */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-violet-300/80">
              Free · Market data
            </p>
            <h2 className="text-lg font-semibold text-white">Interactive price chart</h2>
          </div>
        </div>
        <FreeMarketChart symbol={symbol || "SPY"} apiKey={apiKey} />
      </section>

      {/* Section 2 — Premium analytics */}
      {planLoading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-white/5" />
      ) : !canBacktest ? (
        <section className="space-y-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-amber-300/80">
              Premium · Strategy lab
            </p>
            <h2 className="text-lg font-semibold text-white">Professional backtesting</h2>
          </div>
          <PremiumBlurSection
            title="Unlock Professional Backtesting"
            subtitle="Analyze historical strategies using Buy & Hold, DCA, SMA Crossovers, EMA Crossovers, RSI, MACD and more."
            features={BACKTEST_PREMIUM_FEATURES}
            primaryHref="/dashboard/wallet"
            secondaryHref="/pricing"
            primaryLabel="Upgrade Now"
            secondaryLabel="View Pricing"
            tertiaryHref="/docs"
            tertiaryLabel="Learn More"
          >
            <BacktestPremiumPreviewBody />
          </PremiumBlurSection>
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-4 sm:flex-row sm:justify-between">
            <p className="text-sm text-white/60">
              Upgrade to unlock strategy simulation — Run Backtest stays locked on Free.
            </p>
            <Link
              href="/dashboard/wallet"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:brightness-110"
            >
              Upgrade Now
            </Link>
          </div>
        </section>
      ) : (
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <aside className="h-fit rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-5 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.7)] lg:sticky lg:top-6">
          <h2 className="text-lg font-semibold">Run backtest</h2>
          <p className="mt-1 text-sm text-white/45">Configure universe, capital, and options</p>

          <div className="mt-5 space-y-4">
            <StrategySelector
              value={strategy}
              onChange={(id) => {
                setStrategy(id);
                setStrategyParams(defaultParamsFor(id));
              }}
              params={strategyParams}
              onParamsChange={setStrategyParams}
            />

            <SymbolField
              label="Primary ETF"
              value={symbol}
              onChange={setSymbol}
              apiKey={apiKey}
              symbolPool={symbolPool}
              symbolLoading={symbolLoading}
              recentSymbols={recentSymbols}
              onSelect={(s) => {
                setSymbol(s);
                saveRecentSymbol(s);
              }}
            />

            <Toggle
              checked={enableCompare}
              onChange={setEnableCompare}
              label="Compare with another ETF"
              hint="Overlay equity curves and side-by-side metrics"
            />

            {enableCompare && (
              <SymbolField
                label="Compare with"
                value={compareSymbol}
                onChange={setCompareSymbol}
                apiKey={apiKey}
                symbolPool={symbolPool}
                symbolLoading={symbolLoading}
                recentSymbols={recentSymbols}
                onSelect={(s) => {
                  setCompareSymbol(s);
                  saveRecentSymbol(s);
                }}
              />
            )}

            <label className="block text-sm">
              <span className="text-white/50">Investment (USD)</span>
              <input
                type="number"
                min={1}
                value={investment}
                onChange={(e) => setInvestment(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-white focus:border-indigo-500/50 focus:outline-none"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <DatePickerField label="Start" value={startDate} max={endDate} onChange={setStartDate} />
              <DatePickerField label="End" value={endDate} min={startDate} onChange={setEndDate} />
            </div>

            <Toggle
              checked={reinvestDividends}
              onChange={setReinvestDividends}
              label="Reinvest Dividends"
              hint="Default ON — dividends buy additional shares"
            />
            <Toggle
              checked={adjustForInflation}
              onChange={setAdjustForInflation}
              label="Adjust for Inflation"
              hint="Default OFF — approx. 2.5% annual deflator"
            />
          </div>

          <button
            type="button"
            onClick={runBacktest}
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_-12px_rgba(16,185,129,0.55)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
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
        </aside>

        <div className="min-w-0 space-y-4">
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {loading && <BacktestLoadingState progress={progress} />}

          {!result && !loading && <BacktestEmptyState />}

          {result && stats && !loading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Results header */}
              <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-2xl font-bold tracking-tight text-emerald-300 sm:text-3xl">
                      {result.symbol}
                    </p>
                    <p className="mt-1 max-w-xl text-sm text-white/60 sm:text-base">
                      {result.name || "Exchange-traded fund"}
                    </p>
                    <p className="mt-2 text-xs text-white/40">
                      Strategy:{" "}
                      <span className="text-white/70">
                        {BACKTEST_STRATEGIES.find((s) => s.id === (result.strategy as BacktestStrategyId))
                          ?.label || result.strategy}
                      </span>
                      {result.trades != null ? ` · ${result.trades} trades` : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => exportBacktestCsv(result, compareResult)}
                      className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 hover:bg-white/10"
                    >
                      Export CSV
                    </button>
                    <button
                      type="button"
                      onClick={() => exportBacktestJson(result, compareResult)}
                      className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 hover:bg-white/10"
                    >
                      Export JSON
                    </button>
                    <button
                      type="button"
                      onClick={() => exportBacktestPdf(result)}
                      className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 hover:bg-white/10"
                    >
                      Export PDF
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await shareBacktestResult(result);
                        setShareNote("Summary copied / share sheet opened");
                        setTimeout(() => setShareNote(null), 2000);
                      }}
                      className="rounded-lg border border-indigo-400/30 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-indigo-200 hover:bg-indigo-500/25"
                    >
                      Share Result
                    </button>
                  </div>
                </div>
                {shareNote && <p className="mt-2 text-xs text-emerald-300/80">{shareNote}</p>}

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-wider text-white/40">Investment</p>
                    <p className="mt-1 text-lg font-semibold tabular-nums">{formatUsd(result.initialInvestment)}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-wider text-white/40">Period</p>
                    <p className="mt-1 text-sm font-medium tabular-nums text-white/85">
                      {result.startDate} → {result.endDate}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-wider text-white/40">Duration</p>
                    <p className="mt-1 text-lg font-semibold tabular-nums">
                      {stats.durationYears.toFixed(1)} Years
                    </p>
                  </div>
                </div>
              </div>

              {/* Performance metrics */}
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  label="Total return"
                  value={formatPct(result.totalReturn)}
                  accent={result.totalReturn >= 0 ? "text-emerald-400" : "text-red-400"}
                />
                <MetricCard label="CAGR (Annualized Return)" value={formatPct(cagr)} accent="text-indigo-300" />
                <MetricCard
                  label="Total Profit ($)"
                  value={formatUsdPrecise(stats.totalProfit)}
                  accent={stats.totalProfit >= 0 ? "text-emerald-400" : "text-red-400"}
                />
                <MetricCard label="Max drawdown" value={`${result.maxDrawdown}%`} accent="text-amber-300" />
                <MetricCard
                  label="Sharpe Ratio"
                  value={result.sharpe != null ? String(result.sharpe) : "—"}
                  hint="Excess return / volatility"
                />
                <MetricCard
                  label="Volatility"
                  value={result.volatility != null ? `${result.volatility}%` : "—"}
                  hint="Annualized"
                />
                <MetricCard
                  label="Sortino Ratio"
                  value={result.sortino != null ? String(result.sortino) : "—"}
                  hint="Downside-risk adjusted"
                />
                <MetricCard
                  label="Beta"
                  value={beta != null ? String(beta) : enableCompare ? "—" : "Compare to compute"}
                  hint={compareResult ? `vs ${compareResult.symbol}` : "Requires compare ETF"}
                />
                <MetricCard
                  label="Final value"
                  value={formatUsdPrecise(result.finalValue)}
                  hint={
                    result.adjustForInflation && result.inflationAdjustedFinalValue != null
                      ? `Inflation-adj ${formatUsdPrecise(result.inflationAdjustedFinalValue)}`
                      : result.reinvestDividends
                        ? "Dividends reinvested"
                        : "Dividends as cash"
                  }
                />
              </div>

              {/* Summary */}
              <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-5">
                <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">Backtest summary</p>
                <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    ["Initial Investment", formatUsdPrecise(result.initialInvestment)],
                    ["Final Value", formatUsdPrecise(result.finalValue)],
                    ["Total Profit", formatUsdPrecise(stats.totalProfit)],
                    ["Total Return %", formatPct(result.totalReturn)],
                    ["CAGR", formatPct(cagr)],
                    ["Investment Period", `${result.startDate} → ${result.endDate}`],
                    ["Trading Days", String(stats.tradingDays)],
                    ["Dividend yield", result.dividendYield != null ? `${result.dividendYield}%` : "N/A"],
                    ["Risk score", `${result.riskScore}/100`],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-lg border border-white/5 bg-black/20 px-3 py-2.5">
                      <dt className="text-[11px] text-white/40">{k}</dt>
                      <dd className="mt-0.5 text-sm font-medium tabular-nums text-white/85">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Comparison */}
              {compareResult && (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-emerald-300/70">
                    ETF comparison
                  </p>
                  <p className="mt-1 text-sm text-white/55">
                    {result.symbol} vs {compareResult.symbol}
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <MetricCard
                      label={`${result.symbol} Total Return`}
                      value={formatPct(result.totalReturn)}
                      accent="text-indigo-300"
                    />
                    <MetricCard
                      label={`${compareResult.symbol} Total Return`}
                      value={formatPct(compareResult.totalReturn)}
                      accent="text-emerald-300"
                    />
                    <MetricCard label={`${result.symbol} CAGR`} value={formatPct(result.cagr ?? result.annualReturn)} />
                    <MetricCard
                      label={`${compareResult.symbol} CAGR`}
                      value={formatPct(compareResult.cagr ?? compareResult.annualReturn)}
                    />
                    <MetricCard label={`${result.symbol} Max DD`} value={`${result.maxDrawdown}%`} accent="text-amber-300" />
                    <MetricCard
                      label={`${compareResult.symbol} Max DD`}
                      value={`${compareResult.maxDrawdown}%`}
                      accent="text-amber-300"
                    />
                    <MetricCard label={`${result.symbol} Final`} value={formatUsdPrecise(result.finalValue)} />
                    <MetricCard
                      label={`${compareResult.symbol} Final`}
                      value={formatUsdPrecise(compareResult.finalValue)}
                    />
                  </div>
                </div>
              )}

              <BacktestTerminalCharts
                result={result}
                compareResult={compareResult}
                beta={beta}
                monthlyCells={stats.monthlyCells}
              />

              {/* Portfolio growth */}
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="Highest Portfolio Value" value={formatUsdPrecise(stats.highestValue)} />
                <MetricCard label="Lowest Portfolio Value" value={formatUsdPrecise(stats.lowestValue)} />
                <MetricCard
                  label="Best Year Return"
                  value={stats.bestYearReturn != null ? formatPct(stats.bestYearReturn) : "—"}
                  accent="text-emerald-400"
                />
                <MetricCard
                  label="Worst Year Return"
                  value={stats.worstYearReturn != null ? formatPct(stats.worstYearReturn) : "—"}
                  accent="text-red-400"
                />
              </div>

              <AnnualReturnsTable rows={stats.annualRows} />
              <ApiExamplePanel result={result} />
            </motion.div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
