"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  IChartApi,
  ISeriesApi,
  MouseEventParams,
  SeriesMarker,
  Time,
} from "lightweight-charts";
import type {
  BacktestDividendEvent,
  BacktestPriceBar,
  BacktestResult,
  BacktestTradeEvent,
} from "@/services/datacaptain/endpoints";
import {
  bollinger,
  ema,
  macd,
  rsi,
  sma,
} from "@/lib/explorer/chartIndicators";
import { sampleSeries, vwapSeries } from "@/lib/backtest/chartHelpers";
import { formatUsdPrecise } from "@/lib/backtest/metrics";
import ChartFullscreenShell, {
  ChartFullscreenToggle,
  useChartFullscreen,
} from "@/components/charts/ChartFullscreenShell";

type Mode = "price" | "candle";
type PriceStyle = "line" | "area";

type Props = {
  result: BacktestResult;
  mode: Mode;
};

function toTime(date: string): Time {
  return date as Time;
}

function clearSeries(chart: IChartApi) {
  while (chart.panes().length > 1) {
    chart.removePane(chart.panes().length - 1);
  }
  for (const pane of chart.panes()) {
    for (const s of [...pane.getSeries()]) chart.removeSeries(s);
  }
}

export default function BacktestLwcPanel({ result, mode }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [ready, setReady] = useState(false);

  const [priceStyle, setPriceStyle] = useState<PriceStyle>("area");
  const [sma20, setSma20] = useState(true);
  const [sma50, setSma50] = useState(true);
  const [sma200, setSma200] = useState(false);
  const [ema20, setEma20] = useState(false);
  const [ema50, setEma50] = useState(false);
  const [bb, setBb] = useState(false);
  const [vwap, setVwap] = useState(false);
  const [showVolume, setShowVolume] = useState(true);
  const [showRsi, setShowRsi] = useState(false);
  const [showMacd, setShowMacd] = useState(false);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    lines: string[];
  } | null>(null);

  const bars = useMemo(() => {
    const raw = result.prices?.length
      ? result.prices
      : result.equityCurve.map((p) => ({
          date: p.date,
          open: p.value,
          high: p.value,
          low: p.value,
          close: p.value,
          volume: 0,
        }));
    return sampleSeries(raw, 3000);
  }, [result]);

  const tradeMap = useMemo(() => {
    const m = new Map<string, BacktestTradeEvent[]>();
    for (const t of result.tradeEvents || []) {
      const list = m.get(t.date) || [];
      list.push(t);
      m.set(t.date, list);
    }
    return m;
  }, [result.tradeEvents]);

  const divMap = useMemo(() => {
    const m = new Map<string, BacktestDividendEvent>();
    for (const d of result.dividendEvents || []) m.set(d.date, d);
    return m;
  }, [result.dividendEvents]);

  useEffect(() => {
    let disposed = false;
    (async () => {
      if (!containerRef.current) return;
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
          vertLine: { color: "rgba(167,139,250,0.4)", labelBackgroundColor: "#5b21b6" },
          horzLine: { color: "rgba(167,139,250,0.4)", labelBackgroundColor: "#5b21b6" },
        },
        rightPriceScale: { borderColor: "rgba(255,255,255,0.08)" },
        timeScale: { borderColor: "rgba(255,255,255,0.08)", rightOffset: 4, barSpacing: 6 },
        handleScroll: { mouseWheel: true, pressedMouseMove: true, horzTouchDrag: true, vertTouchDrag: true },
        handleScale: {
          mouseWheel: true,
          pinch: true,
          axisPressedMouseMove: { time: true, price: true },
          axisDoubleClickReset: { time: true, price: true },
        },
      });
      chartRef.current = chart;
      setReady(true);
    })();
    return () => {
      disposed = true;
      chartRef.current?.remove();
      chartRef.current = null;
      setReady(false);
    };
  }, []);

  useEffect(() => {
    if (!ready || !chartRef.current) return;
    let cancelled = false;

    (async () => {
      const lc = await import("lightweight-charts");
      const chart = chartRef.current;
      if (!chart || cancelled) return;
      clearSeries(chart);

      if (!bars.length) return;
      const closes = bars.map((b) => b.close);

      let main: ISeriesApi<"Candlestick" | "Line" | "Area">;
      if (mode === "candle") {
        main = chart.addSeries(lc.CandlestickSeries, {
          upColor: "#34d399",
          downColor: "#fb7185",
          borderUpColor: "#34d399",
          borderDownColor: "#fb7185",
          wickUpColor: "#34d399",
          wickDownColor: "#fb7185",
        });
        main.setData(
          bars.map((b) => ({
            time: toTime(b.date),
            open: b.open,
            high: b.high,
            low: b.low,
            close: b.close,
          }))
        );
      } else if (priceStyle === "line") {
        main = chart.addSeries(lc.LineSeries, {
          color: "#a78bfa",
          lineWidth: 2,
          lastPriceAnimation: lc.LastPriceAnimationMode.OnDataUpdate,
        });
        main.setData(bars.map((b) => ({ time: toTime(b.date), value: b.close })));
      } else {
        main = chart.addSeries(lc.AreaSeries, {
          lineColor: "#a78bfa",
          topColor: "rgba(167,139,250,0.35)",
          bottomColor: "rgba(167,139,250,0.02)",
          lineWidth: 2,
          lastPriceAnimation: lc.LastPriceAnimationMode.OnDataUpdate,
        });
        main.setData(bars.map((b) => ({ time: toTime(b.date), value: b.close })));
      }

      main.priceScale().applyOptions({
        scaleMargins: { top: 0.08, bottom: showVolume || showRsi || showMacd ? 0.2 : 0.08 },
      });

      const addOverlay = (color: string, values: Array<number | null>, width: 1 | 2 = 1) => {
        const s = chart.addSeries(lc.LineSeries, {
          color,
          lineWidth: width,
          priceLineVisible: false,
          lastValueVisible: false,
          crosshairMarkerVisible: false,
        });
        s.setData(
          bars.flatMap((b, i) =>
            values[i] == null ? [] : [{ time: toTime(b.date), value: values[i] as number }]
          )
        );
      };

      if (sma20) addOverlay("#38bdf8", sma(closes, 20));
      if (sma50) addOverlay("#fbbf24", sma(closes, 50));
      if (sma200) addOverlay("#f472b6", sma(closes, 200), 2);
      if (ema20) addOverlay("#22d3ee", ema(closes, 20));
      if (mode === "candle" && ema50) addOverlay("#fb923c", ema(closes, 50));
      if (mode === "candle" && bb) {
        const bands = bollinger(closes, 20, 2);
        addOverlay("rgba(255,255,255,0.35)", bands.mid);
        addOverlay("rgba(167,139,250,0.5)", bands.upper);
        addOverlay("rgba(167,139,250,0.5)", bands.lower);
      }
      if (mode === "candle" && vwap) addOverlay("#c084fc", vwapSeries(bars as BacktestPriceBar[]));

      if (showVolume && mode === "candle") {
        const vol = chart.addSeries(lc.HistogramSeries, {
          priceFormat: { type: "volume" },
          priceScaleId: "volume",
          lastValueVisible: false,
          priceLineVisible: false,
        });
        vol.priceScale().applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
        vol.setData(
          bars.map((b) => ({
            time: toTime(b.date),
            value: b.volume,
            color: b.close >= b.open ? "rgba(52,211,153,0.4)" : "rgba(251,113,133,0.4)",
          }))
        );
      }

      let pane = 1;
      if (showRsi) {
        const vals = rsi(closes, 14);
        const s = chart.addSeries(
          lc.LineSeries,
          { color: "#c4b5fd", lineWidth: 2, priceLineVisible: false },
          pane
        );
        s.setData(
          bars.flatMap((b, i) =>
            vals[i] == null ? [] : [{ time: toTime(b.date), value: vals[i] as number }]
          )
        );
        chart.panes()[pane]?.setHeight(90);
        pane += 1;
      }
      if (showMacd) {
        const m = macd(closes);
        const hist = chart.addSeries(
          lc.HistogramSeries,
          { priceLineVisible: false, lastValueVisible: false },
          pane
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
                        ? "rgba(52,211,153,0.5)"
                        : "rgba(251,113,133,0.5)",
                  },
                ]
          )
        );
        const line = chart.addSeries(
          lc.LineSeries,
          { color: "#38bdf8", lineWidth: 2, priceLineVisible: false },
          pane
        );
        line.setData(
          bars.flatMap((b, i) =>
            m.line[i] == null ? [] : [{ time: toTime(b.date), value: m.line[i] as number }]
          )
        );
        chart.panes()[pane]?.setHeight(100);
      }

      const markers: SeriesMarker<Time>[] = [];
      for (const [date, trades] of tradeMap) {
        for (const t of trades) {
          markers.push({
            time: toTime(date),
            position: t.side === "BUY" ? "belowBar" : "aboveBar",
            color: t.side === "BUY" ? "#34d399" : "#fb7185",
            shape: t.side === "BUY" ? "arrowUp" : "arrowDown",
            text: t.side,
          });
        }
      }
      for (const [date] of divMap) {
        markers.push({
          time: toTime(date),
          position: "belowBar",
          color: "#60a5fa",
          shape: "circle",
          text: "D",
        });
      }
      markers.sort((a, b) => String(a.time).localeCompare(String(b.time)));
      lc.createSeriesMarkers(main, markers);

      const onMove = (param: MouseEventParams<Time>) => {
        if (!param.point || !param.time) {
          setTooltip(null);
          return;
        }
        const date = String(param.time);
        const bar = bars.find((b) => b.date === date);
        if (!bar) {
          setTooltip(null);
          return;
        }
        const lines = [
          `Date ${date}`,
          mode === "candle"
            ? `O ${bar.open.toFixed(2)}  H ${bar.high.toFixed(2)}  L ${bar.low.toFixed(2)}  C ${bar.close.toFixed(2)}`
            : `Close ${formatUsdPrecise(bar.close)}`,
        ];
        if (mode === "candle") lines.push(`Volume ${bar.volume.toLocaleString()}`);
        const trades = tradeMap.get(date);
        if (trades?.length) {
          for (const t of trades) {
            lines.push(
              `${t.side} ${t.shares.toFixed(4)} sh @ ${formatUsdPrecise(t.price)} · Amt ${formatUsdPrecise(t.amount)} · PV ${formatUsdPrecise(t.portfolioValue)}`
            );
          }
        }
        const div = divMap.get(date);
        if (div) {
          lines.push(
            `Div $${div.amount.toFixed(4)} · Reinvested ${div.reinvestedShares.toFixed(4)} sh · Cash ${formatUsdPrecise(div.cashReceived)}`
          );
        }
        setTooltip({ x: param.point.x, y: param.point.y, lines });
      };
      chart.subscribeCrosshairMove(onMove);
      chart.timeScale().fitContent();

      return () => chart.unsubscribeCrosshairMove(onMove);
    })();

    return () => {
      cancelled = true;
    };
  }, [
    ready,
    bars,
    mode,
    priceStyle,
    sma20,
    sma50,
    sma200,
    ema20,
    ema50,
    bb,
    vwap,
    showVolume,
    showRsi,
    showMacd,
    tradeMap,
    divMap,
  ]);

  const height = mode === "candle" ? "h-[550px]" : "h-[420px] sm:h-[480px]";

  return (
    <ChartFullscreenShell
      title={`${result.symbol || "Backtest"} · ${mode === "candle" ? "Candlestick" : "Price"}`}
      subtitle="Backtesting terminal"
    >
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3 text-[11px] text-white/60">
        {mode === "price" && (
          <div className="flex rounded-lg border border-white/10 p-0.5">
            {(["area", "line"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setPriceStyle(s)}
                className={`rounded-md px-2.5 py-1 capitalize ${
                  priceStyle === s ? "bg-white/10 text-white" : "text-white/45"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={sma20} onChange={(e) => setSma20(e.target.checked)} />
          SMA 20
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={sma50} onChange={(e) => setSma50(e.target.checked)} />
          SMA 50
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={sma200} onChange={(e) => setSma200(e.target.checked)} />
          SMA 200
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={ema20} onChange={(e) => setEma20(e.target.checked)} />
          EMA 20
        </label>
        {mode === "candle" && (
          <>
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={ema50} onChange={(e) => setEma50(e.target.checked)} />
              EMA 50
            </label>
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={bb} onChange={(e) => setBb(e.target.checked)} />
              Bollinger
            </label>
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={vwap} onChange={(e) => setVwap(e.target.checked)} />
              VWAP
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={showVolume}
                onChange={(e) => setShowVolume(e.target.checked)}
              />
              Volume
            </label>
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={showRsi} onChange={(e) => setShowRsi(e.target.checked)} />
              RSI
            </label>
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={showMacd} onChange={(e) => setShowMacd(e.target.checked)} />
              MACD
            </label>
          </>
        )}
      </div>

      <div className="relative">
        <BacktestChartCanvas containerRef={containerRef} chartRef={chartRef} heightClass={height} />
        <ChartFullscreenToggle />
        {tooltip && (
          <div
            className="pointer-events-none absolute z-20 max-w-xs rounded-lg border border-white/15 bg-[#0b0b14]/95 px-3 py-2 text-[11px] shadow-xl"
            style={{
              left: Math.min(tooltip.x + 14, (containerRef.current?.clientWidth ?? 400) - 200),
              top: Math.max(8, tooltip.y - 12),
            }}
          >
            {tooltip.lines.map((l) => (
              <p key={l} className="py-0.5 text-white/75">
                {l}
              </p>
            ))}
          </div>
        )}
        {!result.prices?.length && (
          <p className="mt-2 text-[11px] text-amber-200/70">
            Price OHLC not in this response — showing equity values as a proxy. Re-run backtest after
            API deploy for full candlesticks.
          </p>
        )}
      </div>
    </div>
    </ChartFullscreenShell>
  );
}

function BacktestChartCanvas({
  containerRef,
  chartRef,
  heightClass,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  chartRef: React.MutableRefObject<IChartApi | null>;
  heightClass: string;
}) {
  const { open } = useChartFullscreen();
  useEffect(() => {
    const id = window.setTimeout(() => window.dispatchEvent(new Event("resize")), 60);
    return () => window.clearTimeout(id);
  }, [open]);
  return (
    <div
      ref={containerRef}
      className={`${open ? "h-[min(70vh,640px)] min-h-[420px]" : heightClass} w-full min-w-[640px] lg:min-w-0`}
      onDoubleClick={() => chartRef.current?.timeScale().fitContent()}
    />
  );
}
