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
  onSelect: (idOrSlug: string) => void;
}

export default function PricingCard({ plan, popular, onSelect }: PricingCardProps) {
  const isEnterprise = plan.price === -1;
  const isFree = plan.price === 0;

  return (
    <div
      className={`relative rounded-2xl border p-6 transition-all duration-300 ${
        popular
          ? "border-indigo-500/50 bg-indigo-500/5 shadow-lg shadow-indigo-500/10"
          : "border-white/5 bg-white/[0.02] hover:border-white/10"
      }`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-3 py-0.5 text-xs font-medium">
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
      <ul className="mt-4 space-y-2">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-white/80">
            <span className="text-indigo-400">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <button
        onClick={() => onSelect(plan.slug || plan.id)}
        className={`mt-6 w-full rounded-lg py-2.5 font-medium transition-colors ${
          popular
            ? "bg-indigo-500 text-white hover:bg-indigo-600"
            : "bg-white/10 text-white hover:bg-white/5"
        }`}
      >
        {isEnterprise ? "Contact Sales" : isFree ? "Get Started" : "Subscribe"}
      </button>
    </div>
  );
}
