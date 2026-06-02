"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useApiKey } from "@/hooks/useApiKey";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import * as apiKeyService from "@/services/api-key.service";
import { isValidApiKey } from "@/services/datacaptain/apiKeyValidation";
import { getPublicApiOrigin } from "@/lib/public-env";

const QUICK_LINKS = [
  { href: "/dashboard/api-docs", label: "API documentation", desc: "Endpoints & examples" },
  { href: "/dashboard/api-explorer", label: "API Explorer", desc: "Try requests live" },
  { href: "/dashboard/usage", label: "Usage", desc: "Quota & limits" },
];

function KeyIcon({ active }: { active: boolean }) {
  return (
    <div className="relative shrink-0">
      {active && (
        <motion.span
          className="absolute -inset-1 rounded-2xl bg-indigo-500/40 blur-md"
          animate={{ opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      )}
      <div
        className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border ${
          active
            ? "border-indigo-500/40 bg-indigo-500/20 text-indigo-300"
            : "border-white/10 bg-white/5 text-white/40"
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499a1.875 1.875 0 0 1 1.591-.659H9.75V6.75a3 3 0 0 1 3-3h3Z"
          />
        </svg>
      </div>
    </div>
  );
}

function maskKey(key: string, revealed: boolean) {
  if (revealed) return key;
  if (key.endsWith("...")) return key;
  if (key.length < 20) return key;
  return `${key.slice(0, 12)}${"•".repeat(12)}${key.slice(-4)}`;
}

export default function ApiKeysView() {
  const { apiKey, isLoading, error, refetch } = useApiKey();
  const { saveKey } = useDataCaptainKey();
  const [copied, setCopied] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [regenerateError, setRegenerateError] = useState<string | null>(null);
  const [regenerateSuccess, setRegenerateSuccess] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [pasteInput, setPasteInput] = useState("");
  const [pasteError, setPasteError] = useState<string | null>(null);
  const [pasteSuccess, setPasteSuccess] = useState(false);

  const rawKey = apiKey?.key ?? "";
  const isMaskedKey = rawKey.endsWith("...");
  const hasFullKey = Boolean(rawKey && !isMaskedKey && isValidApiKey(rawKey));
  const isActive = hasFullKey || Boolean(rawKey && !isMaskedKey);

  const handleCopy = useCallback(() => {
    if (!rawKey || isMaskedKey) return;
    navigator.clipboard.writeText(rawKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [rawKey, isMaskedKey]);

  const handleRegenerate = useCallback(async () => {
    if (!confirm("Regenerate your API key? Your old key will stop working immediately.")) return;
    setRegenerating(true);
    setRegenerateError(null);
    setRegenerateSuccess(false);
    try {
      const data = await apiKeyService.regenerateApiKey();
      if (data.key && !data.key.endsWith("...") && isValidApiKey(data.key)) {
        saveKey(data.key);
        setRevealed(true);
      }
      setRegenerateSuccess(true);
      setTimeout(() => setRegenerateSuccess(false), 6000);
      refetch();
    } catch (err) {
      setRegenerateError(apiKeyService.getErrorMessage(err));
    } finally {
      setRegenerating(false);
    }
  }, [refetch, saveKey]);

  const handlePasteSave = () => {
    const trimmed = pasteInput.trim();
    if (!trimmed) return;
    if (!isValidApiKey(trimmed)) {
      setPasteError("Invalid format. Key must be sdata_ followed by 48 hex characters.");
      return;
    }
    setPasteError(null);
    saveKey(trimmed);
    setPasteInput("");
    setPasteSuccess(true);
    setTimeout(() => setPasteSuccess(false), 3000);
  };

  const baseUrl = getPublicApiOrigin();
  const curlExample = `curl "${baseUrl}/api/developer/usage" \\
  -H "x-api-key: ${hasFullKey && revealed ? rawKey : "YOUR_API_KEY"}"`;

  const copyCurl = () => {
    navigator.clipboard.writeText(
      `curl "${baseUrl}/api/developer/usage" -H "x-api-key: ${hasFullKey ? rawKey : "YOUR_API_KEY"}"`
    );
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  if (isLoading && !apiKey) {
    return (
      <div className="space-y-8">
        <div className="h-24 animate-pulse rounded-2xl bg-white/5" />
        <div className="h-56 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-medium uppercase tracking-widest text-indigo-300/80">Developer</p>
        <h1 className="mt-0.5 text-2xl font-semibold sm:text-3xl">API Keys</h1>
        <p className="mt-1 max-w-xl text-sm text-white/50">
          Authenticate Stock Market Data API requests with your secret key
        </p>
      </motion.div>

      <AnimatePresence>
        {regenerateSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3"
          >
            <p className="text-sm text-emerald-200">
              New API key generated — copy it now. It may not be shown again in full.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {regenerateError && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {regenerateError}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,280px)]">
        <div className="space-y-6">
          {isMaskedKey && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3"
            >
              <span className="text-amber-400">⚠</span>
              <p className="text-sm text-amber-200/90">
                Only a masked key is stored. Regenerate to get a full working key, then copy it immediately.
              </p>
            </motion.div>
          )}

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-500/15 via-[#0c0c14] to-amber-500/5 p-6 shadow-[0_0_50px_-16px_rgba(99,102,241,0.35)]"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-25"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            <div className="relative flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <KeyIcon active={!!isActive} />
                <div>
                  <h2 className="text-lg font-semibold text-white">Your API key</h2>
                  <p className="mt-1 text-sm text-white/45">
                    Send as <code className="rounded bg-white/10 px-1 text-indigo-200/90">x-api-key</code> on every request
                  </p>
                </div>
              </div>
              {isActive && (
                <span className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                    <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  Active
                </span>
              )}
            </div>

            <div className="relative mt-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                <div className="relative min-w-0 flex-1 overflow-hidden rounded-xl border border-white/10 bg-black/50">
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-indigo-500 to-emerald-500" />
                  <code className="block break-all px-4 py-4 pl-5 font-mono text-sm text-white/90">
                    {rawKey ? maskKey(rawKey, revealed && hasFullKey) : "No key — regenerate to create one"}
                  </code>
                </div>
                <div className="flex flex-wrap gap-2 sm:flex-col sm:justify-center">
                  {hasFullKey && (
                    <button
                      type="button"
                      onClick={() => setRevealed((r) => !r)}
                      className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10"
                    >
                      {revealed ? "Hide" : "Reveal"}
                    </button>
                  )}
                  <motion.button
                    type="button"
                    onClick={handleCopy}
                    disabled={!hasFullKey}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-xl border border-indigo-500/30 bg-indigo-500/15 px-4 py-2.5 text-sm font-medium text-indigo-200 hover:bg-indigo-500/25 disabled:opacity-50"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleRegenerate}
                    disabled={regenerating}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-xl border border-amber-500/35 bg-amber-500/15 px-4 py-2.5 text-sm font-medium text-amber-200 hover:bg-amber-500/25 disabled:opacity-50"
                  >
                    {regenerating ? "Working…" : rawKey ? "Regenerate" : "Generate key"}
                  </motion.button>
                </div>
              </div>

              {apiKey?.createdAt && (
                <dl className="mt-5 flex flex-wrap gap-6 border-t border-white/10 pt-4 text-sm">
                  {apiKey.prefix && (
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-white/35">Prefix</dt>
                      <dd className="mt-0.5 font-mono text-white/70">{apiKey.prefix}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-white/35">Created</dt>
                    <dd className="mt-0.5 text-white/70">
                      {new Date(apiKey.createdAt).toLocaleString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-white/35">Format</dt>
                    <dd className="mt-0.5 font-mono text-white/50">sdata_[48 hex]</dd>
                  </div>
                </dl>
              )}
            </div>
          </motion.section>

          <section className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-6">
            <h2 className="text-lg font-semibold">Example request</h2>
            <p className="mt-1 text-sm text-white/45">Test your key against the usage endpoint</p>
            <pre className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs leading-relaxed text-white/80">
              {curlExample}
            </pre>
            <button
              type="button"
              onClick={copyCurl}
              className="mt-3 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/60 hover:bg-white/10"
            >
              {copiedCurl ? "Copied!" : "Copy cURL"}
            </button>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-6">
            <h2 className="text-lg font-semibold">Sync browser storage</h2>
            <p className="mt-1 text-sm text-white/45">
              Paste a full key here to use dashboard tools (prices, ETFs, economy) in this browser
            </p>
            <AnimatePresence>
              {pasteSuccess && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 text-sm text-emerald-400"
                >
                  Key saved for this browser
                </motion.p>
              )}
            </AnimatePresence>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="password"
                placeholder="sdata_..."
                value={pasteInput}
                onChange={(e) => {
                  setPasteInput(e.target.value);
                  setPasteError(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && handlePasteSave()}
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-sm text-white placeholder:text-white/35 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <motion.button
                type="button"
                onClick={handlePasteSave}
                whileTap={{ scale: 0.98 }}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                Save locally
              </motion.button>
            </div>
            {pasteError && <p className="mt-2 text-sm text-red-400">{pasteError}</p>}
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <p className="text-xs font-medium uppercase tracking-widest text-amber-300/80">Security</p>
            <ul className="mt-3 space-y-2.5 text-sm text-amber-200/75">
              <li className="flex gap-2">
                <span className="text-amber-400">•</span>
                Never commit keys to Git or share in public channels
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400">•</span>
                Regenerate immediately if a key is exposed
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400">•</span>
                Use server-side calls in production apps
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-4">
            <p className="text-xs font-medium uppercase tracking-widest text-white/35">Shortcuts</p>
            <ul className="mt-3 space-y-1">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-white/5"
                  >
                    <span className="text-white/80">{link.label}</span>
                    <span className="text-xs text-white/35">{link.desc} →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5">
            <p className="text-xs font-medium uppercase tracking-widest text-indigo-300/70">Header</p>
            <pre className="mt-2 overflow-x-auto font-mono text-xs text-emerald-400/90">
              {`x-api-key: ${hasFullKey && revealed ? rawKey : "sdata_••••"}`}
            </pre>
          </div>
        </aside>
      </div>
    </div>
  );
}
