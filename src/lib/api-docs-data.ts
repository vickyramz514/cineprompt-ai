/**
 * Full API documentation data - DataCaptain ETF Data API
 * Used by /docs and /dashboard/api-docs
 */

import { getPublicApiOrigin } from "@/lib/public-env";

export const API_BASE_URL = getPublicApiOrigin();

export type EndpointParam = {
  name: string;
  type: string;
  required: boolean;
  desc: string;
  in?: "path" | "query";
};

export type ApiEndpoint = {
  method: string;
  path: string;
  query?: string;
  description: string;
  params: EndpointParam[];
  responseExample?: string;
  cache?: string;
};

export const API_DOC_SECTIONS: Record<string, ApiEndpoint[]> = {
  etf: [
    {
      method: "GET",
      path: "/api/etf/list",
      query: "limit=100&offset=0&search=SPY",
      description: "Paginated US ETF universe from database. Returns { data, total, limit, offset }.",
      params: [
        { name: "limit", type: "number", required: false, desc: "Page size (max 500, default 100)", in: "query" },
        { name: "offset", type: "number", required: false, desc: "Skip N rows", in: "query" },
        { name: "search", type: "string", required: false, desc: "Filter by symbol or name", in: "query" },
      ],
      cache: "60s",
    },
    {
      method: "GET",
      path: "/api/etf/:symbol",
      query: "",
      description: "Single ETF details — symbol, name, latest price, exchange.",
      params: [{ name: "symbol", type: "string", required: true, desc: "ETF ticker (e.g. SPY)", in: "path" }],
      cache: "60s",
    },
    {
      method: "GET",
      path: "/api/stocks/prices",
      query: "?symbols=SPY,QQQ,VOO",
      description: "Batch ETF prices — latest close for up to 50 ETF tickers in one request. Cached 60s.",
      params: [
        { name: "symbols", type: "string", required: true, desc: "Comma-separated ETF tickers (e.g. SPY,QQQ,VOO)", in: "query" },
      ],
      responseExample: '[{"symbol":"SPY","price":512.34},{"symbol":"QQQ","price":445.12}]',
      cache: "60s",
    },
  ],

  market: [
    {
      method: "GET",
      path: "/api/market/status",
      query: "",
      description: "US market session status — open/closed and next session times.",
      params: [],
      cache: "60s",
    },
  ],

  platform: [
    {
      method: "POST",
      path: "/api/backtest/buy-and-hold",
      query: "",
      description: "ETF buy-and-hold backtest — total return, CAGR, drawdown, dividend yield, risk score, equity curve.",
      params: [
        { name: "symbol", type: "string", required: true, desc: "ETF ticker (e.g. SPY)" },
        { name: "investment", type: "number", required: false, desc: "Initial capital USD (default 10000)" },
        { name: "startDate", type: "string", required: true, desc: "YYYY-MM-DD" },
        { name: "endDate", type: "string", required: true, desc: "YYYY-MM-DD" },
        { name: "strategy", type: "string", required: false, desc: "buy_and_hold (only option today)" },
      ],
    },
    {
      method: "POST",
      path: "/api/backtest/compare",
      query: "",
      description: "Compare multiple ETFs — e.g. VOO vs SPY vs QQQ. Returns ranked results.",
      params: [
        { name: "symbols", type: "string[]", required: true, desc: "Array or comma-separated ETF tickers" },
        { name: "investment", type: "number", required: false, desc: "Per-ETF investment USD" },
        { name: "startDate", type: "string", required: true, desc: "YYYY-MM-DD" },
        { name: "endDate", type: "string", required: true, desc: "YYYY-MM-DD" },
      ],
    },
  ],

  developer: [
    {
      method: "GET",
      path: "/api/developer/usage",
      query: "",
      description: "Usage stats — plan, requests today, remaining, daily limit.",
      params: [],
      responseExample: '{"plan":"FREE","requestsToday":12,"requestsRemaining":38,"dailyLimit":50}',
    },
  ],
};

export const SECTION_LABELS: Record<string, string> = {
  etf: "ETF Endpoints",
  market: "Market",
  platform: "Backtesting & Portfolio",
  developer: "Developer",
};

export const WEBSOCKET_DOC = {
  path: "/ws",
  description: "Real-time ETF price streaming (when enabled). Subscribe to ETF symbols for periodic updates.",
  messageFormat: {
    subscribe: '{"action":"subscribe","symbols":["SPY","QQQ"]}',
    unsubscribe: '{"action":"unsubscribe","symbols":["SPY"]}',
    response: '{"symbol":"SPY","price":512.34,"timestamp":"2026-06-10T16:00:00Z"}',
  },
};
