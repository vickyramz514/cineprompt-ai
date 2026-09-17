"use client";

import { useMemo } from "react";
import PricingCard from "@/components/PricingCard";
import { useSubscriptionPlans } from "@/hooks/useSubscriptionPlans";
import { plansForMarketing } from "@/lib/plan-display";
import { BILLING_OFFERS_BANNER } from "@/lib/billing-offers";
import Link from "next/link";

type Props = {
  onSelect: (idOrSlug: string) => void;
  /** Highlight current plan slug (billing page) */
  currentSlug?: string | null;
  showOffersBanner?: boolean;
  className?: string;
};

export default function LivePricingGrid({
  onSelect,
  currentSlug,
  showOffersBanner = true,
  className = "mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
}: Props) {
  const { plans, isLoading, error } = useSubscriptionPlans();
  const cards = useMemo(() => plansForMarketing(plans), [plans]);

  const popularSlug =
    cards.find((c) => c.popular)?.slug ||
    cards.find((c) => c.slug === "starter")?.slug ||
    null;

  return (
    <div>
      {showOffersBanner ? (
        <div className="mx-auto mb-8 max-w-3xl rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-center text-sm text-white/75">
          <strong className="text-amber-100">{BILLING_OFFERS_BANNER.title}</strong>
          <span className="mt-1 block text-white/55">{BILLING_OFFERS_BANNER.body}</span>
        </div>
      ) : null}

      {isLoading && cards.length === 0 ? (
        <p className="text-center text-sm text-white/45">Loading live plans…</p>
      ) : null}
      {error ? (
        <p className="mb-4 text-center text-xs text-white/40">
          Showing cached plan copy —{" "}
          <Link href="/pricing" className="text-indigo-400 hover:underline">
            refresh
          </Link>{" "}
          if prices look stale.
        </p>
      ) : null}

      <div className={className}>
        {cards.map((plan) => (
          <PricingCard
            key={plan.slug || plan.id}
            plan={plan}
            popular={plan.popular || plan.slug === popularSlug}
            isCurrent={Boolean(currentSlug && plan.slug === currentSlug)}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
