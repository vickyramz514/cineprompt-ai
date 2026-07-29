"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { isValidApiKey } from "@/services/datacaptain/apiKeyValidation";

export default function CompactApiKeyCard({
  apiKey,
  onSaveKey,
}: {
  apiKey: string | null;
  onSaveKey: (key: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const masked = apiKey
    ? `${apiKey.slice(0, 10)}${"•".repeat(10)}${apiKey.slice(-4)}`
    : null;

  const copy = useCallback(() => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }, [apiKey]);

  const save = () => {
    const trimmed = input.trim();
    if (!isValidApiKey(trimmed)) {
      setError("Invalid key format (sdata_…)");
      return;
    }
    setError(null);
    onSaveKey(trimmed);
    setInput("");
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">API Key</p>
            {apiKey ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Active
              </span>
            ) : (
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-300">
                Not connected
              </span>
            )}
          </div>
          {apiKey ? (
            <code className="mt-1.5 block truncate font-mono text-sm text-white/80">{masked}</code>
          ) : (
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && save()}
                placeholder="Paste sdata_… key"
                className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-mono text-xs text-white"
              />
              <button
                type="button"
                onClick={save}
                className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-500"
              >
                Save
              </button>
            </div>
          )}
          {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
        </div>
        {apiKey && (
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={copy}
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 hover:bg-white/10"
            >
              {copied ? "Copied" : "Copy"}
            </button>
            <Link
              href="/dashboard/api-keys"
              className="rounded-lg border border-indigo-500/30 bg-indigo-500/15 px-3 py-2 text-xs font-medium text-indigo-200 hover:bg-indigo-500/25"
            >
              Manage
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
