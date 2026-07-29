import type { EtfRankingsRow } from "@/services/datacaptain/endpoints";

export const RANKING_METRICS = [
  { id: "return", label: "Return" },
  { id: "cagr", label: "CAGR" },
  { id: "sharpe", label: "Sharpe Ratio" },
  { id: "yield", label: "Dividend Yield" },
  { id: "expense", label: "Expense Ratio" },
  { id: "volatility", label: "Volatility" },
  { id: "drawdown", label: "Drawdown" },
  { id: "aum", label: "AUM" },
] as const;

export type RankingMetric = (typeof RANKING_METRICS)[number]["id"];

export const RANKING_BASKETS = [
  { id: "", label: "All ETFs" },
  { id: "broad", label: "Broad Market" },
  { id: "technology", label: "Technology" },
  { id: "dividend", label: "Dividend" },
  { id: "bonds", label: "Bond" },
  { id: "growth", label: "Growth" },
  { id: "international", label: "International" },
  { id: "emerging", label: "Emerging Markets" },
  { id: "leveraged", label: "Leveraged" },
  { id: "inverse", label: "Inverse" },
  { id: "esg", label: "ESG" },
  { id: "healthcare", label: "Healthcare" },
  { id: "energy", label: "Energy" },
  { id: "financial", label: "Financial" },
];

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

export function scoreLabel(metric: string) {
  switch (metric) {
    case "yield":
      return "Yield";
    case "volatility":
      return "Volatility";
    case "cagr":
      return "CAGR";
    case "sharpe":
      return "Sharpe";
    case "expense":
      return "Expense";
    case "aum":
      return "AUM";
    case "drawdown":
      return "Drawdown";
    default:
      return "Return";
  }
}

export function formatScore(row: EtfRankingsRow, metric: string) {
  const v = row.score;
  if (metric === "aum") return row.aumBillions != null ? `$${row.aumBillions}B` : "—";
  if (metric === "expense") return row.expenseRatio != null ? `${row.expenseRatio}%` : "—";
  if (metric === "sharpe") return v != null ? v.toFixed(2) : "—";
  return formatPct(v);
}

export type RankingsStats = {
  top: EtfRankingsRow | null;
  avgReturn: number | null;
  highestDividend: EtfRankingsRow | null;
  lowestVol: EtfRankingsRow | null;
  total: number;
};

export function computeRankingsStats(rows: EtfRankingsRow[], total: number): RankingsStats {
  const returns = rows.map((r) => r.return1y).filter((v): v is number => v != null);
  const avgReturn = returns.length ? returns.reduce((s, v) => s + v, 0) / returns.length : null;
  const byYield = [...rows]
    .filter((r) => r.dividendYieldTtm != null)
    .sort((a, b) => (b.dividendYieldTtm ?? 0) - (a.dividendYieldTtm ?? 0));
  const byVol = [...rows]
    .filter((r) => r.volatility1y != null)
    .sort((a, b) => (a.volatility1y ?? 99) - (b.volatility1y ?? 99));
  const top = [...rows].sort((a, b) => a.rank - b.rank)[0] ?? null;

  return {
    top,
    avgReturn,
    highestDividend: byYield[0] ?? null,
    lowestVol: byVol[0] ?? null,
    total,
  };
}

export function exportRankingsCsv(rows: EtfRankingsRow[], metric: string, period: string) {
  const header = [
    "rank",
    "symbol",
    "name",
    "category",
    "issuer",
    "price",
    "score",
    "return1y",
    "cagr",
    "sharpe",
    "yield",
    "expense",
    "aum",
    "volatility",
    "rankDelta",
  ];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.rank,
        r.symbol,
        `"${(r.name || "").replace(/"/g, '""')}"`,
        r.category ?? "",
        r.issuer ?? "",
        r.latestPrice ?? "",
        r.score ?? "",
        r.return1y ?? "",
        r.cagr ?? "",
        r.sharpeRatio ?? "",
        r.dividendYieldTtm ?? "",
        r.expenseRatio ?? "",
        r.aumBillions ?? "",
        r.volatility1y ?? "",
        r.rankDelta ?? "",
      ].join(",")
    );
  }
  download(`etf-rankings-${metric}-${period}.csv`, lines.join("\n"), "text/csv;charset=utf-8");
}

export function exportRankingsJson(rows: EtfRankingsRow[], metric: string, period: string) {
  download(
    `etf-rankings-${metric}-${period}.json`,
    JSON.stringify({ metric, period, exportedAt: new Date().toISOString(), rows }, null, 2),
    "application/json"
  );
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

export async function shareRankings(total: number, metric: string, period: string) {
  const text = `Data Captain ETF Rankings (${metric}, ${period}): ${total} ETFs`;
  const url = typeof window !== "undefined" ? window.location.href : "";
  if (navigator.share) {
    try {
      await navigator.share({ title: "ETF Rankings", text, url });
      return;
    } catch {
      /* fallthrough */
    }
  }
  await navigator.clipboard?.writeText(`${text}\n${url}`);
}
