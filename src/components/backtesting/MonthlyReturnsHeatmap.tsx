"use client";

import { useMemo, useState } from "react";
import type { MonthCell } from "@/lib/backtest/metrics";
import { formatPct, formatUsdPrecise } from "@/lib/backtest/metrics";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function cellColor(pct: number | null): string {
  if (pct == null) return "bg-white/[0.03] text-white/25";
  if (pct >= 8) return "bg-emerald-500/50 text-emerald-50";
  if (pct >= 4) return "bg-emerald-500/35 text-emerald-100";
  if (pct >= 1) return "bg-emerald-500/20 text-emerald-200";
  if (pct > -1) return "bg-white/5 text-white/55";
  if (pct > -4) return "bg-red-500/25 text-red-200";
  if (pct > -8) return "bg-red-500/40 text-red-100";
  return "bg-red-500/55 text-red-50";
}

export default function MonthlyReturnsHeatmap({
  cells,
  embedded = false,
}: {
  cells: MonthCell[];
  embedded?: boolean;
}) {
  const [open, setOpen] = useState(true);
  const [hover, setHover] = useState<MonthCell | null>(null);

  const years = useMemo(() => {
    const map = new Map<number, (MonthCell | null)[]>();
    for (const c of cells) {
      if (!map.has(c.year)) map.set(c.year, Array(12).fill(null));
      map.get(c.year)![c.month - 1] = c;
    }
    return [...map.entries()].sort((a, b) => b[0] - a[0]);
  }, [cells]);

  if (!years.length) return null;

  const body = (
    <div className={`${embedded ? "" : "overflow-x-auto border-t border-white/5 px-3 pb-4 sm:px-5"}`}>
      <div className="relative overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-1 text-center text-[10px] sm:text-xs">
          <thead>
            <tr>
              <th className="px-1 py-2 text-left font-medium text-white/35">Year</th>
              {MONTHS.map((m) => (
                <th key={m} className="px-0.5 py-2 font-medium text-white/35">
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {years.map(([year, months]) => (
              <tr key={year}>
                <td className="px-1 py-0.5 text-left font-mono text-white/70">{year}</td>
                {months.map((cell, i) => (
                  <td key={i} className="p-0.5">
                    <div
                      className={`cursor-default rounded-md px-0.5 py-2 tabular-nums transition hover:ring-1 hover:ring-white/30 ${cellColor(cell?.returnPct ?? null)}`}
                      onMouseEnter={() => setHover(cell)}
                      onMouseLeave={() => setHover(null)}
                    >
                      {cell?.returnPct == null
                        ? "·"
                        : `${cell.returnPct > 0 ? "+" : ""}${cell.returnPct.toFixed(1)}`}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {hover && (
          <div className="mt-3 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white/70">
            <span className="font-medium text-white">
              {hover.year}-{String(hover.month).padStart(2, "0")}
            </span>
            {" · Return "}
            <span className="tabular-nums text-white">
              {hover.returnPct != null ? formatPct(hover.returnPct) : "—"}
            </span>
            {" · Profit "}
            <span className="tabular-nums text-white">
              {hover.profit != null ? formatUsdPrecise(hover.profit) : "—"}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (embedded) {
    return (
      <div>
        <p className="mb-3 text-sm text-white/55">
          Calendar heatmap — hover a cell for month, return %, and profit.
        </p>
        {body}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
            Monthly returns
          </p>
          <p className="mt-0.5 text-sm text-white/55">Calendar heatmap (green = up, red = down)</p>
        </div>
        <span className="text-white/40">{open ? "▾" : "▸"}</span>
      </button>
      {open && body}
    </div>
  );
}
