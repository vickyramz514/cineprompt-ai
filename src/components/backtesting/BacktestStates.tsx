"use client";

export function BacktestEmptyState() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-8 text-center sm:min-h-[420px]">
      <div className="relative mb-6 h-28 w-40">
        <svg viewBox="0 0 160 112" className="h-full w-full" aria-hidden>
          <defs>
            <linearGradient id="emptyEq" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          <rect x="8" y="8" width="144" height="96" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
          <path
            d="M20 88 C40 84, 48 70, 64 62 S96 40, 112 36 S140 28, 148 22"
            fill="none"
            stroke="url(#emptyEq)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="148" cy="22" r="4" fill="#34d399" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-white">Run your first ETF backtest</h3>
      <p className="mt-2 max-w-md text-sm text-white/50">
        Pick a symbol, set your investment and date range, then run a simulation to see CAGR, drawdowns,
        risk ratios, and an interactive equity curve.
      </p>
    </div>
  );
}

export function BacktestLoadingState({ progress }: { progress: number }) {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-white/70">Running backtest…</p>
          <p className="text-xs tabular-nums text-indigo-300">{Math.min(99, Math.round(progress))}%</p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-[width] duration-300"
            style={{ width: `${Math.min(99, progress)}%` }}
          />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[5.5rem] animate-pulse rounded-xl border border-white/10 bg-white/[0.04]" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/[0.04] sm:h-80" />
    </div>
  );
}
