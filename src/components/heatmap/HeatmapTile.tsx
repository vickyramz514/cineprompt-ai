"use client";

import Link from "next/link";
import { useState, type MouseEvent } from "react";
import type { EtfHeatmapCell } from "@/services/datacaptain/endpoints";
import { formatCompact, formatPct, returnToColor, tileGridClass } from "@/lib/heatmap/colors";

function Sparkline({ data, large }: { data?: number[]; large?: boolean }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = large ? 96 : 48;
  const h = large ? 28 : 18;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  const up = data[data.length - 1] >= data[0];
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={`max-w-full shrink opacity-90 ${large ? "h-7 w-24" : "h-[18px] w-12"}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <polyline
        fill="none"
        stroke={up ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.55)"}
        strokeWidth="1.5"
        points={pts}
      />
    </svg>
  );
}

function TipRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-[11px]">
      <span className="text-white/45">{label}</span>
      <span className="shrink-0 tabular-nums text-white/90">{value}</span>
    </div>
  );
}

export default function HeatmapTile({
  cell,
  span,
  onSelect,
  onKeyActivate,
}: {
  cell: EtfHeatmapCell;
  span: 1 | 2 | 3;
  onSelect: (cell: EtfHeatmapCell) => void;
  onKeyActivate: (cell: EtfHeatmapCell) => void;
}) {
  const [copied, setCopied] = useState(false);
  const bg = returnToColor(cell.returnPct);
  const large = span >= 3;

  const copySymbol = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard?.writeText(cell.symbol);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div
      className={`group relative min-h-[92px] min-w-0 ${tileGridClass(span)} ${
        large ? "min-h-[128px]" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => onSelect(cell)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onKeyActivate(cell);
          }
        }}
        aria-label={`${cell.symbol} ${cell.name}, return ${formatPct(cell.returnPct)}. Open details.`}
        className="flex h-full min-h-[inherit] w-full min-w-0 flex-col overflow-hidden rounded-xl border border-white/10 p-2.5 text-left shadow-[0_8px_30px_-18px_rgba(0,0,0,0.65)] transition duration-200 ease-out hover:border-white/35 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 sm:p-3"
        style={{ backgroundColor: bg }}
      >
        <div className="flex min-w-0 items-start justify-between gap-1.5">
          <span
            className={`min-w-0 truncate font-mono font-bold text-white drop-shadow ${
              large ? "text-lg" : "text-sm sm:text-base"
            }`}
          >
            {cell.symbol}
          </span>
          <span
            className={`shrink-0 whitespace-nowrap font-semibold tabular-nums text-white drop-shadow ${
              large ? "text-base" : "text-xs sm:text-sm"
            }`}
          >
            {formatPct(cell.returnPct)}
          </span>
        </div>

        <p
          className={`mt-0.5 min-w-0 truncate text-white/85 ${
            large ? "text-xs" : "text-[10px] leading-tight sm:text-[11px]"
          }`}
          title={cell.name}
        >
          {cell.name}
        </p>

        <div className="mt-auto flex min-w-0 items-end justify-between gap-1 pt-2">
          <Sparkline data={cell.sparkline} large={large} />
          {cell.latestPrice != null && (
            <span className="shrink-0 whitespace-nowrap text-[10px] tabular-nums text-white/80">
              ${cell.latestPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Quick actions — only on larger tiles to avoid crushing small cells */}
        {large && (
          <div
            className="mt-2 hidden min-w-0 gap-0.5 rounded-md bg-black/40 p-0.5 group-hover:flex group-focus-within:flex"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              href="/dashboard/backtesting"
              className="min-w-0 flex-1 truncate rounded px-1 py-0.5 text-center text-[9px] font-medium text-emerald-200 hover:bg-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              Backtest
            </Link>
            <Link
              href={`/dashboard/etf/${cell.symbol}`}
              className="min-w-0 flex-1 truncate rounded px-1 py-0.5 text-center text-[9px] font-medium text-violet-200 hover:bg-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              Explorer
            </Link>
            <button
              type="button"
              onClick={copySymbol}
              className="shrink-0 rounded px-1 py-0.5 text-[9px] font-medium text-white/80 hover:bg-white/10"
            >
              {copied ? "✓" : "Copy"}
            </button>
          </div>
        )}
      </button>

      {/* Tooltip outside clipped button */}
      <div
        role="tooltip"
        className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-50 hidden w-56 max-w-[min(14rem,90vw)] -translate-x-1/2 rounded-xl border border-white/15 bg-[#0b0b14]/98 p-3 opacity-0 shadow-xl backdrop-blur transition duration-150 group-hover:block group-focus-within:block group-hover:opacity-100 group-focus-within:opacity-100"
      >
        <p className="line-clamp-2 text-xs font-semibold text-white">{cell.name}</p>
        <p className="mt-0.5 font-mono text-[11px] text-violet-300">{cell.symbol}</p>
        <div className="mt-2 space-y-1 border-t border-white/10 pt-2">
          <TipRow
            label="Price"
            value={cell.latestPrice != null ? `$${cell.latestPrice.toFixed(2)}` : "—"}
          />
          <TipRow label="1 Day" value={formatPct(cell.return1d)} />
          <TipRow label="1 Month" value={formatPct(cell.return1m)} />
          <TipRow label="YTD" value={formatPct(cell.returnYtd)} />
          <TipRow label="1 Year" value={formatPct(cell.return1y)} />
          <TipRow
            label="Expense"
            value={cell.expenseRatio != null ? `${cell.expenseRatio}%` : "—"}
          />
          <TipRow
            label="Div Yield"
            value={cell.dividendYieldTtm != null ? `${cell.dividendYieldTtm.toFixed(2)}%` : "—"}
          />
          <TipRow label="AUM" value={cell.aumBillions != null ? `$${cell.aumBillions}B` : "—"} />
          <TipRow label="Avg Volume" value={formatCompact(cell.avgVolume30d)} />
        </div>
      </div>
    </div>
  );
}
