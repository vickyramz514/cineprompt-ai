"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useState } from "react";
import { isValidApiKey } from "@/services/datacaptain/apiKeyValidation";

type ApiKeySectionProps = {
  apiKey: string | null;
  onSaveKey: (key: string) => void;
};

function KeyIcon({ active }: { active: boolean }) {
  return (
    <div className="relative">
      {active && (
        <motion.span
          className="absolute inset-0 rounded-2xl bg-indigo-500/30"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.15, 0.4] }}
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

export default function ApiKeySection({ apiKey, onSaveKey }: ApiKeySectionProps) {
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [keyError, setKeyError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const displayKey = apiKey
    ? revealed
      ? apiKey
      : `${apiKey.slice(0, 12)}${"•".repeat(8)}${apiKey.slice(-4)}`
    : "";

  const handleCopy = useCallback(() => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [apiKey]);

  const handleSaveKey = () => {
    const trimmed = apiKeyInput.trim();
    if (!trimmed) return;
    if (!isValidApiKey(trimmed)) {
      setKeyError("Invalid format. Use a full key from API Keys (starts with sdata_).");
      return;
    }
    setKeyError(null);
    onSaveKey(trimmed);
    setApiKeyInput("");
  };

  return (
    <motion.section
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-[#0c0c14] to-amber-500/5 p-6 shadow-[0_0_50px_-16px_rgba(99,102,241,0.35)]"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <KeyIcon active={!!apiKey} />
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-indigo-300/80">
              Authentication
            </p>
            <h2 className="mt-0.5 text-lg font-semibold text-white">API Key</h2>
            <p className="mt-1 max-w-md text-sm text-white/50">
              {apiKey
                ? "Your key is active. Include it in the x-api-key header for every request."
                : "Connect your DataCaptain key to unlock usage stats and market data."}
            </p>
          </div>
        </div>
        {apiKey && (
          <motion.span
            className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Active
          </motion.span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {apiKey ? (
          <motion.div
            key="has-key"
            className="relative mt-6 space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative min-w-0 flex-1 overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm">
                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-indigo-500 to-emerald-500" />
                <code className="block px-4 py-3.5 pl-5 font-mono text-sm text-white/90 break-all">
                  {displayKey}
                </code>
                <motion.div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                />
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setRevealed((r) => !r)}
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {revealed ? "Hide" : "Reveal"}
                </button>
                <motion.button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-xl border border-indigo-500/30 bg-indigo-500/15 px-4 py-2.5 text-sm font-medium text-indigo-200 transition-colors hover:bg-indigo-500/25"
                  whileTap={{ scale: 0.97 }}
                >
                  {copied ? "Copied!" : "Copy"}
                </motion.button>
                <Link
                  href="/dashboard/api-keys"
                  className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm font-medium text-amber-300 transition-colors hover:bg-amber-500/20"
                >
                  Manage
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/30 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-white/40">Example header</p>
              <pre className="mt-2 overflow-x-auto font-mono text-sm text-emerald-400/90">
                x-api-key: {revealed ? apiKey : `${apiKey.slice(0, 12)}••••••••${apiKey.slice(-4)}`}
              </pre>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="no-key"
            className="relative mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="rounded-xl border border-dashed border-white/15 bg-black/20 p-6 text-center sm:text-left">
              <p className="text-sm text-white/60">
                Sign in and generate a key, or paste an existing one below.
              </p>
              <Link
                href="/dashboard/api-keys"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition-colors hover:bg-indigo-500"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                  <path d="M10 3a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 0 1 0-2h5V4a1 1 0 0 1 1-1z" />
                </svg>
                Get API Key
              </Link>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="password"
                placeholder="Or paste key (sdata_...)"
                value={apiKeyInput}
                onChange={(e) => {
                  setApiKeyInput(e.target.value);
                  setKeyError(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSaveKey()}
                className="min-w-0 flex-1 rounded-xl border border-white/15 bg-black/40 px-4 py-3 font-mono text-sm text-white placeholder:text-white/35 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <motion.button
                type="button"
                onClick={handleSaveKey}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-500/20"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Save Key
              </motion.button>
            </div>
            {keyError && (
              <p className="mt-2 text-sm text-red-400">{keyError}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative mt-5 flex items-start gap-2 rounded-lg border border-amber-500/15 bg-amber-500/5 px-3 py-2.5">
        <svg
          viewBox="0 0 20 20"
          className="mt-0.5 h-4 w-4 shrink-0 text-amber-400/90"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 0 0-.75.75v3.5a.75.75 0 0 0 1.5 0v-3.5A.75.75 0 0 0 10 6zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-sm text-amber-200/80">
          Keep your API key secret. Never commit it to public repos or expose it in client-side code.
        </p>
      </div>
    </motion.section>
  );
}
