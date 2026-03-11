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
};

export { getDataCaptainErrorMessage };
