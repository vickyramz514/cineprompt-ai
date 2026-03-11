"use client";

interface DashboardCardsProps {
  requestsToday: number;
  requestsRemaining: number;
  dailyLimit: number;
  plan: string;
  isLoading?: boolean;
}

const cards = [
  { key: "requestsToday", label: "Requests Today", valueKey: "requestsToday" as const },
  { key: "requestsRemaining", label: "Remaining", valueKey: "requestsRemaining" as const, highlight: true },
  { key: "dailyLimit", label: "Daily Limit", valueKey: "dailyLimit" as const },
  { key: "plan", label: "Plan", valueKey: "plan" as const },
];

export default function DashboardCards({
  requestsToday,
  requestsRemaining,
  dailyLimit,
  plan,
  isLoading,
}: DashboardCardsProps) {
  const values = { requestsToday, requestsRemaining, dailyLimit, plan };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ key, label, valueKey, highlight }) => (
        <div
          key={key}
          className="rounded-xl border border-white/5 bg-white/[0.02] p-6"
        >
          <p className="text-sm text-white/60">{label}</p>
          {isLoading ? (
            <div className="mt-2 h-8 w-20 animate-pulse rounded bg-white/10" />
          ) : (
            <p
              className={`mt-1 text-2xl font-bold ${highlight ? "text-emerald-400" : ""}`}
            >
              {typeof values[valueKey] === "number"
                ? values[valueKey].toLocaleString()
                : values[valueKey]}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
