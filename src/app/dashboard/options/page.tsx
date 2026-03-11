"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OptionsIndexPage() {
  const [symbol, setSymbol] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const s = symbol.trim().toUpperCase();
    if (s) router.push(`/dashboard/options/${encodeURIComponent(s)}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Options Chain</h1>
        <p className="mt-1 text-white/60">View options chain for any symbol</p>
      </div>
      <form onSubmit={handleSubmit} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 max-w-md">
        <label className="block text-sm font-medium text-white/70 mb-2">Symbol</label>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="AAPL"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="flex-1 rounded-lg border border-white/20 bg-black/30 px-4 py-2.5 font-mono text-sm text-white placeholder:text-white/40 focus:border-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
          >
            View
          </button>
        </div>
      </form>
    </div>
  );
}
