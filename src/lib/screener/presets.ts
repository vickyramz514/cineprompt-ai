import type { EtfScreenerRow } from "@/services/datacaptain/endpoints";

export type ScreenerFilters = {
  search: string;
  period: string;
  returnMin: string;
  returnMax: string;
  dividendYieldMin: string;
  dividendYieldMax: string;
  volatilityMin: string;
  volatilityMax: string;
  volumeMin: string;
  priceMin: string;
  priceMax: string;
  expenseMax: string;
  aumMin: string;
  sharpeMin: string;
  category: string;
  issuer: string;
  assetClass: string;
  leveraged: boolean;
  inverse: boolean;
  esg: boolean;
  sort: string;
  sortDir: "asc" | "desc";
};

export const DEFAULT_FILTERS: ScreenerFilters = {
  search: "",
  period: "1y",
  returnMin: "",
  returnMax: "",
  dividendYieldMin: "",
  dividendYieldMax: "",
  volatilityMin: "",
  volatilityMax: "",
  volumeMin: "",
  priceMin: "",
  priceMax: "",
  expenseMax: "",
  aumMin: "",
  sharpeMin: "",
  category: "",
  issuer: "",
  assetClass: "",
  leveraged: false,
  inverse: false,
  esg: false,
  sort: "return",
  sortDir: "desc",
};

export type QuickPreset = {
  id: string;
  label: string;
  filters: Partial<ScreenerFilters>;
};

export const QUICK_PRESETS: QuickPreset[] = [
  {
    id: "top",
    label: "Top Performers",
    filters: { returnMin: "15", sort: "return", sortDir: "desc", period: "1y" },
  },
  {
    id: "growth",
    label: "Growth ETFs",
    filters: { category: "growth", returnMin: "8", sort: "return", sortDir: "desc" },
  },
  {
    id: "dividend",
    label: "High Dividend",
    filters: { category: "dividend", dividendYieldMin: "2.5", sort: "yield", sortDir: "desc" },
  },
  {
    id: "lowvol",
    label: "Low Volatility",
    filters: { volatilityMax: "15", sort: "volatility", sortDir: "asc" },
  },
  {
    id: "bonds",
    label: "Bond ETFs",
    filters: { category: "bonds", sort: "yield", sortDir: "desc" },
  },
  {
    id: "tech",
    label: "Technology",
    filters: { category: "technology", sort: "return", sortDir: "desc" },
  },
  {
    id: "intl",
    label: "International",
    filters: { category: "international", sort: "return", sortDir: "desc" },
  },
  {
    id: "lev",
    label: "Leveraged",
    filters: { leveraged: true, category: "leveraged", sort: "return", sortDir: "desc" },
  },
  {
    id: "inv",
    label: "Inverse",
    filters: { inverse: true, category: "inverse", sort: "return", sortDir: "desc" },
  },
  {
    id: "beginner",
    label: "Beginner Friendly",
    filters: {
      category: "broad",
      expenseMax: "0.1",
      volatilityMax: "20",
      sort: "aum",
      sortDir: "desc",
    },
  },
  {
    id: "sharpe",
    label: "Best Sharpe Ratio",
    filters: { sharpeMin: "0.5", sort: "sharpe", sortDir: "desc" },
  },
];

export const CATEGORY_OPTIONS = [
  { id: "", label: "All categories" },
  { id: "broad", label: "Broad Market" },
  { id: "dividend", label: "Dividend" },
  { id: "sector", label: "Sector" },
  { id: "growth", label: "Growth" },
  { id: "value", label: "Value" },
  { id: "technology", label: "Technology" },
  { id: "healthcare", label: "Healthcare" },
  { id: "financial", label: "Financial" },
  { id: "energy", label: "Energy" },
  { id: "utilities", label: "Utilities" },
  { id: "bonds", label: "Bonds" },
  { id: "international", label: "International" },
  { id: "emerging", label: "Emerging Markets" },
  { id: "commodity", label: "Commodity" },
  { id: "leveraged", label: "Leveraged" },
  { id: "inverse", label: "Inverse" },
  { id: "esg", label: "ESG" },
];

export const ISSUER_OPTIONS = [
  "",
  "Vanguard",
  "iShares",
  "State Street",
  "Invesco",
  "Schwab",
  "ARK",
  "ProShares",
  "Direxion",
  "Other",
];

export type ScreenerStats = {
  count: number;
  avgReturn: number | null;
  avgYield: number | null;
  avgVol: number | null;
  highestReturn: EtfScreenerRow | null;
  highestYield: EtfScreenerRow | null;
  lowestExpense: EtfScreenerRow | null;
  largestAum: EtfScreenerRow | null;
};

export function computeScreenerStats(rows: EtfScreenerRow[]): ScreenerStats {
  const avg = (vals: number[]) =>
    vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : null;
  const returns = rows.map((r) => r.returnPct ?? r.return1y).filter((v): v is number => v != null);
  const yields = rows.map((r) => r.dividendYieldTtm).filter((v): v is number => v != null);
  const vols = rows.map((r) => r.volatility1y).filter((v): v is number => v != null);

  const byReturn = [...rows].sort(
    (a, b) => (b.returnPct ?? b.return1y ?? -999) - (a.returnPct ?? a.return1y ?? -999)
  );
  const byYield = [...rows].sort((a, b) => (b.dividendYieldTtm ?? -1) - (a.dividendYieldTtm ?? -1));
  const byExpense = [...rows]
    .filter((r) => r.expenseRatio != null)
    .sort((a, b) => (a.expenseRatio ?? 99) - (b.expenseRatio ?? 99));
  const byAum = [...rows]
    .filter((r) => r.aumBillions != null)
    .sort((a, b) => (b.aumBillions ?? 0) - (a.aumBillions ?? 0));

  return {
    count: rows.length,
    avgReturn: avg(returns),
    avgYield: avg(yields),
    avgVol: avg(vols),
    highestReturn: byReturn[0] ?? null,
    highestYield: byYield[0] ?? null,
    lowestExpense: byExpense[0] ?? null,
    largestAum: byAum[0] ?? null,
  };
}

export function filtersToParams(f: ScreenerFilters, limit: number, offset: number) {
  return {
    period: f.period,
    search: f.search || undefined,
    returnMin: f.returnMin || undefined,
    returnMax: f.returnMax || undefined,
    dividendYieldMin: f.dividendYieldMin || undefined,
    dividendYieldMax: f.dividendYieldMax || undefined,
    volatilityMin: f.volatilityMin || undefined,
    volatilityMax: f.volatilityMax || undefined,
    volumeMin: f.volumeMin || undefined,
    priceMin: f.priceMin || undefined,
    priceMax: f.priceMax || undefined,
    expenseMax: f.expenseMax || undefined,
    aumMin: f.aumMin || undefined,
    sharpeMin: f.sharpeMin || undefined,
    category: f.category || undefined,
    issuer: f.issuer || undefined,
    assetClass: f.assetClass || undefined,
    leveraged: f.leveraged ? "1" : undefined,
    inverse: f.inverse ? "1" : undefined,
    esg: f.esg ? "1" : undefined,
    sort: f.sort,
    sortDir: f.sortDir,
    limit: String(limit),
    offset: String(offset),
  };
}

export function formatPct(n: number | null | undefined, digits = 1) {
  if (n == null || Number.isNaN(n)) return "—";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}

export function formatCompact(n: number | null | undefined) {
  if (n == null || Number.isNaN(n)) return "—";
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(Math.round(n));
}
