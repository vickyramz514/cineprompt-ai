/**
 * Full API documentation data - DataCaptain Stock Market API
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
  stocks: [
    {
      method: "GET",
      path: "/api/stocks/prices",
      query: "?symbols=AAPL,TSLA,NVDA",
      description: "Batch stock prices — get real-time prices for up to 50 symbols in a single request. Cached 60s.",
      params: [
        { name: "symbols", type: "string", required: true, desc: "Comma-separated tickers (e.g. AAPL,TSLA,NVDA)", in: "query" },
      ],
      responseExample: '[{"symbol":"AAPL","price":175.42},{"symbol":"TSLA","price":242.18}]',
      cache: "60s",
    },
    {
      method: "GET",
      path: "/api/stocks/:symbol/price",
      query: "",
      description: "Single stock price — current price, change, changePercent, timestamp.",
      params: [{ name: "symbol", type: "string", required: true, desc: "Stock ticker (e.g. AAPL)", in: "path" }],
      responseExample: '{"symbol":"AAPL","price":175.42,"change":2.1,"changePercent":1.21,"timestamp":"2024-03-10T16:00:00Z"}',
      cache: "60s",
    },
    {
      method: "GET",
      path: "/api/stocks/:symbol/history",
      query: "?startDate=2024-01-01&endDate=2024-03-01&interval=1d",
      description: "Historical OHLCV data — daily, weekly, or monthly bars.",
      params: [
        { name: "symbol", type: "string", required: true, desc: "Stock ticker", in: "path" },
        { name: "startDate", type: "string", required: false, desc: "Start date (YYYY-MM-DD)", in: "query" },
        { name: "endDate", type: "string", required: false, desc: "End date (YYYY-MM-DD)", in: "query" },
        { name: "interval", type: "string", required: false, desc: "1d, 1wk, 1mo", in: "query" },
      ],
      cache: "60s",
    },
    {
      method: "GET",
      path: "/api/stocks/:symbol/candles",
      query: "?interval=5m",
      description: "OHLC candle data — intraday or daily candles.",
      params: [
        { name: "symbol", type: "string", required: true, desc: "Stock ticker", in: "path" },
        { name: "interval", type: "string", required: false, desc: "1m, 5m, 15m, 1h, 1d", in: "query" },
      ],
    },
    {
      method: "GET",
      path: "/api/stocks/:symbol/profile",
      query: "",
      description: "Company profile — sector, industry, market cap, exchange.",
      params: [{ name: "symbol", type: "string", required: true, desc: "Stock ticker", in: "path" }],
      cache: "60s",
    },
    {
      method: "GET",
      path: "/api/stocks/:symbol/dividends",
      query: "",
      description: "Dividend history — ex-date, amount, payment date.",
      params: [{ name: "symbol", type: "string", required: true, desc: "Stock ticker", in: "path" }],
    },
    {
      method: "GET",
      path: "/api/stocks/:symbol/earnings",
      query: "",
      description: "Earnings data — report date, EPS, revenue, consensus.",
      params: [{ name: "symbol", type: "string", required: true, desc: "Stock ticker", in: "path" }],
    },
  ],

  market: [
    {
      method: "GET",
      path: "/api/market/status",
      query: "",
      description: "US market status — OPEN/CLOSED, next open time, next close time.",
      params: [],
      responseExample: '{"market":"US","status":"OPEN","nextOpen":"2024-03-11T09:30:00","nextClose":"2024-03-10T16:00:00"}',
      cache: "60s",
    },
    {
      method: "GET",
      path: "/api/market/top-gainers",
      query: "",
      description: "Top gaining stocks for the day.",
      params: [],
      cache: "60s",
    },
    {
      method: "GET",
      path: "/api/market/top-losers",
      query: "",
      description: "Top losing stocks for the day.",
      params: [],
      cache: "60s",
    },
    {
      method: "GET",
      path: "/api/market/most-active",
      query: "",
      description: "Most traded stocks by volume.",
      params: [],
      cache: "60s",
    },
  ],

  etf: [
    {
      method: "GET",
      path: "/api/etf/list",
      query: "",
      description: "Popular ETFs — SPY, QQQ, VTI, DIA, ARKK with current prices.",
      params: [],
      cache: "60s",
    },
    {
      method: "GET",
      path: "/api/etf/:symbol",
      query: "",
      description: "Single ETF details — symbol, name, price, metadata.",
      params: [{ name: "symbol", type: "string", required: true, desc: "ETF ticker (e.g. SPY)", in: "path" }],
      cache: "60s",
    },
  ],

  options: [
    {
      method: "GET",
      path: "/api/options/:symbol",
      query: "?expirationDate=2024-03-15&limit=50",
      description: "Options chain — calls and puts with strike, bid, ask, volume, open interest.",
      params: [
        { name: "symbol", type: "string", required: true, desc: "Underlying ticker (e.g. AAPL)", in: "path" },
        { name: "expirationDate", type: "string", required: false, desc: "YYYY-MM-DD", in: "query" },
        { name: "limit", type: "integer", required: false, desc: "Max legs (default 50)", in: "query" },
      ],
      cache: "60s",
    },
  ],

  insiders: [
    {
      method: "GET",
      path: "/api/insiders/:symbol",
      query: "?limit=50",
      description: "Insider trading — name, title, transaction type, shares, price, date.",
      params: [
        { name: "symbol", type: "string", required: true, desc: "Stock ticker", in: "path" },
        { name: "limit", type: "integer", required: false, desc: "Max results (default 50)", in: "query" },
      ],
    },
  ],

  sentiment: [
    {
      method: "GET",
      path: "/api/sentiment/:symbol",
      query: "",
      description: "Stock sentiment score (-1 to +1) — BULLISH, NEUTRAL, BEARISH, mentions count.",
      params: [{ name: "symbol", type: "string", required: true, desc: "Stock ticker", in: "path" }],
      cache: "60s",
    },
  ],

  darkpool: [
    {
      method: "GET",
      path: "/api/darkpool/:symbol",
      query: "?limit=50",
      description: "Dark pool trading — price, volume, trade time for off-exchange activity.",
      params: [
        { name: "symbol", type: "string", required: true, desc: "Stock ticker", in: "path" },
        { name: "limit", type: "integer", required: false, desc: "Max trades (default 50)", in: "query" },
      ],
    },
  ],

  economy: [
    {
      method: "GET",
      path: "/api/economy/indicators",
      query: "",
      description: "Economic indicators — inflation, interest rate, GDP growth, unemployment.",
      params: [],
      responseExample: '{"inflation":3.2,"interestRate":5.25,"gdpGrowth":2.4,"unemploymentRate":3.8}',
      cache: "5 min",
    },
  ],

  search: [
    {
      method: "GET",
      path: "/api/search",
      query: "?q=apple",
      description: "Search stocks — symbol and name search.",
      params: [{ name: "q", type: "string", required: true, desc: "Search query", in: "query" }],
    },
  ],

  screener: [
    {
      method: "GET",
      path: "/api/screener",
      query: "?sector=Technology&marketCapMin=1000000000&limit=50",
      description: "Stock screener — filter by sector, market cap, price, volume.",
      params: [
        { name: "sector", type: "string", required: false, desc: "Sector filter", in: "query" },
        { name: "marketCapMin", type: "integer", required: false, desc: "Min market cap", in: "query" },
        { name: "marketCapMax", type: "integer", required: false, desc: "Max market cap", in: "query" },
        { name: "priceMin", type: "number", required: false, desc: "Min price", in: "query" },
        { name: "priceMax", type: "number", required: false, desc: "Max price", in: "query" },
        { name: "volumeMin", type: "integer", required: false, desc: "Min volume", in: "query" },
        { name: "limit", type: "integer", required: false, desc: "Max results (default 50)", in: "query" },
      ],
    },
  ],

  indicators: [
    {
      method: "GET",
      path: "/api/indicators/:symbol",
      query: "?rsiPeriod=14&smaPeriod=20",
      description: "Technical indicators — RSI, SMA, EMA, MACD, Bollinger Bands.",
      params: [
        { name: "symbol", type: "string", required: true, desc: "Stock ticker", in: "path" },
        { name: "rsiPeriod", type: "integer", required: false, desc: "RSI period (default 14)", in: "query" },
        { name: "smaPeriod", type: "integer", required: false, desc: "SMA period (default 20)", in: "query" },
        { name: "emaPeriod", type: "integer", required: false, desc: "EMA period (default 20)", in: "query" },
        { name: "bbPeriod", type: "integer", required: false, desc: "Bollinger Bands period (default 20)", in: "query" },
      ],
    },
  ],

  ai: [
    {
      method: "GET",
      path: "/api/ai/stock-score/:symbol",
      query: "",
      description: "AI stock score (0–100) — trend, momentum, volume, volatility.",
      params: [{ name: "symbol", type: "string", required: true, desc: "Stock ticker", in: "path" }],
      cache: "60s",
    },
  ],

  developer: [
    {
      method: "GET",
      path: "/api/developer/usage",
      query: "",
      description: "Usage stats — plan, requests today, remaining, daily limit.",
      params: [],
      responseExample: '{"plan":"FREE","requestsToday":42,"requestsRemaining":958,"dailyLimit":1000}',
    },
  ],
};

export const SECTION_LABELS: Record<string, string> = {
  stocks: "Stock Endpoints",
  market: "Market Endpoints",
  etf: "ETF Endpoints",
  options: "Options Chain",
  insiders: "Insider Trading",
  sentiment: "Stock Sentiment",
  darkpool: "Dark Pool",
  economy: "Economic Indicators",
  search: "Search",
  screener: "Stock Screener",
  indicators: "Technical Indicators",
  ai: "AI Stock Score",
  developer: "Developer / Usage",
};

export const WEBSOCKET_DOC = {
  path: "/ws",
  description: "Real-time stock price streaming. Subscribe to symbols and receive price updates every 5 seconds.",
  messageFormat: {
    subscribe: '{"action":"subscribe","symbols":["AAPL","TSLA"]}',
    unsubscribe: '{"action":"unsubscribe","symbols":["AAPL"]}',
    response: '{"type":"prices","data":[{"symbol":"AAPL","price":175.42},...]}',
  },
};
