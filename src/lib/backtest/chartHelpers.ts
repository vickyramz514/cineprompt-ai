import type { BacktestPriceBar, BacktestResult } from "@/services/datacaptain/endpoints";
import type { EquityPoint } from "@/lib/backtest/metrics";

export const EQUITY_ZOOM = [
  { id: "1M", days: 31 },
  { id: "6M", days: 183 },
  { id: "YTD", days: null },
  { id: "1Y", days: 365 },
  { id: "3Y", days: 365 * 3 },
  { id: "5Y", days: 365 * 5 },
  { id: "Max", days: null },
] as const;

export type EquityZoomId = (typeof EQUITY_ZOOM)[number]["id"];

export function filterByZoom<T extends { date: string }>(rows: T[], zoom: EquityZoomId): T[] {
  if (!rows.length || zoom === "Max") return rows;
  const last = rows[rows.length - 1].date;
  if (zoom === "YTD") {
    const y = last.slice(0, 4);
    return rows.filter((r) => r.date >= `${y}-01-01`);
  }
  const def = EQUITY_ZOOM.find((z) => z.id === zoom);
  if (!def?.days) return rows;
  const cut = new Date(last);
  cut.setUTCDate(cut.getUTCDate() - def.days);
  const cutStr = cut.toISOString().slice(0, 10);
  return rows.filter((r) => r.date >= cutStr);
}

export function sampleSeries<T>(rows: T[], max = 2000): T[] {
  if (rows.length <= max) return rows;
  const step = Math.ceil(rows.length / max);
  const out: T[] = [];
  for (let i = 0; i < rows.length; i += step) out.push(rows[i]);
  const last = rows[rows.length - 1];
  if (out[out.length - 1] !== last) out.push(last);
  return out;
}

export function buildDrawdownFromEquity(curve: EquityPoint[]) {
  let peak = curve[0]?.value ?? 0;
  return curve.map((p) => {
    if (p.value > peak) peak = p.value;
    const dd = peak > 0 ? ((peak - p.value) / peak) * 100 : 0;
    return { date: p.date, drawdown: -Math.abs(dd), peak, value: p.value };
  });
}

export function vwapSeries(bars: BacktestPriceBar[]): Array<number | null> {
  const out: Array<number | null> = new Array(bars.length).fill(null);
  let cumPv = 0;
  let cumV = 0;
  for (let i = 0; i < bars.length; i++) {
    const typical = (bars[i].high + bars[i].low + bars[i].close) / 3;
    const vol = bars[i].volume || 0;
    cumPv += typical * vol;
    cumV += vol;
    out[i] = cumV > 0 ? cumPv / cumV : null;
  }
  return out;
}

export function todayPortfolioChange(result: BacktestResult) {
  if (result.todayChange != null && result.todayChangePct != null) {
    return { change: result.todayChange, pct: result.todayChangePct };
  }
  const curve = result.equityCurve;
  if (curve.length < 2) return { change: null, pct: null };
  const last = curve[curve.length - 1];
  const prev = curve[curve.length - 2];
  if (!prev.value) return { change: null, pct: null };
  return {
    change: last.value - prev.value,
    pct: ((last.value - prev.value) / prev.value) * 100,
  };
}
