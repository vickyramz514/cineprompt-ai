/**
 * DataCaptain ETF API - Mock data and constants
 */

export const PRICING_PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    currency: "INR",
    requestsPerDay: 50,
    features: [
      "50 requests/day",
      "ETF list & batch prices",
      "Market status",
      "Upgrade for historical data & backtests",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    price: 1500,
    currency: "INR",
    requestsPerDay: 1000,
    features: [
      "1,000 requests/day",
      "Historical ETF data",
      "Backtesting & portfolio compare",
      "ETF symbol details",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 2500,
    currency: "INR",
    requestsPerDay: 10000,
    features: [
      "10,000 requests/day",
      "All Starter features",
      "Higher rate limits",
      "Priority support",
    ],
  },
  {
    id: "ultra",
    name: "Ultra",
    price: 5000,
    currency: "INR",
    requestsPerDay: 100000,
    features: [
      "100,000 requests/day",
      "All Pro features",
      "High-volume production",
      "Dedicated onboarding",
    ],
  },
];

export { SIDEBAR_NAV, SIDEBAR_SECTIONS } from "./sidebar-nav";
