export type SeoLandingPage = {
  slug: string;
  /** Primary keyword for H1 / title */
  keyword: string;
  title: string;
  description: string;
  heroEyebrow: string;
  heroHeadline: string;
  heroSubhead: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  endpoints: Array<{ method: string; path: string; note: string }>;
  features: Array<{ title: string; body: string }>;
  useCases: string[];
  faqs: Array<{ q: string; a: string }>;
  related: Array<{ href: string; label: string }>;
  /** Honest product note when coverage is partial */
  coverageNote?: string;
};

export const SEO_LANDING_PAGES: SeoLandingPage[] = [
  {
    slug: "etf-api",
    keyword: "ETF API",
    title: "US ETF API — Historical Data, Screener & Backtesting",
    description:
      "US ETF API for developers: searchable universe, historical OHLCV, screener, heatmap, and backtesting. Free tier with API key auth.",
    heroEyebrow: "ETF API",
    heroHeadline: "The US ETF data API for builders",
    heroSubhead:
      "List funds, pull history, screen by return and yield, and run buy-and-hold backtests — one platform for product and research teams.",
    primaryCta: { label: "Get free API key", href: "/auth/signup" },
    secondaryCta: { label: "Open API docs", href: "/docs" },
    endpoints: [
      { method: "GET", path: "/api/etf/list", note: "Paginated ETF universe" },
      { method: "GET", path: "/api/etf/screener", note: "Filter by performance" },
      { method: "POST", path: "/api/backtest/buy-and-hold", note: "Simulate returns" },
      { method: "GET", path: "/api/etf/heatmap", note: "Basket performance" },
    ],
    features: [
      {
        title: "Priced US ETF universe",
        body: "Thousands of US ETFs with historical prices for charts and analytics — filter with hasPrice for production UIs.",
      },
      {
        title: "Backtesting included",
        body: "Same history that powers charts also powers buy-and-hold and compare endpoints.",
      },
      {
        title: "Developer-first docs",
        body: "REST JSON, rate limits by plan, status page for freshness, and the official TypeScript SDK (npm install datacaptain).",
      },
    ],
    useCases: [
      "ETF explorers and heatmaps",
      "Portfolio education products",
      "Fintech dashboards",
      "SEO content backed by live API examples",
    ],
    faqs: [
      {
        q: "How is this different from a generic stock API?",
        a: "Data Captain is built around US ETF metadata, metrics, and historical prices — not a thin wrapper over every equity ticker worldwide.",
      },
    ],
    related: [
      { href: "/stock-api", label: "Stock market API" },
      { href: "/historical-stock-api", label: "Historical API" },
      { href: "/blog/best-etf-apis-for-developers", label: "Best ETF APIs" },
    ],
  },
  {
    slug: "stock-api",
    keyword: "stock market API",
    title: "Stock Market API for Developers — US ETF & Market Data",
    description:
      "Stock market API with US ETF prices, history, batch quotes, and market status. Free tier, API key auth, and clear docs for dashboards and fintech apps.",
    heroEyebrow: "Stock market API",
    heroHeadline: "US stock market data API built for product teams",
    heroSubhead:
      "Data Captain gives developers a single API key for US ETF market data — latest prices, searchable universe, market status, and production-ready rate limits.",
    primaryCta: { label: "Get free API key", href: "/auth/signup" },
    secondaryCta: { label: "Read API docs", href: "/docs" },
    endpoints: [
      { method: "GET", path: "/api/etf/list", note: "Searchable ETF universe" },
      { method: "GET", path: "/api/stocks/prices", note: "Batch latest prices" },
      { method: "GET", path: "/api/market/status", note: "US market open/closed" },
      { method: "GET", path: "/api/stocks/:symbol/price", note: "Single-symbol quote" },
    ],
    features: [
      {
        title: "One key, REST JSON",
        body: "Authenticate with x-api-key. Responses are predictable JSON — ideal for React, Next.js, and backend workers.",
      },
      {
        title: "ETF-first market coverage",
        body: "Production coverage focuses on US-listed ETFs with loaded historical prices (SPY, QQQ, VOO, and thousands more).",
      },
      {
        title: "Free tier to ship a prototype",
        body: "Validate auth, latency, and response shape before upgrading for history, backtests, and higher daily limits.",
      },
    ],
    useCases: [
      "Investment dashboards and watchlists",
      "Fintech MVP market-data backends",
      "Portfolio and research tools",
      "Educational and content products with live examples",
    ],
    faqs: [
      {
        q: "Is Data Captain a full US equities stock API?",
        a: "Data Captain is optimized for US ETF market data. Paths under /api/stocks work with ETF symbols that have price history in our database. Prefer /api/etf endpoints for universe search and screener workflows.",
      },
      {
        q: "How do I start?",
        a: "Sign up, copy your API key from the dashboard, then call GET /api/etf/list?search=SPY with the x-api-key header.",
      },
    ],
    related: [
      { href: "/historical-stock-api", label: "Historical stock API" },
      { href: "/stock-screener-api", label: "Stock screener API" },
      { href: "/blog/best-etf-apis-for-developers", label: "Best ETF APIs guide" },
    ],
  },
  {
    slug: "historical-stock-api",
    keyword: "historical stock API",
    title: "Historical Stock API — Daily OHLCV for US ETFs",
    description:
      "Historical stock API with daily OHLCV for US ETFs. Pull date ranges for charts, CAGR, drawdowns, and backtests with a single API key.",
    heroEyebrow: "Historical stock API",
    heroHeadline: "Historical OHLCV API for charts and backtests",
    heroSubhead:
      "Request daily open, high, low, close, and volume by symbol and date range. The same series powers Data Captain charts, indicators, and buy-and-hold simulations.",
    primaryCta: { label: "Try backtesting", href: "/backtesting" },
    secondaryCta: { label: "API documentation", href: "/docs" },
    endpoints: [
      { method: "GET", path: "/api/stocks/:symbol/history", note: "Date-range OHLCV" },
      { method: "GET", path: "/api/stocks/:symbol/candles", note: "Chart-ready candles" },
      { method: "POST", path: "/api/backtest/buy-and-hold", note: "Simulate returns from history" },
      { method: "GET", path: "/api/etf/SPY", note: "Latest price + metadata" },
    ],
    features: [
      {
        title: "Aligned history for analytics",
        body: "Use one history source for charts, RSI/SMA overlays, and portfolio backtests — avoid mismatched vendor series.",
      },
      {
        title: "Date-range requests",
        body: "Pass start and end dates, validate first/last trading days, and cache stable windows in your app.",
      },
      {
        title: "Built for SPY, QQQ, VOO workflows",
        body: "Common benchmarks are first-class. Search the ETF explorer for any symbol with loaded price history.",
      },
    ],
    useCases: [
      "Candlestick and line charts",
      "CAGR and max drawdown calculators",
      "ETF comparison pages",
      "Quant research notebooks",
    ],
    faqs: [
      {
        q: "How far back does history go?",
        a: "Coverage depends on imported market data (typically from 2010 onward for US ETFs in the priced universe). Check /status for latest price date and row counts.",
      },
      {
        q: "Are prices adjusted?",
        a: "Imported series prioritize split- and dividend-adjusted closes where available from the source files. Document your assumptions when publishing returns.",
      },
    ],
    related: [
      { href: "/stock-api", label: "Stock market API" },
      { href: "/technical-indicators-api", label: "Technical indicators API" },
      { href: "/blog/historical-etf-data-api", label: "Historical ETF data guide" },
    ],
  },
  {
    slug: "technical-indicators-api",
    keyword: "technical indicators API",
    title: "Technical Indicators API — RSI, SMA, EMA for ETF Apps",
    description:
      "Technical indicators API for US ETFs: RSI, SMA, EMA and related momentum metrics derived from historical closes. Build research tools without recomputing every series yourself.",
    heroEyebrow: "Technical indicators API",
    heroHeadline: "RSI, SMA, and EMA from the same price history",
    heroSubhead:
      "Data Captain derives technical indicators from ETF closing prices so your dashboard can show trend and momentum without maintaining a separate calculation pipeline.",
    primaryCta: { label: "Get API key", href: "/auth/signup" },
    secondaryCta: { label: "Read the docs", href: "/docs" },
    endpoints: [
      { method: "GET", path: "/api/indicators/:symbol", note: "RSI / SMA / EMA snapshot" },
      { method: "GET", path: "/api/stocks/:symbol/history", note: "Raw series for custom indicators" },
      { method: "GET", path: "/api/stocks/:symbol/snapshot", note: "Quote + indicators bundle" },
    ],
    features: [
      {
        title: "Derived from real history",
        body: "Indicators are calculations over OHLCV — not independent feeds. Warm-up windows and periods are documented in the API response context.",
      },
      {
        title: "Research-ready, not signals",
        body: "Expose RSI and moving averages as research inputs. Pair with price charts and explicit risk disclosures in your product.",
      },
      {
        title: "Custom math still possible",
        body: "Need MACD variants or custom windows? Pull /history and compute on your side while using our endpoint for common defaults.",
      },
    ],
    useCases: [
      "Trading education apps",
      "ETF research dashboards",
      "Alert prototypes (with your own rules)",
      "Snapshot cards for watchlists",
    ],
    faqs: [
      {
        q: "Which indicators are included?",
        a: "The indicators endpoint returns commonly used values such as RSI and moving averages based on recent closes. Exact fields depend on plan and available history for the symbol.",
      },
      {
        q: "Why might my RSI differ from another site?",
        a: "Adjustment method, period length, and smoothing (e.g. Wilder) change results. Always document the period and source date next to the number.",
      },
    ],
    related: [
      { href: "/historical-stock-api", label: "Historical stock API" },
      { href: "/blog/rsi-api-guide", label: "RSI API guide" },
      { href: "/blog/sma-ema-api-guide", label: "SMA & EMA guide" },
    ],
  },
  {
    slug: "market-news-api",
    keyword: "market news API",
    title: "Market News API — Headlines for ETF & Symbol Pages",
    description:
      "Market news API endpoint for symbol headlines and summaries. Enrich ETF detail pages and snapshots with recent news alongside prices.",
    heroEyebrow: "Market news API",
    heroHeadline: "Attach market headlines to any symbol page",
    heroSubhead:
      "Fetch recent news items by symbol for dashboards and research UIs. Combine with price and profile endpoints for a complete snapshot.",
    primaryCta: { label: "Open docs", href: "/docs" },
    secondaryCta: { label: "Create account", href: "/auth/signup" },
    coverageNote:
      "News coverage is available via API routes and demo data. Depth varies by symbol — verify responses in the API Explorer before relying on news in production.",
    endpoints: [
      { method: "GET", path: "/api/stocks/:symbol/news", note: "Recent headlines" },
      { method: "GET", path: "/api/stocks/:symbol/snapshot", note: "Price + news bundle" },
      { method: "GET", path: "/api/etf/:symbol", note: "Fund metadata" },
    ],
    features: [
      {
        title: "Symbol-scoped feed",
        body: "Request news for the ETF or ticker the user is viewing — keep UI context clear.",
      },
      {
        title: "Works with snapshots",
        body: "Bundle quote, profile, and news in one product experience using snapshot-style flows.",
      },
      {
        title: "Simple JSON for frontends",
        body: "Headline, summary, source, URL, and published time — enough for cards and side panels.",
      },
    ],
    useCases: [
      "ETF detail page sidebars",
      "Research brief widgets",
      "Morning brief prototypes",
      "Mobile watchlist detail views",
    ],
    faqs: [
      {
        q: "Is this a full global news wire?",
        a: "No. It is a symbol-associated news endpoint for product UIs. For enterprise wire coverage, combine Data Captain market data with a dedicated news vendor if needed.",
      },
    ],
    related: [
      { href: "/stock-api", label: "Stock market API" },
      { href: "/stock-screener-api", label: "Screener API" },
      { href: "/docs", label: "API reference" },
    ],
  },
  {
    slug: "stock-screener-api",
    keyword: "stock screener API",
    title: "Stock Screener API — Filter US ETFs by Return, Yield & Risk",
    description:
      "Stock screener API for US ETFs: filter by return, dividend yield, volatility, and asset class. Paginated JSON for React screeners and research tools.",
    heroEyebrow: "Stock screener API",
    heroHeadline: "Screen thousands of ETFs with one query",
    heroSubhead:
      "Data Captain’s screener endpoints filter pre-computed ETF metrics so your UI stays fast — no recalculating years of history on every request.",
    primaryCta: { label: "Get free API key", href: "/auth/signup" },
    secondaryCta: { label: "ETF screener blog", href: "/blog/build-etf-screener-react" },
    endpoints: [
      { method: "GET", path: "/api/etf/screener", note: "Return / yield / volatility filters" },
      { method: "GET", path: "/api/etf/rankings", note: "Top performers by category" },
      { method: "GET", path: "/api/etf/heatmap", note: "Basket performance grid" },
      { method: "GET", path: "/api/screener", note: "Sector / price / volume filters" },
    ],
    features: [
      {
        title: "Pre-computed metrics",
        body: "Nightly (or on-demand) metric jobs fill etf_metrics so screener queries stay O(1) per fund.",
      },
      {
        title: "Pagination & search",
        body: "Limit, offset, and search parameters support large universes without dumping 20k+ rows to the browser.",
      },
      {
        title: "Heatmap & rankings",
        body: "Complement the screener with ranking and heatmap endpoints for product marketing pages.",
      },
    ],
    useCases: [
      "In-app ETF discovery",
      "Content sites with live tables",
      "Advisor research tools",
      "React screener tutorials and demos",
    ],
    faqs: [
      {
        q: "Can I screen individual stocks (AAPL, TSLA)?",
        a: "The production dataset and metrics pipeline are ETF-focused. Screener results reflect ETFs with computed metrics and price history.",
      },
    ],
    related: [
      { href: "/stock-api", label: "Stock market API" },
      { href: "/technical-indicators-api", label: "Indicators API" },
      { href: "/blog/market-heatmap-api", label: "Heatmap API guide" },
    ],
  },
  {
    slug: "financial-statements-api",
    keyword: "financial statements API",
    title: "Financial Data API — Earnings, Profiles & ETF Fundamentals",
    description:
      "Financial data API for ETF profiles, earnings calendar events, and company metadata. Start with earnings and profiles while building statement-ready product flows.",
    heroEyebrow: "Financial data API",
    heroHeadline: "Earnings and fund profiles for investment apps",
    heroSubhead:
      "Pull symbol profiles, earnings-related endpoints, and fund metadata to enrich research pages. Full GAAP financial statements are not the core Data Captain catalog — we focus on ETF market data and analytics.",
    primaryCta: { label: "Explore API docs", href: "/docs" },
    secondaryCta: { label: "View pricing", href: "/pricing" },
    coverageNote:
      "Data Captain specializes in US ETF prices, backtests, and screeners. Earnings calendar and profile endpoints exist for product enrichment. If you need 10-K style income statements and balance sheets, pair us with a fundamentals vendor — or contact sales for roadmap timing.",
    endpoints: [
      { method: "GET", path: "/api/stocks/:symbol/profile", note: "Name, sector, exchange" },
      { method: "GET", path: "/api/stocks/:symbol/earnings", note: "Earnings history / events" },
      { method: "GET", path: "/api/etf/:symbol", note: "ETF detail" },
      { method: "GET", path: "/api/stocks/:symbol/snapshot", note: "Combined research card" },
    ],
    features: [
      {
        title: "Profiles for UI labels",
        body: "Show human-readable names, sector, and exchange next to charts and screeners.",
      },
      {
        title: "Earnings context",
        body: "Surface upcoming or recent earnings where data is loaded — useful for event calendars.",
      },
      {
        title: "Honest API boundaries",
        body: "We do not pretend to be a full financial-statements warehouse. Use the right tool for each layer of your stack.",
      },
    ],
    useCases: [
      "ETF research side panels",
      "Earnings calendar widgets",
      "Fund comparison landing pages",
      "Hybrid apps (prices + third-party fundamentals)",
    ],
    faqs: [
      {
        q: "Do you provide income statements and balance sheets?",
        a: "Not as a primary product today. Use profile and earnings endpoints for enrichment, and a fundamentals provider for full statements — or ask sales about enterprise data expansion.",
      },
    ],
    related: [
      { href: "/stock-api", label: "Stock market API" },
      { href: "/historical-stock-api", label: "Historical API" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
];

export function getSeoLandingPage(slug: string): SeoLandingPage | undefined {
  return SEO_LANDING_PAGES.find((p) => p.slug === slug);
}

export function getAllSeoLandingSlugs(): string[] {
  return SEO_LANDING_PAGES.map((p) => p.slug);
}
