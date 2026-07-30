/**
 * Help chatbot knowledge — Data Captain product flows & FAQ.
 * Matched client-side (no LLM / no API cost).
 */

export type HelpLink = { label: string; href: string };

export type HelpArticle = {
  id: string;
  title: string;
  keywords: string[];
  answer: string;
  links?: HelpLink[];
};

export const HELP_QUICK_PROMPTS = [
  "How do I get started?",
  "Create an API key",
  "What is free vs paid?",
  "How do I use the SDK?",
  "Run a backtest",
  "Billing & plans",
];

export const HELP_ARTICLES: HelpArticle[] = [
  {
    id: "start",
    title: "Get started",
    keywords: [
      "start",
      "getting started",
      "begin",
      "onboard",
      "first",
      "how do i",
      "help",
      "flow",
      "application flow",
      "overview",
    ],
    answer: `Here's the usual Data Captain flow:

1. Sign up at /auth/signup (email/password or Google).
2. Open Dashboard → API Keys and create a key.
3. Call the API with header x-api-key, or install the SDK (npm/pip install datacaptain).
4. Explore ETF tools: Heatmap, Screener, Rankings, Explorer.
5. Upgrade on Pricing/Billing when you need backtesting, portfolio, or higher limits.

Free tier includes market status, batch prices, ETF list/screener/rankings/heatmap.`,
    links: [
      { label: "Sign up", href: "/auth/signup" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "API Docs", href: "/docs" },
      { label: "SDK Docs", href: "/sdk" },
    ],
  },
  {
    id: "signup-login",
    title: "Sign up & login",
    keywords: ["signup", "sign up", "register", "login", "sign in", "google", "password", "account", "auth"],
    answer: `Create an account with email + password or Continue with Google.

- Login: /auth/login
- Signup: /auth/signup
- After login you land on /dashboard.

OTP phone login is not live yet — use email/password or Google.`,
    links: [
      { label: "Login", href: "/auth/login" },
      { label: "Sign up", href: "/auth/signup" },
    ],
  },
  {
    id: "api-keys",
    title: "API keys",
    keywords: ["api key", "apikey", "x-api-key", "create key", "token", "secret", "credentials"],
    answer: `API keys authenticate every Data Captain request.

1. Go to Dashboard → API Keys (/dashboard/api-keys).
2. Create a key and copy it once (store it safely).
3. Send it as header: x-api-key: YOUR_KEY
4. Check remaining quota on Dashboard → Usage.

Never commit keys to git or share them publicly.`,
    links: [
      { label: "API Keys", href: "/dashboard/api-keys" },
      { label: "Usage", href: "/dashboard/usage" },
      { label: "API Explorer", href: "/dashboard/api-explorer" },
    ],
  },
  {
    id: "docs-sdk",
    title: "Docs & SDKs",
    keywords: ["docs", "documentation", "sdk", "npm", "pip", "python", "typescript", "javascript", "install", "client"],
    answer: `REST docs: /docs (also Swagger on the API host).

Official SDKs (package name datacaptain):
- JavaScript/TypeScript: npm install datacaptain
- Python: pip install datacaptain

Full examples: /sdk

Default API origin is https://api.datacaptain.in. You can pass baseUrl / base_url to override.`,
    links: [
      { label: "REST docs", href: "/docs" },
      { label: "SDK docs", href: "/sdk" },
      { label: "Dashboard API docs", href: "/dashboard/api-docs" },
    ],
  },
  {
    id: "explorer",
    title: "API Explorer",
    keywords: ["explorer", "try api", "playground", "test endpoint", "api explorer"],
    answer: `API Explorer lets you call live endpoints with your key from the dashboard.

Path: /dashboard/api-explorer

Pick a path, send the request, inspect JSON. Free-plan paths are limited — paid features return an upgrade message.`,
    links: [{ label: "Open Explorer", href: "/dashboard/api-explorer" }],
  },
  {
    id: "etf-tools",
    title: "ETF tools",
    keywords: [
      "etf",
      "heatmap",
      "screener",
      "rankings",
      "explorer",
      "spy",
      "qqq",
      "prices",
      "batch",
      "list",
    ],
    answer: `Market data in the dashboard:

- ETF Heatmap — basket performance at a glance
- ETF Screener — filter by return / yield
- ETF Rankings — top performers by period
- ETF Explorer — search symbols (prefer “with price”)
- Batch ETF Prices — latest prices for many symbols

Most of these are available on the free plan.`,
    links: [
      { label: "Heatmap", href: "/dashboard/etf/heatmap" },
      { label: "Screener", href: "/dashboard/etf/screener" },
      { label: "Rankings", href: "/dashboard/etf/rankings" },
      { label: "Explorer", href: "/dashboard/etf" },
      { label: "Batch prices", href: "/dashboard/tools/prices" },
    ],
  },
  {
    id: "backtest",
    title: "Backtesting",
    keywords: ["backtest", "backtesting", "buy and hold", "compare", "historical return", "simulation"],
    answer: `Backtesting runs buy-and-hold (and compare) on ETF history.

- Marketing page: /backtesting
- Dashboard (paid): /dashboard/backtesting

API: POST /v1/backtest/buy-and-hold and /api/backtest/compare

Requires a paid plan (Starter+). Free users see an upgrade prompt.`,
    links: [
      { label: "Backtesting overview", href: "/backtesting" },
      { label: "Dashboard backtesting", href: "/dashboard/backtesting" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    id: "portfolio",
    title: "Portfolio tools",
    keywords: ["portfolio", "rebalance", "rebalancer", "weights", "holdings", "drift"],
    answer: `Portfolio tools help rebalance holdings toward target weights.

- Marketing: /portfolio
- Dashboard (paid): /dashboard/portfolio

API: POST /v1/portfolio/rebalance

Paid feature — upgrade from Billing or Pricing.`,
    links: [
      { label: "Portfolio", href: "/portfolio" },
      { label: "Dashboard portfolio", href: "/dashboard/portfolio" },
    ],
  },
  {
    id: "plans",
    title: "Free vs paid",
    keywords: ["free", "paid", "plan", "pricing", "upgrade", "limit", "quota", "tier", "starter", "pro"],
    answer: `Free plan typically includes:
- Market status, developer usage
- Batch prices, ETF list / screener / rankings / heatmap

Paid plans unlock higher daily limits plus backtesting, portfolio, and advanced market tools (options, insiders, etc. where enabled).

See /pricing and Dashboard → Billing (/dashboard/wallet). Payments currently run through Razorpay (INR).`,
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Billing", href: "/dashboard/wallet" },
    ],
  },
  {
    id: "billing",
    title: "Billing & payments",
    keywords: ["billing", "payment", "razorpay", "subscribe", "subscription", "invoice", "wallet", "refund"],
    answer: `Manage plans under Dashboard → Billing (/dashboard/wallet).

Checkout uses Razorpay. After payment, your plan syncs for API access.

Issues with a charge? Open Support (/dashboard/support) or email the support address in the site footer.`,
    links: [
      { label: "Billing", href: "/dashboard/wallet" },
      { label: "Support", href: "/dashboard/support" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    id: "market-status",
    title: "Market open / closed",
    keywords: ["market", "open", "closed", "hours", "nyse", "status", "holiday", "trading hours"],
    answer: `GET /v1/market/status returns US regular session OPEN/CLOSED.

Hours: Mon–Fri 09:30–16:00 America/New_York, with NYSE holidays and early closes (13:00 ET).

In India that session is roughly 7:00 PM – 1:30 AM IST (EDT), so daytime IST often shows CLOSED — that is expected.`,
    links: [{ label: "Dashboard", href: "/dashboard" }],
  },
  {
    id: "theme",
    title: "Theme",
    keywords: ["theme", "dark", "ocean", "appearance", "mode", "color"],
    answer: `Use the theme control in the header (or sidebar on dashboard).

Themes: Dark (default) and Ocean (teal accents). Your choice is saved in this browser.`,
  },
  {
    id: "support",
    title: "Support & referrals",
    keywords: ["support", "ticket", "help desk", "contact", "referral", "affiliate", "bug"],
    answer: `Support tickets: Dashboard → Support (/dashboard/support).

Referrals: Dashboard → Referrals.

Also check Blog guides (/blog) and System status (/status).`,
    links: [
      { label: "Support", href: "/dashboard/support" },
      { label: "Referrals", href: "/dashboard/referral" },
      { label: "Blog", href: "/blog" },
      { label: "Status", href: "/status" },
    ],
  },
  {
    id: "sdk-usage",
    title: "SDK usage example",
    keywords: ["example", "code", "snippet", "datacaptain(", "import"],
    answer: `TypeScript:
import { DataCaptain } from "datacaptain";
const dc = new DataCaptain({ apiKey: process.env.DATACAPTAIN_API_KEY });
const list = await dc.etf.list({ search: "SPY", limit: 10 });

Python:
from datacaptain import DataCaptain
dc = DataCaptain(api_key="YOUR_KEY")
print(dc.etf_list(search="SPY", limit=10))

More on /sdk.`,
    links: [{ label: "SDK docs", href: "/sdk" }],
  },
];

function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .replace(/[^a-z0-9\s+/.-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

export type HelpMatch = {
  article: HelpArticle;
  score: number;
};

export function matchHelpArticles(query: string, limit = 3): HelpMatch[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const tokens = tokenize(q);
  const scored: HelpMatch[] = HELP_ARTICLES.map((article) => {
    let score = 0;
    const hay = `${article.title} ${article.keywords.join(" ")} ${article.answer}`.toLowerCase();

    if (article.title.toLowerCase() === q) score += 20;
    if (hay.includes(q)) score += 12;

    for (const kw of article.keywords) {
      if (q.includes(kw) || kw.includes(q)) score += 8;
      for (const t of tokens) {
        if (kw.includes(t) || t.includes(kw)) score += 3;
      }
    }

    for (const t of tokens) {
      if (hay.includes(t)) score += 1;
    }

    return { article, score };
  })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
}

export function formatHelpReply(query: string): {
  text: string;
  links: HelpLink[];
  suggestions: string[];
} {
  const matches = matchHelpArticles(query, 2);
  if (matches.length === 0) {
    return {
      text: `I couldn't find an exact match. Try asking about: getting started, API keys, SDK, ETF tools, backtesting, portfolio, pricing, billing, or market hours.

You can also browse /docs and /sdk, or open a ticket under Support.`,
      links: [
        { label: "Get started tips", href: "/docs" },
        { label: "SDK", href: "/sdk" },
        { label: "Support", href: "/dashboard/support" },
      ],
      suggestions: HELP_QUICK_PROMPTS.slice(0, 4),
    };
  }

  const primary = matches[0].article;
  const extra =
    matches[1] && matches[1].score >= matches[0].score * 0.55
      ? `\n\nRelated: ${matches[1].article.title} — ask “${matches[1].article.title.toLowerCase()}” for details.`
      : "";

  return {
    text: `${primary.answer}${extra}`,
    links: primary.links ?? [],
    suggestions: HELP_QUICK_PROMPTS.filter((p) => !query.toLowerCase().includes(p.toLowerCase().slice(0, 8))).slice(
      0,
      3
    ),
  };
}
