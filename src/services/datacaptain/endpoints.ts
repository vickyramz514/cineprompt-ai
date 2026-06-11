/**
 * DataCaptain API endpoints - Types and fetch helpers
 */

import { datacaptainFetch, getDataCaptainErrorMessage } from "./client";

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

export type EtfItem = { symbol: string; name: string; price: number | null };

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

  etfList: (key: string | null) =>
    datacaptainFetch<EtfItem[]>("/etf/list", key),

  etfBySymbol: (key: string | null, symbol: string) =>
    datacaptainFetch<EtfItem & { type?: string; date?: string }>(
      `/etf/${encodeURIComponent(symbol)}`,
      key
    ),

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
};

export { getDataCaptainErrorMessage };
