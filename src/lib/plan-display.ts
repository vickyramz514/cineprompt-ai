import type { Plan } from "@/components/PricingCard";
import type { SubscriptionPlan } from "@/services/subscription.service";
import { mergePlanOffer } from "@/lib/billing-offers";
import { PRICING_PLANS } from "@/lib/mock-data";

const FREE_UNLOCKS =
  PRICING_PLANS.find((p) => p.slug === "free")?.unlocksAtPaid ?? [
    "Historical ETF prices",
    "Backtesting & portfolio rebalance",
    "1,000+ requests/day",
  ];

/** Map API subscription plan → PricingCard model (single source for marketing + wallet). */
export function mapSubscriptionPlanToCard(plan: SubscriptionPlan): Plan {
  const offer = mergePlanOffer(plan.slug, plan.metadata);
  const price = plan.priceCents < 0 ? -1 : Math.round(plan.priceCents / 100);
  const credits = plan.credits < 0 ? 0 : plan.credits;
  const features = Array.isArray(plan.features)
    ? [...(plan.features as string[])]
    : [];
  if (plan.adminOnly) features.unshift("Admin-only plan");

  const isYearly = plan.billingCycle === "yearly" || plan.billingCycle === "annual";
  const compareAt =
    offer.compareAtCents != null && offer.compareAtCents > plan.priceCents
      ? Math.round(offer.compareAtCents / 100)
      : undefined;

  return {
    id: plan.id,
    name: plan.name,
    price,
    credits,
    features,
    slug: plan.slug,
    currency: plan.currency || "INR",
    tagline: plan.description || (plan.adminOnly ? "Visible to admins only" : undefined),
    unlocksAtPaid: plan.slug === "free" ? FREE_UNLOCKS : undefined,
    overage: offer.offerNote || undefined,
    cta:
      plan.priceCents === 0
        ? "Get API Key"
        : plan.priceCents < 0
          ? "Contact sales"
          : plan.checkoutAvailable === false
            ? "Contact to enable"
            : isYearly
              ? "Subscribe annually"
              : "Subscribe",
    offerBadge: offer.offerBadge || undefined,
    compareAtPrice: compareAt,
    billingCycle: isYearly ? "year" : plan.priceCents === 0 ? undefined : "month",
    checkoutAvailable: plan.checkoutAvailable !== false,
    popular: offer.popular === true,
  };
}

/** Prefer live API plans; fall back to static mock-data when offline. */
export function plansForMarketing(apiPlans: SubscriptionPlan[]): Plan[] {
  const publicPlans = apiPlans.filter((p) => !p.adminOnly);
  if (publicPlans.length === 0) {
    return PRICING_PLANS.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      credits: p.requestsPerDay,
      features: p.features,
      slug: p.slug,
      currency: p.currency,
      tagline: p.tagline,
      unlocksAtPaid: p.unlocksAtPaid,
      overage: p.overage,
      cta: p.cta,
      billingCycle: p.price === 0 ? undefined : "month",
      popular: p.slug === "starter",
      offerBadge: p.slug === "starter" ? "Launch price" : undefined,
      compareAtPrice: p.slug === "starter" ? 2000 : undefined,
      checkoutAvailable: true,
    }));
  }
  return publicPlans
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map(mapSubscriptionPlanToCard);
}
