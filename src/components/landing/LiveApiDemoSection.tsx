"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getPublicApiBaseUrl, getPublicApiOrigin } from "@/lib/public-env";

type DemoPayload = {
  market?: { status?: string; session?: string; asOf?: string };
  sample?: { symbol?: string; date?: string; close?: number; volume?: number } | null;
  coverage?: { etfCount?: number | null; demoSymbol?: string };
  nextSteps?: { example?: string; header?: string };
};

export default function LiveApiDemoSection() {
  const origin = getPublicApiOrigin();
  const curl = `curl -s ${origin}/v1/public/demo | jq .`;
  const [data, setData] = useState<DemoPayload | null>(null);
  const [raw, setRaw] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const runDemo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${getPublicApiBaseUrl()}/public/demo`);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error?.message || `HTTP ${res.status}`);
      }
      const payload = (json.data ?? json) as DemoPayload;
      setData(payload);
      setRaw(JSON.stringify(json, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Demo request failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const copyCurl = async () => {
    try {
      await navigator.clipboard.writeText(curl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <section
      id="try-api"
      className="scroll-mt-28 border-t border-white/5 px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-medium uppercase tracking-wider text-emerald-400/90">
            Try in 60 seconds
          </p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
            Hit a real endpoint — no API key
          </h2>
          <p className="mt-3 text-white/55">
            <code className="text-emerald-300/90">GET /v1/public/demo</code> returns live market
            session status and a sample SPY bar. Sign up for a free key to call screener, heatmap,
            and the rest of the API.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-medium uppercase tracking-wider text-white/40">Terminal</p>
              <button
                type="button"
                onClick={copyCurl}
                className="text-xs text-indigo-300 hover:underline"
              >
                {copied ? "Copied" : "Copy curl"}
              </button>
            </div>
            <pre className="mt-3 overflow-x-auto rounded-xl bg-black/50 p-4 text-xs leading-relaxed text-emerald-300/95 sm:text-sm">
              <code>{curl}</code>
            </pre>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={runDemo}
                disabled={loading}
                className="inline-flex rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black hover:bg-emerald-400 disabled:opacity-60"
              >
                {loading ? "Calling…" : "Run live request"}
              </button>
              <Link
                href="/auth/signup"
                className="inline-flex rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/5"
              >
                Get free API key
              </Link>
            </div>
            {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0c0c14] p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-white/40">Response</p>
            {data ? (
              <div className="mt-3 space-y-3 text-sm">
                <p className="text-white/70">
                  Market:{" "}
                  <span className="font-semibold text-emerald-300">
                    {data.market?.status ?? "—"}
                  </span>
                  {data.market?.session ? (
                    <span className="text-white/40"> · {data.market.session}</span>
                  ) : null}
                </p>
                {data.sample ? (
                  <p className="text-white/70">
                    Sample {data.sample.symbol}: close{" "}
                    <span className="font-semibold text-white">
                      {data.sample.close?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </span>{" "}
                    <span className="text-white/40">on {data.sample.date}</span>
                  </p>
                ) : (
                  <p className="text-white/45">No sample bar loaded yet — status still works.</p>
                )}
                {data.coverage?.etfCount != null ? (
                  <p className="text-white/45">
                    Catalog: {data.coverage.etfCount.toLocaleString()} ETFs
                  </p>
                ) : null}
                <pre className="max-h-56 overflow-auto rounded-xl border border-white/5 bg-black/40 p-3 text-[11px] text-white/55">
                  {raw.slice(0, 1200)}
                  {raw.length > 1200 ? "\n…" : ""}
                </pre>
              </div>
            ) : (
              <p className="mt-6 text-sm text-white/45">
                Click <strong className="text-white/70">Run live request</strong> to fetch JSON from
                the production API (rate-limited).
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
