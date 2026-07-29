"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import {
  datacaptainEndpoints,
  getDataCaptainErrorMessage,
  type EtfDetail,
  type MarketStatus,
  type StockNewsArticle,
  type StockSentiment,
} from "@/services/datacaptain/endpoints";
import { getPublicApiOrigin } from "@/lib/public-env";
import { formatCompact, formatPct, pushRecentEtf } from "@/lib/explorer/helpers";
import { loadFavorites, toggleFavorite } from "@/lib/screener/storage";
import EtfResearchChart from "@/components/explorer/EtfResearchChart";
import ExplorerDividendChart from "@/components/explorer/ExplorerDividendChart";
import SentimentMeter from "@/components/SentimentMeter";
import ScreenerCompareModal from "@/components/screener/ScreenerCompareModal";

const PERF_KEYS = ["1m", "3m", "6m", "ytd", "1y", "3y", "5y", "10y"] as const;

type EtfDetailViewProps = { symbol: string };

export default function EtfDetailView({ symbol }: EtfDetailViewProps) {
  const { apiKey } = useDataCaptainKey();
  const [etf, setEtf] = useState<EtfDetail | null>(null);
  const [sentiment, setSentiment] = useState<StockSentiment | null>(null);
  const [news, setNews] = useState<StockNewsArticle[]>([]);
  const [marketStatus, setMarketStatus] = useState<MarketStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorited, setFavorited] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCompare, setShowCompare] = useState(false);

  const fetchData = useCallback(async () => {
    if (!apiKey || !symbol) {
      setLoading(false);
      if (!apiKey) setError("Set your API key in API Keys to view ETF details.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [etfData, sentimentData, newsData, statusData] = await Promise.all([
        datacaptainEndpoints.etfBySymbol(apiKey, symbol),
        datacaptainEndpoints.sentiment(apiKey, symbol).catch(() => null),
        datacaptainEndpoints.stockNews(apiKey, symbol, { limit: "8" }).catch(() => null),
        datacaptainEndpoints.marketStatus(apiKey).catch(() => null),
      ]);
      setEtf(etfData);
      setSentiment(sentimentData);
      setNews(newsData?.articles ?? []);
      setMarketStatus(statusData);
      pushRecentEtf(symbol);
    } catch (err) {
      setError(getDataCaptainErrorMessage(err));
      setEtf(null);
    } finally {
      setLoading(false);
    }
  }, [apiKey, symbol]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setFavorited(loadFavorites().includes(symbol.toUpperCase()));
  }, [symbol]);

  const origin = getPublicApiOrigin();
  const apiExample = `GET ${origin}/api/etf/${symbol.toUpperCase()}\nx-api-key: YOUR_API_KEY`;

  const metrics = useMemo(() => {
    if (!etf) return [];
    return [
      { label: "Price", value: etf.price != null ? `$${etf.price.toFixed(2)}` : "—" },
      { label: "Daily change", value: formatPct(etf.change1d), tone: (etf.change1d ?? 0) >= 0 },
      { label: "52-week high", value: etf.high52w != null ? `$${etf.high52w.toFixed(2)}` : "—" },
      { label: "52-week low", value: etf.low52w != null ? `$${etf.low52w.toFixed(2)}` : "—" },
      { label: "AUM", value: etf.aumBillions != null ? `$${etf.aumBillions}B` : "—" },
      { label: "Volume", value: formatCompact(etf.volume ?? etf.avgVolume30d) },
      { label: "Expense ratio", value: etf.expenseRatio != null ? `${etf.expenseRatio}%` : "—" },
      { label: "Dividend yield", value: formatPct(etf.dividendYieldTtm) },
      { label: "Beta", value: etf.beta != null ? etf.beta.toFixed(2) : "—" },
      { label: "Volatility", value: formatPct(etf.volatility1y) },
      { label: "Sharpe ratio", value: etf.sharpeRatio != null ? etf.sharpeRatio.toFixed(2) : "—" },
      { label: "Max drawdown", value: formatPct(etf.maxDrawdown) },
    ];
  }, [etf]);

  const related = [
    { href: "/dashboard/backtesting", label: "Backtesting" },
    { href: "/dashboard/etf/heatmap", label: "Heatmap" },
    { href: "/dashboard/etf/rankings", label: "Rankings" },
    { href: "/dashboard/portfolio", label: "Portfolio" },
    { href: "/dashboard/etf/screener", label: "Screener" },
  ];

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 pb-20">
        <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
        <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
        <div className="h-96 animate-pulse rounded-2xl bg-white/5" />
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-20">
      <Link
        href="/dashboard/etf"
        className="inline-flex items-center gap-1 text-sm text-white/50 transition-colors hover:text-violet-300"
      >
        ← ETF Explorer
      </Link>

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
          {!apiKey && (
            <Link href="/dashboard/api-keys" className="ml-2 underline">
              Open API Keys
            </Link>
          )}
        </div>
      )}

      {etf && (
        <>
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/15 via-[#0c0c14] to-[#0a0a12] p-5 sm:p-7"
          >
            <div className="flex flex-wrap items-start gap-5">
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-violet-400/30 bg-violet-500/20 font-mono text-lg font-bold text-violet-100"
                aria-hidden
              >
                {symbol.slice(0, 3)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-mono text-3xl font-bold text-white sm:text-4xl">{etf.symbol}</h1>
                  <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-xs text-white/55">
                    {etf.category ?? "ETF"}
                  </span>
                  {(etf.badges || []).slice(0, 3).map((b) => (
                    <span
                      key={b}
                      className="rounded-full border border-violet-500/25 bg-violet-500/10 px-2 py-0.5 text-[10px] text-violet-200"
                    >
                      {b}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-base text-white/65 sm:text-lg">{etf.name}</p>
                <p className="mt-1 text-sm text-white/40">
                  {etf.issuer ?? "—"} · {etf.country ?? "US"} · {etf.assetClass ?? "Equity"}
                </p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/35">Expense</p>
                    <p className="font-semibold tabular-nums">
                      {etf.expenseRatio != null ? `${etf.expenseRatio}%` : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/35">Yield</p>
                    <p className="font-semibold tabular-nums">{formatPct(etf.dividendYieldTtm)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/35">AUM</p>
                    <p className="font-semibold tabular-nums">
                      {etf.aumBillions != null ? `$${etf.aumBillions}B` : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/35">Price</p>
                    <p className="font-semibold tabular-nums">
                      {etf.price != null ? `$${etf.price.toFixed(2)}` : "—"}
                      <span
                        className={`ml-2 text-sm ${(etf.change1d ?? 0) >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                      >
                        {formatPct(etf.change1d)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setFavorited(toggleFavorite(etf.symbol).includes(etf.symbol))}
                  className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200"
                >
                  {favorited ? "★ Favorited" : "☆ Favorite"}
                </button>
                {(etf.similar?.length ?? 0) >= 1 && (
                  <button
                    type="button"
                    onClick={() => setShowCompare(true)}
                    className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200"
                  >
                    Compare similar
                  </button>
                )}
              </div>
            </div>
          </motion.section>

          <EtfResearchChart
            symbol={etf.symbol}
            history={etf.history ?? []}
            dividends={etf.dividends}
            performance={etf.performance}
            marketStatus={marketStatus}
            asOf={etf.asOf ?? etf.date}
          />

          <section>
            <h2 className="text-sm font-medium uppercase tracking-wider text-white/40">Key metrics</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {metrics.map((m) => (
                <div key={m.label} className="rounded-xl border border-white/10 bg-black/30 p-3.5">
                  <p className="text-[10px] uppercase tracking-wider text-white/40">{m.label}</p>
                  <p
                    className={`mt-1 text-base font-semibold tabular-nums ${
                      m.tone === true
                        ? "text-emerald-400"
                        : m.tone === false
                          ? "text-rose-400"
                          : "text-white"
                    }`}
                  >
                    {m.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-5">
              <h2 className="font-semibold">Holdings</h2>
              <p className="mt-2 text-sm text-white/50">
                {etf.holdingsNote ??
                  "Top holdings are not available in the current metrics dataset."}
              </p>
              <div className="mt-4 flex h-40 items-center justify-center rounded-xl border border-dashed border-white/10 text-xs text-white/35">
                Portfolio weight chart — pending fund filings feed
              </div>
            </section>
            <section className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-5">
              <h2 className="font-semibold">Sector & geography</h2>
              <p className="mt-2 text-sm text-white/50">
                Official sector and geographic weights are not in this dataset. Category:{" "}
                <span className="text-violet-200">{etf.category ?? "—"}</span>
                {" · "}
                Country focus: <span className="text-violet-200">{etf.country ?? "US"}</span>
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-white/10 text-xs text-white/35">
                  Sector allocation
                </div>
                <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-white/10 text-xs text-white/35">
                  Geographic exposure
                </div>
              </div>
            </section>
          </div>

          <section className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-5">
            <h2 className="font-semibold">Performance</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-[11px] uppercase tracking-wider text-white/40">
                    {PERF_KEYS.map((k) => (
                      <th key={k} className="px-2 py-2">
                        {k.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {PERF_KEYS.map((k) => {
                      const v = etf.performance?.[k] ?? null;
                      return (
                        <td
                          key={k}
                          className={`px-2 py-3 font-semibold tabular-nums ${
                            (v ?? 0) >= 0 ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {formatPct(v)}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-5">
              <h2 className="font-semibold">Dividend history</h2>
              <div className="mt-4">
                <ExplorerDividendChart dividends={etf.dividends ?? []} />
              </div>
            </section>
            <section className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-5">
              <h2 className="font-semibold">Risk analysis</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Risk rating", value: etf.risk?.rating ?? "—" },
                  { label: "Volatility (1Y)", value: formatPct(etf.risk?.volatility1y) },
                  { label: "Sharpe", value: etf.risk?.sharpeRatio?.toFixed(2) ?? "—" },
                  { label: "Max drawdown", value: formatPct(etf.risk?.maxDrawdown) },
                  { label: "Beta (est.)", value: etf.risk?.beta?.toFixed(2) ?? "—" },
                  {
                    label: "Leverage flags",
                    value: [etf.leveraged && "Leveraged", etf.inverse && "Inverse"]
                      .filter(Boolean)
                      .join(", ") || "None",
                  },
                ].map((card) => (
                  <div key={card.label} className="rounded-xl border border-white/10 bg-black/30 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-white/40">{card.label}</p>
                    <p className="mt-1 font-semibold text-white">{card.value}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {etf.aiSummary && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-violet-500/25 bg-violet-500/10 p-5"
            >
              <h2 className="text-sm font-medium uppercase tracking-wider text-violet-200/80">
                AI research summary
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/75">{etf.aiSummary}</p>
            </motion.section>
          )}

          {(etf.similar?.length ?? 0) > 0 && (
            <section className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-semibold">Similar ETFs</h2>
                <button
                  type="button"
                  onClick={() => setShowCompare(true)}
                  className="text-xs text-cyan-300 hover:underline"
                >
                  Open compare table
                </button>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {etf.similar!.map((s) => (
                  <Link
                    key={s.symbol}
                    href={`/dashboard/etf/${s.symbol}`}
                    className="rounded-xl border border-white/10 bg-black/30 p-4 transition hover:border-violet-500/35"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-semibold text-violet-300">{s.symbol}</span>
                      <span
                        className={`text-sm tabular-nums ${(s.return1y ?? 0) >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                      >
                        {formatPct(s.return1y)}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs text-white/50">{s.name}</p>
                    <p className="mt-2 text-[11px] text-white/35">
                      Yld {formatPct(s.dividendYieldTtm)} · Exp{" "}
                      {s.expenseRatio != null ? `${s.expenseRatio}%` : "—"}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-5">
            <h2 className="font-semibold">Related tools</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {related.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/70 hover:border-violet-500/40 hover:text-white"
                >
                  {r.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold">API endpoint</h2>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(apiExample);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="rounded-lg border border-white/15 px-3 py-1 text-xs text-white/70"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-violet-300/90">
              {apiExample}
            </pre>
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-5">
              <h2 className="font-semibold">News</h2>
              {news.length === 0 ? (
                <p className="mt-3 text-sm text-white/45">No recent articles for this symbol.</p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {news.map((a) => (
                    <li key={a.id} className="border-b border-white/5 pb-3 last:border-0">
                      {a.url ? (
                        <a
                          href={a.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-medium text-white hover:text-violet-300"
                        >
                          {a.headline}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-white">{a.headline}</p>
                      )}
                      <p className="mt-1 text-[11px] text-white/35">
                        {a.source ?? "News"} · {String(a.publishedAt).slice(0, 10)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-5">
              <h2 className="font-semibold">Sentiment</h2>
              <div className="mt-4">
                <SentimentMeter data={sentiment} symbol={symbol} />
              </div>
            </section>
          </div>

          {showCompare && etf.similar && etf.similar.length > 0 && (
            <ScreenerCompareModal
              rows={[etf, ...etf.similar].map((c) => ({
                symbol: c.symbol,
                name: c.name,
                latestPrice: c.price ?? null,
                asOf: c.asOf ?? null,
                returnYtd: c.returnYtd ?? null,
                return1y: c.return1y ?? null,
                return3y: c.return3y ?? null,
                return5y: c.return5y ?? null,
                dividendYieldTtm: c.dividendYieldTtm ?? null,
                volatility1y: c.volatility1y ?? null,
                avgVolume30d: c.avgVolume30d ?? null,
                assetClass: c.assetClass ?? null,
                aumBillions: c.aumBillions,
                expenseRatio: c.expenseRatio,
                sharpeRatio: c.sharpeRatio,
                issuer: c.issuer,
                category: c.category,
                cagr: c.cagr,
              }))}
              onClose={() => setShowCompare(false)}
            />
          )}
        </>
      )}
    </div>
  );
}
