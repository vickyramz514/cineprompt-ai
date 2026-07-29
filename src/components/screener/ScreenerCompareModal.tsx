"use client";

import type { EtfScreenerRow } from "@/services/datacaptain/endpoints";
import { formatPct } from "@/lib/screener/presets";

export default function ScreenerCompareModal({
  rows,
  onClose,
}: {
  rows: EtfScreenerRow[];
  onClose: () => void;
}) {
  if (rows.length < 2) return null;

  const metrics: Array<{ label: string; get: (r: EtfScreenerRow) => string }> = [
    { label: "Price", get: (r) => (r.latestPrice != null ? `$${r.latestPrice.toFixed(2)}` : "—") },
    { label: "1Y Return", get: (r) => formatPct(r.return1y) },
    { label: "YTD", get: (r) => formatPct(r.returnYtd) },
    { label: "CAGR (3Y est.)", get: (r) => formatPct(r.cagr) },
    { label: "Dividend Yield", get: (r) => formatPct(r.dividendYieldTtm) },
    { label: "Expense Ratio", get: (r) => (r.expenseRatio != null ? `${r.expenseRatio}%` : "—") },
    { label: "Volatility", get: (r) => formatPct(r.volatility1y) },
    { label: "Sharpe", get: (r) => (r.sharpeRatio != null ? r.sharpeRatio.toFixed(2) : "—") },
    { label: "AUM", get: (r) => (r.aumBillions != null ? `$${r.aumBillions}B` : "—") },
    { label: "Category", get: (r) => r.category ?? "—" },
    { label: "Issuer", get: (r) => r.issuer ?? "—" },
  ];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/70" aria-label="Close compare" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Compare ETFs"
        className="relative max-h-[85vh] w-full max-w-4xl overflow-auto rounded-2xl border border-white/10 bg-[#0b0b14] p-5 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Compare ETFs</h2>
          <button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-white/50 hover:bg-white/10">
            ✕
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-white/40">
                <th className="py-2 pr-3">Metric</th>
                {rows.map((r) => (
                  <th key={r.symbol} className="px-2 py-2 font-mono text-cyan-300">
                    {r.symbol}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((m) => (
                <tr key={m.label} className="border-b border-white/5">
                  <td className="py-2 pr-3 text-white/50">{m.label}</td>
                  {rows.map((r) => (
                    <td key={r.symbol} className="px-2 py-2 tabular-nums text-white/85">
                      {m.get(r)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
