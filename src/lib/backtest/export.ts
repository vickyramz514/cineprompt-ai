import type { BacktestResult } from "@/services/datacaptain/endpoints";
import { derivePortfolioStats, formatPct, formatUsdPrecise } from "@/lib/backtest/metrics";

function downloadBlob(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportBacktestJson(result: BacktestResult, compare?: BacktestResult | null) {
  const payload = {
    primary: result,
    compare: compare ?? null,
    exportedAt: new Date().toISOString(),
  };
  downloadBlob(
    `${result.symbol}-backtest.json`,
    JSON.stringify(payload, null, 2),
    "application/json"
  );
}

export function exportBacktestCsv(result: BacktestResult, compare?: BacktestResult | null) {
  const stats = derivePortfolioStats(result);
  const lines: string[] = [];
  lines.push("section,field,value");
  lines.push(`summary,symbol,${result.symbol}`);
  lines.push(`summary,name,"${(result.name || "").replace(/"/g, '""')}"`);
  lines.push(`summary,startDate,${result.startDate}`);
  lines.push(`summary,endDate,${result.endDate}`);
  lines.push(`summary,initialInvestment,${result.initialInvestment}`);
  lines.push(`summary,finalValue,${result.finalValue}`);
  lines.push(`summary,totalProfit,${stats.totalProfit}`);
  lines.push(`summary,totalReturnPct,${result.totalReturn}`);
  lines.push(`summary,cagrPct,${result.cagr ?? result.annualReturn}`);
  lines.push(`summary,maxDrawdownPct,${result.maxDrawdown}`);
  lines.push(`summary,volatilityPct,${result.volatility ?? ""}`);
  lines.push(`summary,sharpe,${result.sharpe ?? ""}`);
  lines.push(`summary,sortino,${result.sortino ?? ""}`);
  lines.push(`summary,tradingDays,${stats.tradingDays}`);

  if (compare) {
    lines.push(`compare,symbol,${compare.symbol}`);
    lines.push(`compare,totalReturnPct,${compare.totalReturn}`);
    lines.push(`compare,cagrPct,${compare.cagr ?? compare.annualReturn}`);
    lines.push(`compare,maxDrawdownPct,${compare.maxDrawdown}`);
    lines.push(`compare,finalValue,${compare.finalValue}`);
  }

  lines.push("");
  lines.push("date,portfolioValue");
  for (const p of result.equityCurve) {
    lines.push(`${p.date},${p.value}`);
  }

  lines.push("");
  lines.push("year,returnPct,portfolioValue");
  for (const row of stats.annualRows) {
    lines.push(`${row.year},${row.returnPct},${row.portfolioValue}`);
  }

  downloadBlob(`${result.symbol}-backtest.csv`, lines.join("\n"), "text/csv;charset=utf-8");
}

export function exportBacktestPdf(result: BacktestResult) {
  const stats = derivePortfolioStats(result);
  const cagr = result.cagr ?? result.annualReturn;
  const html = `<!DOCTYPE html><html><head><title>${result.symbol} Backtest</title>
<style>
body{font-family:ui-sans-serif,system-ui,sans-serif;background:#0a0a0f;color:#f8fafc;padding:32px}
h1{margin:0 0 4px} .muted{color:#94a3b8} .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:24px}
.card{border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:16px;background:#12121a}
.label{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#64748b}
.val{font-size:22px;font-weight:600;margin-top:4px}
</style></head><body>
<h1>${result.symbol}</h1>
<p class="muted">${result.name || ""}</p>
<p class="muted">Investment ${formatUsdPrecise(result.initialInvestment)} · ${result.startDate} → ${result.endDate} · ${stats.durationYears.toFixed(1)} years</p>
<div class="grid">
<div class="card"><div class="label">Final Value</div><div class="val">${formatUsdPrecise(result.finalValue)}</div></div>
<div class="card"><div class="label">Total Profit</div><div class="val">${formatUsdPrecise(stats.totalProfit)}</div></div>
<div class="card"><div class="label">Total Return</div><div class="val">${formatPct(result.totalReturn)}</div></div>
<div class="card"><div class="label">CAGR</div><div class="val">${formatPct(cagr)}</div></div>
<div class="card"><div class="label">Max Drawdown</div><div class="val">${formatPct(-Math.abs(result.maxDrawdown))}</div></div>
<div class="card"><div class="label">Sharpe</div><div class="val">${result.sharpe ?? "—"}</div></div>
</div>
<script>window.onload=()=>window.print()</script>
</body></html>`;

  const w = window.open("", "_blank", "noopener,noreferrer,width=900,height=700");
  if (!w) return;
  w.document.write(html);
  w.document.close();
}

export async function shareBacktestResult(result: BacktestResult) {
  const stats = derivePortfolioStats(result);
  const text = `${result.symbol} backtest: ${formatUsdPrecise(result.initialInvestment)} → ${formatUsdPrecise(result.finalValue)} (${formatPct(result.totalReturn)}), CAGR ${formatPct(result.cagr ?? result.annualReturn)}, max DD ${result.maxDrawdown}% · ${result.startDate} → ${result.endDate} (${stats.durationYears.toFixed(1)}y)`;
  const url = typeof window !== "undefined" ? window.location.href : "";

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title: `${result.symbol} Backtest`, text, url });
      return;
    } catch {
      /* fall through */
    }
  }
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(`${text}\n${url}`);
  }
}
