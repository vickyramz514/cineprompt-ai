"use client";

import Link from "next/link";
import { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  API_BASE_URL,
  API_DOC_SECTIONS,
  SECTION_LABELS,
  WEBSOCKET_DOC,
  type ApiEndpoint,
} from "@/lib/api-docs-data";
import JsonHighlight from "@/components/dashboard/JsonHighlight";

const SECTION_ORDER = Object.keys(API_DOC_SECTIONS);

const SECTION_ACCENTS: Record<string, string> = {
  etf: "from-violet-500/10",
  market: "from-sky-500/10",
  platform: "from-indigo-500/10",
  developer: "from-emerald-500/10",
};

function getExamplePath(ep: ApiEndpoint): string {
  let p = ep.path;
  ep.params.forEach((param) => {
    if (param.in === "path") {
      const example = param.name === "symbol" ? "SPY" : "VALUE";
      p = p.replace(`:${param.name}`, example);
    }
  });
  return p;
}

function formatJsonExample(raw: string) {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
}

function EndpointCard({ ep, index }: { ep: ApiEndpoint; index: number }) {
  const [copied, setCopied] = useState(false);
  const examplePath = getExamplePath(ep);
  const fullUrl = `${API_BASE_URL}${examplePath}${ep.query || ""}`;
  const pathParams = ep.params.filter((p) => p.in === "path");
  const queryParams = ep.params.filter((p) => p.in === "query");

  const copyUrl = useCallback(() => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [fullUrl]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ delay: Math.min(index * 0.03, 0.2), duration: 0.35 }}
      className="overflow-hidden rounded-xl border border-white/10 bg-[#06060a]"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
            {ep.method}
          </span>
          <code className="truncate font-mono text-sm text-white/90">
            {ep.path}
            {ep.query && <span className="text-amber-300/80">{ep.query}</span>}
          </code>
        </div>
        <div className="flex items-center gap-2">
          {ep.cache && (
            <span className="rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-300/90">
              cache {ep.cache}
            </span>
          )}
          <button
            type="button"
            onClick={copyUrl}
            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/60 hover:bg-white/10 hover:text-white"
          >
            {copied ? "Copied" : "Copy URL"}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <p className="text-sm leading-relaxed text-white/55">{ep.description}</p>

        {(pathParams.length > 0 || queryParams.length > 0) && (
          <div className="grid gap-3 sm:grid-cols-2">
            {pathParams.length > 0 && (
              <ParamBlock title="Path" params={pathParams} />
            )}
            {queryParams.length > 0 && (
              <ParamBlock title="Query" params={queryParams} />
            )}
          </div>
        )}

        {ep.responseExample && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/35">Response</p>
            <pre className="mt-2 max-h-48 overflow-auto rounded-lg border border-white/5 bg-black/40 p-3 font-mono text-xs leading-relaxed">
              <JsonHighlight json={formatJsonExample(ep.responseExample)} />
            </pre>
          </div>
        )}

        <div className="rounded-lg border border-white/5 bg-black/30 px-3 py-2 font-mono text-xs text-white/50 break-all">
          <span className="text-violet-400/80">{API_BASE_URL}</span>
          <span className="text-emerald-400/90">{examplePath}</span>
          <span className="text-amber-300/70">{ep.query || ""}</span>
        </div>
      </div>
    </motion.article>
  );
}

function ParamBlock({
  title,
  params,
}: {
  title: string;
  params: ApiEndpoint["params"];
}) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-white/35">{title}</p>
      <ul className="mt-2 space-y-2">
        {params.map((p) => (
          <li key={p.name} className="text-sm">
            <div className="flex flex-wrap items-center gap-1.5">
              <code className="text-sky-300/90">{p.name}</code>
              <span className="text-[10px] text-white/40">{p.type}</span>
              {p.required && (
                <span className="rounded bg-amber-500/15 px-1 py-0.5 text-[10px] text-amber-400">required</span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-white/45">{p.desc}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ApiDocsView() {
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const totalEndpoints = useMemo(
    () => Object.values(API_DOC_SECTIONS).reduce((n, arr) => n + arr.length, 0),
    []
  );

  const filteredSections = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return API_DOC_SECTIONS;

    const out: Record<string, ApiEndpoint[]> = {};
    for (const [key, endpoints] of Object.entries(API_DOC_SECTIONS)) {
      const matched = endpoints.filter(
        (ep) =>
          ep.path.toLowerCase().includes(q) ||
          ep.description.toLowerCase().includes(q) ||
          ep.method.toLowerCase().includes(q) ||
          ep.params.some((p) => p.name.toLowerCase().includes(q))
      );
      if (matched.length) out[key] = matched;
    }
    return out;
  }, [search]);

  const sectionKeys = SECTION_ORDER.filter((k) => filteredSections[k]?.length);

  const scrollToSection = (key: string) => {
    setActiveSection(key);
    document.getElementById(`api-doc-${key}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-[#0c0c14] to-violet-500/10 p-6 sm:p-8"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative">
          <p className="text-xs font-medium uppercase tracking-widest text-indigo-300/80">DataCaptain API</p>
          <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">API Documentation</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/55 sm:text-base">
            REST endpoints for US ETF data — universe, batch prices, market status, backtesting, and developer usage.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href={`${API_BASE_URL}/api-docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open Swagger
            </a>
            <Link
              href="/dashboard/api-explorer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/85 hover:bg-white/10"
            >
              Try API Explorer
            </Link>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50">
              {totalEndpoints} endpoints
            </span>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Sidebar nav */}
        <aside className="lg:sticky lg:top-6 lg:w-56 shrink-0">
          <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-4 backdrop-blur-sm">
            <label className="sr-only" htmlFor="api-doc-search">
              Search endpoints
            </label>
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                id="api-doc-search"
                type="search"
                placeholder="Search endpoints…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/35 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <nav className="mt-4 max-h-[50vh] space-y-0.5 overflow-y-auto lg:max-h-[calc(100vh-12rem)]">
              <button
                type="button"
                onClick={() => document.getElementById("api-doc-auth")?.scrollIntoView({ behavior: "smooth" })}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/55 hover:bg-white/5 hover:text-white"
              >
                Authentication
              </button>
              {sectionKeys.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => scrollToSection(key)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    activeSection === key
                      ? "bg-indigo-500/15 text-indigo-200"
                      : "text-white/55 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {SECTION_LABELS[key] || key}
                  <span className="ml-1 text-white/30">({filteredSections[key]?.length})</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => document.getElementById("api-doc-ws")?.scrollIntoView({ behavior: "smooth" })}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/55 hover:bg-white/5 hover:text-white"
              >
                WebSocket
              </button>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1 space-y-8">
          {/* Auth */}
          <section
            id="api-doc-auth"
            className="scroll-mt-6 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/5 to-transparent p-6"
          >
            <h2 className="text-lg font-semibold">Authentication</h2>
            <p className="mt-2 text-sm text-white/55">
              Send your API key on every request. Get or regenerate a key from{" "}
              <Link href="/dashboard/api-keys" className="text-indigo-400 hover:underline">
                API Keys
              </Link>
              .
            </p>
            <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-[#06060a]">
              <div className="border-b border-white/10 px-4 py-2 text-xs text-white/40">Required header</div>
              <pre className="overflow-x-auto p-4 font-mono text-sm">
                <span className="text-sky-400">x-api-key</span>
                <span className="text-white/40">: </span>
                <span className="text-amber-200/90">YOUR_API_KEY</span>
                {"\n"}
                <span className="text-sky-400">Content-Type</span>
                <span className="text-white/40">: </span>
                <span className="text-emerald-300/90">application/json</span>
              </pre>
            </div>
            <p className="mt-3 text-xs text-white/40">Base URL: <code className="text-white/60">{API_BASE_URL}</code></p>
          </section>

          <AnimatePresence mode="popLayout">
            {sectionKeys.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm text-white/50 py-12"
              >
                No endpoints match &quot;{search}&quot;
              </motion.p>
            ) : (
              sectionKeys.map((key) => (
                <motion.section
                  key={key}
                  id={`api-doc-${key}`}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`scroll-mt-6 rounded-2xl border border-white/10 bg-gradient-to-b ${SECTION_ACCENTS[key] || "from-white/5"} to-transparent p-6`}
                >
                  <h2 className="text-lg font-semibold">{SECTION_LABELS[key] || key}</h2>
                  <p className="mt-1 text-xs text-white/40">
                    {filteredSections[key]?.length} endpoint
                    {filteredSections[key]?.length === 1 ? "" : "s"}
                  </p>
                  <div className="mt-5 space-y-4">
                    {filteredSections[key]?.map((ep, i) => (
                      <EndpointCard key={ep.path + (ep.query || "")} ep={ep} index={i} />
                    ))}
                  </div>
                </motion.section>
              ))
            )}
          </AnimatePresence>

          {/* WebSocket */}
          <section
            id="api-doc-ws"
            className="scroll-mt-6 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/10 via-[#0c0c14] to-transparent p-6"
          >
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-violet-300">
                WS
              </span>
              <h2 className="text-lg font-semibold">Real-time prices</h2>
            </div>
            <p className="mt-2 text-sm text-white/55">{WEBSOCKET_DOC.description}</p>
            <p className="mt-3 font-mono text-sm text-indigo-300">
              {API_BASE_URL.replace(/^http/, "ws")}
              {WEBSOCKET_DOC.path}
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <WsMessageBlock title="Subscribe" code={WEBSOCKET_DOC.messageFormat.subscribe} />
              <WsMessageBlock title="Unsubscribe" code={WEBSOCKET_DOC.messageFormat.unsubscribe} />
            </div>
            <div className="mt-4">
              <WsMessageBlock title="Price update" code={WEBSOCKET_DOC.messageFormat.response} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function WsMessageBlock({ title, code }: { title: string; code: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-white/35">{title}</p>
      <pre className="mt-2 overflow-x-auto rounded-lg border border-white/5 bg-black/40 p-3 font-mono text-xs">
        <JsonHighlight json={formatJsonExample(code)} />
      </pre>
    </div>
  );
}
