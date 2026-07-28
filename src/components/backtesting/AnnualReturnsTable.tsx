"use client";

import { useState } from "react";
import type { AnnualReturnRow } from "@/lib/backtest/metrics";
import { formatPct, formatUsdPrecise } from "@/lib/backtest/metrics";

export default function AnnualReturnsTable({ rows }: { rows: AnnualReturnRow[] }) {
  const [open, setOpen] = useState(true);
  if (!rows.length) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">Annual returns</p>
          <p className="mt-0.5 text-sm text-white/55">Year · Return · Portfolio value</p>
        </div>
        <span className="text-white/40">{open ? "▾" : "▸"}</span>
      </button>
      {open && (
        <div className="overflow-x-auto border-t border-white/5">
          <table className="w-full min-w-[320px] text-left text-sm">
            <thead className="bg-white/[0.02] text-[11px] uppercase tracking-wider text-white/40">
              <tr>
                <th className="px-5 py-3 font-medium">Year</th>
                <th className="px-5 py-3 font-medium">Return</th>
                <th className="px-5 py-3 font-medium">Portfolio value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((row) => (
                <tr key={row.year} className="hover:bg-white/[0.03]">
                  <td className="px-5 py-2.5 font-mono text-white/80">{row.year}</td>
                  <td
                    className={`px-5 py-2.5 tabular-nums ${
                      row.returnPct >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {formatPct(row.returnPct)}
                  </td>
                  <td className="px-5 py-2.5 tabular-nums text-white/75">{formatUsdPrecise(row.portfolioValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
