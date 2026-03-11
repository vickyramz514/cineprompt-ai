"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import { datacaptainEndpoints, getDataCaptainErrorMessage } from "@/services/datacaptain/endpoints";
import SentimentMeter from "@/components/SentimentMeter";
import type { StockSentiment } from "@/services/datacaptain/endpoints";

type EtfDetail = { symbol: string; name: string; price: number | null; type?: string; date?: string };

export default function EtfDetailPage() {
  const params = useParams();
  const symbol = String(params.symbol ?? "").toUpperCase();
  const { apiKey } = useDataCaptainKey();
  const [etf, setEtf] = useState<EtfDetail | null>(null);
  const [sentiment, setSentiment] = useState<StockSentiment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!apiKey || !symbol) {
      setLoading(false);
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
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/etf"
          className="text-sm text-white/60 hover:text-white"
        >
          ← ETF Explorer
        </Link>
      </div>
      <div>
        <h1 className="text-2xl font-semibold">{symbol}</h1>
        <p className="mt-1 text-white/60">{etf?.name || "ETF details"}</p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="animate-pulse space-y-6">
          <div className="h-24 rounded-xl bg-white/10" />
          <div className="h-32 rounded-xl bg-white/10" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider">Details</h2>
            <dl className="mt-4 space-y-3">
              <div>
                <dt className="text-sm text-white/50">Symbol</dt>
                <dd className="font-semibold">{etf?.symbol}</dd>
              </div>
              <div>
                <dt className="text-sm text-white/50">Name</dt>
                <dd className="text-white/80">{etf?.name || "—"}</dd>
              </div>
              <div>
                <dt className="text-sm text-white/50">Price</dt>
                <dd className="text-xl font-semibold">
                  {etf?.price != null ? `$${etf.price.toFixed(2)}` : "—"}
                </dd>
              </div>
              {etf?.type && (
                <div>
                  <dt className="text-sm text-white/50">Type</dt>
                  <dd>{etf.type}</dd>
                </div>
              )}
            </dl>
          </div>
          <div>
            <SentimentMeter
              data={sentiment}
              isLoading={false}
              error={null}
              symbol={symbol}
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/dashboard/options/${symbol}`}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
        >
          Options Chain
        </Link>
        <Link
          href={`/dashboard/insiders/${symbol}`}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
        >
          Insider Trades
        </Link>
        <Link
          href={`/dashboard/darkpool/${symbol}`}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
        >
          Dark Pool
        </Link>
      </div>
    </div>
  );
}
