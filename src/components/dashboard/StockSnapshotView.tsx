"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import {
  datacaptainEndpoints,
  getDataCaptainErrorMessage,
  type StockSnapshot,
} from "@/services/datacaptain/endpoints";
import { getPublicApiOrigin } from "@/lib/public-env";

const POPULAR = ["AAPL", "TSLA", "NVDA", "MSFT", "AMZN", "META", "SPY", "QQQ"];

function formatCap(n: number | null) {
  if (n == null) return "—";
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toLocaleString()}`;
}

function sentimentColor(label: string) {
  if (label.includes("BULL")) return "text-emerald-400";
  if (label.includes("BEAR")) return "text-red-400";
  return "text-amber-300";
}

function ScoreRing({ score, summary }: { score: number; summary: string }) {
  const pct = Math.min(100, Math.max(0, score));
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (pct / 100) * circumference;
  const stroke =
    score >= 70 ? "#34d399" : score >= 50 ? "#818cf8" : score >= 30 ? "#fbbf24" : "#f87171";

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-28 w-28">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
          <motion.circle
            cx="48"
            cy="48"
            r="42"
            fill="none"
            stroke={stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tabular-nums text-white">{score}</span>
          <span className="text-[10px] uppercase tracking-wider text-white/40">AI score</span>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-white/70">{summary}</p>
    </div>
  );
}

function SentimentBar({ score, label }: { score: number; label: string }) {
  const pct = ((score + 1) / 2) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/50">Sentiment</span>
        <span className={`font-semibold ${sentimentColor(label)}`}>{label.replace(/_/g, " ")}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <p className="text-xs text-white/35 tabular-nums">Score {score.toFixed(2)} (−1 bearish → +1 bullish)</p>
    </div>
  );
}

function MetricTile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">
      <p className="text-[10px] font-medium uppercase tracking-widest text-white/40">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums text-white">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-white/35">{sub}</p>}
    </div>
  );
}

type Props = {
  initialSymbol?: string;
};

export default function StockSnapshotView({ initialSymbol }: Props) {
  const start = (initialSymbol || "AAPL").toUpperCase();
  const { apiKey } = useDataCaptainKey();
  const [symbol, setSymbol] = useState(start);
  const [input, setInput] = useState(start);
  const [data, setData] = useState<StockSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (sym: string) => {
      const ticker = sym.trim().toUpperCase();
      if (!ticker) return;
      if (!apiKey) {
        setError("Add your API key in API Keys to load snapshots.");
        setData(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const snap = await datacaptainEndpoints.stockSnapshot(apiKey, ticker);
        setData(snap);
        setSymbol(ticker);
        setInput(ticker);
      } catch (err) {
        setError(getDataCaptainErrorMessage(err));
        setData(null);
      } finally {
        setLoading(false);
      }
    },
    [apiKey]
  );

  useEffect(() => {
    if (initialSymbol) {
      const s = initialSymbol.toUpperCase();
      setSymbol(s);
      setInput(s);
      load(s);
      return;
    }
    load(symbol);
  }, [apiKey, initialSymbol]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    load(input);
  };

  const baseUrl = getPublicApiOrigin();
  const positive = (data?.quote.change ?? 0) >= 0;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-medium uppercase tracking-widest text-violet-300/90">Market data</p>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                Free on all plans
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Stock Snapshot</h1>
            <p className="mt-1 max-w-xl text-sm text-white/50">
              One API call — live quote, profile, sentiment, indicators, AI score, earnings, and headlines.
            </p>
          </div>
          <Link
            href="/dashboard/earnings"
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70 transition-colors hover:border-indigo-500/30 hover:text-white"
          >
            Earnings calendar →
          </Link>
        </div>
      </motion.div>

      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-white/30">
            $
          </span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            placeholder="Enter symbol — AAPL"
            className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-8 pr-4 text-sm font-medium text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50"
        >
          {loading ? "Loading…" : "Get snapshot"}
        </button>
      </motion.form>

      <div className="flex flex-wrap gap-2">
        {POPULAR.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => load(s)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              symbol === s
                ? "border-indigo-500/40 bg-indigo-500/20 text-indigo-200"
                : "border-white/10 bg-white/[0.03] text-white/55 hover:border-white/20 hover:text-white"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
          {!apiKey && (
            <Link href="/dashboard/api-keys" className="ml-2 underline hover:text-red-200">
              Set API key
            </Link>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        {loading && !data && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-4 lg:grid-cols-3"
          >
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-white/5 lg:col-span-1" />
            ))}
            <div className="h-64 animate-pulse rounded-2xl bg-white/5 lg:col-span-3" />
          </motion.div>
        )}

        {data && !loading && (
          <motion.div
            key={data.symbol}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Hero quote */}
            <div className="relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-600/20 via-[#0c0c14] to-violet-600/15 p-6 sm:p-8">
              <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.25), transparent 50%), radial-gradient(circle at 80% 80%, rgba(139,92,246,0.2), transparent 45%)",
                }}
              />
              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm font-medium text-white/50">{data.profile.companyName}</p>
                  <div className="mt-1 flex flex-wrap items-baseline gap-3">
                    <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">{data.symbol}</h2>
                    <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs text-white/50">
                      {data.profile.exchange}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-white/45">
                    {data.profile.sector} · {data.profile.industry}
                  </p>
                </div>
                <div className="text-left lg:text-right">
                  <p className="text-4xl font-bold tabular-nums text-white sm:text-5xl">
                    ${data.quote.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p
                    className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold tabular-nums ${
                      positive
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-red-500/15 text-red-300"
                    }`}
                  >
                    {positive ? "▲" : "▼"} {Math.abs(data.quote.change).toFixed(2)} (
                    {data.quote.changePercent >= 0 ? "+" : ""}
                    {data.quote.changePercent.toFixed(2)}%)
                  </p>
                  <p className="mt-2 text-xs text-white/35">Mkt cap {formatCap(data.profile.marketCap)}</p>
                </div>
              </div>
            </div>

            {/* Metrics row */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {data.aiScore && (
                <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-5 sm:col-span-2 lg:col-span-1">
                  <ScoreRing score={data.aiScore.score} summary={data.aiScore.summary} />
                </div>
              )}
              <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-5 sm:col-span-2 lg:col-span-1">
                <SentimentBar score={data.sentiment.sentimentScore} label={data.sentiment.sentiment} />
                <p className="mt-3 text-xs text-white/35">{data.sentiment.mentions} mentions tracked</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:col-span-2 lg:col-span-2">
                <MetricTile label="RSI (14)" value={data.indicators?.rsi?.toFixed(1) ?? "—"} />
                <MetricTile label="SMA 20" value={data.indicators?.sma20 ? `$${data.indicators.sma20.toFixed(2)}` : "—"} />
                <MetricTile label="EMA 20" value={data.indicators?.ema20 ? `$${data.indicators.ema20.toFixed(2)}` : "—"} />
                <MetricTile
                  label="Next earnings"
                  value={data.nextEarnings?.reportDate ?? "—"}
                  sub={
                    data.nextEarnings?.consensusEps != null
                      ? `Est. EPS ${data.nextEarnings.consensusEps}`
                      : undefined
                  }
                />
              </div>
            </div>

            {/* News + earnings */}
            <div className="grid gap-6 lg:grid-cols-5">
              <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-[#0c0c14]/90 overflow-hidden">
                <div className="border-b border-white/10 bg-black/30 px-5 py-4">
                  <h3 className="font-semibold text-white">Latest headlines</h3>
                  <p className="text-xs text-white/40">From snapshot API · upgrade for full news feed</p>
                </div>
                <ul className="divide-y divide-white/5">
                  {data.news.length === 0 ? (
                    <li className="px-5 py-10 text-center text-sm text-white/40">No news for this symbol yet</li>
                  ) : (
                    data.news.map((article, i) => (
                      <motion.li
                        key={article.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group px-5 py-4 transition-colors hover:bg-white/[0.02]"
                      >
                        <div className="flex gap-3">
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-500/80" />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-white/90 group-hover:text-white">{article.headline}</p>
                            {article.summary && (
                              <p className="mt-1 line-clamp-2 text-sm text-white/45">{article.summary}</p>
                            )}
                            <p className="mt-2 text-xs text-white/35">
                              {article.source} · {new Date(article.publishedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </motion.li>
                    ))
                  )}
                </ul>
              </div>

              <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#0c0c14]/90 overflow-hidden">
                <div className="border-b border-white/10 bg-black/30 px-5 py-4">
                  <h3 className="font-semibold text-white">Earnings</h3>
                  <p className="text-xs text-white/40">Recent reports & upcoming date</p>
                </div>
                <div className="p-5 space-y-4">
                  {data.nextEarnings && (
                    <div className="rounded-xl border border-violet-500/25 bg-violet-500/10 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-violet-300/80">
                        Upcoming
                      </p>
                      <p className="mt-1 text-lg font-semibold text-white">{data.nextEarnings.reportDate}</p>
                      {data.nextEarnings.consensusEps != null && (
                        <p className="text-sm text-white/50">Consensus EPS {data.nextEarnings.consensusEps}</p>
                      )}
                    </div>
                  )}
                  <ul className="space-y-2">
                    {data.recentEarnings.map((e) => (
                      <li
                        key={e.reportDate}
                        className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5 text-sm"
                      >
                        <span className="text-white/70">{e.reportDate}</span>
                        <span className="tabular-nums text-white/90">
                          {e.eps != null ? `EPS ${e.eps}` : "—"}
                          {e.consensusEps != null && e.eps != null && (
                            <span
                              className={`ml-2 text-xs ${
                                e.eps >= e.consensusEps ? "text-emerald-400" : "text-red-400"
                              }`}
                            >
                              vs {e.consensusEps}
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* API strip */}
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wider text-indigo-300/80">API endpoint</p>
              <code className="mt-1 block break-all text-sm text-white/70">
                GET {baseUrl}/api/stocks/{data.symbol}/snapshot
              </code>
              <Link
                href="/dashboard/api-explorer"
                className="mt-2 inline-block text-sm text-indigo-400 hover:underline"
              >
                Try in API Explorer →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
