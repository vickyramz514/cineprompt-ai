"use client";

import Link from "next/link";
import Footer from "@/components/Footer";

const STOCK_ENDPOINTS = [
  { method: "GET", path: "/api/stocks/list", desc: "Returns list of supported stocks" },
  { method: "GET", path: "/api/stocks/history", desc: "Historical stock prices (symbol, start_date, end_date)" },
];

const ETF_ENDPOINTS = [
  { method: "GET", path: "/api/etf/list", desc: "Returns list of supported ETFs" },
  { method: "GET", path: "/api/etf/history", desc: "Historical ETF prices" },
];

const MARKET_ENDPOINTS = [
  { method: "GET", path: "/api/market/top-gainers", desc: "Top gaining stocks for the day" },
  { method: "GET", path: "/api/market/top-losers", desc: "Top losing stocks for the day" },
];

const baseUrl = "https://api.stockdata.example.com";

export default function PublicDocsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 lg:px-8">
          <Link href="/" className="text-xl font-semibold">
            Stock Data <span className="text-indigo-400">API</span>
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
            <p className="mt-1 text-white/60">REST API for US Stock Market and ETF historical data (2000–Present)</p>
          </div>

          <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <h2 className="text-lg font-semibold">Authentication</h2>
            <p className="mt-2 text-sm text-white/70">
              Include your API key in the <code className="rounded bg-white/10 px-1.5 py-0.5">x-api-key</code> header for all requests.
            </p>
            <pre className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-4 text-sm">
              <code className="text-emerald-400">x-api-key: YOUR_API_KEY</code>
            </pre>
          </section>

          <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <h2 className="text-lg font-semibold">Stock Endpoints</h2>
            <div className="mt-6 space-y-4">
              {STOCK_ENDPOINTS.map((ep) => (
                <div key={ep.path} className="rounded-xl border border-white/5 bg-black/20 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
                      {ep.method}
                    </span>
                    <code className="font-mono text-sm text-white/90">{ep.path}</code>
                  </div>
                  <p className="mt-2 text-sm text-white/60">{ep.desc}</p>
                  <div className="mt-2 font-mono text-xs text-white/50">{baseUrl}{ep.path}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <h2 className="text-lg font-semibold">ETF Endpoints</h2>
            <div className="mt-6 space-y-4">
              {ETF_ENDPOINTS.map((ep) => (
                <div key={ep.path} className="rounded-xl border border-white/5 bg-black/20 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
                      {ep.method}
                    </span>
                    <code className="font-mono text-sm text-white/90">{ep.path}</code>
                  </div>
                  <p className="mt-2 text-sm text-white/60">{ep.desc}</p>
                  <div className="mt-2 font-mono text-xs text-white/50">{baseUrl}{ep.path}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <h2 className="text-lg font-semibold">Market Endpoints</h2>
            <div className="mt-6 space-y-4">
              {MARKET_ENDPOINTS.map((ep) => (
                <div key={ep.path} className="rounded-xl border border-white/5 bg-black/20 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
                      {ep.method}
                    </span>
                    <code className="font-mono text-sm text-white/90">{ep.path}</code>
                  </div>
                  <p className="mt-2 text-sm text-white/60">{ep.desc}</p>
                  <div className="mt-2 font-mono text-xs text-white/50">{baseUrl}{ep.path}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
