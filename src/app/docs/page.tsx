"use client";

import Footer from "@/components/Footer";
import DataCaptainLogo from "@/components/DataCaptainLogo";
import { MarketingHeaderActions } from "@/components/MarketingHeaderActions";
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
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0a0a0f]/70 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0a0a0f]/55">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 lg:px-8">
          <DataCaptainLogo size="md" />
          <MarketingHeaderActions active="docs" />
        </div>
      </header>

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
                <pre className="mt-2 overflow-x-auto text-sm">
                  <code className="text-emerald-400">npm install ../packages/datacaptain</code>
                </pre>
                <pre className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-3 text-xs text-white/70">
{`import { DataCaptain } from "datacaptain";

const dc = new DataCaptain({ apiKey: process.env.DATACAPTAIN_KEY });
const rankings = await dc.etf.rankings({ category: "return", period: "1y" });`}
                </pre>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs font-medium uppercase tracking-widest text-white/40">Python</p>
                <pre className="mt-2 overflow-x-auto text-sm">
                  <code className="text-emerald-400">pip install -e ../packages/datacaptain-py</code>
                </pre>
                <pre className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-3 text-xs text-white/70">
{`from datacaptain import DataCaptain

dc = DataCaptain(api_key="sdata_...")
rankings = dc.etf_rankings(category="return", period="1y")`}
                </pre>
              </div>
            </div>
            <p className="mt-4 text-xs text-white/45">
              Packages live in this repo under <code className="rounded bg-white/10 px-1">packages/datacaptain</code> and{" "}
              <code className="rounded bg-white/10 px-1">packages/datacaptain-py</code>. Publish to npm/PyPI when ready.
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
