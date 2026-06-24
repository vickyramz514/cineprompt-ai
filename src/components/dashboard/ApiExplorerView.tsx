"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import { datacaptainFetch, getApiKey } from "@/services/datacaptain/client";
import { getDataCaptainErrorMessage } from "@/services/datacaptain/endpoints";
import { getPublicApiOrigin } from "@/lib/public-env";
import JsonHighlight from "@/components/dashboard/JsonHighlight";
import { usePlanAccess } from "@/hooks/usePlanAccess";
import { isApiPathFree } from "@/lib/plan-access";

type EndpointDef = {
  path: string;
  method: "GET";
  label: string;
  description: string;
  category: string;
  premium?: boolean;
  params?: { key: string; label: string; placeholder: string }[];
};

const ENDPOINTS: EndpointDef[] = [
  {
    path: "/developer/usage",
    method: "GET",
    label: "Usage",
    description: "Plan, daily limit, requests remaining",
    category: "Developer",
  },
  {
    path: "/market/status",
    method: "GET",
    label: "Market status",
    description: "Open/closed and session times",
    category: "Market",
  },
  {
    path: "/stocks/prices",
    method: "GET",
    label: "Batch ETF prices",
    description: "Latest prices for comma-separated ETF tickers",
    category: "ETF",
    params: [{ key: "symbols", label: "Symbols", placeholder: "SPY,QQQ,VOO" }],
  },
  {
    path: "/etf/list",
    method: "GET",
    label: "ETF list",
    description: "Paginated ETF universe from database",
    category: "ETF",
    params: [
      { key: "limit", label: "Limit", placeholder: "100" },
      { key: "search", label: "Search", placeholder: "SPY" },
    ],
  },
  {
    path: "/etf/:symbol",
    method: "GET",
    label: "ETF details",
    description: "Symbol, name, latest price, exchange",
    category: "ETF",
    premium: true,
    params: [{ key: "symbol", label: "Symbol", placeholder: "SPY" }],
  },
  {
    path: "/backtest/buy-and-hold",
    method: "GET",
    label: "Backtest buy & hold",
    description: "Total return, drawdown, risk score, equity curve",
    category: "Platform",
    premium: true,
    params: [
      { key: "symbol", label: "Symbol", placeholder: "SPY" },
      { key: "investment", label: "Investment", placeholder: "10000" },
      { key: "startDate", label: "Start", placeholder: "2015-01-01" },
      { key: "endDate", label: "End", placeholder: "2025-01-01" },
    ],
  },
  {
    path: "/backtest/compare",
    method: "GET",
    label: "Compare ETFs",
    description: "VOO vs SPY vs QQQ — ranked results",
    category: "Platform",
    premium: true,
    params: [
      { key: "symbols", label: "Symbols", placeholder: "VOO,SPY,QQQ" },
      { key: "investment", label: "Investment", placeholder: "10000" },
      { key: "startDate", label: "Start", placeholder: "2015-01-01" },
      { key: "endDate", label: "End", placeholder: "2025-01-01" },
    ],
  },
];

const CATEGORIES = [...new Set(ENDPOINTS.map((e) => e.category))];

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 font-mono text-sm text-white placeholder:text-white/35 focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20";

function maskKey(key: string | null | undefined) {
  if (!key || key.length < 16) return "YOUR_API_KEY";
  if (key.endsWith("...")) return key;
  return `${key.slice(0, 12)}••••••••${key.slice(-4)}`;
}

export default function ApiExplorerView() {
  const { apiKey } = useDataCaptainKey();
  const { isFree, canCallApiPath, displayName } = usePlanAccess();
  const [selectedPath, setSelectedPath] = useState(ENDPOINTS[0].path);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastMs, setLastMs] = useState<number | null>(null);
  const [copied, setCopied] = useState<"response" | "curl" | null>(null);

  const selected = ENDPOINTS.find((e) => e.path === selectedPath) ?? ENDPOINTS[0];
  const baseUrl = getPublicApiOrigin();

  const buildPath = useCallback(() => {
    let path = selectedPath;
    if (selected.params) {
      for (const p of selected.params) {
        const val = paramValues[p.key]?.trim();
        if (val && path.includes(`:${p.key}`)) {
          path = path.replace(`:${p.key}`, encodeURIComponent(val));
        }
      }
    }
    return path;
  }, [selectedPath, selected, paramValues]);

  const buildQueryParams = useCallback(() => {
    const q: Record<string, string> = {};
    if (selected.params) {
      for (const p of selected.params) {
        const val = paramValues[p.key]?.trim();
        if (val && !selectedPath.includes(`:${p.key}`)) {
          q[p.key] = val;
        }
      }
    }
    return q;
  }, [selectedPath, selected, paramValues]);

  const fullUrl = useMemo(() => {
    const path = buildPath();
    const q = buildQueryParams();
    const qs = new URLSearchParams(q).toString();
    return `${baseUrl}/api${path}${qs ? `?${qs}` : ""}`;
  }, [baseUrl, buildPath, buildQueryParams]);

  const curlCommand = useMemo(() => {
    const key = apiKey ?? getApiKey() ?? "YOUR_API_KEY";
    return `curl -X GET "${fullUrl}" \\\n  -H "x-api-key: ${maskKey(key)}" \\\n  -H "Content-Type: application/json"`;
  }, [fullUrl, apiKey]);

  const selectedLocked = isFree && !canCallApiPath(selectedPath);

  const sendRequest = useCallback(async () => {
    const key = apiKey ?? getApiKey();
    if (!key) {
      setError("Set your API key in API Keys to make requests.");
      return;
    }
    if (isFree && !canCallApiPath(buildPath())) {
      setError("This endpoint requires a paid plan. Upgrade in Billing to continue.");
      return;
    }
    setLoading(true);
    setError(null);
    setResponse("");
    setLastMs(null);
    const start = performance.now();
    try {
      const path = buildPath();
      const params = buildQueryParams();
      const data = await datacaptainFetch(path, key, Object.keys(params).length ? params : undefined);
      setResponse(JSON.stringify(data, null, 2));
      setLastMs(Math.round(performance.now() - start));
    } catch (err: unknown) {
      setError(getDataCaptainErrorMessage(err));
      setLastMs(Math.round(performance.now() - start));
    } finally {
      setLoading(false);
    }
  }, [apiKey, buildPath, buildQueryParams, isFree, canCallApiPath]);

  const copyText = (text: string, kind: "response" | "curl") => {
    navigator.clipboard.writeText(text);
    setCopied(kind);
    setTimeout(() => setCopied(null), 2000);
  };

  const selectEndpoint = (path: string) => {
    setSelectedPath(path);
    setParamValues({});
    setError(null);
    setResponse("");
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-sky-300/80">Developer</p>
          <h1 className="mt-0.5 text-2xl font-semibold sm:text-3xl">API Explorer</h1>
          <p className="mt-1 max-w-xl text-sm text-white/50">
            Send live GET requests to DataCaptain endpoints with your API key
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/api-keys"
            className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-2.5 text-sm font-medium text-sky-200 hover:bg-sky-500/20"
          >
            API Keys
          </Link>
          <Link
            href="/dashboard/api-docs"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10"
          >
            Full docs
          </Link>
        </div>
      </motion.div>

      {isFree && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-500/25 bg-indigo-500/10 px-4 py-3">
          <p className="text-sm text-indigo-200/90">
            <span className="font-medium capitalize">{displayName}</span> plan — free tier includes usage, market
            status, batch prices, and ETF list only.
          </p>
          <Link href="/dashboard/wallet" className="text-sm font-medium text-indigo-300 hover:underline">
            Upgrade →
          </Link>
        </div>
      )}

      {!apiKey && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
          <p className="text-sm text-amber-200/90">No API key in this browser — requests will fail until you set one.</p>
          <Link href="/dashboard/api-keys" className="text-sm font-medium text-amber-300 hover:underline">
            Set API key →
          </Link>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,260px)_1fr]">
        {/* Endpoint sidebar */}
        <aside className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-4 lg:sticky lg:top-6 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
          <p className="px-2 text-xs font-medium uppercase tracking-widest text-white/35">Endpoints</p>
          <nav className="mt-3 space-y-4">
            {CATEGORIES.map((cat) => (
              <div key={cat}>
                <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-white/30">
                  {cat}
                </p>
                <ul className="space-y-0.5">
                  {ENDPOINTS.filter((e) => e.category === cat).map((ep) => {
                    const epLocked = isFree && (ep.premium ?? !isApiPathFree(ep.path));
                    return (
                    <li key={ep.path}>
                      <button
                        type="button"
                        onClick={() => selectEndpoint(ep.path)}
                        className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                          selectedPath === ep.path
                            ? "bg-sky-500/20 text-sky-200"
                            : epLocked
                              ? "text-white/40 hover:bg-white/5"
                              : "text-white/60 hover:bg-white/5 hover:text-white/85"
                        }`}
                      >
                        <span className="flex items-center justify-between gap-1 font-medium">
                          {ep.label}
                          {epLocked && (
                            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 shrink-0 text-amber-400/90" aria-hidden>
                              <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-2.45 8.26v2.07a1 1 0 0 0 .55.9l3.5 1.75a1 1 0 0 0 .9 0l3.5-1.75a1 1 0 0 0 .55-.9v-2.07A4.5 4.5 0 0 0 10 1Z" clipRule="evenodd" />
                            </svg>
                          )}
                        </span>
                        <span className="mt-0.5 block font-mono text-[10px] text-white/35 truncate">
                          GET {ep.path}
                        </span>
                      </button>
                    </li>
                  );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Request + response */}
        <div className="space-y-4">
          <motion.section
            key={selectedPath}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#06060a] shadow-[0_0_40px_-20px_rgba(56,189,248,0.15)]"
          >
            {/* Terminal chrome */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-xs text-white/40">datacaptain — explorer</span>
              </div>
              <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-emerald-400">
                GET
              </span>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div>
                <h2 className="text-lg font-semibold text-white">{selected.label}</h2>
                <p className="mt-1 text-sm text-white/45">{selected.description}</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                <p className="text-[10px] font-medium uppercase tracking-wider text-white/35">Request URL</p>
                <code className="mt-2 block break-all font-mono text-xs leading-relaxed text-sky-300/90">
                  {fullUrl}
                </code>
                <p className="mt-2 font-mono text-[10px] text-white/35">
                  x-api-key: {maskKey(apiKey ?? getApiKey())}
                </p>
              </div>

              {selected.params && selected.params.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {selected.params.map((p) => (
                    <div key={p.key}>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/40">
                        {p.label}
                      </label>
                      <input
                        type="text"
                        placeholder={p.placeholder}
                        value={paramValues[p.key] ?? ""}
                        onChange={(e) =>
                          setParamValues((prev) => ({ ...prev, [p.key]: e.target.value }))
                        }
                        onKeyDown={(e) => e.key === "Enter" && sendRequest()}
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              )}

              {selectedLocked && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
                  <p className="text-sm text-amber-200/90">This endpoint is not on the Free plan.</p>
                  <Link href="/dashboard/wallet" className="text-sm font-medium text-amber-300 hover:underline">
                    Upgrade in Billing
                  </Link>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <motion.button
                  type="button"
                  onClick={sendRequest}
                  disabled={loading || selectedLocked}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:from-sky-500 hover:to-indigo-500 disabled:opacity-50"
                >
                  {loading ? "Sending…" : selectedLocked ? "Upgrade to send" : "Send request"}
                </motion.button>
                <button
                  type="button"
                  onClick={() => copyText(curlCommand, "curl")}
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white/60 hover:bg-white/10"
                >
                  {copied === "curl" ? "Copied!" : "Copy cURL"}
                </button>
              </div>
            </div>
          </motion.section>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-red-400/80">Error</p>
              <p className="mt-1 text-sm text-red-300">{error}</p>
              {lastMs != null && (
                <p className="mt-2 text-xs text-white/35">{lastMs} ms</p>
              )}
            </motion.div>
          )}

          <AnimatePresence>
            {response && (
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="overflow-hidden rounded-2xl border border-emerald-500/20 bg-[#06060a]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-emerald-500/5 px-5 py-3">
                  <div className="flex items-center gap-3">
                    <h2 className="text-sm font-semibold text-white">Response</h2>
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                      200 OK
                    </span>
                    {lastMs != null && (
                      <span className="text-xs text-white/35 tabular-nums">{lastMs} ms</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => copyText(response, "response")}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60 hover:bg-white/10"
                  >
                    {copied === "response" ? "Copied!" : "Copy JSON"}
                  </button>
                </div>
                <div className="max-h-[min(28rem,50vh)] overflow-auto p-5 font-mono text-xs leading-relaxed">
                  <JsonHighlight json={response} />
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {!response && !error && !loading && (
            <div className="rounded-xl border border-dashed border-white/10 bg-black/20 px-6 py-10 text-center">
              <p className="text-sm text-white/45">Run a request to see the JSON response here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
