/**
 * DataCaptain API endpoints - Types and fetch helpers
 */

import { datacaptainFetch, datacaptainPost, getDataCaptainErrorMessage } from "./client";

export type DeveloperUsage = {
  plan: string;
  requestsToday: number;
  requestsRemaining: number;
  dailyLimit: number;
  requestsThisMonth?: number;
  monthlyLimit?: number;
  series?: {
    daily: Array<{ date: string; count: number }>;
    weekly: Array<{ date: string; label?: string; count: number }>;
    monthly: Array<{ date: string; label?: string; count: number }>;
  };
  endpoints?: Array<{
    endpoint: string;
    count: number;
    avgMs: number | null;
    errors: number;
    success: number;
  }>;
  analytics?: {
    avgLatencyMs: number | null;
    successRate: number | null;
    errorRate: number | null;
    totalRequests30d: number;
    errors7d: number;
  };
  recentActivity?: Array<{
    endpoint: string;
    method: string;
    statusCode: number;
    durationMs: number;
    at: string;
  }>;
  health?: {
    uptimePct: number;
    avgLatencyMs: number;
    errorCount: number;
    database: string;
    cache: string;
  };
  asOf?: string;
};

export type MarketStatus = {
  market: string;
  status: "OPEN" | "CLOSED";
  session?: "regular" | "early_close" | "closed" | "holiday";
  holiday?: string | null;
  earlyClose?: string | null;
  timezone?: string;
  asOf?: string;
  nextOpen: string;
  nextClose: string;
};

export type BatchPrice = { symbol: string; price: number };

export type EtfItem = {
  symbol: string;
  name: string;
  price: number | null;
  exchange?: string | null;
  returnYtd?: number | null;
  return1y?: number | null;
  return3y?: number | null;
  return5y?: number | null;
  dividendYieldTtm?: number | null;
  volatility1y?: number | null;
  avgVolume30d?: number | null;
  assetClass?: string | null;
  aumBillions?: number | null;
  expenseRatio?: number | null;
  sharpeRatio?: number | null;
  cagr?: number | null;
  issuer?: string | null;
  category?: string | null;
  badges?: string[];
  leveraged?: boolean;
  inverse?: boolean;
  esg?: boolean;
  country?: string | null;
  currency?: string | null;
  change1d?: number | null;
  asOf?: string | null;
};

export type EtfListStats = {
  totalEtfs: number;
  withHistory: number;
  categories: number;
  avgVolume: number | null;
  asOf: string | null;
};

export type EtfListResponse = {
  data: EtfItem[];
  total: number;
  limit: number;
  offset: number;
  hasPrice?: boolean;
  stats?: EtfListStats;
};

export type EtfDetail = EtfItem & {
  type?: string;
  date?: string | null;
  open?: number | null;
  high?: number | null;
  low?: number | null;
  volume?: number | null;
  high52w?: number | null;
  low52w?: number | null;
  beta?: number | null;
  maxDrawdown?: number | null;
  performance?: Record<string, number | null>;
  history?: Array<{
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
  sparkline?: number[];
  dividends?: Array<{ exDate: string; amount: number | null }>;
  similar?: EtfItem[];
  aiSummary?: string;
  holdingsNote?: string;
  risk?: {
    volatility1y: number | null;
    sharpeRatio: number | null;
    maxDrawdown: number | null;
    beta: number | null;
    rating: string;
  };
};

export type EtfHeatmapCell = {
  symbol: string;
  name: string;
  returnPct: number | null;
  latestPrice: number | null;
  dividendYieldTtm: number | null;
  assetClass: string | null;
  returnYtd?: number | null;
  return1y?: number | null;
  return3y?: number | null;
  return5y?: number | null;
  return1d?: number | null;
  return1w?: number | null;
  return1m?: number | null;
  return3m?: number | null;
  return6m?: number | null;
  return10y?: number | null;
  returnMax?: number | null;
  volatility1y?: number | null;
  avgVolume30d?: number | null;
  aumBillions?: number | null;
  expenseRatio?: number | null;
  sizeScore?: number;
  sparkline?: number[];
};

export type EtfHeatmapResponse = {
  period: string;
  asOf: string;
  basket: { id: string; label: string; symbols: string[] } | null;
  cells: EtfHeatmapCell[];
};

export type EtfHeatmapBasket = {
  id: string;
  label: string;
  symbols: string[];
};

export type EtfScreenerRow = {
  symbol: string;
  name: string;
  latestPrice: number | null;
  asOf: string | null;
  returnYtd: number | null;
  return1y: number | null;
  return3y: number | null;
  return5y: number | null;
  returnPct?: number | null;
  return1d?: number | null;
  return1m?: number | null;
  cagr?: number | null;
  dividendYieldTtm: number | null;
  volatility1y: number | null;
  avgVolume30d: number | null;
  assetClass: string | null;
  aumBillions?: number | null;
  expenseRatio?: number | null;
  sharpeRatio?: number | null;
  issuer?: string | null;
  category?: string | null;
  badges?: string[];
  leveraged?: boolean;
  inverse?: boolean;
  esg?: boolean;
  country?: string | null;
  currency?: string | null;
  sparkline?: number[];
};

export type EtfScreenerResponse = {
  period: string;
  data: EtfScreenerRow[];
  total: number;
  limit: number;
  offset: number;
  freeTierLimited?: boolean;
};

export type EtfRankingsRow = EtfScreenerRow & {
  rank: number;
  previousRank?: number | null;
  rankDelta?: number | null;
  score?: number | null;
  maxDrawdown?: number | null;
  displayIndex?: number;
};

export type EtfRankingsResponse = {
  category: string;
  metric?: string;
  period: string;
  basket?: string | null;
  data: EtfRankingsRow[];
  total: number;
  limit: number;
  offset: number;
  freeTierLimited?: boolean;
};

export type BacktestResult = {
  strategy: string;
  symbol: string;
  name?: string;
  startDate: string;
  endDate: string;
  initialInvestment: number;
  finalValue: number;
  totalProfit?: number;
  totalReturn: number;
  /** CAGR (same as annualReturn from API) */
  annualReturn: number;
  cagr?: number;
  maxDrawdown: number;
  volatility?: number;
  sharpe?: number | null;
  sortino?: number | null;
  dividendYield: number | null;
  riskScore: number;
  tradingDays?: number;
  years?: number;
  trades?: number;
  strategyParams?: Record<string, number | string>;
  reinvestDividends?: boolean;
  adjustForInflation?: boolean;
  inflationAdjustedFinalValue?: number | null;
  inflationAdjustedReturn?: number | null;
  inflationAdjustedCagr?: number | null;
  equityCurve: { date: string; value: number }[];
};

export type CompareResult = {
  investment: number;
  startDate: string;
  endDate: string;
  winner: string | null;
  ranked: string[];
  results: Array<
    | (Pick<
        BacktestResult,
        | "symbol"
        | "name"
        | "totalReturn"
        | "annualReturn"
        | "cagr"
        | "maxDrawdown"
        | "finalValue"
        | "totalProfit"
        | "dividendYield"
        | "riskScore"
        | "sharpe"
        | "sortino"
        | "volatility"
        | "equityCurve"
      >)
    | { symbol: string; error: string }
  >;
};

export type RebalanceAllocation = {
  symbol: string;
  name: string;
  price: number;
  shares: number;
  currentValue: number;
  currentWeight: number;
  targetWeight: number;
  drift: number;
  tradeValue: number;
  tradeShares: number;
  action: "BUY" | "SELL" | "HOLD";
  reason: string;
};

export type RebalanceTrade = {
  symbol: string;
  name: string;
  action: "BUY" | "SELL";
  shares: number;
  value: number;
  reason: string;
};

export type RebalanceResult = {
  totalValue: number;
  driftThreshold: number;
  mode: "rebalance" | "contributions_only";
  needsRebalance: boolean;
  maxDrift: { symbol: string; drift: number } | null;
  allocation: RebalanceAllocation[];
  trades: RebalanceTrade[];
};

export type OptionLeg = {
  strike: number;
  bid: number | null;
  ask: number | null;
  volume: number | null;
  openInterest: number | null;
};

export type OptionsChain = {
  symbol: string;
  expirationDate: string | null;
  calls: OptionLeg[];
  puts: OptionLeg[];
};

export type InsiderTrade = {
  name: string;
  title: string | null;
  transactionType: string;
  shares: number;
  price: number | null;
  date: string;
};

export type StockSentiment = {
  symbol: string;
  sentimentScore: number;
  sentiment: string;
  mentions: number;
};

export type EconomicIndicators = {
  inflation: number;
  interestRate: number;
  gdpGrowth: number;
  unemploymentRate: number;
};

export type DarkPoolTrade = {
  symbol: string;
  price: number;
  volume: number;
  tradeTime: string;
};

export type StockNewsArticle = {
  id: string;
  symbol: string;
  headline: string;
  summary: string | null;
  source: string | null;
  url: string | null;
  publishedAt: string;
};

export type StockSnapshot = {
  symbol: string;
  asOf: string;
  quote: {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    timestamp: string;
  };
  profile: {
    symbol: string;
    companyName: string;
    sector: string;
    industry: string;
    marketCap: number | null;
    exchange: string;
  };
  sentiment: StockSentiment;
  indicators: { date: string; rsi: number | null; sma20: number | null; ema20: number | null } | null;
  aiScore: { score: number; summary: string } | null;
  nextEarnings: {
    reportDate: string;
    eps: number | null;
    consensusEps: number | null;
    revenue: number | null;
  } | null;
  recentEarnings: Array<{
    reportDate: string;
    eps: number | null;
    revenue: number | null;
    consensusEps: number | null;
  }>;
  news: StockNewsArticle[];
};

export type EarningsCalendarEvent = {
  symbol: string;
  companyName: string;
  reportDate: string;
  timing: "upcoming" | "reported";
  eps: number | null;
  consensusEps: number | null;
  revenue: number | null;
  surprise: number | null;
};

export type EarningsCalendar = {
  from: string;
  to: string;
  count: number;
  events: EarningsCalendarEvent[];
};

export const datacaptainEndpoints = {
  developerUsage: (key: string | null) =>
    datacaptainFetch<DeveloperUsage>("/developer/usage", key),

  marketStatus: (key: string | null) =>
    datacaptainFetch<MarketStatus>("/market/status", key),

  batchPrices: (key: string | null, symbols: string) =>
    datacaptainFetch<BatchPrice[]>("/stocks/prices", key, { symbols }),

  etfList: (
    key: string | null,
    params?: Record<string, string | undefined>
  ) => {
    const cleaned: Record<string, string> = {};
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v != null && v !== "") cleaned[k] = v;
      }
    }
    return datacaptainFetch<EtfListResponse>("/etf/list", key, cleaned);
  },

  etfBySymbol: (key: string | null, symbol: string) =>
    datacaptainFetch<EtfDetail>(`/etf/${encodeURIComponent(symbol)}`, key),

  stockHistory: (
    key: string | null,
    symbol: string,
    params?: { startDate?: string; endDate?: string; interval?: string }
  ) =>
    datacaptainFetch<
      Array<{ date: string; open: number; high: number; low: number; close: number; volume: number }>
    >(`/stocks/${encodeURIComponent(symbol)}/history`, key, params as Record<string, string>),

  stockDividends: (key: string | null, symbol: string) =>
    datacaptainFetch<Array<{ exDate?: string; ex_date?: string; amount: number }>>(
      `/stocks/${encodeURIComponent(symbol)}/dividends`,
      key
    ),

  etfHeatmap: (
    key: string | null,
    params?: { basket?: string; symbols?: string; period?: string }
  ) => datacaptainFetch<EtfHeatmapResponse>("/etf/heatmap", key, params as Record<string, string>),

  etfHeatmapBaskets: (key: string | null) =>
    datacaptainFetch<{ baskets: EtfHeatmapBasket[] }>("/etf/heatmap/baskets", key),

  etfScreener: (
    key: string | null,
    params?: Record<string, string | undefined>
  ) => {
    const cleaned: Record<string, string> = {};
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v != null && v !== "") cleaned[k] = v;
      }
    }
    return datacaptainFetch<EtfScreenerResponse>("/etf/screener", key, cleaned);
  },

  etfRankings: (
    key: string | null,
    params?: Record<string, string | undefined>
  ) => {
    const cleaned: Record<string, string> = {};
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v != null && v !== "") cleaned[k] = v;
      }
    }
    return datacaptainFetch<EtfRankingsResponse>("/etf/rankings", key, cleaned);
  },

  optionsChain: (key: string | null, symbol: string, params?: { expirationDate?: string; limit?: string }) =>
    datacaptainFetch<OptionsChain>(`/options/${encodeURIComponent(symbol)}`, key, params as Record<string, string>),

  insiders: (key: string | null, symbol: string, params?: { limit?: string }) =>
    datacaptainFetch<InsiderTrade[]>(`/insiders/${encodeURIComponent(symbol)}`, key, params as Record<string, string>),

  sentiment: (key: string | null, symbol: string) =>
    datacaptainFetch<StockSentiment>(`/sentiment/${encodeURIComponent(symbol)}`, key),

  economyIndicators: (key: string | null) =>
    datacaptainFetch<EconomicIndicators>("/economy/indicators", key),

  darkpool: (key: string | null, symbol: string, params?: { limit?: string }) =>
    datacaptainFetch<DarkPoolTrade[]>(`/darkpool/${encodeURIComponent(symbol)}`, key, params as Record<string, string>),

  stockSnapshot: (key: string | null, symbol: string) =>
    datacaptainFetch<StockSnapshot>(`/stocks/${encodeURIComponent(symbol)}/snapshot`, key),

  stockNews: (key: string | null, symbol: string, params?: { limit?: string }) =>
    datacaptainFetch<{ symbol: string; count: number; articles: StockNewsArticle[] }>(
      `/stocks/${encodeURIComponent(symbol)}/news`,
      key,
      params as Record<string, string>
    ),

  earningsCalendar: (
    key: string | null,
    params?: { from?: string; to?: string; symbol?: string; limit?: string }
  ) => datacaptainFetch<EarningsCalendar>("/market/earnings-calendar", key, params as Record<string, string>),

  backtestBuyAndHold: (
    key: string | null,
    body: {
      symbol: string;
      investment?: number;
      startDate: string;
      endDate: string;
      strategy?: string;
      reinvestDividends?: boolean;
      adjustForInflation?: boolean;
      fastPeriod?: number;
      slowPeriod?: number;
      rsiPeriod?: number;
      rsiBuyBelow?: number;
      rsiSellAbove?: number;
      macdFast?: number;
      macdSlow?: number;
      macdSignal?: number;
    }
  ) => datacaptainPost<BacktestResult>("/backtest/buy-and-hold", key, body),

  backtestCompare: (
    key: string | null,
    body: {
      symbols: string[];
      investment?: number;
      startDate: string;
      endDate: string;
      strategy?: string;
      reinvestDividends?: boolean;
      adjustForInflation?: boolean;
      fastPeriod?: number;
      slowPeriod?: number;
      rsiPeriod?: number;
      rsiBuyBelow?: number;
      rsiSellAbove?: number;
      macdFast?: number;
      macdSlow?: number;
      macdSignal?: number;
    }
  ) => datacaptainPost<CompareResult>("/backtest/compare", key, body),

  portfolioRebalance: (
    key: string | null,
    body: {
      holdings: Array<{ symbol: string; shares?: number; value?: number }>;
      target: Array<{ symbol: string; weight: number }>;
      driftThreshold?: number;
      mode?: "rebalance" | "contributions_only";
    }
  ) => datacaptainPost<RebalanceResult>("/portfolio/rebalance", key, body),
};

export { getDataCaptainErrorMessage };
