/**
 * DataCaptain API endpoints - Types and fetch helpers
 */

import { datacaptainFetch, datacaptainPost, getDataCaptainErrorMessage } from "./client";

export type DeveloperUsage = {
  plan: string;
  requestsToday: number;
  requestsRemaining: number;
  dailyLimit: number;
};

export type MarketStatus = {
  market: string;
  status: "OPEN" | "CLOSED";
  nextOpen: string;
  nextClose: string;
};

export type BatchPrice = { symbol: string; price: number };

export type EtfItem = { symbol: string; name: string; price: number | null; exchange?: string | null };

export type EtfListResponse = {
  data: EtfItem[];
  total: number;
  limit: number;
  offset: number;
};

export type EtfHeatmapCell = {
  symbol: string;
  name: string;
  returnPct: number | null;
  latestPrice: number | null;
  dividendYieldTtm: number | null;
  assetClass: string | null;
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
  dividendYieldTtm: number | null;
  volatility1y: number | null;
  avgVolume30d: number | null;
  assetClass: string | null;
};

export type EtfScreenerResponse = {
  period: string;
  data: EtfScreenerRow[];
  total: number;
  limit: number;
  offset: number;
  freeTierLimited?: boolean;
};

export type EtfRankingsRow = EtfScreenerRow & { rank: number };

export type EtfRankingsResponse = {
  category: string;
  period: string;
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
  totalReturn: number;
  annualReturn: number;
  maxDrawdown: number;
  dividendYield: number | null;
  riskScore: number;
  equityCurve: { date: string; value: number }[];
};

export type CompareResult = {
  investment: number;
  startDate: string;
  endDate: string;
  winner: string | null;
  ranked: string[];
  results: Array<
    | (Pick<BacktestResult, "symbol" | "name" | "totalReturn" | "annualReturn" | "maxDrawdown" | "finalValue" | "dividendYield" | "riskScore">)
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
    params?: { limit?: string; offset?: string; search?: string }
  ) => datacaptainFetch<EtfListResponse>("/etf/list", key, params as Record<string, string>),

  etfBySymbol: (key: string | null, symbol: string) =>
    datacaptainFetch<EtfItem & { type?: string; date?: string }>(
      `/etf/${encodeURIComponent(symbol)}`,
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
    params?: {
      returnMin?: string;
      dividendYieldMin?: string;
      period?: string;
      assetClass?: string;
      sort?: string;
      limit?: string;
      offset?: string;
    }
  ) => datacaptainFetch<EtfScreenerResponse>("/etf/screener", key, params as Record<string, string>),

  etfRankings: (
    key: string | null,
    params?: {
      category?: string;
      period?: string;
      assetClass?: string;
      limit?: string;
      offset?: string;
    }
  ) => datacaptainFetch<EtfRankingsResponse>("/etf/rankings", key, params as Record<string, string>),

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
    }
  ) => datacaptainPost<BacktestResult>("/backtest/buy-and-hold", key, body),

  backtestCompare: (
    key: string | null,
    body: {
      symbols: string[];
      investment?: number;
      startDate: string;
      endDate: string;
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
