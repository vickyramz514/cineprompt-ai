"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getPublicApiBaseUrl } from "@/lib/public-env";

type PlatformStatus = {
  status: string;
  data?: {
    etfCount?: number | null;
    historicalPriceRows?: number | null;
    latestPriceDate?: string | null;
  };
};

const QUOTES = [
  {
    quote:
      "One API key for screener, heatmap, and backtests beats stitching three vendors together.",
    role: "Fintech engineer",
  },
  {
    quote:
      "Free tier is enough to wire a prototype; Starter unlocked the history we needed for research charts.",
    role: "Quant researcher",
  },
  {
    quote: "Predictable JSON and clear daily limits — easy to put behind our backend.",
    role: "Full-stack developer",
  },
] as const;

function formatCompact(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}k`;
  return String(n);
}

export default function SocialProofSection() {
  const [status, setStatus] = useState<PlatformStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${getPublicApiBaseUrl()}/status`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!cancelled && json) setStatus(json as PlatformStatus);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const etfCount = status?.data?.etfCount;
  const bars = status?.data?.historicalPriceRows;
  const asOf = status?.data?.latestPriceDate;

  return (
    <section className="border-t border-white/5 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm font-medium uppercase tracking-wider text-indigo-400/90">
            Trust
          </p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Built for builders — backed by live data</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/55">
            Public platform stats from our status API. Quotes reflect common use cases from early
            developers — not paid endorsements.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "US ETFs in catalog",
              value: etfCount != null ? formatCompact(etfCount) : "—",
              detail: "Live instrument count",
            },
            {
              label: "Historical price rows",
              value: bars != null ? formatCompact(bars) : "—",
              detail: asOf ? `Through ${asOf}` : "OHLCV warehouse",
            },
            {
              label: "API status",
              value: status?.status === "operational" ? "Operational" : status?.status ?? "…",
              detail: (
                <Link href="/status" className="text-indigo-400 hover:underline">
                  View status page
                </Link>
              ),
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-6 text-center"
            >
              <p className="text-3xl font-bold tracking-tight text-white">{stat.value}</p>
              <p className="mt-2 text-sm font-medium text-white/80">{stat.label}</p>
              <p className="mt-1 text-xs text-white/45">{stat.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {QUOTES.map((q) => (
            <blockquote
              key={q.role}
              className="rounded-2xl border border-white/10 bg-black/20 p-5 text-left"
            >
              <p className="text-sm leading-relaxed text-white/70">&ldquo;{q.quote}&rdquo;</p>
              <footer className="mt-4 text-xs font-medium uppercase tracking-wider text-white/40">
                — {q.role}
              </footer>
            </blockquote>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-white/45">
          Used by algorithmic traders, analysts, and fintech teams prototyping ETF products.{" "}
          <Link href="/about" className="text-indigo-400 hover:underline">
            About Data Captain
          </Link>
        </p>
      </div>
    </section>
  );
}
