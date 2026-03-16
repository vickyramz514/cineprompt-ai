"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import DataCaptainLogo from "@/components/DataCaptainLogo";
import { API_BASE_URL, API_DOC_SECTIONS, WEBSOCKET_DOC, type ApiEndpoint } from "@/lib/api-docs-data";

const SECTION_TITLES: Record<string, string> = {
  stocks: "Stock Endpoints",
  market: "Market Endpoints",
  etf: "ETF Endpoints",
  options: "Options Endpoints",
  insiders: "Insider Trades",
  sentiment: "Sentiment",
  darkpool: "Dark Pool",
  economy: "Economic Indicators",
  search: "Search",
  screener: "Stock Screener",
  indicators: "Technical Indicators",
  ai: "AI Stock Score",
  developer: "Developer",
};

function EndpointCard({ ep, baseUrl }: { ep: ApiEndpoint; baseUrl: string }) {
  const pathForUrl = ep.path.replace(/:symbol/g, "AAPL").replace(/:\w+/g, "VALUE");
  const fullUrl = `${baseUrl}${pathForUrl}${ep.query || ""}`;
  return (
    <div className="rounded-xl border border-white/5 bg-black/20 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">{ep.method}</span>
        <code className="font-mono text-sm text-white/90">
          {ep.path}
          {ep.query || ""}
        </code>
        {ep.cache && (
          <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-white/50">cache: {ep.cache}</span>
        )}
      </div>
      <p className="mt-2 text-sm text-white/60">{ep.description}</p>
      {ep.params.length > 0 && (
        <div className="mt-3 text-xs">
          <span className="text-white/50">Params: </span>
          <span className="text-white/70">
            {ep.params.map((p) => `${p.name} (${p.type})${p.required ? "*" : ""}`).join(", ")}
          </span>
        </div>
      )}
      <div className="mt-2 font-mono text-xs text-white/50 break-all">{fullUrl}</div>
    </div>
  );
}

export default function PublicDocsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <DataCaptainLogo size="md" />
            <span className="text-xl font-semibold">
              Data <span className="text-indigo-400">Captain</span>
            </span>
          </Link>
          <div className="flex gap-4">
            <Link href="/pricing" className="text-sm font-medium text-white/70 hover:text-white">
              Pricing
            </Link>
            <Link href="/auth/login" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium">
              Login
            </Link>
            <Link href="/auth/signup" className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white">
              Get API Key
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        <div className="space-y-10">
          <div>
            <h1 className="text-2xl font-semibold">API Documentation</h1>
            <p className="mt-1 text-white/60">
              REST API for US Stock Market, ETFs, options, insider trades, sentiment, and more. Historical data 2000–Present.
            </p>
          </div>

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

          <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <h2 className="text-lg font-semibold">Authentication</h2>
            <p className="mt-2 text-sm text-white/70">
              Include your API key in the <code className="rounded bg-white/10 px-1.5 py-0.5">x-api-key</code> header
              for all requests.
            </p>
            <pre className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-4 text-sm">
              <code className="text-emerald-400">x-api-key: YOUR_API_KEY</code>
            </pre>
          </section>

          {Object.entries(API_DOC_SECTIONS).map(([key, endpoints]) => (
            <section key={key} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
              <h2 className="text-lg font-semibold">{SECTION_TITLES[key] || key}</h2>
              <div className="mt-6 space-y-4">
                {endpoints.map((ep) => (
                  <EndpointCard key={ep.path + (ep.query || "")} ep={ep} baseUrl={API_BASE_URL} />
                ))}
              </div>
            </section>
          ))}

          <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <h2 className="text-lg font-semibold">WebSocket (Real-Time)</h2>
            <p className="mt-2 text-sm text-white/70">{WEBSOCKET_DOC.description}</p>
            <div className="mt-4 font-mono text-sm text-white/60">
              {API_BASE_URL.replace(/^http/, "ws")}
              {WEBSOCKET_DOC.path}
            </div>
            <div className="mt-4 space-y-2 text-xs">
              <p className="text-white/50">Subscribe:</p>
              <pre className="overflow-x-auto rounded-lg border border-white/10 bg-black/30 p-3 text-emerald-400">
                {WEBSOCKET_DOC.messageFormat.subscribe}
              </pre>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
