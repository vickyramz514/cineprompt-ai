import type { BacktestResult } from "@/services/datacaptain/endpoints";

export type EquityPoint = { date: string; value: number };

export type AnnualReturnRow = {
  year: number;
  returnPct: number;
  portfolioValue: number;
};

export type MonthCell = {
  year: number;
  month: number; // 1-12
  returnPct: number | null;
};

export type DerivedPortfolioStats = {
  highestValue: number;
  lowestValue: number;
  bestYearReturn: number | null;
  worstYearReturn: number | null;
  annualRows: AnnualReturnRow[];
  monthlyCells: MonthCell[];
  tradingDays: number;
  durationYears: number;
  totalProfit: number;
};

function yearsBetween(start: string, end: string): number {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(ms / (365.25 * 24 * 60 * 60 * 1000), 0);
}

/** Build year-end style annual returns from an equity curve. */
export function buildAnnualReturns(curve: EquityPoint[]): AnnualReturnRow[] {
  if (curve.length < 2) return [];

  const byYear = new Map<number, EquityPoint[]>();
  for (const p of curve) {
    const y = Number(p.date.slice(0, 4));
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y)!.push(p);
  }

  const years = [...byYear.keys()].sort((a, b) => a - b);
  const rows: AnnualReturnRow[] = [];
  let prevEnd = curve[0].value;

  for (const year of years) {
    const pts = byYear.get(year)!;
    const endVal = pts[pts.length - 1].value;
    const startVal = year === years[0] ? curve[0].value : prevEnd;
    const returnPct = startVal > 0 ? ((endVal - startVal) / startVal) * 100 : 0;
    rows.push({
      year,
      returnPct: Math.round(returnPct * 100) / 100,
      portfolioValue: endVal,
    });
    prevEnd = endVal;
  }

  return rows;
}

/** Month-over-month returns for heatmap (calendar grid). */
export function buildMonthlyReturns(curve: EquityPoint[]): MonthCell[] {
  if (curve.length < 2) return [];

  const monthEnd = new Map<string, number>();
  for (const p of curve) {
    const key = p.date.slice(0, 7); // YYYY-MM
    monthEnd.set(key, p.value);
  }

  const keys = [...monthEnd.keys()].sort();
  const cells: MonthCell[] = [];
  let prev: number | null = null;

  for (const key of keys) {
    const [ys, ms] = key.split("-");
    const year = Number(ys);
    const month = Number(ms);
    const value = monthEnd.get(key)!;
    let returnPct: number | null = null;
    if (prev != null && prev > 0) {
      returnPct = Math.round(((value - prev) / prev) * 10000) / 100;
    }
    cells.push({ year, month, returnPct });
    prev = value;
  }

  return cells;
}

export function derivePortfolioStats(result: BacktestResult): DerivedPortfolioStats {
  const curve = result.equityCurve || [];
  const values = curve.map((c) => c.value);
  const annualRows = buildAnnualReturns(curve);
  const yearReturns = annualRows.map((r) => r.returnPct);

  return {
    highestValue: values.length ? Math.max(...values) : result.finalValue,
    lowestValue: values.length ? Math.min(...values) : result.initialInvestment,
    bestYearReturn: yearReturns.length ? Math.max(...yearReturns) : null,
    worstYearReturn: yearReturns.length ? Math.min(...yearReturns) : null,
    annualRows,
    monthlyCells: buildMonthlyReturns(curve),
    tradingDays: result.tradingDays ?? curve.length,
    durationYears: result.years ?? yearsBetween(result.startDate, result.endDate),
    totalProfit: result.totalProfit ?? result.finalValue - result.initialInvestment,
  };
}

/** Align two equity curves onto shared dates (forward-fill). */
export function mergeEquityCurves(
  primary: EquityPoint[],
  secondary: EquityPoint[],
  primaryKey = "primary",
  secondaryKey = "secondary"
): Array<Record<string, string | number | null>> {
  const mapA = new Map(primary.map((p) => [p.date, p.value]));
  const mapB = new Map(secondary.map((p) => [p.date, p.value]));
  const dates = [...new Set([...mapA.keys(), ...mapB.keys()])].sort();

  let lastA: number | null = null;
  let lastB: number | null = null;
  return dates.map((date) => {
    if (mapA.has(date)) lastA = mapA.get(date)!;
    if (mapB.has(date)) lastB = mapB.get(date)!;
    return {
      date,
      [primaryKey]: lastA,
      [secondaryKey]: lastB,
    };
  });
}

/** Beta of primary vs benchmark from aligned equity curves. */
export function computeBeta(primary: EquityPoint[], benchmark: EquityPoint[]): number | null {
  const merged = mergeEquityCurves(primary, benchmark, "p", "b");
  const rp: number[] = [];
  const rb: number[] = [];
  for (let i = 1; i < merged.length; i++) {
    const p0 = merged[i - 1].p as number | null;
    const p1 = merged[i].p as number | null;
    const b0 = merged[i - 1].b as number | null;
    const b1 = merged[i].b as number | null;
    if (p0 && p1 && b0 && b1 && p0 > 0 && b0 > 0) {
      rp.push((p1 - p0) / p0);
      rb.push((b1 - b0) / b0);
    }
  }
  if (rp.length < 20) return null;
  const meanP = rp.reduce((a, b) => a + b, 0) / rp.length;
  const meanB = rb.reduce((a, b) => a + b, 0) / rb.length;
  let cov = 0;
  let varB = 0;
  for (let i = 0; i < rp.length; i++) {
    cov += (rp[i] - meanP) * (rb[i] - meanB);
    varB += (rb[i] - meanB) ** 2;
  }
  if (varB === 0) return null;
  return Math.round((cov / varB) * 100) / 100;
}

export function formatUsd(n: number): string {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function formatUsdPrecise(n: number): string {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

export function formatPct(n: number, digits = 2): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}
