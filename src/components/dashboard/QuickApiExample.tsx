"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useState } from "react";
import { getPublicApiOrigin } from "@/lib/public-env";
import JsonHighlight from "@/components/dashboard/JsonHighlight";

const EXAMPLE_RESPONSE = {
  symbol: "AAPL",
  date: "2024-03-01",
  open: 182.2,
  high: 185.1,
  low: 180.5,
  close: 184.7,
  volume: 120000000,
};

const API_PATH = "/api/stocks/history?symbol=AAPL";

type TabId = "request" | "response" | "curl";

type QuickApiExampleProps = {
  apiKey?: string | null;
};

function maskKey(key: string | null | undefined) {
  if (!key || key.length < 16) return "YOUR_API_KEY";
  return `${key.slice(0, 12)}••••••••${key.slice(-4)}`;
}

function CopyBtn({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      type="button"
      onClick={onCopy}
      className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white"
    >
      {copied ? "Copied" : label}
    </button>
  );
}

function LineNumbers({ lines }: { lines: number }) {
  return (
    <div
      className="select-none border-r border-white/5 bg-black/20 px-3 py-4 text-right font-mono text-xs text-white/25"
      aria-hidden
    >
      {Array.from({ length: lines }, (_, i) => (
        <div key={i}>{i + 1}</div>
      ))}
    </div>
  );
}

export default function QuickApiExample({ apiKey }: QuickApiExampleProps) {
  const [tab, setTab] = useState<TabId>("request");
  const baseUrl = getPublicApiOrigin();
  const fullUrl = `${baseUrl}${API_PATH}`;
  const keyDisplay = maskKey(apiKey);
  const headerLine = `x-api-key: ${keyDisplay}`;
  const responseJson = JSON.stringify(EXAMPLE_RESPONSE, null, 2);
  const curlExample = `curl -X GET "${fullUrl}" \\
  -H "x-api-key: ${keyDisplay}" \\
  -H "Content-Type: application/json"`;

  const tabs: { id: TabId; label: string }[] = [
    { id: "request", label: "Request" },
    { id: "response", label: "Response" },
    { id: "curl", label: "cURL" },
  ];

  return (
    <motion.section
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/5 via-[#0c0c14] to-indigo-500/10 shadow-[0_0_50px_-20px_rgba(52,211,153,0.2)]"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45 }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative border-b border-white/10 px-6 py-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-emerald-400/80">
              Developer
            </p>
            <h2 className="mt-0.5 text-lg font-semibold text-white">Quick API Example</h2>
            <p className="mt-1 text-sm text-white/50">
              Copy-paste ready snippets for stock history
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard/api-explorer"
              className="rounded-xl border border-indigo-500/30 bg-indigo-500/15 px-4 py-2 text-sm font-medium text-indigo-200 transition-colors hover:bg-indigo-500/25"
            >
              Try in Explorer
            </Link>
            <Link
              href="/dashboard/api-docs"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10"
            >
              Full docs →
            </Link>
          </div>
        </div>
      </div>

      <div className="relative p-4 sm:p-6">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#06060a] shadow-inner">
          {/* Terminal chrome */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-xs text-white/40">datacaptain — api</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-emerald-400">
                GET
              </span>
              <span className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/50">
                200 OK
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-white/10 bg-black/40 px-2 pt-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`relative rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
                  tab === t.id ? "text-white" : "text-white/45 hover:text-white/70"
                }`}
              >
                {tab === t.id && (
                  <motion.span
                    layoutId="api-example-tab"
                    className="absolute inset-0 rounded-t-lg border border-b-0 border-white/10 bg-white/[0.06]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === "request" && (
              <motion.div
                key="request"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
                className="grid lg:grid-cols-2"
              >
                <div className="border-b border-white/5 lg:border-b-0 lg:border-r">
                  <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-white/40">
                      Endpoint
                    </span>
                    <CopyBtn text={fullUrl} />
                  </div>
                  <div className="flex">
                    <LineNumbers lines={1} />
                    <pre className="flex-1 overflow-x-auto p-4 font-mono text-sm leading-relaxed">
                      <span className="text-violet-400">GET</span>{" "}
                      <span className="text-emerald-400">/api/stocks/history</span>
                      <span className="text-amber-300/90">?symbol=AAPL</span>
                    </pre>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-white/40">
                      Headers
                    </span>
                    <CopyBtn text={headerLine} />
                  </div>
                  <div className="flex">
                    <LineNumbers lines={2} />
                    <pre className="flex-1 overflow-x-auto p-4 font-mono text-sm leading-relaxed text-white/80">
                      <span className="text-sky-400">x-api-key</span>
                      <span className="text-white/40">: </span>
                      <span className="text-amber-200/90">{keyDisplay}</span>
                      {"\n"}
                      <span className="text-sky-400">Content-Type</span>
                      <span className="text-white/40">: </span>
                      <span className="text-emerald-300/90">application/json</span>
                    </pre>
                  </div>
                </div>
              </motion.div>
            )}

            {tab === "response" && (
              <motion.div
                key="response"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-white/40">
                    JSON body
                  </span>
                  <CopyBtn text={responseJson} />
                </div>
                <div className="flex max-h-64">
                  <LineNumbers lines={responseJson.split("\n").length} />
                  <pre className="flex-1 overflow-auto p-4 font-mono text-sm leading-relaxed">
                    <JsonHighlight json={responseJson} />
                  </pre>
                </div>
              </motion.div>
            )}

            {tab === "curl" && (
              <motion.div
                key="curl"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-white/40">
                    Terminal
                  </span>
                  <CopyBtn text={curlExample} label="Copy cURL" />
                </div>
                <div className="flex">
                  <LineNumbers lines={curlExample.split("\n").length} />
                  <pre className="flex-1 overflow-x-auto p-4 font-mono text-sm leading-relaxed text-white/75">
                    <span className="text-violet-400">curl</span>
                    <span className="text-white/50"> -X </span>
                    <span className="text-emerald-400">GET</span>
                    <span className="text-white/50"> &quot;</span>
                    <span className="text-amber-200/90">{fullUrl}</span>
                    <span className="text-white/50">&quot; \</span>
                    {"\n  "}
                    <span className="text-white/50">-H &quot;</span>
                    <span className="text-sky-400">x-api-key</span>
                    <span className="text-white/50">: </span>
                    <span className="text-amber-200/90">{keyDisplay}</span>
                    <span className="text-white/50">&quot; \</span>
                    {"\n  "}
                    <span className="text-white/50">-H &quot;</span>
                    <span className="text-sky-400">Content-Type</span>
                    <span className="text-white/50">: application/json&quot;</span>
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/40">
          <span className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Replace symbol query param for other tickers
          </span>
          <span className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            Requires valid <code className="text-white/60">x-api-key</code>
          </span>
        </div>
      </div>
    </motion.section>
  );
}

