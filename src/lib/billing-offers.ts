/**
 * Marketing / billing offer overlays — merged with live plan metadata from the API.
 */

export type PlanOffer = {
  offerBadge?: string | null;
  compareAtCents?: number | null;
  offerNote?: string | null;
  popular?: boolean;
};

/** Fallback offers by slug when DB metadata is empty (until seed is re-run). */
export const BILLING_OFFERS_BY_SLUG: Record<string, PlanOffer> = {
  starter: {
    offerBadge: "Launch price",
    compareAtCents: 200_000,
    offerNote: "Introductory monthly rate — unlock history & backtests",
    popular: true,
  },
  "starter-annual": {
    offerBadge: "Save ₹3,000/yr",
    compareAtCents: 1_800_000,
    offerNote: "2 months free compared with monthly Starter",
    popular: false,
  },
};

export const BILLING_OFFERS_BANNER = {
  title: "Launch offer on Starter",
  body: "Monthly Starter at an introductory price, or save ₹3,000/year with Starter Annual once linked in billing.",
  ctaLabel: "See plans",
  ctaHref: "/pricing",
} as const;

export function mergePlanOffer(
  slug: string,
  metadata?: unknown
): PlanOffer {
  const fromMeta =
    metadata && typeof metadata === "object" && !Array.isArray(metadata)
      ? (metadata as PlanOffer)
      : {};
  const fallback = BILLING_OFFERS_BY_SLUG[slug] ?? {};
  return {
    offerBadge: fromMeta.offerBadge ?? fallback.offerBadge ?? null,
    compareAtCents: fromMeta.compareAtCents ?? fallback.compareAtCents ?? null,
    offerNote: fromMeta.offerNote ?? fallback.offerNote ?? null,
    popular: fromMeta.popular ?? fallback.popular ?? false,
  };
}
