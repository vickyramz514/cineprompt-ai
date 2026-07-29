type LockedMetricItem = {
  label: string;
  value: string;
};

type LockedMetricGridProps = {
  items: LockedMetricItem[];
  className?: string;
};

/**
 * Placeholder metric cards for paywalled previews.
 * Values are intentionally sample/preview-looking; parent blur makes them non-legible.
 */
export default function LockedMetricGrid({ items, className = "" }: LockedMetricGridProps) {
  return (
    <div
      className={`grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 ${className}`}
      aria-hidden
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 sm:px-4 sm:py-3.5"
        >
          <p className="text-[10px] font-medium uppercase tracking-wider text-white/35">
            {item.label}
          </p>
          <p className="mt-1.5 font-mono text-lg font-semibold tabular-nums tracking-tight text-white/80 sm:text-xl">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

/** Sensible defaults for backtesting / portfolio locked previews */
export const PREVIEW_METRIC_ITEMS: LockedMetricItem[] = [
  { label: "Total Return", value: "+142.8%" },
  { label: "CAGR", value: "+12.4%" },
  { label: "Annual Return", value: "+11.9%" },
  { label: "Sharpe Ratio", value: "1.42" },
  { label: "Sortino Ratio", value: "1.88" },
  { label: "Maximum Drawdown", value: "−18.7%" },
  { label: "Volatility", value: "14.2%" },
  { label: "Portfolio Value", value: "$24,850" },
  { label: "Trades", value: "47" },
  { label: "Win Rate", value: "62%" },
  { label: "Profit", value: "+$14,850" },
  { label: "Beta", value: "0.94" },
];

export const PORTFOLIO_PREVIEW_METRICS: LockedMetricItem[] = [
  { label: "Sharpe Ratio", value: "1.35" },
  { label: "Sortino Ratio", value: "1.72" },
  { label: "CAGR", value: "+9.8%" },
  { label: "Max Drawdown", value: "−12.4%" },
  { label: "Volatility", value: "11.2%" },
  { label: "Correlation", value: "0.68" },
  { label: "Efficient Frontier", value: "Optimized" },
  { label: "Monte Carlo P50", value: "$41,200" },
];
