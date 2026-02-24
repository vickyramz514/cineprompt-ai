"use client";

interface Plan {
  id: string;
  name: string;
  price: number;
  credits: number;
  features: string[];
}

interface PricingCardProps {
  plan: Plan;
  popular?: boolean;
  onSelect: (id: string) => void;
}

export default function PricingCard({ plan, popular, onSelect }: PricingCardProps) {
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
        <span className="text-3xl font-bold">
          {plan.price === 0 ? "Free" : `₹${plan.price}`}
        </span>
        {plan.price > 0 && <span className="text-white/50">/month</span>}
      </div>
      <p className="mt-1 text-sm text-white/60">{plan.credits} credits</p>
      <ul className="mt-4 space-y-2">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-white/80">
            <span className="text-indigo-400">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <button
        onClick={() => onSelect(plan.id)}
        className={`mt-6 w-full rounded-lg py-2.5 font-medium transition-colors ${
          popular
            ? "bg-indigo-500 text-white hover:bg-indigo-600"
            : "bg-white/10 text-white hover:bg-white/5"
        }`}
      >
        {plan.price === 0 ? "Get Started" : "Subscribe"}
      </button>
    </div>
  );
}
