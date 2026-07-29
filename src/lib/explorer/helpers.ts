import type { EtfItem } from "@/services/datacaptain/endpoints";

export const EXPLORER_CATEGORIES = [
  { id: "", label: "All" },
  { id: "broad", label: "Broad Market" },
  { id: "technology", label: "Technology" },
  { id: "dividend", label: "Dividend" },
  { id: "bonds", label: "Bonds" },
  { id: "growth", label: "Growth" },
  { id: "international", label: "International" },
  { id: "leveraged", label: "Leveraged" },
  { id: "inverse", label: "Inverse" },
  { id: "esg", label: "ESG" },
  { id: "healthcare", label: "Healthcare" },
  { id: "energy", label: "Energy" },
];

export const EXPLORER_ISSUERS = [
  "",
  "Vanguard",
  "iShares",
  "State Street",
  "Invesco",
  "Schwab",
  "ARK",
  "ProShares",
  "Direxion",
];

export const SORT_OPTIONS = [
  { id: "symbol", label: "Symbol" },
  { id: "price", label: "Price" },
  { id: "return", label: "Return" },
  { id: "volume", label: "Volume" },
  { id: "yield", label: "Dividend Yield" },
  { id: "expense", label: "Expense Ratio" },
  { id: "aum", label: "AUM" },
];

export type ExplorerViewMode = "grid" | "list" | "compact";

const RECENT_KEY = "dc_etf_recent_viewed";

export function loadRecentEtfs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]") as string[];
  } catch {
    return [];
  }
}

export function pushRecentEtf(symbol: string) {
  const next = [symbol.toUpperCase(), ...loadRecentEtfs().filter((s) => s !== symbol.toUpperCase())].slice(
    0,
    12
  );
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  return next;
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

export function filterParams(filters: {
  search: string;
  category: string;
  issuer: string;
  assetClass: string;
  leveraged: boolean;
  inverse: boolean;
  dividendMin: string;
  expenseMax: string;
  aumMin: string;
  volumeMin: string;
  sort: string;
  sortDir: string;
  hasPrice: boolean;
  limit: number;
  offset: number;
}) {
  return {
    search: filters.search || undefined,
    category: filters.category || undefined,
    issuer: filters.issuer || undefined,
    assetClass: filters.assetClass || undefined,
    leveraged: filters.leveraged ? "1" : undefined,
    inverse: filters.inverse ? "1" : undefined,
    dividendMin: filters.dividendMin || undefined,
    expenseMax: filters.expenseMax || undefined,
    aumMin: filters.aumMin || undefined,
    volumeMin: filters.volumeMin || undefined,
    sort: filters.sort,
    sortDir: filters.sortDir,
    hasPrice: filters.hasPrice ? "1" : "0",
    limit: String(filters.limit),
    offset: String(filters.offset),
  };
}

export type { EtfItem };
