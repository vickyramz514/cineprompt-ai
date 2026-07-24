import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/MarketingShell";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "SDK Docs — npm & Python",
  description:
    "Official Data Captain SDKs: install datacaptain from npm or PyPI. TypeScript and Python examples for ETF list, screener, backtest, and portfolio.",
  alternates: { canonical: `${siteUrl}/sdk` },
  openGraph: {
    title: "Data Captain SDK Docs",
    description: "npm install datacaptain · pip install datacaptain — usage examples for US ETF APIs.",
    url: `${siteUrl}/sdk`,
    type: "website",
  },
};

function CodeBlock({ children, label }: { children: string; label?: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
      {label && (
        <div className="border-b border-white/10 px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-white/40">
          {label}
        </div>
      )}
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-emerald-300/95 sm:text-sm">
        <code>{children}</code>
      </pre>
    </div>
  );
}

const TOC = [
  { id: "install", label: "Install" },
  { id: "auth", label: "Authentication" },
  { id: "typescript", label: "TypeScript / npm" },
  { id: "python", label: "Python / pip" },
  { id: "methods", label: "API methods" },
  { id: "errors", label: "Errors" },
  { id: "links", label: "Links" },
];

export default function SdkDocsPage() {
  return (
    <MarketingShell active="sdk">
      <div className="mx-auto max-w-4xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300/90">Developers</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">SDK Docs</h1>
        <p className="mt-3 max-w-2xl text-lg text-white/55">
          Official client libraries for the Data Captain US ETF API. Same API key as the REST docs — typed helpers
          for list, screener, backtest, and portfolio.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="https://www.npmjs.com/package/datacaptain"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm text-white/80 hover:border-indigo-400/40"
          >
            npm · datacaptain@0.1.0
          </a>
          <a
            href="https://pypi.org/project/datacaptain/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm text-white/80 hover:border-indigo-400/40"
          >
            PyPI · datacaptain@0.1.0
          </a>
          <Link
            href="/docs"
            className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm text-white/80 hover:border-indigo-400/40"
          >
            REST API docs →
          </Link>
        </div>

        <nav
          aria-label="On this page"
          className="mt-10 rounded-2xl border border-white/10 bg-white/[0.025] p-5"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">On this page</p>
          <ol className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/60">
            {TOC.map((item, i) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="hover:text-indigo-300">
                  {i + 1}. {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <section id="install" className="mt-14 scroll-mt-28">
          <h2 className="text-xl font-semibold text-white">Install</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <CodeBlock label="npm / yarn / pnpm">{`npm install datacaptain
# yarn add datacaptain
# pnpm add datacaptain`}</CodeBlock>
            <CodeBlock label="pip">{`pip install datacaptain
# python -m pip install datacaptain`}</CodeBlock>
          </div>
          <p className="mt-3 text-sm text-white/45">
            Requires Node.js 18+ (native <code className="text-white/60">fetch</code>) or Python 3.9+.
          </p>
        </section>

        <section id="auth" className="mt-14 scroll-mt-28">
          <h2 className="text-xl font-semibold text-white">Authentication</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            Create a key in{" "}
            <Link href="/dashboard/api-keys" className="text-indigo-400 hover:underline">
              Dashboard → API Keys
            </Link>
            . The SDK sends it as the <code className="rounded bg-white/10 px-1">x-api-key</code> header. Default
            API origin is <code className="rounded bg-white/10 px-1">https://datacaptain.up.railway.app</code>{" "}
            (override with <code className="rounded bg-white/10 px-1">baseUrl</code> / <code className="rounded bg-white/10 px-1">base_url</code> — origin only, no{" "}
            <code className="rounded bg-white/10 px-1">/api</code> suffix).
          </p>
        </section>

        <section id="typescript" className="mt-14 scroll-mt-28">
          <h2 className="text-xl font-semibold text-white">TypeScript / JavaScript</h2>
          <p className="mt-2 text-sm text-white/55">Package: <code className="text-white/70">datacaptain</code> on npm</p>

          <h3 className="mt-6 text-sm font-medium text-white/80">Quick start</h3>
          <div className="mt-3">
            <CodeBlock label="TypeScript">{`import { DataCaptain, DataCaptainError } from "datacaptain";

const dc = new DataCaptain({
  apiKey: process.env.DATACAPTAIN_API_KEY!,
  // baseUrl: "https://datacaptain.up.railway.app", // optional
});

try {
  const usage = await dc.developer.usage();
  const list = await dc.etf.list({ search: "SPY", limit: 10 });
  const prices = await dc.prices.batch(["SPY", "QQQ", "VOO"]);
  const status = await dc.market.status();

  const rankings = await dc.etf.rankings({
    category: "return",
    period: "1y",
    limit: 20,
  });

  const screen = await dc.etf.screener({
    returnMin: 10,
    period: "1y",
    sort: "return",
  });

  const heatmap = await dc.etf.heatmap({ basket: "broad", period: "1y" });

  const backtest = await dc.backtest.buyAndHold({
    symbol: "SPY",
    investment: 10_000,
    startDate: "2020-01-01",
    endDate: "2024-12-31",
  });

  const compare = await dc.backtest.compare({
    symbols: ["SPY", "QQQ", "VOO"],
    investment: 10_000,
    startDate: "2018-01-01",
    endDate: "2024-12-31",
  });

  const rebalance = await dc.portfolio.rebalance({
    holdings: [
      { symbol: "SPY", value: 6000 },
      { symbol: "BND", value: 4000 },
    ],
    target: [
      { symbol: "SPY", weight: 0.6 },
      { symbol: "BND", weight: 0.4 },
    ],
    driftThreshold: 0.02,
  });

  console.log({ usage, list, prices, status, rankings, screen, heatmap, backtest, compare, rebalance });
} catch (err) {
  if (err instanceof DataCaptainError) {
    console.error(err.message, err.statusCode, err.code);
  }
  throw err;
}`}</CodeBlock>
          </div>

          <h3 className="mt-6 text-sm font-medium text-white/80">Namespaces</h3>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            <li>
              <code className="text-indigo-300">dc.developer.usage()</code> — plan & daily quota
            </li>
            <li>
              <code className="text-indigo-300">dc.market.status()</code> — US market open/closed
            </li>
            <li>
              <code className="text-indigo-300">dc.prices.batch(symbols)</code> — latest prices
            </li>
            <li>
              <code className="text-indigo-300">dc.etf.*</code> — list, get, screener, rankings, heatmap
            </li>
            <li>
              <code className="text-indigo-300">dc.backtest.*</code> — buyAndHold, compare
            </li>
            <li>
              <code className="text-indigo-300">dc.portfolio.rebalance()</code> — target weights
            </li>
          </ul>
        </section>

        <section id="python" className="mt-14 scroll-mt-28">
          <h2 className="text-xl font-semibold text-white">Python</h2>
          <p className="mt-2 text-sm text-white/55">
            Package: <code className="text-white/70">datacaptain</code> on PyPI (stdlib HTTP — no extra deps)
          </p>

          <h3 className="mt-6 text-sm font-medium text-white/80">Quick start</h3>
          <div className="mt-3">
            <CodeBlock label="Python">{`import os
from datacaptain import DataCaptain, DataCaptainError

dc = DataCaptain(
    api_key=os.environ["DATACAPTAIN_API_KEY"],
    # base_url="https://datacaptain.up.railway.app",  # optional
)

try:
    usage = dc.developer_usage()
    etfs = dc.etf_list(search="SPY", limit=10)
    detail = dc.etf_get("SPY")

    screen = dc.etf_screener(
        return_min=10,
        dividend_yield_min=2,
        period="1y",
        sort="return",
    )

    heatmap = dc.etf_heatmap(basket="broad", period="1y")

    prices = dc.batch_prices(["SPY", "QQQ", "VOO"])
    status = dc.market_status()

    bt = dc.backtest_buy_and_hold(
        symbol="SPY",
        start_date="2020-01-01",
        end_date="2024-12-31",
        investment=10000,
    )

    compare = dc.backtest_compare(
        symbols=["SPY", "QQQ", "VOO"],
        start_date="2018-01-01",
        end_date="2024-12-31",
        investment=10000,
    )

    rebalance = dc.portfolio_rebalance(
        holdings=[
            {"symbol": "VOO", "shares": 63},
            {"symbol": "QQQ", "shares": 37},
        ],
        target=[
            {"symbol": "VOO", "weight": 60},
            {"symbol": "QQQ", "weight": 40},
        ],
        drift_threshold=2,
    )

    print(usage, etfs["total"], bt.get("totalReturn"))
except DataCaptainError as e:
    print(str(e), e.status_code, e.code)`}</CodeBlock>
          </div>
        </section>

        <section id="methods" className="mt-14 scroll-mt-28">
          <h2 className="text-xl font-semibold text-white">Method map</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-white/40">
                <tr>
                  <th className="px-4 py-3 font-medium">Capability</th>
                  <th className="px-4 py-3 font-medium">TypeScript</th>
                  <th className="px-4 py-3 font-medium">Python</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/65">
                {[
                  ["Usage", "dc.developer.usage()", "dc.developer_usage()"],
                  ["Market status", "dc.market.status()", "dc.market_status()"],
                  ["Batch prices", "dc.prices.batch([...])", "dc.batch_prices([...])"],
                  ["ETF list", "dc.etf.list({...})", "dc.etf_list(...)"],
                  ["ETF detail", "dc.etf.get('SPY')", "dc.etf_get('SPY')"],
                  ["Screener", "dc.etf.screener({...})", "dc.etf_screener(...)"],
                  ["Rankings", "dc.etf.rankings({...})", "— (use REST /etf/rankings)"],
                  ["Heatmap", "dc.etf.heatmap({...})", "dc.etf_heatmap(...)"],
                  ["Backtest", "dc.backtest.buyAndHold({...})", "dc.backtest_buy_and_hold(...)"],
                  ["Compare", "dc.backtest.compare({...})", "dc.backtest_compare(...)"],
                  ["Rebalance", "dc.portfolio.rebalance({...})", "dc.portfolio_rebalance(...)"],
                ].map(([cap, ts, py]) => (
                  <tr key={cap}>
                    <td className="px-4 py-2.5 text-white/80">{cap}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-emerald-300/90">{ts}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-emerald-300/90">{py}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="errors" className="mt-14 scroll-mt-28">
          <h2 className="text-xl font-semibold text-white">Errors</h2>
          <p className="mt-3 text-sm text-white/60">
            Both SDKs throw <code className="rounded bg-white/10 px-1">DataCaptainError</code> with{" "}
            <code className="rounded bg-white/10 px-1">statusCode</code> /{" "}
            <code className="rounded bg-white/10 px-1">status_code</code> and optional{" "}
            <code className="rounded bg-white/10 px-1">code</code> (plan limits, not found, etc.).
          </p>
        </section>

        <section id="links" className="mt-14 scroll-mt-28 border-t border-white/10 pt-10">
          <h2 className="text-xl font-semibold text-white">Next steps</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/auth/signup" className="text-indigo-400 hover:underline">
                Get a free API key →
              </Link>
            </li>
            <li>
              <Link href="/docs" className="text-indigo-400 hover:underline">
                Full REST reference →
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="text-indigo-400 hover:underline">
                Plans & rate limits →
              </Link>
            </li>
            <li>
              <a
                href="https://www.npmjs.com/package/datacaptain"
                className="text-indigo-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                npm package →
              </a>
            </li>
            <li>
              <a
                href="https://pypi.org/project/datacaptain/"
                className="text-indigo-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                PyPI package →
              </a>
            </li>
          </ul>
        </section>
      </div>
    </MarketingShell>
  );
}
