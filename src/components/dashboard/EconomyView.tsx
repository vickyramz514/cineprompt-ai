"use client";

import { useEffect, useState, useCallback, type ReactNode } from "react";
import Link from "next/link";
import { motion, useSpring, useTransform } from "framer-motion";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import { datacaptainEndpoints, getDataCaptainErrorMessage } from "@/services/datacaptain/endpoints";
import type { EconomicIndicators } from "@/services/datacaptain/endpoints";
import { getPublicApiOrigin } from "@/lib/public-env";
import JsonHighlight from "@/components/dashboard/JsonHighlight";

type IndicatorKey = keyof EconomicIndicators;

type IndicatorConfig = {
  key: IndicatorKey;
  label: string;
  shortLabel: string;
  suffix: string;
  description: string;
  source: string;
  accent: string;
  border: string;
  icon: ReactNode;
  /** Rough "healthy" band for visual hint (min, max inclusive) */
  band: [number, number];
};

const INDICATORS: IndicatorConfig[] = [
  {
    key: "inflation",
    label: "Inflation (CPI)",
    shortLabel: "Inflation",
    suffix: "%",
    description: "Year-over-year consumer price change — purchasing power and Fed policy input.",
    source: "BLS / CPI",
    accent: "text-amber-300",
    border: "border-amber-500/30 from-amber-500/15 via-[#0c0c14] to-[#0c0c14]",
    band: [2, 3.5],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" d="M4 18h4l3-8 4 14 3-6h2" />
      </svg>
    ),
  },
  {
    key: "interestRate",
    label: "Fed Funds Rate",
    shortLabel: "Interest rate",
    suffix: "%",
    description: "Benchmark policy rate — affects borrowing costs, equities, and bond yields.",
    source: "Federal Reserve",
    accent: "text-violet-300",
    border: "border-violet-500/30 from-violet-500/15 via-[#0c0c14] to-[#0c0c14]",
    band: [3, 5.5],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M8 7h8M7 12h10M8 17h8" />
      </svg>
    ),
  },
  {
    key: "gdpGrowth",
    label: "GDP Growth",
    shortLabel: "GDP",
    suffix: "%",
    description: "Real GDP growth — broad measure of economic expansion or contraction.",
    source: "BEA",
    accent: "text-emerald-300",
    border: "border-emerald-500/30 from-emerald-500/15 via-[#0c0c14] to-[#0c0c14]",
    band: [1.5, 3.5],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4-6 4 4 4-8 4 6" />
        <path strokeLinecap="round" d="M4 20h16" />
      </svg>
    ),
  },
  {
    key: "unemploymentRate",
    label: "Unemployment",
    shortLabel: "Unemployment",
    suffix: "%",
    description: "Share of labor force without work — labor market tightness signal.",
    source: "BLS",
    accent: "text-sky-300",
    border: "border-sky-500/30 from-sky-500/15 via-[#0c0c14] to-[#0c0c14]",
    band: [3.5, 5],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="3" />
        <path strokeLinecap="round" d="M6 20v-1a6 6 0 0 1 12 0v1" />
      </svg>
    ),
  },
];

function bandStatus(value: number, band: [number, number], invert = false) {
  const inBand = value >= band[0] && value <= band[1];
  if (invert) {
    if (inBand) return { label: "Moderate", class: "text-emerald-400/90 bg-emerald-500/15 border-emerald-500/25" };
    if (value < band[0]) return { label: "Low", class: "text-sky-400/90 bg-sky-500/15 border-sky-500/25" };
    return { label: "Elevated", class: "text-amber-400/90 bg-amber-500/15 border-amber-500/25" };
  }
  if (inBand) return { label: "In range", class: "text-emerald-400/90 bg-emerald-500/15 border-emerald-500/25" };
  if (value < band[0]) return { label: "Below typical", class: "text-sky-400/90 bg-sky-500/15 border-sky-500/25" };
  return { label: "Above typical", class: "text-amber-400/90 bg-amber-500/15 border-amber-500/25" };
}

function DecimalValue({
  value,
  suffix,
  className,
}: {
  value: number;
  suffix: string;
  className?: string;
}) {
  const spring = useSpring(0, { stiffness: 80, damping: 26 });
  const display = useTransform(spring, (v) => `${v.toFixed(2)}${suffix}`);
  const [text, setText] = useState(`0.00${suffix}`);

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    const unsub = display.on("change", (v) => setText(v));
    return () => unsub();
  }, [display]);

  return <motion.span className={className}>{text}</motion.span>;
}

function IndicatorCard({
  config,
  value,
  index,
}: {
  config: IndicatorConfig;
  value: number;
  index: number;
}) {
  const invertBand = config.key === "unemploymentRate" || config.key === "inflation";
  const status = bandStatus(value, config.band, invertBand);
  const bandPct =
    config.band[1] > config.band[0]
      ? Math.min(100, Math.max(8, ((value - config.band[0]) / (config.band[1] - config.band[0])) * 100))
      : 50;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 ${config.border}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className={`rounded-xl border border-white/10 bg-black/30 p-2.5 ${config.accent}`}>
            {config.icon}
          </div>
          <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${status.class}`}>
            {status.label}
          </span>
        </div>
        <p className="mt-4 text-xs font-medium uppercase tracking-widest text-white/40">{config.label}</p>
        <p className="mt-1 text-3xl font-bold tabular-nums text-white">
          <DecimalValue value={value} suffix={config.suffix} />
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/45">{config.description}</p>
        <div className="mt-4">
          <div className="flex justify-between text-[10px] text-white/35">
            <span>Typical range {config.band[0]}–{config.band[1]}{config.suffix}</span>
            <span className="text-white/25">{config.source}</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${
                config.key === "inflation"
                  ? "from-amber-600 to-amber-400"
                  : config.key === "interestRate"
                    ? "from-violet-600 to-violet-400"
                    : config.key === "gdpGrowth"
                      ? "from-emerald-600 to-emerald-400"
                      : "from-sky-600 to-sky-400"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${bandPct}%` }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 + index * 0.05 }}
            />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-6">
      <div className="h-10 w-10 animate-pulse rounded-xl bg-white/10" />
      <div className="mt-4 h-3 w-28 animate-pulse rounded bg-white/10" />
      <div className="mt-3 h-9 w-24 animate-pulse rounded bg-white/10" />
      <div className="mt-4 h-12 w-full animate-pulse rounded bg-white/5" />
    </div>
  );
}

export default function EconomyView() {
  const { apiKey } = useDataCaptainKey();
  const [data, setData] = useState<EconomicIndicators | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    if (!apiKey) {
      setLoading(false);
      setError("Set your API key in API Keys to load macro data.");
      return;
    }
    setError(null);
    try {
      const res = await datacaptainEndpoints.economyIndicators(apiKey);
      setData(res);
    } catch (err) {
      setError(getDataCaptainErrorMessage(err));
      setData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    setLoading(true);
    fetchData();
  };

  const baseUrl = getPublicApiOrigin();
  const apiPath = "/api/economy/indicators";
  const exampleJson = data
    ? JSON.stringify(data, null, 2)
    : JSON.stringify(
        { inflation: 3.2, interestRate: 5.25, gdpGrowth: 2.4, unemploymentRate: 3.8 },
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
          <p className="text-xs font-medium uppercase tracking-widest text-cyan-300/80">Macro</p>
          <h1 className="mt-0.5 text-2xl font-semibold sm:text-3xl">Economic Indicators</h1>
          <p className="mt-1 max-w-xl text-sm text-white/50">
            Key US macro metrics — inflation, policy rates, growth, and labor market health
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading || !apiKey}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 disabled:opacity-50"
          >
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
          <Link
            href="/dashboard/api-docs"
            className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-200 hover:bg-cyan-500/20"
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

      {data && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-500/5 via-[#0c0c14] to-indigo-500/5 p-5"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-white/35">Snapshot</p>
          <div className="mt-3 flex flex-wrap gap-4">
            {INDICATORS.map((ind) => (
              <div key={ind.key} className="flex items-baseline gap-2">
                <span className="text-sm text-white/50">{ind.shortLabel}</span>
                <span className={`text-lg font-semibold tabular-nums ${ind.accent}`}>
                  {(data[ind.key] ?? 0).toFixed(2)}
                  {ind.suffix}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {loading
          ? INDICATORS.map((ind) => <SkeletonCard key={ind.key} />)
          : data
            ? INDICATORS.map((ind, i) => (
                <IndicatorCard key={ind.key} config={ind} value={data[ind.key] ?? 0} index={i} />
              ))
            : null}
      </div>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 overflow-hidden"
      >
        <div className="border-b border-white/10 bg-white/[0.03] px-5 py-4">
          <h2 className="text-lg font-semibold">API endpoint</h2>
          <p className="mt-1 text-sm text-white/45">
            <code className="text-cyan-300/90">GET {apiPath}</code> — cached ~5 min
          </p>
        </div>
        <div className="grid gap-0 lg:grid-cols-2">
          <div className="border-b border-white/10 p-5 lg:border-b-0 lg:border-r">
            <p className="text-xs font-medium uppercase tracking-wider text-white/35">Request</p>
            <pre className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs leading-relaxed text-white/80">
              {`GET ${baseUrl}${apiPath}\nx-api-key: YOUR_API_KEY`}
            </pre>
          </div>
          <div className="p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-white/35">Response</p>
            <div className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs">
              <JsonHighlight json={exampleJson} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 border-t border-white/10 px-5 py-4">
          <Link
            href="/dashboard/api-explorer"
            className="text-sm text-indigo-400/90 hover:text-indigo-300"
          >
            Try in API Explorer →
          </Link>
          <Link href="/dashboard/usage" className="text-sm text-white/45 hover:text-white/70">
            View usage →
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
