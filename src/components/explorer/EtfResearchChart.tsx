"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  IChartApi,
  IPriceLine,
  ISeriesApi,
  MouseEventParams,
  SeriesMarker,
  Time,
  ISeriesMarkersPluginApi,
} from "lightweight-charts";
import {
  atr,
  bollinger,
  dailyReturns,
  ema,
  find52WeekExtremes,
  findLargeGaps,
  macd,
  rsi,
  sma,
  stochastic,
  type Ohlcv,
} from "@/lib/explorer/chartIndicators";
import {
  CHART_RANGES,
  computeReturnFromHistory,
  downloadBlob,
  filterByRange,
  formatVol,
  sampleBars,
  toCsv,
  type ChartRangeId,
  type ChartStyle,
  type DrawTool,
  type IndicatorTab,
  type OverlayId,
} from "@/lib/explorer/chartUtils";
import { formatPct } from "@/lib/explorer/helpers";
import type { MarketStatus } from "@/services/datacaptain/endpoints";
import ChartFullscreenShell, {
  ChartFullscreenToggle,
  useChartFullscreen,
} from "@/components/charts/ChartFullscreenShell";

type Dividend = { exDate: string; amount: number | null };

type Props = {
  symbol: string;
  history: Ohlcv[];
  dividends?: Dividend[];
  performance?: Record<string, number | null>;
  marketStatus?: MarketStatus | null;
  asOf?: string | null;
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
  ret: number | null;
} | null;

type Drawing =
  | { id: string; type: "hline"; price: number }
  | { id: string; type: "vline"; time: Time }
  | { id: string; type: "trend"; t1: Time; p1: number; t2: Time; p2: number }
  | { id: string; type: "rect"; t1: Time; p1: number; t2: Time; p2: number }
  | { id: string; type: "arrow"; time: Time; price: number; up: boolean };

const OVERLAY_OPTS: { id: OverlayId; label: string }[] = [
  { id: "sma20", label: "SMA 20" },
  { id: "sma50", label: "SMA 50" },
  { id: "sma200", label: "SMA 200" },
  { id: "ema20", label: "EMA 20" },
  { id: "bb", label: "Bollinger" },
];

const INDICATOR_TABS: { id: IndicatorTab; label: string }[] = [
  { id: "price", label: "Price" },
  { id: "volume", label: "Volume" },
  { id: "rsi", label: "RSI" },
  { id: "macd", label: "MACD" },
  { id: "atr", label: "ATR" },
  { id: "stochastic", label: "Stochastic" },
];

const DRAW_TOOLS: { id: DrawTool; label: string }[] = [
  { id: "none", label: "Select" },
  { id: "trend", label: "Trend" },
  { id: "hline", label: "H-Line" },
  { id: "vline", label: "V-Line" },
  { id: "rect", label: "Rect" },
  { id: "arrow", label: "Arrow" },
];

const EVENT_OPTS = [
  { id: "dividend", label: "Dividend" },
  { id: "split", label: "Split" },
  { id: "gap", label: "Large Gap" },
  { id: "high52", label: "52W High" },
  { id: "low52", label: "52W Low" },
] as const;

type EventId = (typeof EVENT_OPTS)[number]["id"];

function toTime(date: string): Time {
  return date as Time;
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
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

export default function EtfResearchChart({
  symbol,
  history,
  dividends = [],
  performance,
  marketStatus,
  asOf,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const mainSeriesRef = useRef<ISeriesApi<"Candlestick" | "Bar" | "Line" | "Area"> | null>(null);
  const markersApiRef = useRef<ISeriesMarkersPluginApi<Time> | null>(null);
  const priceLinesRef = useRef<IPriceLine[]>([]);
  const barsRef = useRef<Ohlcv[]>([]);
  const returnsRef = useRef<Array<number | null>>([]);
  const drawToolRef = useRef<DrawTool>("none");
  const pendingPointsRef = useRef<Array<{ time: Time; price: number }>>([]);
  const setDrawingsRef = useRef<(fn: (d: Drawing[]) => Drawing[]) => void>(() => {});
  const moveHandlerRef = useRef<((p: MouseEventParams<Time>) => void) | null>(null);
  const clickHandlerRef = useRef<((p: MouseEventParams<Time>) => void) | null>(null);

  const [range, setRange] = useState<ChartRangeId>("1Y");
  const [style, setStyle] = useState<ChartStyle>("candlestick");
  const [overlays, setOverlays] = useState<Set<OverlayId>>(() => new Set(["sma20", "sma50"]));
  const [indicator, setIndicator] = useState<IndicatorTab>("price");
  const [drawTool, setDrawTool] = useState<DrawTool>("none");
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [events, setEvents] = useState<Set<EventId>>(
    () => new Set(["dividend", "gap", "high52", "low52"])
  );
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const [ready, setReady] = useState(false);

  setDrawingsRef.current = setDrawings;
  drawToolRef.current = drawTool;

  const bars = useMemo(() => sampleBars(filterByRange(history, range)), [history, range]);
  const overlaysKey = useMemo(() => [...overlays].sort().join(","), [overlays]);
  const eventsKey = useMemo(() => [...events].sort().join(","), [events]);
  const drawingsKey = useMemo(() => drawings.map((d) => d.id).join(","), [drawings]);

  const last = history[history.length - 1];
  const prev = history.length >= 2 ? history[history.length - 2] : null;
  const price = last?.close ?? null;
  const dayChange = price != null && prev ? price - prev.close : null;
  const dayPct =
    price != null && prev && prev.close ? ((price - prev.close) / prev.close) * 100 : null;
  const up = (dayPct ?? 0) >= 0;

  const perfStrip = useMemo(() => {
    const fromPerf = (k: string) => performance?.[k] ?? null;
    return [
      { label: "Today", value: dayPct ?? fromPerf("1d") },
      { label: "Week", value: fromPerf("1w") ?? computeReturnFromHistory(history, 7) },
      { label: "Month", value: fromPerf("1m") ?? computeReturnFromHistory(history, 30) },
      { label: "YTD", value: fromPerf("ytd") ?? computeReturnFromHistory(history, "ytd") },
      { label: "1Y", value: fromPerf("1y") ?? computeReturnFromHistory(history, 365) },
      { label: "5Y", value: fromPerf("5y") ?? computeReturnFromHistory(history, 365 * 5) },
      { label: "Inception", value: computeReturnFromHistory(history, "inception") },
    ];
  }, [history, performance, dayPct]);

  const toggleOverlay = (id: OverlayId) => {
    setOverlays((prevSet) => {
      const next = new Set(prevSet);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleEvent = (id: EventId) => {
    setEvents((prevSet) => {
      const next = new Set(prevSet);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearDrawings = () => {
    setDrawings([]);
    pendingPointsRef.current = [];
  };

  const exportPng = useCallback(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const canvas = chart.takeScreenshot(true, false);
    canvas.toBlob((blob) => {
      if (!blob) return;
      downloadBlob(`${symbol}-chart.png`, blob, "image/png");
    });
  }, [symbol]);

  const exportCsv = useCallback(() => {
    downloadBlob(`${symbol}-ohlcv.csv`, toCsv(bars), "text/csv");
  }, [symbol, bars]);

  const exportJson = useCallback(() => {
    downloadBlob(`${symbol}-ohlcv.json`, JSON.stringify(bars, null, 2), "application/json");
  }, [symbol, bars]);

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
          ret: returnsRef.current[idx],
        });
      };

      const onClick = (param: MouseEventParams<Time>) => {
        const tool = drawToolRef.current;
        if (tool === "none" || !param.time || param.point == null) return;
        const main = mainSeriesRef.current;
        if (!main) return;
        const priceHit = main.coordinateToPrice(param.point.y);
        if (priceHit == null) return;
        const point = { time: param.time, price: priceHit };

        if (tool === "hline") {
          setDrawingsRef.current((d) => [...d, { id: uid(), type: "hline", price: point.price }]);
          return;
        }
        if (tool === "vline") {
          setDrawingsRef.current((d) => [...d, { id: uid(), type: "vline", time: point.time }]);
          return;
        }
        if (tool === "arrow") {
          setDrawingsRef.current((d) => [
            ...d,
            { id: uid(), type: "arrow", time: point.time, price: point.price, up: true },
          ]);
          return;
        }

        const pts = [...pendingPointsRef.current, point];
        if (pts.length < 2) {
          pendingPointsRef.current = pts;
          return;
        }
        pendingPointsRef.current = [];
        if (tool === "trend") {
          setDrawingsRef.current((d) => [
            ...d,
            {
              id: uid(),
              type: "trend",
              t1: pts[0].time,
              p1: pts[0].price,
              t2: pts[1].time,
              p2: pts[1].price,
            },
          ]);
        } else if (tool === "rect") {
          setDrawingsRef.current((d) => [
            ...d,
            {
              id: uid(),
              type: "rect",
              t1: pts[0].time,
              p1: pts[0].price,
              t2: pts[1].time,
              p2: pts[1].price,
            },
          ]);
        }
      };

      moveHandlerRef.current = onMove;
      clickHandlerRef.current = onClick;
      chart.subscribeCrosshairMove(onMove);
      chart.subscribeClick(onClick);
      setReady(true);
    })();

    return () => {
      disposed = true;
      const chart = chartRef.current;
      if (chart) {
        if (moveHandlerRef.current) chart.unsubscribeCrosshairMove(moveHandlerRef.current);
        if (clickHandlerRef.current) chart.unsubscribeClick(clickHandlerRef.current);
        chart.remove();
      }
      chartRef.current = null;
      mainSeriesRef.current = null;
      markersApiRef.current = null;
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
      markersApiRef.current = null;
      priceLinesRef.current = [];
      mainSeriesRef.current = null;

      barsRef.current = bars;
      const closes = bars.map((b) => b.close);
      returnsRef.current = dailyReturns(closes);
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

      let main: ISeriesApi<"Candlestick" | "Bar" | "Line" | "Area">;
      if (style === "candlestick") {
        main = chart.addSeries(lc.CandlestickSeries, {
          upColor: "#34d399",
          downColor: "#fb7185",
          borderUpColor: "#34d399",
          borderDownColor: "#fb7185",
          wickUpColor: "#34d399",
          wickDownColor: "#fb7185",
        });
        main.setData(candleData);
      } else if (style === "ohlc") {
        main = chart.addSeries(lc.BarSeries, {
          upColor: "#34d399",
          downColor: "#fb7185",
        });
        main.setData(candleData);
      } else if (style === "line") {
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
        scaleMargins: { top: 0.08, bottom: indicator === "volume" ? 0.48 : 0.22 },
      });

      const vol = chart.addSeries(lc.HistogramSeries, {
        priceFormat: { type: "volume" },
        priceScaleId: "volume",
        lastValueVisible: false,
        priceLineVisible: false,
      });
      vol.priceScale().applyOptions({
        scaleMargins: { top: indicator === "volume" ? 0.55 : 0.78, bottom: 0 },
      });
      vol.setData(
        bars.map((b) => ({
          time: toTime(b.date),
          value: b.volume,
          color: b.close >= b.open ? "rgba(52,211,153,0.45)" : "rgba(251,113,133,0.45)",
        }))
      );

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
      if (overlays.has("bb")) {
        const bb = bollinger(closes, 20, 2);
        addOverlay("rgba(255,255,255,0.35)", bb.mid);
        addOverlay("rgba(167,139,250,0.55)", bb.upper);
        addOverlay("rgba(167,139,250,0.55)", bb.lower);
      }

      if (indicator === "rsi") {
        const vals = rsi(closes, 14);
        const s = chart.addSeries(
          lc.LineSeries,
          { color: "#c4b5fd", lineWidth: 2, priceLineVisible: false },
          1
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
        chart.panes()[1]?.setHeight(110);
      } else if (indicator === "macd") {
        const m = macd(closes);
        const hist = chart.addSeries(
          lc.HistogramSeries,
          { priceLineVisible: false, lastValueVisible: false },
          1
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
          1
        );
        line.setData(
          bars.flatMap((b, i) =>
            m.line[i] == null ? [] : [{ time: toTime(b.date), value: m.line[i] as number }]
          )
        );
        const sig = chart.addSeries(
          lc.LineSeries,
          { color: "#fbbf24", lineWidth: 1, priceLineVisible: false },
          1
        );
        sig.setData(
          bars.flatMap((b, i) =>
            m.signal[i] == null ? [] : [{ time: toTime(b.date), value: m.signal[i] as number }]
          )
        );
        chart.panes()[1]?.setHeight(120);
      } else if (indicator === "atr") {
        const vals = atr(bars, 14);
        const s = chart.addSeries(
          lc.LineSeries,
          { color: "#fb923c", lineWidth: 2, priceLineVisible: false },
          1
        );
        s.setData(
          bars.flatMap((b, i) =>
            vals[i] == null ? [] : [{ time: toTime(b.date), value: vals[i] as number }]
          )
        );
        chart.panes()[1]?.setHeight(100);
      } else if (indicator === "stochastic") {
        const st = stochastic(bars);
        const k = chart.addSeries(
          lc.LineSeries,
          { color: "#38bdf8", lineWidth: 2, priceLineVisible: false },
          1
        );
        const d = chart.addSeries(
          lc.LineSeries,
          { color: "#f472b6", lineWidth: 1, priceLineVisible: false },
          1
        );
        k.setData(
          bars.flatMap((b, i) =>
            st.k[i] == null ? [] : [{ time: toTime(b.date), value: st.k[i] as number }]
          )
        );
        d.setData(
          bars.flatMap((b, i) =>
            st.d[i] == null ? [] : [{ time: toTime(b.date), value: st.d[i] as number }]
          )
        );
        k.createPriceLine({
          price: 80,
          color: "rgba(251,113,133,0.45)",
          lineWidth: 1,
          lineStyle: lc.LineStyle.Dashed,
          axisLabelVisible: false,
          title: "",
        });
        k.createPriceLine({
          price: 20,
          color: "rgba(52,211,153,0.45)",
          lineWidth: 1,
          lineStyle: lc.LineStyle.Dashed,
          axisLabelVisible: false,
          title: "",
        });
        chart.panes()[1]?.setHeight(110);
      }

      const markers: SeriesMarker<Time>[] = [];
      if (events.has("dividend")) {
        const set = new Set(bars.map((b) => b.date));
        for (const div of dividends) {
          const day = String(div.exDate).slice(0, 10);
          if (!set.has(day)) continue;
          markers.push({
            time: toTime(day),
            position: "belowBar",
            color: "#a78bfa",
            shape: "circle",
            text: div.amount != null ? `Div $${div.amount.toFixed(2)}` : "Div",
          });
        }
      }
      if (events.has("gap")) {
        for (const i of findLargeGaps(bars, 3)) {
          markers.push({
            time: toTime(bars[i].date),
            position: "aboveBar",
            color: "#fbbf24",
            shape: "square",
            text: "Gap",
          });
        }
      }
      const extremes = find52WeekExtremes(bars);
      if (events.has("high52") && extremes.highIdx != null) {
        markers.push({
          time: toTime(bars[extremes.highIdx].date),
          position: "aboveBar",
          color: "#34d399",
          shape: "arrowUp",
          text: "52W H",
        });
      }
      if (events.has("low52") && extremes.lowIdx != null) {
        markers.push({
          time: toTime(bars[extremes.lowIdx].date),
          position: "belowBar",
          color: "#fb7185",
          shape: "arrowDown",
          text: "52W L",
        });
      }

      for (const d of drawings) {
        if (d.type === "hline") {
          priceLinesRef.current.push(
            main.createPriceLine({
              price: d.price,
              color: "#67e8f9",
              lineWidth: 1,
              lineStyle: lc.LineStyle.Solid,
              axisLabelVisible: true,
              title: d.price.toFixed(2),
            })
          );
        } else if (d.type === "vline") {
          markers.push({
            time: d.time,
            position: "inBar",
            color: "#67e8f9",
            shape: "square",
            text: "│",
          });
        } else if (d.type === "trend") {
          const s = chart.addSeries(lc.LineSeries, {
            color: "#67e8f9",
            lineWidth: 2,
            priceLineVisible: false,
            lastValueVisible: false,
          });
          const ordered =
            String(d.t1) <= String(d.t2)
              ? [
                  { time: d.t1, value: d.p1 },
                  { time: d.t2, value: d.p2 },
                ]
              : [
                  { time: d.t2, value: d.p2 },
                  { time: d.t1, value: d.p1 },
                ];
          s.setData(ordered);
        } else if (d.type === "rect") {
          const top = Math.max(d.p1, d.p2);
          const bot = Math.min(d.p1, d.p2);
          const tA = String(d.t1) <= String(d.t2) ? d.t1 : d.t2;
          const tB = String(d.t1) <= String(d.t2) ? d.t2 : d.t1;
          const edge = (pts: { time: Time; value: number }[]) => {
            const s = chart.addSeries(lc.LineSeries, {
              color: "rgba(103,232,249,0.85)",
              lineWidth: 1,
              priceLineVisible: false,
              lastValueVisible: false,
              crosshairMarkerVisible: false,
            });
            s.setData(pts);
          };
          edge([
            { time: tA, value: top },
            { time: tB, value: top },
          ]);
          edge([
            { time: tA, value: bot },
            { time: tB, value: bot },
          ]);
        } else if (d.type === "arrow") {
          markers.push({
            time: d.time,
            position: d.up ? "belowBar" : "aboveBar",
            color: "#67e8f9",
            shape: d.up ? "arrowUp" : "arrowDown",
            text: "",
          });
        }
      }

      markers.sort((a, b) => String(a.time).localeCompare(String(b.time)));
      markersApiRef.current = lc.createSeriesMarkers(main, markers);
      chart.timeScale().fitContent();
    })();

    return () => {
      cancelled = true;
    };
  }, [
    ready,
    bars,
    style,
    overlays,
    overlaysKey,
    indicator,
    events,
    eventsKey,
    drawings,
    drawingsKey,
    dividends,
  ]);

  useEffect(() => {
    pendingPointsRef.current = [];
  }, [drawTool]);

  return (
    <ChartFullscreenShell title={`${symbol} research chart`} subtitle="ETF detail · DataCaptain">
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a12]">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
        <div>
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className="font-mono text-2xl font-bold text-white">{symbol}</h2>
            <span className="text-2xl font-semibold tabular-nums text-white">
              {price != null ? `$${price.toFixed(2)}` : "—"}
            </span>
            <span className={`text-sm font-semibold tabular-nums ${up ? "text-emerald-400" : "text-rose-400"}`}>
              {dayChange != null ? `${dayChange >= 0 ? "+" : ""}${dayChange.toFixed(2)}` : "—"}{" "}
              ({formatPct(dayPct)})
            </span>
          </div>
          <p className="mt-1 text-xs text-white/40">
            Market{" "}
            <span className={marketStatus?.status === "OPEN" ? "text-emerald-400" : "text-white/60"}>
              {marketStatus?.status ?? "—"}
            </span>
            {asOf || last?.date ? ` · Updated ${String(asOf ?? last?.date).slice(0, 10)}` : null}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={exportPng}
            className="rounded-lg border border-white/15 px-2.5 py-1 text-[11px] text-white/65 hover:bg-white/5"
          >
            PNG
          </button>
          <button
            type="button"
            onClick={exportCsv}
            className="rounded-lg border border-white/15 px-2.5 py-1 text-[11px] text-white/65 hover:bg-white/5"
          >
            CSV
          </button>
          <button
            type="button"
            onClick={exportJson}
            className="rounded-lg border border-white/15 px-2.5 py-1 text-[11px] text-white/65 hover:bg-white/5"
          >
            JSON
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px border-b border-white/10 bg-white/5 sm:grid-cols-4 lg:grid-cols-7">
        {perfStrip.map((p) => (
          <div key={p.label} className="bg-[#0a0a12] px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-white/35">{p.label}</p>
            <p
              className={`mt-0.5 text-sm font-semibold tabular-nums ${
                (p.value ?? 0) >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {formatPct(p.value)}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-2 border-b border-white/10 px-3 py-3 sm:px-4">
        <div className="flex flex-wrap items-center gap-1">
          {CHART_RANGES.map((r) => (
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
                ["ohlc", "OHLC"],
                ["line", "Line"],
                ["area", "Area"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setStyle(id)}
                className={`rounded-md px-2.5 py-1 text-[11px] ${
                  style === id ? "bg-white/10 text-white" : "text-white/45"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {OVERLAY_OPTS.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => toggleOverlay(o.id)}
                className={`rounded-md border px-2 py-1 text-[11px] ${
                  overlays.has(o.id)
                    ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-100"
                    : "border-white/10 text-white/45"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-white/35">Draw</span>
          {DRAW_TOOLS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setDrawTool(t.id)}
              className={`rounded-md px-2 py-1 text-[11px] ${
                drawTool === t.id ? "bg-emerald-600/80 text-white" : "text-white/45 hover:bg-white/5"
              }`}
            >
              {t.label}
            </button>
          ))}
          <button
            type="button"
            onClick={clearDrawings}
            className="rounded-md border border-white/10 px-2 py-1 text-[11px] text-white/45"
          >
            Clear
          </button>
          <span className="ml-2 text-[10px] uppercase tracking-wider text-white/35">Events</span>
          {EVENT_OPTS.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => toggleEvent(e.id)}
              disabled={e.id === "split"}
              title={e.id === "split" ? "Split data not in current feed" : undefined}
              className={`rounded-md border px-2 py-1 text-[11px] disabled:cursor-not-allowed disabled:opacity-40 ${
                events.has(e.id)
                  ? "border-amber-400/40 bg-amber-500/15 text-amber-100"
                  : "border-white/10 text-white/45"
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <EtfResearchChartCanvas containerRef={containerRef} chartRef={chartRef} />
        {tooltip && (
          <div
            className="pointer-events-none absolute z-20 min-w-[148px] rounded-lg border border-white/15 bg-[#0b0b14]/95 px-3 py-2 text-xs shadow-xl backdrop-blur"
            style={{
              left: Math.min(tooltip.x + 16, (containerRef.current?.clientWidth ?? 320) - 160),
              top: Math.max(8, tooltip.y - 20),
            }}
          >
            <p className="mb-1.5 font-medium text-white/70">{tooltip.date}</p>
            <TooltipRow label="Open" value={tooltip.open.toFixed(2)} />
            <TooltipRow label="High" value={tooltip.high.toFixed(2)} />
            <TooltipRow label="Low" value={tooltip.low.toFixed(2)} />
            <TooltipRow label="Close" value={tooltip.close.toFixed(2)} />
            <TooltipRow label="Volume" value={formatVol(tooltip.volume)} />
            <TooltipRow
              label="Return"
              value={formatPct(tooltip.ret)}
              tone={(tooltip.ret ?? 0) >= 0 ? "up" : "down"}
            />
          </div>
        )}
        {!history.length && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a12]/80 text-sm text-white/45">
            No price history available
          </div>
        )}
        <ChartFullscreenToggle />
      </div>

      <div className="flex flex-wrap gap-1 border-t border-white/10 px-3 py-2 sm:px-4">
        {INDICATOR_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setIndicator(tab.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              indicator === tab.id
                ? "bg-violet-600 text-white"
                : "text-white/45 hover:bg-white/5 hover:text-white/75"
            }`}
          >
            {tab.label}
          </button>
        ))}
        <span className="ml-auto hidden text-[10px] text-white/30 sm:inline">
          Scroll · drag · pinch · double-click reset
        </span>
      </div>
    </div>
    </ChartFullscreenShell>
  );
}

function EtfResearchChartCanvas({
  containerRef,
  chartRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  chartRef: React.MutableRefObject<IChartApi | null>;
}) {
  const { open } = useChartFullscreen();
  useEffect(() => {
    const id = window.setTimeout(() => window.dispatchEvent(new Event("resize")), 60);
    return () => window.clearTimeout(id);
  }, [open]);
  return (
    <div
      ref={containerRef}
      className={`w-full ${open ? "h-[min(70vh,720px)] min-h-[420px]" : "h-[380px] sm:h-[460px] lg:h-[520px]"}`}
      onDoubleClick={() => chartRef.current?.timeScale().fitContent()}
    />
  );
}

function TooltipRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "up" | "down";
}) {
  return (
    <div className="flex justify-between gap-4 py-0.5">
      <span className="text-white/40">{label}</span>
      <span
        className={`tabular-nums ${
          tone === "up" ? "text-emerald-400" : tone === "down" ? "text-rose-400" : "text-white/85"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
