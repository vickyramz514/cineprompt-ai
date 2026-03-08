"use client";

import { useState } from "react";

const baseUrl = "https://api.stockdata.example.com";

const STOCK_ENDPOINTS = [
  {
    method: "GET",
    path: "/api/stocks/list",
    query: "",
    description: "Returns list of supported stocks",
    params: [],
  },
  {
    method: "GET",
    path: "/api/stocks/history",
    query: "?symbol=AAPL&start_date=2024-01-01&end_date=2024-03-01",
    description: "Get historical stock price data",
    params: [
      { name: "symbol", type: "string", required: true, desc: "Stock ticker symbol" },
      { name: "start_date", type: "string", required: false, desc: "Start date (YYYY-MM-DD)" },
      { name: "end_date", type: "string", required: false, desc: "End date (YYYY-MM-DD)" },
    ],
  },
];

const ETF_ENDPOINTS = [
  {
    method: "GET",
    path: "/api/etf/list",
    query: "",
    description: "Returns list of supported ETFs",
    params: [],
  },
  {
    method: "GET",
    path: "/api/etf/history",
    query: "?symbol=SPY",
    description: "Get historical ETF price data",
    params: [
      { name: "symbol", type: "string", required: true, desc: "ETF ticker symbol" },
    ],
  },
];

const MARKET_ENDPOINTS = [
  {
    method: "GET",
    path: "/api/market/top-gainers",
    query: "",
    description: "Returns top gaining stocks for the day",
    params: [],
  },
  {
    method: "GET",
    path: "/api/market/top-losers",
    query: "",
    description: "Returns top losing stocks for the day",
    params: [],
  },
];

function EndpointSection({
  title,
  endpoints,
}: {
  title: string;
  endpoints: (typeof STOCK_ENDPOINTS)[0][];
}) {
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const copyUrl = (path: string, query: string) => {
    navigator.clipboard.writeText(`${baseUrl}${path}${query}`);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  return (
    <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-6 space-y-6">
        {endpoints.map((ep) => (
          <div
            key={ep.path + ep.query}
            className="rounded-xl border border-white/5 bg-black/20 p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
                {ep.method}
              </span>
              <code className="font-mono text-sm text-white/90">{ep.path}{ep.query}</code>
              <button
                onClick={() => copyUrl(ep.path, ep.query)}
                className="ml-2 rounded px-2 py-1 text-xs text-white/60 hover:bg-white/10 hover:text-white"
              >
                {copiedPath === ep.path ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="mt-2 text-sm text-white/60">{ep.description}</p>
            {ep.params.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-medium text-white/50 uppercase tracking-wider">Query Parameters</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {ep.params.map((p) => (
                    <li key={p.name} className="flex gap-2">
                      <code className="text-indigo-400">{p.name}</code>
                      <span className="text-white/50">({p.type})</span>
                      {p.required && <span className="text-amber-400">required</span>}
                      <span className="text-white/60">— {p.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-3 rounded-lg border border-white/5 bg-black/30 px-3 py-2 font-mono text-xs text-white/70">
              {baseUrl}{ep.path}{ep.query}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ApiDocsPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">API Documentation</h1>
        <p className="mt-1 text-white/60">REST API for US Stock Market and ETF historical data</p>
      </div>

      {/* Authentication */}
      <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <h2 className="text-lg font-semibold">Authentication</h2>
        <p className="mt-2 text-sm text-white/70">
          Include your API key in the <code className="rounded bg-white/10 px-1.5 py-0.5">x-api-key</code> header for all requests.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-4 text-sm">
          <code className="text-emerald-400">x-api-key: YOUR_API_KEY</code>
        </pre>
      </section>

      <EndpointSection title="Stock Endpoints" endpoints={STOCK_ENDPOINTS} />
      <EndpointSection title="ETF Endpoints" endpoints={ETF_ENDPOINTS} />
      <EndpointSection title="Market Endpoints" endpoints={MARKET_ENDPOINTS} />
    </div>
  );
}
