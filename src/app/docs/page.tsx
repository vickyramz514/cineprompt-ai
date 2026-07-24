"use client";

import Footer from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import { API_BASE_URL, API_DOC_SECTIONS, SECTION_LABELS, WEBSOCKET_DOC, type ApiEndpoint } from "@/lib/api-docs-data";

function EndpointCard({ ep, baseUrl }: { ep: ApiEndpoint; baseUrl: string }) {
  const pathForUrl = ep.path.replace(/:symbol/g, "SPY").replace(/:\w+/g, "VALUE");
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
      <SiteHeader active="docs" contained containedMax="max-w-4xl" sticky />

      <main className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        <div className="space-y-10">
          <div>
            <h1 className="text-2xl font-semibold">API Documentation</h1>
            <p className="mt-1 text-white/60">
              REST API for US ETF data — universe, batch prices, market status, and backtesting endpoints.
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

          <section id="sdks" className="scroll-mt-28 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <h2 className="text-lg font-semibold">Official SDKs</h2>
            <p className="mt-2 text-sm text-white/70">
              Use the official client libraries instead of hand-rolling HTTP calls. Same API key, typed methods for
              screener, rankings, heatmap, backtest, and portfolio endpoints.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs font-medium uppercase tracking-widest text-white/40">JavaScript / TypeScript</p>
                <p className="mt-1 text-xs text-white/40">
                  npm ·{" "}
                  <a
                    href="https://www.npmjs.com/package/datacaptain"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:underline"
                  >
                    datacaptain@0.1.0
                  </a>
                </p>
                <pre className="mt-2 overflow-x-auto text-sm">
                  <code className="text-emerald-400">npm install datacaptain</code>
                </pre>
                <pre className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-3 text-xs text-white/70">
{`import { DataCaptain } from "datacaptain";

const dc = new DataCaptain({ apiKey: process.env.DATACAPTAIN_API_KEY });
const rankings = await dc.etf.rankings({ category: "return", period: "1y" });`}
                </pre>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs font-medium uppercase tracking-widest text-white/40">Python</p>
                <p className="mt-1 text-xs text-white/40">Coming soon on PyPI — use REST meanwhile</p>
                <pre className="mt-2 overflow-x-auto text-sm">
                  <code className="text-white/50"># pip install datacaptain  (after PyPI publish)</code>
                </pre>
                <pre className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-3 text-xs text-white/70">
{`from datacaptain import DataCaptain

dc = DataCaptain(api_key="YOUR_API_KEY")
rankings = dc.etf_rankings(category="return", period="1y")`}
                </pre>
              </div>
            </div>
            <p className="mt-4 text-xs text-white/45">
              TypeScript SDK is published on npm. Source lives in this repo under{" "}
              <code className="rounded bg-white/10 px-1">packages/datacaptain</code>.
            </p>
          </section>

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
              <h2 className="text-lg font-semibold">{SECTION_LABELS[key] || key}</h2>
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
