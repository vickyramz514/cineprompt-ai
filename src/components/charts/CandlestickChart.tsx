"use client";

import { useEffect, useRef, useState } from "react";
import type { IChartApi, ISeriesApi, MouseEventParams, Time } from "lightweight-charts";
import { sampleBars } from "@/lib/explorer/chartUtils";
import ChartFullscreenShell, {
  ChartFullscreenToggle,
  useChartFullscreenOptional,
} from "@/components/charts/ChartFullscreenShell";

export type CandleBar = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type Props = {
  bars: CandleBar[];
  height?: number;
  className?: string;
  onCrosshair?: (bar: CandleBar | null) => void;
  /** Chart title shown in fullscreen header */
  title?: string;
  subtitle?: string;
  /** Wrap with fullscreen shell (default true) */
  enableFullscreen?: boolean;
};

function toTime(date: string): Time {
  return date as Time;
}

function clearSeries(chart: IChartApi) {
  for (const pane of chart.panes()) {
    for (const series of [...pane.getSeries()]) {
      chart.removeSeries(series);
    }
  }
}

function CandlestickChartCanvas({
  bars,
  height = 360,
  className = "",
  onCrosshair,
}: Omit<Props, "title" | "subtitle" | "enableFullscreen">) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const barsRef = useRef<CandleBar[]>([]);
  const onCrosshairRef = useRef(onCrosshair);
  const [ready, setReady] = useState(false);
  const fs = useChartFullscreenOptional();
  const open = fs?.open ?? false;

  onCrosshairRef.current = onCrosshair;

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
          background: { type: lc.ColorType.Solid, color: "transparent" },
          textColor: "rgba(255,255,255,0.5)",
          fontSize: 11,
          attributionLogo: false,
        },
        grid: {
          vertLines: { color: "rgba(255,255,255,0.04)" },
          horzLines: { color: "rgba(255,255,255,0.04)" },
        },
        crosshair: {
          mode: lc.CrosshairMode.Normal,
          vertLine: { color: "rgba(34,211,238,0.4)", labelBackgroundColor: "#0e7490" },
          horzLine: { color: "rgba(167,139,250,0.4)", labelBackgroundColor: "#5b21b6" },
        },
        rightPriceScale: { borderColor: "rgba(255,255,255,0.08)" },
        timeScale: {
          borderColor: "rgba(255,255,255,0.08)",
          timeVisible: false,
          rightOffset: 4,
          barSpacing: 6,
          minBarSpacing: 2,
        },
        handleScroll: { mouseWheel: true, pressedMouseMove: true, horzTouchDrag: true, vertTouchDrag: true },
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
          onCrosshairRef.current?.(null);
          return;
        }
        const date = String(param.time);
        const bar = barsRef.current.find((b) => b.date === date) ?? null;
        onCrosshairRef.current?.(bar);
      };

      chart.subscribeCrosshairMove(onMove);
      setReady(true);
    })();

    return () => {
      disposed = true;
      chartRef.current?.remove();
      chartRef.current = null;
      candleRef.current = null;
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

      const sampled = sampleBars(bars, 2200);
      barsRef.current = sampled;
      clearSeries(chart);
      candleRef.current = null;

      if (!sampled.length) return;

      const candle = chart.addSeries(lc.CandlestickSeries, {
        upColor: "#34d399",
        downColor: "#fb7185",
        borderUpColor: "#34d399",
        borderDownColor: "#fb7185",
        wickUpColor: "#34d399",
        wickDownColor: "#fb7185",
      });
      candle.setData(
        sampled.map((b) => ({
          time: toTime(b.date),
          open: b.open,
          high: b.high,
          low: b.low,
          close: b.close,
        }))
      );
      candle.priceScale().applyOptions({ scaleMargins: { top: 0.08, bottom: 0.32 } });
      candleRef.current = candle;

      const vol = chart.addSeries(lc.HistogramSeries, {
        priceFormat: { type: "volume" },
        priceScaleId: "volume",
        lastValueVisible: false,
        priceLineVisible: false,
      });
      vol.priceScale().applyOptions({ scaleMargins: { top: 0.78, bottom: 0 } });
      vol.setData(
        sampled.map((b) => ({
          time: toTime(b.date),
          value: b.volume,
          color: b.close >= b.open ? "rgba(52,211,153,0.45)" : "rgba(251,113,133,0.45)",
        }))
      );

      chart.timeScale().fitContent();
    })();

    return () => {
      cancelled = true;
    };
  }, [bars, ready]);

  useEffect(() => {
    // Force LWC resize when entering/leaving fullscreen
    const id = window.setTimeout(() => window.dispatchEvent(new Event("resize")), 60);
    return () => window.clearTimeout(id);
  }, [open]);

  const chartHeight = open ? "100%" : height;

  return (
    <div className={`relative w-full ${open ? "min-h-0 flex-1" : ""} ${className}`}>
      <div
        ref={containerRef}
        className="w-full"
        style={{ height: chartHeight, minHeight: open ? 420 : height }}
        role="img"
        aria-label="Candlestick chart"
      />
    </div>
  );
}

export default function CandlestickChart({
  bars,
  height = 360,
  className = "",
  onCrosshair,
  title = "Chart",
  subtitle,
  enableFullscreen = true,
}: Props) {
  const canvas = (
    <div className="relative">
      <CandlestickChartCanvas
        bars={bars}
        height={height}
        className={className}
        onCrosshair={onCrosshair}
      />
      {enableFullscreen ? <ChartFullscreenToggle /> : null}
    </div>
  );

  if (!enableFullscreen) {
    return (
      <CandlestickChartCanvas
        bars={bars}
        height={height}
        className={className}
        onCrosshair={onCrosshair}
      />
    );
  }

  return (
    <ChartFullscreenShell title={title} subtitle={subtitle}>
      {canvas}
    </ChartFullscreenShell>
  );
}
