"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import { datacaptainEndpoints, getDataCaptainErrorMessage } from "@/services/datacaptain/endpoints";
import SentimentMeter from "@/components/SentimentMeter";
import type { StockSentiment } from "@/services/datacaptain/endpoints";

type EtfDetail = { symbol: string; name: string; price: number | null; type?: string; date?: string };

const RELATED_LINKS = [
  { href: (s: string) => `/dashboard/options/${s}`, label: "Options chain" },
  { href: (s: string) => `/dashboard/insiders/${s}`, label: "Insider trades" },
  { href: (s: string) => `/dashboard/darkpool/${s}`, label: "Dark pool" },
  { href: () => `/dashboard/tools/prices`, label: "Batch prices" },
];

type EtfDetailViewProps = { symbol: string };

export default function EtfDetailView({ symbol }: EtfDetailViewProps) {
  const { apiKey } = useDataCaptainKey();
  const [etf, setEtf] = useState<EtfDetail | null>(null);
  const [sentiment, setSentiment] = useState<StockSentiment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!apiKey || !symbol) {
      setLoading(false);
      if (!apiKey) setError("Set your API key in API Keys to view ETF details.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [etfData, sentimentData] = await Promise.all([
        datacaptainEndpoints.etfBySymbol(apiKey, symbol).catch(() => null),
        datacaptainEndpoints.sentiment(apiKey, symbol).catch(() => null),
      ]);
      setEtf(etfData ?? { symbol, name: "", price: null });
      setSentiment(sentimentData ?? null);
    } catch (err) {
      setError(getDataCaptainErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [apiKey, symbol]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-8">
      <Link
        href="/dashboard/etf"
        className="inline-flex items-center gap-1 text-sm text-white/50 transition-colors hover:text-violet-300"
      >
        ← ETF Explorer
      </Link>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-medium uppercase tracking-widest text-violet-300/80">ETF</p>
        <div className="mt-1 flex flex-wrap items-end gap-3">
          <h1 className="font-mono text-3xl font-bold text-white">{symbol}</h1>
          {etf?.type && (
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-0.5 text-xs text-white/50">
              {etf.type}
            </span>
          )}
        </div>
        <p className="mt-2 max-w-2xl text-sm text-white/55">{etf?.name || "Loading fund details…"}</p>
      </motion.div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
          {!apiKey && (
            <Link href="/dashboard/api-keys" className="mt-2 block text-indigo-400 hover:underline">
              Go to API Keys →
            </Link>
          )}
        </div>
      )}

      {loading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-48 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-48 animate-pulse rounded-2xl bg-white/5" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-500/15 via-[#0c0c14] to-[#0c0c14] p-6"
          >
            <p className="text-xs font-medium uppercase tracking-widest text-white/40">Last price</p>
            {etf?.price != null ? (
              <p className="mt-2 text-4xl font-bold tabular-nums text-white">${etf.price.toFixed(2)}</p>
            ) : (
              <p className="mt-2 text-2xl text-white/40">—</p>
            )}
            {etf?.date && (
              <p className="mt-2 text-xs text-white/35">As of {etf.date}</p>
            )}
            <dl className="mt-6 space-y-3 border-t border-white/10 pt-5">
              <div className="flex justify-between gap-4 text-sm">
                <dt className="text-white/45">Symbol</dt>
                <dd className="font-mono font-medium text-violet-200">{etf?.symbol}</dd>
              </div>
              <div className="flex justify-between gap-4 text-sm">
                <dt className="text-white/45">Name</dt>
                <dd className="text-right text-white/80">{etf?.name || "—"}</dd>
              </div>
            </dl>
          </motion.section>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <SentimentMeter
              data={sentiment}
              isLoading={false}
              error={null}
              symbol={symbol}
            />
          </motion.div>
        </div>
      )}

      <section className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-5">
        <p className="text-xs font-medium uppercase tracking-widest text-white/35">Related tools</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {RELATED_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href(symbol)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition-colors hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-200"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
