"use client";

import type { StockSentiment } from "@/services/datacaptain/endpoints";

interface SentimentMeterProps {
  data: StockSentiment | null;
  isLoading?: boolean;
  error?: string | null;
  symbol?: string;
}

function getSentimentColor(sentiment: string) {
  const s = sentiment.toUpperCase();
  if (s.includes("BULLISH")) return "bg-emerald-500";
  if (s.includes("BEARISH")) return "bg-red-500";
  return "bg-amber-500";
}


export default function SentimentMeter({
  data,
  isLoading,
  error,
  symbol,
}: SentimentMeterProps) {
  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-32 rounded bg-white/10" />
          <div className="h-4 w-full rounded bg-white/10" />
        </div>
      </div>
    );
  }

  const score = data.sentimentScore;
  const percent = ((score + 1) / 2) * 100;

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
      {symbol && (
        <p className="mb-2 text-sm text-white/60">Sentiment for {data.symbol}</p>
      )}
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold">{data.sentiment}</span>
        <span className="text-sm text-white/60">
          {data.sentimentScore.toFixed(2)} ({data.mentions} mentions)
        </span>
      </div>
      <div className="mt-4">
        <div className="h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full transition-all duration-500 ${getSentimentColor(data.sentiment)}`}
            style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-white/50">
          <span>Bearish (-1)</span>
          <span>Neutral (0)</span>
          <span>Bullish (+1)</span>
        </div>
      </div>
    </div>
  );
}
