import type { EtfScreenerRow } from "@/services/datacaptain/endpoints";
import type { ScreenerFilters } from "./presets";

const FAV_KEY = "dc_etf_favorites";
const SCREENS_KEY = "dc_etf_saved_screens";

export function loadFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAV_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(symbols: string[]) {
  localStorage.setItem(FAV_KEY, JSON.stringify([...new Set(symbols)]));
}

export function toggleFavorite(symbol: string): string[] {
  const list = loadFavorites();
  const next = list.includes(symbol) ? list.filter((s) => s !== symbol) : [...list, symbol];
  saveFavorites(next);
  return next;
}

export type SavedScreen = {
  id: string;
  name: string;
  filters: ScreenerFilters;
  createdAt: string;
};

export function loadSavedScreens(): SavedScreen[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SCREENS_KEY);
    return raw ? (JSON.parse(raw) as SavedScreen[]) : [];
  } catch {
    return [];
  }
}

export function saveScreen(name: string, filters: ScreenerFilters): SavedScreen[] {
  const screens = loadSavedScreens();
  const entry: SavedScreen = {
    id: `${Date.now()}`,
    name,
    filters,
    createdAt: new Date().toISOString(),
  };
  const next = [entry, ...screens].slice(0, 20);
  localStorage.setItem(SCREENS_KEY, JSON.stringify(next));
  return next;
}

export function deleteSavedScreen(id: string): SavedScreen[] {
  const next = loadSavedScreens().filter((s) => s.id !== id);
  localStorage.setItem(SCREENS_KEY, JSON.stringify(next));
  return next;
}

export function exportScreenerCsv(rows: EtfScreenerRow[], period: string) {
  const header = [
    "symbol",
    "name",
    "category",
    "issuer",
    "price",
    "return1d",
    "return1m",
    "returnYtd",
    "return1y",
    "return3y",
    "return5y",
    "cagr",
    "dividendYield",
    "expenseRatio",
    "aumBillions",
    "volume",
    "volatility",
    "sharpe",
  ];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.symbol,
        `"${(r.name || "").replace(/"/g, '""')}"`,
        r.category ?? "",
        r.issuer ?? "",
        r.latestPrice ?? "",
        r.return1d ?? "",
        r.return1m ?? "",
        r.returnYtd ?? "",
        r.return1y ?? "",
        r.return3y ?? "",
        r.return5y ?? "",
        r.cagr ?? "",
        r.dividendYieldTtm ?? "",
        r.expenseRatio ?? "",
        r.aumBillions ?? "",
        r.avgVolume30d ?? "",
        r.volatility1y ?? "",
        r.sharpeRatio ?? "",
      ].join(",")
    );
  }
  download(`etf-screener-${period}.csv`, lines.join("\n"), "text/csv;charset=utf-8");
}

export function exportScreenerJson(rows: EtfScreenerRow[], period: string, filters: ScreenerFilters) {
  download(
    `etf-screener-${period}.json`,
    JSON.stringify({ period, filters, exportedAt: new Date().toISOString(), rows }, null, 2),
    "application/json"
  );
}

/** Excel-friendly TSV */
export function exportScreenerExcel(rows: EtfScreenerRow[], period: string) {
  exportScreenerCsv(rows, `${period}-excel`);
}

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function shareScreen(total: number, period: string) {
  const text = `Data Captain ETF Screener (${period}): ${total} matching ETFs`;
  const url = typeof window !== "undefined" ? window.location.href : "";
  if (navigator.share) {
    try {
      await navigator.share({ title: "ETF Screener", text, url });
      return;
    } catch {
      /* fallthrough */
    }
  }
  await navigator.clipboard?.writeText(`${text}\n${url}`);
}
