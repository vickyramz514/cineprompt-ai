"use client";

import { useState } from "react";

const ENDPOINTS = [
  {
    method: "GET",
    path: "/api/stocks/history",
    query: "?symbol=AAPL",
    description: "Get historical stock price data",
  },
  {
    method: "GET",
    path: "/api/etf/history",
    query: "?symbol=SPY",
    description: "Get historical ETF price data",
  },
  {
    method: "GET",
    path: "/api/stocks/list",
    query: "",
    description: "Get list of available stock symbols",
  },
];

const EXAMPLE_RESPONSE = {
  symbol: "AAPL",
  data: [
    { date: "2024-01-15", open: 185.5, high: 188.2, low: 184.1, close: 187.8, volume: 54200000 },
    { date: "2024-01-16", open: 188.0, high: 189.5, low: 186.2, close: 188.5, volume: 48900000 },
  ],
};

export default function ApiDocsPage() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyEndpoint = (baseUrl: string, path: string, query: string) => {
    const full = `${baseUrl}${path}${query}`;
    navigator.clipboard.writeText(full);
    setCopiedEndpoint(path);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const baseUrl = "https://api.stockdata.example.com";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">API Documentation</h1>
        <p className="mt-1 text-white/60">REST API for US Stock Market and ETF historical data (2000–Present)</p>
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

      {/* Endpoints */}
      <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <h2 className="text-lg font-semibold">Endpoints</h2>
        <div className="mt-6 space-y-6">
          {ENDPOINTS.map((ep) => (
            <div
              key={ep.path + ep.query}
              className="rounded-xl border border-white/5 bg-black/20 p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
                  {ep.method}
                </span>
                <code className="font-mono text-sm text-white/90">
                  {ep.path}{ep.query}
                </code>
                <button
                  onClick={() => copyEndpoint(baseUrl, ep.path, ep.query)}
                  className="ml-2 rounded px-2 py-1 text-xs text-white/60 hover:bg-white/10 hover:text-white"
                >
                  {copiedEndpoint === ep.path ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="mt-2 text-sm text-white/60">{ep.description}</p>
              <div className="mt-3 rounded-lg border border-white/5 bg-black/30 px-3 py-2 font-mono text-xs text-white/70">
                {baseUrl}{ep.path}{ep.query}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Example Response */}
      <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <h2 className="text-lg font-semibold">Example Response</h2>
        <p className="mt-2 text-sm text-white/70">
          Response from <code className="rounded bg-white/10 px-1.5 py-0.5">GET /api/stocks/history?symbol=AAPL</code>
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white/80">
          {JSON.stringify(EXAMPLE_RESPONSE, null, 2)}
        </pre>
      </section>
    </div>
  );
}
