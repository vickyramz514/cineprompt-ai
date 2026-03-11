"use client";

import { useState, useCallback } from "react";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import { datacaptainFetch, getApiKey } from "@/services/datacaptain/client";
import { getDataCaptainErrorMessage } from "@/services/datacaptain/endpoints";

type EndpointDef = {
  path: string;
  method: "GET";
  params?: { key: string; label: string; placeholder: string }[];
};

const ENDPOINTS: EndpointDef[] = [
  { path: "/developer/usage", method: "GET" },
  { path: "/market/status", method: "GET" },
  {
    path: "/stocks/prices",
    method: "GET",
    params: [{ key: "symbols", label: "Symbols", placeholder: "AAPL,TSLA,NVDA" }],
  },
  { path: "/etf/list", method: "GET" },
  {
    path: "/options/:symbol",
    method: "GET",
    params: [{ key: "symbol", label: "Symbol", placeholder: "AAPL" }],
  },
  {
    path: "/insiders/:symbol",
    method: "GET",
    params: [{ key: "symbol", label: "Symbol", placeholder: "AAPL" }],
  },
  {
    path: "/sentiment/:symbol",
    method: "GET",
    params: [{ key: "symbol", label: "Symbol", placeholder: "AAPL" }],
  },
  { path: "/economy/indicators", method: "GET" },
  {
    path: "/darkpool/:symbol",
    method: "GET",
    params: [{ key: "symbol", label: "Symbol", placeholder: "AAPL" }],
  },
];

export default function ApiExplorerPage() {
  const { apiKey } = useDataCaptainKey();
  const [selectedPath, setSelectedPath] = useState(ENDPOINTS[0].path);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = ENDPOINTS.find((e) => e.path === selectedPath);

  const buildPath = useCallback(() => {
    let path = selectedPath;
    if (selected?.params) {
      for (const p of selected.params) {
        const val = paramValues[p.key]?.trim();
        if (val && path.includes(`:${p.key}`)) {
          path = path.replace(`:${p.key}`, encodeURIComponent(val));
        }
      }
    }
    return path;
  }, [selectedPath, selected, paramValues]);

  const buildParams = useCallback(() => {
    const q: Record<string, string> = {};
    if (selected?.params) {
      for (const p of selected.params) {
        const val = paramValues[p.key]?.trim();
        if (val && !selectedPath.includes(`:${p.key}`)) {
          q[p.key] = val;
        }
      }
    }
    return q;
  }, [selectedPath, selected, paramValues]);

  const sendRequest = useCallback(async () => {
    const key = apiKey ?? getApiKey();
    if (!key) {
      setError("Set your API key in the Dashboard.");
      return;
    }
    setLoading(true);
    setError(null);
    setResponse("");
    try {
      const path = buildPath();
      const params = buildParams();
      const data = await datacaptainFetch(path, key, Object.keys(params).length ? params : undefined);
      setResponse(JSON.stringify(data, null, 2));
    } catch (err: unknown) {
      setError(getDataCaptainErrorMessage(err));
      setResponse("");
    } finally {
      setLoading(false);
    }
  }, [apiKey, buildPath, buildParams]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">API Explorer</h1>
        <p className="mt-1 text-white/60">
          Try DataCaptain API endpoints with your key
        </p>
      </div>

      {!apiKey && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <p className="text-sm text-amber-300">
            Set your API key in the Dashboard to make requests.
          </p>
        </div>
      )}

      <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">Endpoint</label>
          <select
            value={selectedPath}
            onChange={(e) => {
              setSelectedPath(e.target.value);
              setParamValues({});
            }}
            className="w-full max-w-md rounded-lg border border-white/20 bg-black/30 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
          >
            {ENDPOINTS.map((e) => (
              <option key={e.path} value={e.path}>
                GET {e.path}
              </option>
            ))}
          </select>
        </div>

        {selected?.params && selected.params.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-white/70">Parameters</label>
            {selected.params.map((p) => (
              <div key={p.key}>
                <label className="block text-xs text-white/50 mb-1">{p.label}</label>
                <input
                  type="text"
                  placeholder={p.placeholder}
                  value={paramValues[p.key] ?? ""}
                  onChange={(e) =>
                    setParamValues((prev) => ({ ...prev, [p.key]: e.target.value }))
                  }
                  className="w-full max-w-md rounded-lg border border-white/20 bg-black/30 px-4 py-2 font-mono text-sm text-white placeholder:text-white/40 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            ))}
          </div>
        )}

        <button
          onClick={sendRequest}
          disabled={loading || !apiKey}
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending…" : "Send Request"}
        </button>
      </section>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {response && (
        <section className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
          <h2 className="px-6 py-4 text-lg font-semibold border-b border-white/5">
            Response
          </h2>
          <pre className="overflow-x-auto p-6 text-sm text-white/90 font-mono max-h-96 overflow-y-auto">
            {response}
          </pre>
        </section>
      )}
    </div>
  );
}
