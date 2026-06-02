/**
 * Stock Market Data API - Mock data and constants
 */

export const PRICING_PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    requestsPerDay: 100,
    features: ["100 requests/day", "Historical stock data", "ETF data", "Basic support"],
  },
  {
    id: "starter",
    name: "Starter",
    price: 15,
    requestsPerDay: 10000,
    features: ["10,000 requests/day", "Historical stock data", "ETF data", "Email support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 39,
    requestsPerDay: 100000,
    features: ["100,000 requests/day", "Historical stock data", "ETF data", "Priority support"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: -1,
    requestsPerDay: -1,
    features: ["Custom volume", "Dedicated support", "SLA guarantee", "Custom integrations"],
  },
];

export { SIDEBAR_NAV, SIDEBAR_SECTIONS } from "./sidebar-nav";
