"use client";

import type { OptionLeg } from "@/services/datacaptain/endpoints";

interface OptionsTableProps {
  legs: OptionLeg[];
  title: "Calls" | "Puts";
  isLoading?: boolean;
}

const columns = ["Strike", "Bid", "Ask", "Volume", "Open Interest"] as const;

export default function OptionsTable({ legs, title, isLoading }: OptionsTableProps) {
  const colorClass = title === "Calls" ? "text-emerald-400" : "text-red-400";

  if (isLoading) {
    return (
      <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="border-b border-white/5 bg-white/[0.02] px-4 py-3">
          <h3 className={`font-semibold ${colorClass}`}>{title}</h3>
        </div>
        <div className="p-4">
          <div className="animate-pulse space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 w-full rounded bg-white/10" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!legs.length) {
    return (
      <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="border-b border-white/5 bg-white/[0.02] px-4 py-3">
          <h3 className={`font-semibold ${colorClass}`}>{title}</h3>
        </div>
        <p className="p-6 text-center text-white/50">No {title.toLowerCase()} found</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
      <div className="border-b border-white/5 bg-white/[0.02] px-4 py-3">
        <h3 className={`font-semibold ${colorClass}`}>{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
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
            {legs.map((leg, i) => (
              <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-medium">{leg.strike}</td>
                <td className="px-4 py-3">{leg.bid ?? "—"}</td>
                <td className="px-4 py-3">{leg.ask ?? "—"}</td>
                <td className="px-4 py-3">{leg.volume ?? "—"}</td>
                <td className="px-4 py-3">{leg.openInterest ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
