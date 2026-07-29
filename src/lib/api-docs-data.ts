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
  in?: "path" | "query" | "body";
};

export type ApiEndpoint = {
  method: string;
  path: string;
  query?: string;
  description: string;
  params: EndpointParam[];
  responseExample?: string;
  cache?: string;
  plan?: "free" | "paid";
};

export const API_DOC_SECTIONS: Record<string, ApiEndpoint[]> = {
  etf: [
    {
      method: "GET",
      path: "/api/etf/list",
      query: "limit=48&category=technology&sort=return&sortDir=desc",
      description:
        "Paginated US ETF universe with filters, sorting, enrichment (issuer, category, expense, AUM), and optional stats. Returns { data, total, limit, offset, stats? }.",
      plan: "free",
      params: [
        { name: "limit", type: "number", required: false, desc: "Page size (max 500, default 100)", in: "query" },
        { name: "offset", type: "number", required: false, desc: "Skip N rows", in: "query" },
        { name: "search", type: "string", required: false, desc: "Filter by symbol or name (alias: q)", in: "query" },
        { name: "hasPrice", type: "string", required: false, desc: "1 = only ETFs with price history", in: "query" },
        { name: "category", type: "string", required: false, desc: "Basket id e.g. technology, dividend, bonds", in: "query" },
        { name: "issuer", type: "string", required: false, desc: "e.g. Vanguard, iShares", in: "query" },
        { name: "assetClass", type: "string", required: false, desc: "Substring match on asset class", in: "query" },
        { name: "leveraged", type: "string", required: false, desc: "1 = leveraged ETFs only", in: "query" },
        { name: "inverse", type: "string", required: false, desc: "1 = inverse ETFs only", in: "query" },
        { name: "dividendMin", type: "number", required: false, desc: "Min dividend yield %", in: "query" },
        { name: "expenseMax", type: "number", required: false, desc: "Max expense ratio %", in: "query" },
        { name: "aumMin", type: "number", required: false, desc: "Min AUM in $B", in: "query" },
        { name: "volumeMin", type: "number", required: false, desc: "Min avg 30d volume", in: "query" },
        {
          name: "sort",
          type: "string",
          required: false,
          desc: "symbol | price | return | volume | yield | expense | aum",
          in: "query",
        },
        { name: "sortDir", type: "string", required: false, desc: "asc | desc", in: "query" },
      ],
      cache: "60s",
    },
    {
      method: "GET",
      path: "/api/etf/:symbol",
      query: "",
      description:
        "ETF research profile — price, metrics, performance periods, OHLCV history, dividends, similar ETFs, AI summary, and risk block.",
      plan: "free",
      params: [{ name: "symbol", type: "string", required: true, desc: "ETF ticker (e.g. SPY)", in: "path" }],
      responseExample:
        '{"symbol":"SPY","name":"SPDR S&P 500","price":512.3,"performance":{"1y":18.2},"history":[{"date":"2024-01-02","open":470,"high":472,"low":468,"close":471,"volume":80000000}],"aiSummary":"..."}',
      cache: "60s",
    },
    {
      method: "GET",
      path: "/api/etf/heatmap",
      query: "basket=broad&period=1y",
      description: "ETF performance heatmap cells by return % for a preset basket or custom symbols.",
      plan: "free",
      params: [
        { name: "basket", type: "string", required: false, desc: "Preset basket id (see /heatmap/baskets)", in: "query" },
        { name: "symbols", type: "string", required: false, desc: "Comma-separated tickers (max ~40)", in: "query" },
        {
          name: "period",
          type: "string",
          required: false,
          desc: "1d | 1w | 1m | 3m | 6m | ytd | 1y | 3y | 5y | 10y | max",
          in: "query",
        },
      ],
      cache: "60s",
    },
    {
      method: "GET",
      path: "/api/etf/heatmap/baskets",
      query: "",
      description: "List heatmap basket presets — { baskets: [{ id, label, symbols }] }.",
      plan: "free",
      params: [],
      cache: "60s",
    },
    {
      method: "GET",
      path: "/api/etf/screener",
      query: "returnMin=10&expenseMax=0.2&period=1y&sort=return",
      description:
        "Screen ETFs by return, yield, volatility, expense, AUM, Sharpe, issuer/category flags. Free plan: top 10.",
      plan: "free",
      params: [
        { name: "returnMin", type: "number", required: false, desc: "Min return % for period", in: "query" },
        { name: "returnMax", type: "number", required: false, desc: "Max return %", in: "query" },
        { name: "dividendYieldMin", type: "number", required: false, desc: "Min trailing yield %", in: "query" },
        { name: "dividendYieldMax", type: "number", required: false, desc: "Max trailing yield %", in: "query" },
        { name: "volatilityMin", type: "number", required: false, desc: "Min 1Y volatility %", in: "query" },
        { name: "volatilityMax", type: "number", required: false, desc: "Max 1Y volatility %", in: "query" },
        { name: "volumeMin", type: "number", required: false, desc: "Min avg volume", in: "query" },
        { name: "volumeMax", type: "number", required: false, desc: "Max avg volume", in: "query" },
        { name: "priceMin", type: "number", required: false, desc: "Min price", in: "query" },
        { name: "priceMax", type: "number", required: false, desc: "Max price", in: "query" },
        { name: "expenseMin", type: "number", required: false, desc: "Min expense %", in: "query" },
        { name: "expenseMax", type: "number", required: false, desc: "Max expense %", in: "query" },
        { name: "aumMin", type: "number", required: false, desc: "Min AUM $B", in: "query" },
        { name: "aumMax", type: "number", required: false, desc: "Max AUM $B", in: "query" },
        { name: "sharpeMin", type: "number", required: false, desc: "Min Sharpe", in: "query" },
        { name: "period", type: "string", required: false, desc: "ytd | 1y | 3y | 5y", in: "query" },
        { name: "assetClass", type: "string", required: false, desc: "Asset class contains", in: "query" },
        { name: "category", type: "string", required: false, desc: "Category / basket", in: "query" },
        { name: "issuer", type: "string", required: false, desc: "Issuer name", in: "query" },
        { name: "search", type: "string", required: false, desc: "Symbol or name", in: "query" },
        { name: "leveraged", type: "string", required: false, desc: "1 = leveraged only", in: "query" },
        { name: "inverse", type: "string", required: false, desc: "1 = inverse only", in: "query" },
        { name: "esg", type: "string", required: false, desc: "1 = ESG basket", in: "query" },
        {
          name: "sort",
          type: "string",
          required: false,
          desc: "return | yield | volatility | expense | aum | sharpe | price",
          in: "query",
        },
        { name: "sortDir", type: "string", required: false, desc: "asc | desc", in: "query" },
        { name: "limit", type: "number", required: false, desc: "Max results (10 on Free)", in: "query" },
        { name: "offset", type: "number", required: false, desc: "Pagination offset (paid)", in: "query" },
      ],
      cache: "60s",
    },
    {
      method: "GET",
      path: "/api/etf/rankings",
      query: "metric=return&period=1y&limit=20",
      description:
        "ETF leaderboards by return, yield, volatility, CAGR, Sharpe, expense, AUM, or drawdown. Free plan: top 10.",
      plan: "free",
      params: [
        {
          name: "metric",
          type: "string",
          required: false,
          desc: "return | yield | volatility | cagr | sharpe | expense | aum | drawdown",
          in: "query",
        },
        { name: "category", type: "string", required: false, desc: "Legacy metric alias or basket id", in: "query" },
        { name: "period", type: "string", required: false, desc: "ytd | 1y | 3y | 5y", in: "query" },
        { name: "basket", type: "string", required: false, desc: "Limit to heatmap basket", in: "query" },
        { name: "assetClass", type: "string", required: false, desc: "Filter by asset class", in: "query" },
        { name: "search", type: "string", required: false, desc: "Symbol or name", in: "query" },
        { name: "limit", type: "number", required: false, desc: "Max results (10 on Free)", in: "query" },
        { name: "offset", type: "number", required: false, desc: "Pagination offset (paid)", in: "query" },
      ],
      cache: "60s",
    },
    {
      method: "GET",
      path: "/api/stocks/prices",
      query: "symbols=SPY,QQQ,VOO",
      description: "Batch ETF prices — latest close for up to 50 tickers. Cached 60s.",
      plan: "free",
      params: [
        { name: "symbols", type: "string", required: true, desc: "Comma-separated ETF tickers", in: "query" },
      ],
      responseExample: '[{"symbol":"SPY","price":512.34},{"symbol":"QQQ","price":445.12}]',
      cache: "60s",
    },
    {
      method: "GET",
      path: "/api/stocks/:symbol/history",
      query: "startDate=2020-01-01&endDate=2024-12-31",
      description: "Historical OHLCV bars for charts and research. Free plan.",
      plan: "free",
      params: [
        { name: "symbol", type: "string", required: true, desc: "Ticker", in: "path" },
        { name: "startDate", type: "string", required: false, desc: "YYYY-MM-DD", in: "query" },
        { name: "endDate", type: "string", required: false, desc: "YYYY-MM-DD", in: "query" },
        { name: "interval", type: "string", required: false, desc: "1d | 1wk | 1mo", in: "query" },
      ],
      cache: "60s",
    },
  ],

  market: [
    {
      method: "GET",
      path: "/api/market/status",
      query: "",
      description:
        "US market session status from NYSE calendar (holidays + early closes). Regular 09:30–16:00 ET.",
      plan: "free",
      params: [],
      cache: "30s",
    },
  ],

  platform: [
    {
      method: "POST",
      path: "/api/backtest/buy-and-hold",
      query: "",
      description:
        "Multi-strategy ETF backtest (also accepts GET). Returns equity curve, tradeEvents, dividendEvents, OHLCV prices, drawdownCurve, Sharpe/Sortino, and more. Paid plan.",
      plan: "paid",
      params: [
        { name: "symbol", type: "string", required: true, desc: "ETF ticker (e.g. SPY)", in: "body" },
        { name: "investment", type: "number", required: false, desc: "Initial capital USD (default 10000)", in: "body" },
        { name: "startDate", type: "string", required: true, desc: "YYYY-MM-DD", in: "body" },
        { name: "endDate", type: "string", required: true, desc: "YYYY-MM-DD", in: "body" },
        {
          name: "strategy",
          type: "string",
          required: false,
          desc: "buy_and_hold | dca | sma_crossover | ema_crossover | rsi | macd | custom",
          in: "body",
        },
        { name: "reinvestDividends", type: "boolean", required: false, desc: "Default true", in: "body" },
        { name: "adjustForInflation", type: "boolean", required: false, desc: "Default false", in: "body" },
        { name: "fastPeriod", type: "number", required: false, desc: "SMA/EMA fast period", in: "body" },
        { name: "slowPeriod", type: "number", required: false, desc: "SMA/EMA slow period", in: "body" },
        { name: "rsiPeriod", type: "number", required: false, desc: "RSI lookback", in: "body" },
        { name: "rsiBuyBelow", type: "number", required: false, desc: "RSI entry threshold", in: "body" },
        { name: "rsiSellAbove", type: "number", required: false, desc: "RSI exit threshold", in: "body" },
        { name: "macdFast", type: "number", required: false, desc: "MACD fast EMA", in: "body" },
        { name: "macdSlow", type: "number", required: false, desc: "MACD slow EMA", in: "body" },
        { name: "macdSignal", type: "number", required: false, desc: "MACD signal period", in: "body" },
      ],
      responseExample:
        '{"symbol":"SPY","strategy":"buy_and_hold","totalReturn":142.5,"cagr":12.4,"maxDrawdown":18.7,"equityCurve":[{"date":"2020-01-02","value":10000}],"tradeEvents":[{"date":"2020-01-02","side":"BUY","shares":20.1,"price":497}],"prices":[{"date":"2020-01-02","open":496,"high":498,"low":495,"close":497,"volume":1e8}]}',
    },
    {
      method: "POST",
      path: "/api/backtest/compare",
      query: "",
      description: "Compare multiple ETFs with the same strategy settings. Returns winner, ranked list, and per-symbol results. Paid plan.",
      plan: "paid",
      params: [
        { name: "symbols", type: "string[]", required: true, desc: "Array or comma-separated tickers", in: "body" },
        { name: "investment", type: "number", required: false, desc: "Per-ETF investment USD", in: "body" },
        { name: "startDate", type: "string", required: true, desc: "YYYY-MM-DD", in: "body" },
        { name: "endDate", type: "string", required: true, desc: "YYYY-MM-DD", in: "body" },
        { name: "strategy", type: "string", required: false, desc: "Same strategies as buy-and-hold", in: "body" },
        { name: "reinvestDividends", type: "boolean", required: false, desc: "Default true", in: "body" },
        { name: "adjustForInflation", type: "boolean", required: false, desc: "Default false", in: "body" },
      ],
    },
    {
      method: "POST",
      path: "/api/portfolio/rebalance",
      query: "",
      description:
        "Compare current holdings to target weights and get buy/sell suggestions. Paid plan. Also accepts GET with JSON query strings.",
      plan: "paid",
      params: [
        { name: "holdings", type: "object[]", required: true, desc: '[{ "symbol": "VOO", "shares": 63 }]', in: "body" },
        { name: "target", type: "object[]", required: true, desc: '[{ "symbol": "VOO", "weight": 60 }]', in: "body" },
        { name: "driftThreshold", type: "number", required: false, desc: "Min drift % before suggesting trades", in: "body" },
        { name: "mode", type: "string", required: false, desc: "rebalance | contributions_only", in: "body" },
      ],
    },
  ],

  developer: [
    {
      method: "GET",
      path: "/api/developer/usage",
      query: "",
      description: "Usage stats — plan, requests today, remaining, daily limit, series, endpoint analytics.",
      plan: "free",
      params: [],
      responseExample: '{"plan":"free","requestsToday":12,"requestsRemaining":38,"dailyLimit":50}',
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
