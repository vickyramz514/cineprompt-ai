"use client";

import { useState, useCallback } from "react";
import { useApiKey } from "@/hooks/useApiKey";
import Loader from "@/components/Loader";

export default function ApiKeysPage() {
  const { apiKey, isLoading, error, refetch } = useApiKey();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!apiKey?.key) return;
    navigator.clipboard.writeText(apiKey.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [apiKey?.key]);

  if (isLoading && !apiKey) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">API Keys</h1>
        <p className="mt-1 text-white/60">Manage your API keys for accessing the Stock Market Data API</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider">API Key</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <code className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-white/90 break-all">
            {apiKey?.key ?? "sdata_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}
          </code>
          <button
            onClick={handleCopy}
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <p className="mt-4 text-sm text-white/50">
          Use this key in the <code className="rounded bg-white/10 px-1">x-api-key</code> header for all API requests.
          Keep it secure and never share it publicly.
        </p>
      </div>
    </div>
  );
}
