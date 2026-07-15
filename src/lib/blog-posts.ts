import { SEO_BLOG_POSTS } from "@/lib/seo-blog-posts";

export type BlogSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  readMinutes: number;
  tags: string[];
  sections: BlogSection[];
  relatedSlugs?: string[];
  cta?: { label: string; href: string };
};

export const BLOG_AUTHOR = "Data Captain Research Team";

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "best-etf-apis-for-developers",
    title: "Best ETF APIs for Developers in 2026",
    description:
      "Compare what developers need from an ETF data API — universe coverage, historical prices, backtesting, and pricing — and how Data Captain fits.",
    publishedAt: "2026-03-15",
    updatedAt: "2026-07-15",
    author: BLOG_AUTHOR,
    readMinutes: 8,
    tags: ["ETF API", "developers", "fintech"],
    sections: [
      {
        heading: "What makes a good ETF API?",
        paragraphs: [
          "If you are building a portfolio app, research dashboard, or trading bot, you need more than a single quote endpoint. A production-grade ETF API should expose a searchable universe, historical OHLCV, batch prices, and clear rate limits.",
          "Data Captain is built for this workflow: list thousands of US ETFs, pull history for backtests, and upgrade when you need higher limits — one API key, one dashboard.",
        ],
        bullets: [
          "ETF universe endpoint with pagination and search",
          "Historical daily prices (2000–present where data is loaded)",
          "Batch latest prices for watchlists",
          "Backtesting API for buy-and-hold simulations",
          "Free tier to prototype, paid plans for production traffic",
        ],
      },
      {
        heading: "ETF API use cases",
        paragraphs: [
          "Robo-advisors and portfolio trackers need symbol metadata plus latest NAV or close. Quant teams need aligned date ranges for CAGR and drawdown. Content sites publish articles like “QQQ historical returns” — those pages convert when backed by real API data.",
        ],
        bullets: [
          "Fintech dashboards — ETF explorer + charts",
          "Backtesting tools — SPY, QQQ, VOO comparisons",
          "Internal research — screener and batch prices",
          "Educational content — embed live API examples",
        ],
      },
      {
        heading: "How to evaluate providers",
        paragraphs: [
          "Check documentation quality, authentication (API keys vs OAuth), latency, and whether historical data is split-adjusted. Ask if backtesting is a separate product or included in the same platform.",
          "Data Captain keeps ETF data, backtesting, and portfolio comparison under one roof at datacaptain.in — same login as your API dashboard.",
        ],
      },
      {
        heading: "Quick start",
        paragraphs: [
          "Sign up free, copy your API key, and call GET /api/etf/list?search=SPY. Upgrade to Starter when you need full history, backtests, and 1,000 requests/day.",
        ],
      },
    ],
    relatedSlugs: ["historical-etf-data-api", "yahoo-finance-api-alternative", "etf-backtesting-api"],
    cta: { label: "Get your free API key", href: "/auth/signup" },
  },
  {
    slug: "qqq-historical-returns",
    title: "QQQ Historical Returns: Data, Backtests & API Access",
    description:
      "How to analyze Invesco QQQ historical performance with real data — total return, drawdown, and a sample backtest using Data Captain.",
    publishedAt: "2026-03-15",
    updatedAt: "2026-07-15",
    author: BLOG_AUTHOR,
    readMinutes: 6,
    tags: ["QQQ", "historical returns", "backtesting"],
    sections: [
      {
        heading: "Why QQQ is a benchmark for growth exposure",
        paragraphs: [
          "QQQ tracks the Nasdaq-100 — heavily weighted toward large-cap US technology and growth names. Developers and analysts often use it alongside SPY (S&P 500) to compare growth vs broad market.",
        ],
      },
      {
        heading: "Metrics that matter",
        paragraphs: [
          "A serious “QQQ historical returns” analysis should show total return, annualized return (CAGR), maximum drawdown, and optionally dividend yield. Buy-and-hold is the simplest baseline before adding rebalancing or SIP logic.",
        ],
        bullets: [
          "Total return — end value vs initial investment",
          "Annual return — CAGR over the selected window",
          "Max drawdown — worst peak-to-trough decline",
          "Risk score — volatility-based summary",
        ],
      },
      {
        heading: "Run a QQQ backtest via API",
        paragraphs: [
          "On Data Captain, POST /api/backtest/buy-and-hold with symbol QQQ, investment 10000, startDate 2015-01-01, endDate 2025-01-01. You get an equity curve plus all headline metrics — ideal for embedding in your own app or validating content.",
          "Compare QQQ vs SPY vs VOO with POST /api/backtest/compare when you want ranked results for portfolio education pages.",
        ],
      },
      {
        heading: "Free vs paid access",
        paragraphs: [
          "Free tier includes ETF list and market status — enough to prototype. Historical backtests require a paid plan and loaded price history in your database. Start free, upgrade when traffic grows.",
        ],
      },
    ],
    relatedSlugs: ["spy-historical-data-api", "voo-historical-data-api", "spy-vs-qqq-vs-voo-comparison"],
    cta: { label: "Try the backtesting UI", href: "/backtesting" },
  },
  {
    slug: "spy-vs-qqq-vs-voo-comparison",
    title: "SPY vs QQQ vs VOO: Which ETF Performed Better?",
    description:
      "Compare three popular US equity ETFs over the same period using portfolio simulation — methodology and API approach with Data Captain.",
    publishedAt: "2026-03-15",
    updatedAt: "2026-07-15",
    author: BLOG_AUTHOR,
    readMinutes: 7,
    tags: ["SPY", "QQQ", "VOO", "portfolio"],
    sections: [
      {
        heading: "Three ETFs, three stories",
        paragraphs: [
          "SPY is the classic S&P 500 proxy. VOO is another low-cost S&P 500 ETF from Vanguard. QQQ targets Nasdaq-100 growth. Over long windows, rankings change — especially around tech drawdowns and recoveries.",
        ],
        bullets: [
          "SPY — SPDR S&P 500 ETF Trust",
          "VOO — Vanguard S&P 500 ETF",
          "QQQ — Invesco QQQ Trust (Nasdaq-100)",
        ],
      },
      {
        heading: "Apples-to-apples comparison",
        paragraphs: [
          "Use the same start date, end date, and initial investment for each symbol. Data Captain’s compare endpoint runs independent buy-and-hold backtests and returns a ranked list with total and annual returns.",
        ],
      },
      {
        heading: "Example API request",
        paragraphs: [
          "GET /api/backtest/compare?symbols=VOO,SPY,QQQ&investment=10000&startDate=2015-01-01&endDate=2025-01-01",
          "Use this in fintech apps, research newsletters, or internal tools — no spreadsheet exports required.",
        ],
      },
      {
        heading: "Next steps for builders",
        paragraphs: [
          "Publish comparison pages that update when your data refreshes. Pair with ETF list search for discovery and batch prices for live watchlists. Outreach to fintech teams works best when you show a working demo link, not just docs.",
        ],
      },
    ],
    relatedSlugs: ["qqq-historical-returns", "etf-backtesting-api", "calculate-etf-cagr"],
    cta: { label: "Open portfolio compare", href: "/portfolio" },
  },
  ...SEO_BLOG_POSTS,
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}
