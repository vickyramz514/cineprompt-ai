import type { Ohlcv } from "@/lib/explorer/chartIndicators";

export const CHART_RANGES = [
  { id: "1D", days: 2 },
  { id: "5D", days: 7 },
  { id: "1M", days: 31 },
  { id: "3M", days: 93 },
  { id: "6M", days: 183 },
  { id: "YTD", days: null },
  { id: "1Y", days: 365 },
  { id: "3Y", days: 365 * 3 },
  { id: "5Y", days: 365 * 5 },
  { id: "10Y", days: 365 * 10 },
  { id: "MAX", days: null },
] as const;

export type ChartRangeId = (typeof CHART_RANGES)[number]["id"];
export type ChartStyle = "candlestick" | "ohlc" | "line" | "area";
export type IndicatorTab = "price" | "volume" | "rsi" | "macd" | "atr" | "stochastic";
export type OverlayId = "sma20" | "sma50" | "sma200" | "ema20" | "bb";
export type DrawTool = "none" | "trend" | "hline" | "vline" | "rect" | "arrow";

export function filterByRange(history: Ohlcv[], range: ChartRangeId): Ohlcv[] {
  if (!history.length) return [];
  if (range === "MAX") return history;
  const last = history[history.length - 1];
  if (range === "YTD") {
    const y = last.date.slice(0, 4);
    return history.filter((p) => p.date >= `${y}-01-01`);
  }
  const def = CHART_RANGES.find((r) => r.id === range);
  if (!def?.days) return history;
  const cut = new Date(last.date);
  cut.setUTCDate(cut.getUTCDate() - def.days);
  const cutStr = cut.toISOString().slice(0, 10);
  return history.filter((p) => p.date >= cutStr);
}

/** Keep chart responsive for MAX; LWC virtualizes paint but data set size still matters. */
export function sampleBars(bars: Ohlcv[], maxPoints = 2500): Ohlcv[] {
  if (bars.length <= maxPoints) return bars;
  const step = Math.ceil(bars.length / maxPoints);
  const out: Ohlcv[] = [];
  for (let i = 0; i < bars.length; i += step) out.push(bars[i]);
  const last = bars[bars.length - 1];
  if (out[out.length - 1]?.date !== last.date) out.push(last);
  return out;
}

export function formatVol(n: number | null | undefined) {
  if (n == null || Number.isNaN(n)) return "—";
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(Math.round(n));
}

export function toCsv(bars: Ohlcv[]) {
  const header = "date,open,high,low,close,volume";
  const rows = bars.map(
    (b) => `${b.date},${b.open},${b.high},${b.low},${b.close},${b.volume}`
  );
  return [header, ...rows].join("\n");
}

export function downloadBlob(filename: string, content: string | Blob, mime: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function computeReturnFromHistory(bars: Ohlcv[], days: number | "ytd" | "inception"): number | null {
  if (bars.length < 2) return null;
  const last = bars[bars.length - 1];
  let start: Ohlcv | null = null;
  if (days === "inception") {
    start = bars[0];
  } else if (days === "ytd") {
    const y = last.date.slice(0, 4);
    start = bars.find((b) => b.date >= `${y}-01-01`) ?? bars[0];
  } else {
    const cut = new Date(last.date);
    cut.setUTCDate(cut.getUTCDate() - days);
    const cutStr = cut.toISOString().slice(0, 10);
    for (const b of bars) {
      if (b.date <= cutStr) start = b;
      else break;
    }
    start = start ?? bars[0];
  }
  if (!start || start.close <= 0) return null;
  return ((last.close - start.close) / start.close) * 100;
}
