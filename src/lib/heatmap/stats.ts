import type { EtfHeatmapCell } from "@/services/datacaptain/endpoints";

export type HeatmapSort =
  | "best"
  | "worst"
  | "alpha"
  | "volume"
  | "aum"
  | "expense";

export type HeatmapStats = {
  count: number;
  greenCount: number;
  redCount: number;
  avgReturn: number | null;
  medianReturn: number | null;
  best: EtfHeatmapCell | null;
  worst: EtfHeatmapCell | null;
  largest: EtfHeatmapCell | null;
  highestGain: number | null;
  largestLoss: number | null;
};

export function computeHeatmapStats(cells: EtfHeatmapCell[]): HeatmapStats {
  const withRet = cells.filter((c) => c.returnPct != null) as Array<
    EtfHeatmapCell & { returnPct: number }
  >;
  const returns = withRet.map((c) => c.returnPct).sort((a, b) => a - b);
  const avgReturn =
    returns.length > 0 ? returns.reduce((s, r) => s + r, 0) / returns.length : null;
  const mid = Math.floor(returns.length / 2);
  const medianReturn =
    returns.length === 0
      ? null
      : returns.length % 2
        ? returns[mid]
        : (returns[mid - 1] + returns[mid]) / 2;

  const byReturn = [...withRet].sort((a, b) => b.returnPct - a.returnPct);
  const bySize = [...cells].sort((a, b) => (b.sizeScore || 0) - (a.sizeScore || 0));

  return {
    count: cells.length,
    greenCount: withRet.filter((c) => c.returnPct > 0).length,
    redCount: withRet.filter((c) => c.returnPct < 0).length,
    avgReturn,
    medianReturn,
    best: byReturn[0] ?? null,
    worst: byReturn[byReturn.length - 1] ?? null,
    largest: bySize[0] ?? null,
    highestGain: byReturn[0]?.returnPct ?? null,
    largestLoss: byReturn[byReturn.length - 1]?.returnPct ?? null,
  };
}

export function sortHeatmapCells(cells: EtfHeatmapCell[], sort: HeatmapSort): EtfHeatmapCell[] {
  const list = [...cells];
  switch (sort) {
    case "worst":
      return list.sort((a, b) => (a.returnPct ?? 999) - (b.returnPct ?? 999));
    case "alpha":
      return list.sort((a, b) => a.symbol.localeCompare(b.symbol));
    case "volume":
      return list.sort((a, b) => (b.avgVolume30d || 0) - (a.avgVolume30d || 0));
    case "aum":
      return list.sort((a, b) => (b.aumBillions || b.sizeScore || 0) - (a.aumBillions || a.sizeScore || 0));
    case "expense":
      return list.sort((a, b) => {
        const ea = a.expenseRatio;
        const eb = b.expenseRatio;
        if (ea == null && eb == null) return 0;
        if (ea == null) return 1;
        if (eb == null) return -1;
        return ea - eb;
      });
    case "best":
    default:
      return list.sort((a, b) => (b.returnPct ?? -999) - (a.returnPct ?? -999));
  }
}

export function buildReturnHistogram(cells: EtfHeatmapCell[], bucket = 5) {
  const map = new Map<string, number>();
  for (const c of cells) {
    if (c.returnPct == null) continue;
    const b = Math.floor(c.returnPct / bucket) * bucket;
    const key = `${b}`;
    map.set(key, (map.get(key) || 0) + 1);
  }
  return [...map.entries()]
    .map(([k, count]) => ({ bucket: Number(k), label: `${k}%`, count }))
    .sort((a, b) => a.bucket - b.bucket);
}

export const PERIODS = [
  { id: "1d", label: "1D" },
  { id: "1w", label: "1W" },
  { id: "1m", label: "1M" },
  { id: "3m", label: "3M" },
  { id: "6m", label: "6M" },
  { id: "ytd", label: "YTD" },
  { id: "1y", label: "1Y" },
  { id: "3y", label: "3Y" },
  { id: "5y", label: "5Y" },
  { id: "10y", label: "10Y" },
  { id: "max", label: "Max" },
] as const;

export const SORT_OPTIONS: { id: HeatmapSort; label: string }[] = [
  { id: "best", label: "Best Performance" },
  { id: "worst", label: "Worst Performance" },
  { id: "alpha", label: "Alphabetical" },
  { id: "volume", label: "Highest Volume" },
  { id: "aum", label: "Largest AUM" },
  { id: "expense", label: "Lowest Expense Ratio" },
];
