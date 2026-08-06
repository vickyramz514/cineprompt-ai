/**
 * DataCaptain ETF API — public pricing (keep in sync with API subscription plans).
 */

export type PricingPlan = {
  id: string;
  /** Billing / URL slug */
  slug: string;
  name: string;
  price: number;
  currency: "INR";
  requestsPerDay: number;
  /** Short line under the price */
  tagline: string;
  /** What this tier includes */
  features: string[];
  /** Explicit limits for conversion copy */
  limits: string[];
  /** What paid unlocks vs Free (shown on Free / comparison) */
  unlocksAtPaid?: string[];
  /** Overage / soft-out policy */
  overage: string;
  cta: string;
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    slug: "free",
    name: "Free",
    price: 0,
    currency: "INR",
    requestsPerDay: 50,
    tagline: "Prototype with a real API key — no card",
    features: [
      "50 requests/day",
      "ETF list, screener, rankings & heatmap",
      "Batch latest prices",
      "Market status",
      "API key + docs + SDKs",
    ],
    limits: [
      "50 requests/day hard cap",
      "No historical OHLCV",
      "No backtesting or portfolio APIs",
    ],
    unlocksAtPaid: [
      "Historical ETF prices",
      "Backtesting & portfolio rebalance",
      "1,000+ requests/day",
    ],
    overage: "Daily cap — upgrade to Starter when you need more",
    cta: "Get API Key",
  },
  {
    id: "starter",
    slug: "starter",
    name: "Starter",
    price: 1500,
    currency: "INR",
    requestsPerDay: 1000,
    tagline: "Ship production ETF tools",
    features: [
      "1,000 requests/day",
      "Historical ETF OHLCV",
      "Backtesting & portfolio compare",
      "ETF symbol details",
      "Email support",
    ],
    limits: ["1,000 requests/day"],
    overage: "Daily cap — upgrade to Pro for 10× volume",
    cta: "Start Starter",
  },
  {
    id: "pro",
    slug: "pro",
    name: "Pro",
    price: 2500,
    currency: "INR",
    requestsPerDay: 10000,
    tagline: "Growing apps & heavier research",
    features: [
      "10,000 requests/day",
      "Everything in Starter",
      "Higher rate limits",
      "Priority support",
    ],
    limits: ["10,000 requests/day"],
    overage: "Daily cap — upgrade to Scale for high volume",
    cta: "Start Pro",
  },
  {
    id: "ultra",
    slug: "ultra",
    name: "Scale",
    price: 5000,
    currency: "INR",
    requestsPerDay: 100000,
    tagline: "High-volume production",
    features: [
      "100,000 requests/day",
      "Everything in Pro",
      "High-volume production workloads",
      "Dedicated onboarding",
    ],
    limits: ["100,000 requests/day"],
    overage: "Need more? Email sales for custom volume",
    cta: "Start Scale",
  },
];

/** Homepage / hero one-liner for Free */
export const FREE_TIER_SUMMARY =
  "Free: 50 requests/day · ETF list, screener, rankings, heatmap & batch prices · no historical / backtests · no card required";

/** What ₹1,500 Starter unlocks */
export const STARTER_UNLOCKS_SUMMARY =
  "Starter (₹1,500/mo): 1,000 requests/day · historical OHLCV · backtesting · portfolio tools";

export { SIDEBAR_NAV, SIDEBAR_SECTIONS } from "./sidebar-nav";
