"use client";

import type { InsiderTrade } from "@/services/datacaptain/endpoints";

interface InsiderTradesTableProps {
  trades: InsiderTrade[];
  isLoading?: boolean;
  error?: string | null;
}

const columns = ["Name", "Title", "Transaction", "Shares", "Price", "Date"] as const;

export default function InsiderTradesTable({
  trades,
  isLoading,
  error,
}: InsiderTradesTableProps) {
  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="animate-pulse p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-full rounded bg-white/10" />
          ))}
        </div>
      </div>
    );
  }

  if (!trades.length) {
    return (
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-12 text-center">
        <p className="text-white/50">No insider trades found</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left font-medium text-white/60"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, i) => (
              <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-medium">{trade.name}</td>
                <td className="px-4 py-3 text-white/70">{trade.title ?? "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      trade.transactionType === "BUY"
                        ? "text-emerald-400"
                        : "text-red-400"
                    }
                  >
                    {trade.transactionType}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {trade.shares.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  {trade.price != null ? `$${trade.price.toFixed(2)}` : "—"}
                </td>
                <td className="px-4 py-3 text-white/70">{trade.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
