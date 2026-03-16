"use client";

import { useState } from "react";
import { API_BASE_URL, API_DOC_SECTIONS, WEBSOCKET_DOC, type ApiEndpoint } from "@/lib/api-docs-data";

const SECTION_TITLES: Record<string, string> = {
  stocks: "Stock Endpoints",
  market: "Market Endpoints",
  etf: "ETF Endpoints",
  options: "Options Chain",
  insiders: "Insider Trades",
  sentiment: "Stock Sentiment",
  darkpool: "Dark Pool",
  economy: "Economic Indicators",
  search: "Search",
  screener: "Stock Screener",
  indicators: "Technical Indicators",
  ai: "AI Stock Score",
  developer: "Developer",
};

function getExamplePath(ep: ApiEndpoint): string {
  let p = ep.path;
  ep.params.forEach((param) => {
    if (param.in === "path") {
      const example = param.name === "symbol" ? "AAPL" : "NVDA";
      p = p.replace(`:${param.name}`, example);
    }
  });
  return p;
}

function EndpointSection({ title, endpoints }: { title: string; endpoints: ApiEndpoint[] }) {
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const copyUrl = (ep: ApiEndpoint) => {
    const path = getExamplePath(ep);
    const url = `${API_BASE_URL}${path}${ep.query || ""}`;
    navigator.clipboard.writeText(url);
    setCopiedPath(ep.path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  return (
    <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-6 space-y-6">
        {endpoints.map((ep) => {
          const pathParams = ep.params.filter((p) => p.in === "path");
          const queryParams = ep.params.filter((p) => p.in === "query");
          const examplePath = getExamplePath(ep);

          return (
            <div key={ep.path + (ep.query || "")} className="rounded-xl border border-white/5 bg-black/20 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
                  {ep.method}
                </span>
                <code className="font-mono text-sm text-white/90">
                  {ep.path}
                  {ep.query && <span className="text-white/50">{ep.query}</span>}
                </code>
                {ep.cache && (
                  <span className="rounded bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400">cached {ep.cache}</span>
                )}
                <button
                  onClick={() => copyUrl(ep)}
                  className="ml-2 rounded px-2 py-1 text-xs text-white/60 hover:bg-white/10 hover:text-white"
                >
                  {copiedPath === ep.path ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="mt-2 text-sm text-white/60">{ep.description}</p>

              {(pathParams.length > 0 || queryParams.length > 0) && (
                <div className="mt-4 space-y-2">
                  {pathParams.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-white/50 uppercase tracking-wider">Path Parameters</p>
                      <ul className="mt-1 space-y-1 text-sm">
                        {pathParams.map((p) => (
                          <li key={p.name} className="flex flex-wrap gap-2">
                            <code className="text-indigo-400">{p.name}</code>
                            <span className="text-white/50">({p.type})</span>
                            {p.required && <span className="text-amber-400">required</span>}
                            <span className="text-white/60">— {p.desc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {queryParams.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-white/50 uppercase tracking-wider">Query Parameters</p>
                      <ul className="mt-1 space-y-1 text-sm">
                        {queryParams.map((p) => (
                          <li key={p.name} className="flex flex-wrap gap-2">
                            <code className="text-indigo-400">{p.name}</code>
                            <span className="text-white/50">({p.type})</span>
                            {p.required && <span className="text-amber-400">required</span>}
                            <span className="text-white/60">— {p.desc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {ep.responseExample && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-white/50 uppercase tracking-wider">Response Example</p>
                  <pre className="mt-1 overflow-x-auto rounded-lg border border-white/5 bg-black/30 px-3 py-2 font-mono text-xs text-emerald-400">
                    {ep.responseExample}
                  </pre>
                </div>
              )}

              <div className="mt-3 rounded-lg border border-white/5 bg-black/30 px-3 py-2 font-mono text-xs text-white/70">
                {API_BASE_URL}
                {examplePath}
                {ep.query || ""}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function ApiDocsPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">API Documentation</h1>
        <p className="mt-1 text-white/60">
          Complete REST API for US stocks, ETFs, options, market data, economic indicators, and more. Historical data from 2000–present.
        </p>
      </div>

      {/* Swagger link */}
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={`${API_BASE_URL}/api-docs`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Go to Swagger
        </a>
      </div>

      {/* Authentication */}
      <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <h2 className="text-lg font-semibold">Authentication</h2>
        <p className="mt-2 text-sm text-white/70">
          Include your API key in the <code className="rounded bg-white/10 px-1.5 py-0.5">x-api-key</code> header for
          all requests. Get your key from the Dashboard or API Keys page.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-4 text-sm">
          <code className="text-emerald-400">x-api-key: YOUR_API_KEY</code>
        </pre>
      </section>

      {/* Sections */}
      {Object.entries(API_DOC_SECTIONS).map(([key, endpoints]) => (
        <EndpointSection key={key} title={SECTION_TITLES[key] || key} endpoints={endpoints} />
      ))}

      {/* WebSocket */}
      <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <h2 className="text-lg font-semibold">WebSocket — Real-Time Prices</h2>
        <p className="mt-2 text-sm text-white/70">{WEBSOCKET_DOC.description}</p>
        <div className="mt-4 space-y-2">
          <p className="font-mono text-sm text-indigo-400">
            {API_BASE_URL.replace(/^http/, "ws")}
            {WEBSOCKET_DOC.path}
          </p>
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-white/50 uppercase tracking-wider">Subscribe</p>
            <pre className="overflow-x-auto rounded-lg border border-white/5 bg-black/30 px-3 py-2 font-mono text-xs text-emerald-400">
              {WEBSOCKET_DOC.messageFormat.subscribe}
            </pre>
            <p className="text-xs font-medium text-white/50 uppercase tracking-wider mt-2">Response</p>
            <pre className="overflow-x-auto rounded-lg border border-white/5 bg-black/30 px-3 py-2 font-mono text-xs text-emerald-400">
              {WEBSOCKET_DOC.messageFormat.response}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}
