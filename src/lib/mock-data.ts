/**
 * Stock Market Data API - Mock data and constants
 */

export const PRICING_PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    currency: "INR",
    requestsPerDay: 50,
    features: ["50 requests/day", "Historical stock data", "ETF data", "Basic support"],
  },
  {
    id: "starter",
    name: "Starter",
    price: 1500,
    currency: "INR",
    requestsPerDay: 1000,
    features: ["1,000 requests/day", "Historical stock data", "ETF data", "Email support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 2500,
    currency: "INR",
    requestsPerDay: 10000,
    features: ["10,000 requests/day", "Historical stock data", "ETF data", "Priority support"],
  },
  {
    id: "ultra",
    name: "Ultra",
    price: 5000,
    currency: "INR",
    requestsPerDay: 100000,
    features: ["100,000 requests/day", "Historical stock data", "ETF data", "All premium APIs"],
  },
];

export { SIDEBAR_NAV, SIDEBAR_SECTIONS } from "./sidebar-nav";
