"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { CandleBar } from "@/components/charts/CandlestickChart";
import ChartFullscreenShell, {
  ChartFullscreenToggle,
  useChartFullscreenOptional,
} from "@/components/charts/ChartFullscreenShell";
import MiniVolumeBars from "@/components/charts/MiniVolumeBars";
import MarketSnapshot, { type SnapshotCard } from "@/components/dev-dashboard/MarketSnapshot";
import {
  datacaptainEndpoints,
  getDataCaptainErrorMessage,
  type EtfDetail,
} from "@/services/datacaptain/endpoints";
import { filterByRange, formatVol, type ChartRangeId } from "@/lib/explorer/chartUtils";
import { formatPct } from "@/lib/heatmap/colors";

const CandlestickChart = dynamic(() => import("@/components/charts/CandlestickChart"), {
  ssr: false,
  loading: () => <div className="h-[360px] animate-pulse rounded-xl bg-white/5" />,
});

const TICKERS = ["SPY", "QQQ", "DIA", "VTI", "VOO", "IWM"] as const;
const RANGES: ChartRangeId[] = ["1D", "5D", "1M", "3M", "6M", "1Y", "5Y", "MAX"];

type Props = {
  apiKey: string | null;
  snapshot: SnapshotCard[];
  snapshotLoading?: boolean;
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/8 bg-black/25 px-2.5 py-2">
      <p className="text-[10px] uppercase tracking-wider text-white/35">{label}</p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums text-white/90">{value}</p>
    </div>
  );
}

function FeaturedMarketPanel({
  apiKey,
  symbol,
  setSymbol,
  range,
  setRange,
  detail,
  last,
  changePct,
  bars,
  loading,
  error,
  setHover,
  high52,
  low52,
  recentVol,
}: {
  apiKey: string | null;
  symbol: (typeof TICKERS)[number];
  setSymbol: (s: (typeof TICKERS)[number]) => void;
  range: ChartRangeId;
  setRange: (r: ChartRangeId) => void;
  detail: EtfDetail | null;
  last: CandleBar | null;
  changePct: number | null;
  bars: CandleBar[];
  loading: boolean;
  error: string | null;
  setHover: (b: CandleBar | null) => void;
  high52: number | null;
  low52: number | null;
  recentVol: CandleBar[];
}) {
  const fs = useChartFullscreenOptional();
  const open = fs?.open ?? false;

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-gradient-to-br from-[#10101a] via-[#0c0c14] to-[#0a1220] p-4 backdrop-blur-md sm:p-5 ${
        open ? "flex h-full min-h-0 flex-col border-0 bg-[#0a0a12]" : ""
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-cyan-300/70">Featured Market</p>
          <div className="mt-1 flex flex-wrap items-baseline gap-3">
            <h2 className="font-mono text-2xl font-bold tracking-tight text-white">{symbol}</h2>
            <span className="text-lg font-semibold tabular-nums text-white/90">
              {last ? `$${last.close.toFixed(2)}` : "—"}
            </span>
            <span
              className={`rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums ${
                (changePct ?? 0) >= 0
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "bg-rose-500/15 text-rose-300"
              }`}
            >
              {formatPct(typeof changePct === "number" ? changePct : null)}
            </span>
          </div>
          {detail?.name && <p className="mt-1 text-xs text-white/45">{detail.name}</p>}
        </div>
        <Link
          href={`/dashboard/etf/${symbol}`}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10"
        >
          Open detail →
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1 rounded-xl border border-white/10 bg-black/30 p-1">
          {TICKERS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSymbol(t)}
              className={`rounded-lg px-2.5 py-1 font-mono text-xs font-medium transition ${
                symbol === t
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1 rounded-xl border border-white/10 bg-black/30 p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`rounded-lg px-2 py-1 text-[11px] font-medium transition ${
                range === r ? "bg-cyan-600/80 text-white" : "text-white/50 hover:text-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className={`relative mt-3 ${open ? "min-h-0 flex-1" : "min-h-[360px]"}`}>
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-[#0c0c14]/50">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
          </div>
        )}
        {error ? (
          <div className="flex h-[360px] items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/5 text-sm text-rose-200">
            {error}
          </div>
        ) : !apiKey ? (
          <div className="flex h-[360px] items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-sm text-white/45">
            Add an API key to load live candlesticks.
          </div>
        ) : (
          <CandlestickChart
            bars={bars}
            height={open ? 560 : 360}
            onCrosshair={setHover}
            title={`${symbol}${detail?.name ? ` — ${detail.name}` : ""}`}
            enableFullscreen={false}
          />
        )}
        <ChartFullscreenToggle />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
          <Stat label="Open" value={last ? `$${last.open.toFixed(2)}` : "—"} />
          <Stat label="High" value={last ? `$${last.high.toFixed(2)}` : "—"} />
          <Stat label="Low" value={last ? `$${last.low.toFixed(2)}` : "—"} />
          <Stat label="Close" value={last ? `$${last.close.toFixed(2)}` : "—"} />
          <Stat label="Volume" value={last ? formatVol(last.volume) : "—"} />
          <Stat label="52W High" value={high52 != null ? `$${Number(high52).toFixed(2)}` : "—"} />
          <Stat label="52W Low" value={low52 != null ? `$${Number(low52).toFixed(2)}` : "—"} />
          <Stat
            label="Daily %"
            value={formatPct(typeof changePct === "number" ? changePct : null)}
          />
        </div>
        <div className="hidden rounded-lg border border-white/8 bg-black/25 px-3 py-2 xl:block">
          <p className="text-[10px] uppercase tracking-wider text-white/35">Vol (24d)</p>
          <div className="mt-1">
            <MiniVolumeBars
              volumes={recentVol.map((b) => b.volume)}
              closes={recentVol.map((b) => b.close)}
              width={96}
              height={28}
            />
          </div>
        </div>
      </div>
      <p className="mt-2 text-[10px] text-white/30">
        Powered by DataCaptain OHLCV · zoom &amp; crosshair enabled
      </p>
    </div>
  );
}

export default function FeaturedMarket({ apiKey, snapshot, snapshotLoading }: Props) {
  const [symbol, setSymbol] = useState<(typeof TICKERS)[number]>("SPY");
  const [range, setRange] = useState<ChartRangeId>("1Y");
  const [history, setHistory] = useState<CandleBar[]>([]);
  const [detail, setDetail] = useState<EtfDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hover, setHover] = useState<CandleBar | null>(null);

  const load = useCallback(async () => {
    if (!apiKey) {
      setHistory([]);
      setDetail(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [hist, etf] = await Promise.all([
        datacaptainEndpoints.stockHistory(apiKey, symbol),
        datacaptainEndpoints.etfBySymbol(apiKey, symbol).catch(() => null),
      ]);
      const bars = (Array.isArray(hist) ? hist : []).map((b) => ({
        date: String(b.date).slice(0, 10),
        open: Number(b.open),
        high: Number(b.high),
        low: Number(b.low),
        close: Number(b.close),
        volume: Number(b.volume || 0),
      }));
      setHistory(bars);
      setDetail(etf);
    } catch (err) {
      setError(getDataCaptainErrorMessage(err));
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [apiKey, symbol]);

  useEffect(() => {
    load();
  }, [load]);

  const bars = useMemo(() => filterByRange(history, range), [history, range]);
  const last = hover || bars[bars.length - 1] || null;
  const prev = bars.length >= 2 ? bars[bars.length - 2] : null;
  const changePct =
    last && prev && prev.close > 0
      ? ((last.close - prev.close) / prev.close) * 100
      : detail?.performance?.["1d"] ?? null;

  const high52 = detail?.high52w ?? null;
  const low52 = detail?.low52w ?? null;
  const recentVol = bars.slice(-24);

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(280px,3fr)]">
      <ChartFullscreenShell
        title={`${symbol}${detail?.name ? ` — ${detail.name}` : ""}`}
        subtitle="Featured market · DataCaptain OHLCV"
        className="min-w-0"
        bodyClassName="h-full"
      >
        <FeaturedMarketPanel
          apiKey={apiKey}
          symbol={symbol}
          setSymbol={setSymbol}
          range={range}
          setRange={setRange}
          detail={detail}
          last={last}
          changePct={typeof changePct === "number" ? changePct : null}
          bars={bars}
          loading={loading}
          error={error}
          setHover={setHover}
          high52={high52 != null ? Number(high52) : null}
          low52={low52 != null ? Number(low52) : null}
          recentVol={recentVol}
        />
      </ChartFullscreenShell>

      <MarketSnapshot cards={snapshot} loading={snapshotLoading} />
    </section>
  );
}
