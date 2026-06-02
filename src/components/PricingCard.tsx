"use client";

export interface Plan {
  id: string;
  name: string;
  price: number;
  credits: number;
  features: string[];
  slug?: string;
}

interface PricingCardProps {
  plan: Plan;
  popular?: boolean;
  isCurrent?: boolean;
  onSelect: (idOrSlug: string) => void;
}

export default function PricingCard({ plan, popular, isCurrent, onSelect }: PricingCardProps) {
  const isEnterprise = plan.price === -1;
  const isFree = plan.price === 0;

  return (
    <div
      className={`relative flex h-full flex-col rounded-2xl border p-6 transition-all duration-300 ${
        isCurrent
          ? "border-emerald-500/40 bg-emerald-500/5 ring-1 ring-emerald-500/20"
          : popular
            ? "border-indigo-500/50 bg-indigo-500/5 shadow-lg shadow-indigo-500/10 hover:border-indigo-400/60"
            : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
      }`}
    >
      {isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3 py-0.5 text-xs font-medium text-emerald-300">
          Current plan
        </div>
      )}
      {popular && !isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-3 py-0.5 text-xs font-medium shadow-lg shadow-indigo-500/30">
          Popular
        </div>
      )}
      <h3 className="text-lg font-semibold">{plan.name}</h3>
      <div className="mt-2">
        {isEnterprise ? (
          <span className="text-2xl font-bold">Custom</span>
        ) : (
          <>
            <span className="text-3xl font-bold">
              {isFree ? "Free" : `$${plan.price}`}
            </span>
            {!isFree && <span className="text-white/50">/month</span>}
          </>
        )}
      </div>
      <p className="mt-1 text-sm text-white/60">
        {isEnterprise ? "High volume access" : `${plan.credits.toLocaleString()} requests/day`}
      </p>
      <ul className="mt-4 flex-1 space-y-2">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-white/75">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => onSelect(plan.slug || plan.id)}
        disabled={isCurrent && !isEnterprise}
        className={`mt-6 w-full rounded-xl py-2.5 text-sm font-medium transition-colors ${
          isCurrent && !isEnterprise
            ? "cursor-default border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
            : popular
              ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-500/20"
              : "border border-white/15 bg-white/5 text-white hover:bg-white/10"
        }`}
      >
        {isCurrent && !isEnterprise
          ? "Current plan"
          : isEnterprise
            ? "Contact sales"
            : isFree
              ? "Get started"
              : "Subscribe"}
      </button>
    </div>
  );
}
