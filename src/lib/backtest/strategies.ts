/**
 * Backtest strategy registry — all strategies are live in the API.
 */

export type BacktestStrategyId =
  | "buy_and_hold"
  | "dca"
  | "sma_crossover"
  | "ema_crossover"
  | "rsi"
  | "macd"
  | "custom";

export type BacktestStrategyDef = {
  id: BacktestStrategyId;
  label: string;
  description: string;
  available: boolean;
  /** Optional tunable fields shown in the UI */
  params?: Array<{
    key: string;
    label: string;
    defaultValue: number;
    min?: number;
    max?: number;
  }>;
};

export const BACKTEST_STRATEGIES: BacktestStrategyDef[] = [
  {
    id: "buy_and_hold",
    label: "Buy & Hold",
    description: "Invest once at the start and hold through the period.",
    available: true,
  },
  {
    id: "dca",
    label: "Dollar Cost Averaging",
    description: "Split total capital into equal monthly purchases over the period.",
    available: true,
  },
  {
    id: "sma_crossover",
    label: "SMA Crossover",
    description: "Go long when the fast SMA is above the slow SMA; otherwise cash.",
    available: true,
    params: [
      { key: "fastPeriod", label: "Fast SMA", defaultValue: 20, min: 2, max: 100 },
      { key: "slowPeriod", label: "Slow SMA", defaultValue: 50, min: 5, max: 300 },
    ],
  },
  {
    id: "ema_crossover",
    label: "EMA Crossover",
    description: "Go long when the fast EMA is above the slow EMA; otherwise cash.",
    available: true,
    params: [
      { key: "fastPeriod", label: "Fast EMA", defaultValue: 12, min: 2, max: 100 },
      { key: "slowPeriod", label: "Slow EMA", defaultValue: 26, min: 5, max: 300 },
    ],
  },
  {
    id: "rsi",
    label: "RSI Strategy",
    description: "Buy when RSI recovers from oversold; sell when it cools from overbought.",
    available: true,
    params: [
      { key: "rsiPeriod", label: "RSI period", defaultValue: 14, min: 2, max: 50 },
      { key: "rsiBuyBelow", label: "Buy below", defaultValue: 30, min: 5, max: 50 },
      { key: "rsiSellAbove", label: "Sell above", defaultValue: 70, min: 50, max: 95 },
    ],
  },
  {
    id: "macd",
    label: "MACD Strategy",
    description: "Go long when the MACD line is above its signal line.",
    available: true,
    params: [
      { key: "macdFast", label: "MACD fast", defaultValue: 12, min: 2, max: 50 },
      { key: "macdSlow", label: "MACD slow", defaultValue: 26, min: 5, max: 100 },
      { key: "macdSignal", label: "Signal", defaultValue: 9, min: 2, max: 50 },
    ],
  },
  {
    id: "custom",
    label: "Custom SMA",
    description: "Your own SMA crossover periods (defaults 10 / 30).",
    available: true,
    params: [
      { key: "fastPeriod", label: "Fast SMA", defaultValue: 10, min: 2, max: 100 },
      { key: "slowPeriod", label: "Slow SMA", defaultValue: 30, min: 5, max: 300 },
    ],
  },
];

export function defaultParamsFor(strategyId: BacktestStrategyId): Record<string, number> {
  const def = BACKTEST_STRATEGIES.find((s) => s.id === strategyId);
  const out: Record<string, number> = {};
  for (const p of def?.params || []) out[p.key] = p.defaultValue;
  return out;
}
