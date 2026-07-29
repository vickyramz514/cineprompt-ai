"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { IChartApi, ISeriesApi, MouseEventParams, Time } from "lightweight-charts";
import { ema, macd, rsi, sma, type Ohlcv } from "@/lib/explorer/chartIndicators";
import { formatVol, sampleBars } from "@/lib/explorer/chartUtils";
import { formatCompact, formatPct } from "@/lib/explorer/helpers";
import {
  datacaptainEndpoints,
  getDataCaptainErrorMessage,
  type EtfDetail,
  type MarketStatus,
} from "@/services/datacaptain/endpoints";
import ChartFullscreenShell, {
  ChartFullscreenToggle,
  useChartFullscreen,
} from "@/components/charts/ChartFullscreenShell";

const POPULAR_ETFS = ["SPY", "VOO", "QQQ", "VTI", "IWM", "DIA", "ARKK", "XLK"] as const;

const FREE_RANGES = [
  { id: "1W", days: 7 },
  { id: "1M", days: 31 },
  { id: "3M", days: 93 },
  { id: "6M", days: 183 },
  { id: "YTD", days: null },
  { id: "1Y", days: 365 },
  { id: "3Y", days: 365 * 3 },
  { id: "5Y", days: 365 * 5 },
  { id: "MAX", days: null },
] as const;

type FreeRangeId = (typeof FREE_RANGES)[number]["id"];
type ChartType = "candlestick" | "line" | "area";
type OverlayId = "sma20" | "sma50" | "sma200" | "ema20" | "ema50";
type LowerPanel = "volume" | "rsi" | "macd";

const OVERLAY_OPTS: { id: OverlayId; label: string }[] = [
  { id: "sma20", label: "SMA20" },
  { id: "sma50", label: "SMA50" },
  { id: "sma200", label: "SMA200" },
  { id: "ema20", label: "EMA20" },
  { id: "ema50", label: "EMA50" },
];

const LOWER_OPTS: { id: LowerPanel; label: string }[] = [
  { id: "volume", label: "Volume" },
  { id: "rsi", label: "RSI" },
  { id: "macd", label: "MACD" },
];

type Props = {
  symbol?: string;
  apiKey: string | null;
  className?: string;
};

type TooltipState = {
  x: number;
  y: number;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
} | null;

function toTime(date: string): Time {
  return date as Time;
}

function filterByFreeRange(history: Ohlcv[], range: FreeRangeId): Ohlcv[] {
  if (!history.length) return [];
  if (range === "MAX") return history;
  const last = history[history.length - 1];
  if (range === "YTD") {
    const y = last.date.slice(0, 4);
    return history.filter((p) => p.date >= `${y}-01-01`);
  }
  const def = FREE_RANGES.find((r) => r.id === range);
  if (!def?.days) return history;
  const cut = new Date(last.date);
  cut.setUTCDate(cut.getUTCDate() - def.days);
  const cutStr = cut.toISOString().slice(0, 10);
  return history.filter((p) => p.date >= cutStr);
}

function clearChartSeries(chart: IChartApi) {
  while (chart.panes().length > 1) {
    chart.removePane(chart.panes().length - 1);
  }
  for (const pane of chart.panes()) {
    for (const series of [...pane.getSeries()]) {
      chart.removeSeries(series);
    }
  }
}

function TooltipRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 tabular-nums">
      <span className="text-white/45">{label}</span>
      <span className="text-white/85">{value}</span>
    </div>
  );
}

export default function FreeMarketChart({
  symbol: initialSymbol = "SPY",
  apiKey,
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const mainSeriesRef = useRef<ISeriesApi<"Candlestick" | "Line" | "Area"> | null>(null);
  const barsRef = useRef<Ohlcv[]>([]);
  const moveHandlerRef = useRef<((p: MouseEventParams<Time>) => void) | null>(null);

  const [symbol, setSymbol] = useState(initialSymbol.toUpperCase());
  const [customSymbol, setCustomSymbol] = useState("");
  const [etf, setEtf] = useState<EtfDetail | null>(null);
  const [marketStatus, setMarketStatus] = useState<MarketStatus | null>(null);
  const [history, setHistory] = useState<Ohlcv[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [range, setRange] = useState<FreeRangeId>("1Y");
  const [chartType, setChartType] = useState<ChartType>("candlestick");
  const [overlays, setOverlays] = useState<Set<OverlayId>>(
    () => new Set(["sma20", "sma50"])
  );
  const [lowerPanels, setLowerPanels] = useState<Set<LowerPanel>>(
    () => new Set(["volume"])
  );
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSymbol(initialSymbol.toUpperCase());
  }, [initialSymbol]);

  const fetchData = useCallback(async () => {
    if (!apiKey) {
      setEtf(null);
      setHistory([]);
      setMarketStatus(null);
      setError("Set your API key in API Keys to load market data.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [etfData, statusData, histFallback] = await Promise.all([
        datacaptainEndpoints.etfBySymbol(apiKey, symbol),
        datacaptainEndpoints.marketStatus(apiKey).catch(() => null),
        datacaptainEndpoints.stockHistory(apiKey, symbol).catch(() => null),
      ]);
      setEtf(etfData);
      setMarketStatus(statusData);
      const fromEtf = (etfData.history ?? []) as Ohlcv[];
      const fromStock = (histFallback ?? []) as Ohlcv[];
      setHistory(fromEtf.length ? fromEtf : fromStock);
    } catch (err) {
      setError(getDataCaptainErrorMessage(err));
      setEtf(null);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [apiKey, symbol]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const bars = useMemo(
    () => sampleBars(filterByFreeRange(history, range), 2500),
    [history, range]
  );
  const overlaysKey = useMemo(() => [...overlays].sort().join(","), [overlays]);
  const lowerKey = useMemo(() => [...lowerPanels].sort().join(","), [lowerPanels]);

  const last = history[history.length - 1];
  const prev = history.length >= 2 ? history[history.length - 2] : null;
  const price = etf?.price ?? last?.close ?? null;
  const dayChange =
    etf?.change1d != null && price != null
      ? (price * etf.change1d) / 100
      : price != null && prev
        ? price - prev.close
        : null;
  const dayPct =
    etf?.change1d ??
    (price != null && prev && prev.close ? ((price - prev.close) / prev.close) * 100 : null);
  const up = (dayPct ?? 0) >= 0;

  const high52 = etf?.high52w ?? null;
  const low52 = etf?.low52w ?? null;
  const avgVol = etf?.avgVolume30d ?? etf?.volume ?? null;
  const lastUpdated = etf?.asOf ?? etf?.date ?? last?.date ?? marketStatus?.asOf ?? null;

  const toggleOverlay = (id: OverlayId) => {
    setOverlays((prevSet) => {
      const next = new Set(prevSet);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleLower = (id: LowerPanel) => {
    setLowerPanels((prevSet) => {
      const next = new Set(prevSet);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const applySymbol = (next: string) => {
    const cleaned = next.trim().toUpperCase();
    if (!cleaned) return;
    setSymbol(cleaned);
    setCustomSymbol("");
  };

  // Create chart once
  useEffect(() => {
    let disposed = false;
    const el = containerRef.current;
    if (!el) return;

    (async () => {
      const lc = await import("lightweight-charts");
      if (disposed || !containerRef.current) return;

      const chart = lc.createChart(containerRef.current, {
        autoSize: true,
        layout: {
          background: { type: lc.ColorType.Solid, color: "#0a0a12" },
          textColor: "rgba(255,255,255,0.55)",
          fontSize: 11,
          attributionLogo: false,
        },
        grid: {
          vertLines: { color: "rgba(255,255,255,0.04)" },
          horzLines: { color: "rgba(255,255,255,0.04)" },
        },
        crosshair: {
          mode: lc.CrosshairMode.Normal,
          vertLine: { color: "rgba(167,139,250,0.45)", labelBackgroundColor: "#5b21b6" },
          horzLine: { color: "rgba(167,139,250,0.45)", labelBackgroundColor: "#5b21b6" },
        },
        rightPriceScale: { borderColor: "rgba(255,255,255,0.08)" },
        timeScale: {
          borderColor: "rgba(255,255,255,0.08)",
          timeVisible: false,
          rightOffset: 4,
          barSpacing: 7,
          minBarSpacing: 2,
        },
        handleScroll: {
          mouseWheel: true,
          pressedMouseMove: true,
          horzTouchDrag: true,
          vertTouchDrag: true,
        },
        handleScale: {
          mouseWheel: true,
          pinch: true,
          axisPressedMouseMove: { time: true, price: true },
          axisDoubleClickReset: { time: true, price: true },
        },
      });

      chartRef.current = chart;

      const onMove = (param: MouseEventParams<Time>) => {
        if (!param.point || !param.time) {
          setTooltip(null);
          return;
        }
        const date = String(param.time);
        const idx = barsRef.current.findIndex((b) => b.date === date);
        if (idx < 0) {
          setTooltip(null);
          return;
        }
        const b = barsRef.current[idx];
        setTooltip({
          x: param.point.x,
          y: param.point.y,
          date: b.date,
          open: b.open,
          high: b.high,
          low: b.low,
          close: b.close,
          volume: b.volume,
        });
      };

      moveHandlerRef.current = onMove;
      chart.subscribeCrosshairMove(onMove);
      setReady(true);
    })();

    return () => {
      disposed = true;
      const chart = chartRef.current;
      if (chart) {
        if (moveHandlerRef.current) chart.unsubscribeCrosshairMove(moveHandlerRef.current);
        chart.remove();
      }
      chartRef.current = null;
      mainSeriesRef.current = null;
      setReady(false);
    };
  }, []);

  // Rebuild series when inputs change
  useEffect(() => {
    if (!ready || !chartRef.current) return;
    let cancelled = false;

    (async () => {
      const lc = await import("lightweight-charts");
      const chart = chartRef.current;
      if (!chart || cancelled) return;

      clearChartSeries(chart);
      mainSeriesRef.current = null;
      barsRef.current = bars;
      if (!bars.length) {
        setTooltip(null);
        return;
      }

      const candleData = bars.map((b) => ({
        time: toTime(b.date),
        open: b.open,
        high: b.high,
        low: b.low,
        close: b.close,
      }));
      const lineData = bars.map((b) => ({ time: toTime(b.date), value: b.close }));
      const closes = bars.map((b) => b.close);
      const showVolume = lowerPanels.has("volume");
      const showRsi = lowerPanels.has("rsi");
      const showMacd = lowerPanels.has("macd");
      const lowerCount = (showRsi ? 1 : 0) + (showMacd ? 1 : 0);

      let main: ISeriesApi<"Candlestick" | "Line" | "Area">;
      if (chartType === "candlestick") {
        main = chart.addSeries(lc.CandlestickSeries, {
          upColor: "#34d399",
          downColor: "#fb7185",
          borderUpColor: "#34d399",
          borderDownColor: "#fb7185",
          wickUpColor: "#34d399",
          wickDownColor: "#fb7185",
        });
        main.setData(candleData);
      } else if (chartType === "line") {
        main = chart.addSeries(lc.LineSeries, {
          color: "#a78bfa",
          lineWidth: 2,
          lastPriceAnimation: lc.LastPriceAnimationMode.OnDataUpdate,
        });
        main.setData(lineData);
      } else {
        main = chart.addSeries(lc.AreaSeries, {
          lineColor: "#a78bfa",
          topColor: "rgba(167,139,250,0.35)",
          bottomColor: "rgba(167,139,250,0.02)",
          lineWidth: 2,
          lastPriceAnimation: lc.LastPriceAnimationMode.OnDataUpdate,
        });
        main.setData(lineData);
      }
      mainSeriesRef.current = main;
      main.priceScale().applyOptions({
        scaleMargins: {
          top: 0.08,
          bottom: showVolume ? 0.42 : lowerCount > 0 ? 0.18 : 0.12,
        },
      });

      if (showVolume) {
        const vol = chart.addSeries(lc.HistogramSeries, {
          priceFormat: { type: "volume" },
          priceScaleId: "volume",
          lastValueVisible: false,
          priceLineVisible: false,
        });
        vol.priceScale().applyOptions({
          scaleMargins: { top: 0.72, bottom: 0 },
        });
        vol.setData(
          bars.map((b) => ({
            time: toTime(b.date),
            value: b.volume,
            color: b.close >= b.open ? "rgba(52,211,153,0.45)" : "rgba(251,113,133,0.45)",
          }))
        );
      }

      const addOverlay = (color: string, values: Array<number | null>, width: 1 | 2 = 1) => {
        const series = chart.addSeries(lc.LineSeries, {
          color,
          lineWidth: width,
          priceLineVisible: false,
          lastValueVisible: false,
          crosshairMarkerVisible: false,
        });
        series.setData(
          bars.flatMap((b, i) =>
            values[i] == null ? [] : [{ time: toTime(b.date), value: values[i] as number }]
          )
        );
      };

      if (overlays.has("sma20")) addOverlay("#38bdf8", sma(closes, 20));
      if (overlays.has("sma50")) addOverlay("#fbbf24", sma(closes, 50));
      if (overlays.has("sma200")) addOverlay("#f472b6", sma(closes, 200), 2);
      if (overlays.has("ema20")) addOverlay("#22d3ee", ema(closes, 20));
      if (overlays.has("ema50")) addOverlay("#a3e635", ema(closes, 50));

      let paneIdx = 1;
      if (showRsi) {
        const vals = rsi(closes, 14);
        const s = chart.addSeries(
          lc.LineSeries,
          { color: "#c4b5fd", lineWidth: 2, priceLineVisible: false },
          paneIdx
        );
        s.setData(
          bars.flatMap((b, i) =>
            vals[i] == null ? [] : [{ time: toTime(b.date), value: vals[i] as number }]
          )
        );
        s.createPriceLine({
          price: 70,
          color: "rgba(251,113,133,0.5)",
          lineWidth: 1,
          lineStyle: lc.LineStyle.Dashed,
          axisLabelVisible: true,
          title: "70",
        });
        s.createPriceLine({
          price: 30,
          color: "rgba(52,211,153,0.5)",
          lineWidth: 1,
          lineStyle: lc.LineStyle.Dashed,
          axisLabelVisible: true,
          title: "30",
        });
        chart.panes()[paneIdx]?.setHeight(100);
        paneIdx += 1;
      }

      if (showMacd) {
        const m = macd(closes);
        const hist = chart.addSeries(
          lc.HistogramSeries,
          { priceLineVisible: false, lastValueVisible: false },
          paneIdx
        );
        hist.setData(
          bars.flatMap((b, i) =>
            m.hist[i] == null
              ? []
              : [
                  {
                    time: toTime(b.date),
                    value: m.hist[i] as number,
                    color:
                      (m.hist[i] as number) >= 0
                        ? "rgba(52,211,153,0.55)"
                        : "rgba(251,113,133,0.55)",
                  },
                ]
          )
        );
        const line = chart.addSeries(
          lc.LineSeries,
          { color: "#38bdf8", lineWidth: 2, priceLineVisible: false },
          paneIdx
        );
        line.setData(
          bars.flatMap((b, i) =>
            m.line[i] == null ? [] : [{ time: toTime(b.date), value: m.line[i] as number }]
          )
        );
        const sig = chart.addSeries(
          lc.LineSeries,
          { color: "#fbbf24", lineWidth: 1, priceLineVisible: false },
          paneIdx
        );
        sig.setData(
          bars.flatMap((b, i) =>
            m.signal[i] == null ? [] : [{ time: toTime(b.date), value: m.signal[i] as number }]
          )
        );
        chart.panes()[paneIdx]?.setHeight(110);
      }

      chart.timeScale().fitContent();
    })();

    return () => {
      cancelled = true;
    };
  }, [ready, bars, chartType, overlays, overlaysKey, lowerPanels, lowerKey]);

  return (
    <ChartFullscreenShell
      title={`${symbol}${etf?.name ? ` — ${etf.name}` : ""}`}
      subtitle="Market chart · DataCaptain"
      className={className}
    >
      <FreeMarketChartFrame className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a12]">
      {/* Symbol picker */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-3 py-3 sm:px-4">
        <span className="text-[10px] font-medium uppercase tracking-wider text-white/35">
          Symbol
        </span>
        <div className="flex flex-wrap gap-1">
          {POPULAR_ETFS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => applySymbol(s)}
              className={`rounded-md px-2 py-1 font-mono text-[11px] font-medium transition ${
                symbol === s
                  ? "bg-violet-600 text-white"
                  : "text-white/50 hover:bg-white/5 hover:text-white/80"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <form
          className="ml-auto flex items-center gap-1.5"
          onSubmit={(e) => {
            e.preventDefault();
            applySymbol(customSymbol || symbol);
          }}
        >
          <input
            value={customSymbol}
            onChange={(e) => setCustomSymbol(e.target.value.toUpperCase())}
            placeholder={symbol}
            className="w-20 rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-[11px] text-white outline-none placeholder:text-white/30 focus:border-violet-500/50"
          />
          <button
            type="submit"
            className="rounded-md border border-white/15 px-2 py-1 text-[11px] text-white/65 hover:bg-white/5"
          >
            Go
          </button>
        </form>
      </div>

      {/* Header metrics */}
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
        <div>
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className="font-mono text-2xl font-bold text-white">{symbol}</h2>
            <span className="text-2xl font-semibold tabular-nums text-white">
              {price != null ? `$${price.toFixed(2)}` : "—"}
            </span>
            <span
              className={`text-sm font-semibold tabular-nums ${up ? "text-emerald-400" : "text-rose-400"}`}
            >
              {dayChange != null ? `${dayChange >= 0 ? "+" : ""}${dayChange.toFixed(2)}` : "—"}{" "}
              ({formatPct(dayPct)})
            </span>
          </div>
          <p className="mt-1 text-xs text-white/40">
            Market{" "}
            <span className={marketStatus?.status === "OPEN" ? "text-emerald-400" : "text-white/60"}>
              {marketStatus?.status ?? "—"}
            </span>
            {lastUpdated ? ` · Updated ${String(lastUpdated).slice(0, 10)}` : null}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-right text-xs sm:gap-x-6">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/35">52W High</p>
            <p className="font-medium tabular-nums text-white/80">
              {high52 != null ? `$${high52.toFixed(2)}` : "—"}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/35">52W Low</p>
            <p className="font-medium tabular-nums text-white/80">
              {low52 != null ? `$${low52.toFixed(2)}` : "—"}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/35">Avg Vol</p>
            <p className="font-medium tabular-nums text-white/80">{formatVol(avgVol)}</p>
          </div>
        </div>
      </div>

      {/* ETF info row */}
      <div className="grid grid-cols-2 gap-px border-b border-white/10 bg-white/5 sm:grid-cols-4 lg:grid-cols-7">
        {[
          { label: "Name", value: etf?.name ?? "—" },
          { label: "Symbol", value: symbol },
          { label: "Issuer", value: etf?.issuer ?? "—" },
          { label: "Category", value: etf?.category ?? etf?.assetClass ?? "—" },
          {
            label: "Expense",
            value: etf?.expenseRatio != null ? `${etf.expenseRatio}%` : "—",
          },
          { label: "Div Yield", value: formatPct(etf?.dividendYieldTtm) },
          {
            label: "AUM",
            value: etf?.aumBillions != null ? `$${etf.aumBillions}B` : formatCompact(null),
          },
        ].map((row) => (
          <div key={row.label} className="bg-[#0a0a12] px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-white/35">{row.label}</p>
            <p className="mt-0.5 truncate text-sm font-medium text-white/80" title={row.value}>
              {row.value}
            </p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="space-y-2 border-b border-white/10 px-3 py-3 sm:px-4">
        <div className="flex flex-wrap items-center gap-1">
          {FREE_RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRange(r.id)}
              className={`rounded-md px-2 py-1 text-[11px] font-medium transition ${
                range === r.id
                  ? "bg-violet-600 text-white"
                  : "text-white/50 hover:bg-white/5 hover:text-white/80"
              }`}
            >
              {r.id}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-white/10 p-0.5">
            {(
              [
                ["candlestick", "Candle"],
                ["line", "Line"],
                ["area", "Area"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setChartType(id)}
                className={`rounded-md px-2.5 py-1 text-[11px] ${
                  chartType === id ? "bg-white/10 text-white" : "text-white/45"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {OVERLAY_OPTS.map((o) => (
              <label
                key={o.id}
                className={`flex cursor-pointer items-center gap-1 rounded-md border px-2 py-1 text-[11px] ${
                  overlays.has(o.id)
                    ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-100"
                    : "border-white/10 text-white/45"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={overlays.has(o.id)}
                  onChange={() => toggleOverlay(o.id)}
                />
                {o.label}
              </label>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {LOWER_OPTS.map((o) => (
              <label
                key={o.id}
                className={`flex cursor-pointer items-center gap-1 rounded-md border px-2 py-1 text-[11px] ${
                  lowerPanels.has(o.id)
                    ? "border-amber-400/40 bg-amber-500/15 text-amber-100"
                    : "border-white/10 text-white/45"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={lowerPanels.has(o.id)}
                  onChange={() => toggleLower(o.id)}
                />
                {o.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Chart body — container always mounted so LWC can initialize */}
      <FreeMarketChartCanvas
        containerRef={containerRef}
        chartRef={chartRef}
        tooltip={tooltip}
        loading={loading}
        error={error}
        fetchData={fetchData}
      />
      </FreeMarketChartFrame>
    </ChartFullscreenShell>
  );
}

function FreeMarketChartFrame({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { open } = useChartFullscreen();
  return (
    <div className={`${className ?? ""} ${open ? "flex h-full min-h-0 flex-col border-0" : ""}`}>
      {children}
    </div>
  );
}

function FreeMarketChartCanvas({
  containerRef,
  chartRef,
  tooltip,
  loading,
  error,
  fetchData,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  chartRef: React.MutableRefObject<IChartApi | null>;
  tooltip: TooltipState;
  loading: boolean;
  error: string | null;
  fetchData: () => void;
}) {
  const { open } = useChartFullscreen();
  useEffect(() => {
    const id = window.setTimeout(() => window.dispatchEvent(new Event("resize")), 60);
    return () => window.clearTimeout(id);
  }, [open]);

  return (
      <div className={`relative min-h-[320px] ${open ? "min-h-0 flex-1" : ""}`}>
        <div
          ref={containerRef}
          className={`w-full ${loading || error ? "opacity-0" : ""} ${
            open ? "h-full min-h-[420px]" : "h-[380px] sm:h-[460px]"
          }`}
          onDoubleClick={() => chartRef.current?.timeScale().fitContent()}
        />
        <ChartFullscreenToggle />
        {tooltip && !loading && !error ? (
          <div
            className="pointer-events-none absolute z-20 min-w-[148px] rounded-lg border border-white/15 bg-[#0b0b14]/95 px-3 py-2 text-xs shadow-xl backdrop-blur"
            style={{
              left: Math.min(
                tooltip.x + 16,
                (containerRef.current?.clientWidth ?? 320) - 160
              ),
              top: Math.max(8, tooltip.y - 20),
            }}
          >
            <p className="mb-1.5 font-medium text-white/70">{tooltip.date}</p>
            <TooltipRow label="Open" value={tooltip.open.toFixed(2)} />
            <TooltipRow label="High" value={tooltip.high.toFixed(2)} />
            <TooltipRow label="Low" value={tooltip.low.toFixed(2)} />
            <TooltipRow label="Close" value={tooltip.close.toFixed(2)} />
            <TooltipRow label="Volume" value={formatVol(tooltip.volume)} />
          </div>
        ) : null}
        {loading ? (
          <div className="absolute inset-0 flex flex-col gap-3 bg-[#0a0a12] p-4">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-white/10" />
            <div className="flex-1 animate-pulse rounded-xl bg-white/5" />
            <div className="h-4 w-full max-w-md animate-pulse rounded bg-white/5" />
          </div>
        ) : null}
        {error && !loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0a0a12] px-6 text-center">
            <p className="text-sm text-rose-300/90">{error}</p>
            <button
              type="button"
              onClick={fetchData}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:bg-white/5"
            >
              Retry
            </button>
          </div>
        ) : null}
      </div>
  );
}
