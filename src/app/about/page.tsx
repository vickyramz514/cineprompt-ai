import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/MarketingShell";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SUPPORT_EMAIL, mailtoSupport, mailtoSales, SALES_EMAIL } from "@/lib/site";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = buildPageMetadata({
  title: "About Data Captain — US ETF API for Builders",
  description:
    "Data Captain builds a developer-first US ETF data API: historical prices, screener, backtesting, and portfolio tools with official npm and Python SDKs.",
  path: "/about",
  keywords: ["About Data Captain", "ETF API company", "market data for developers"],
});

export default function AboutPage() {
  const site = getSiteUrl();

  return (
    <MarketingShell active="home">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About Data Captain",
          url: `${site}/about`,
          description:
            "Data Captain provides a US ETF data API and developer tools for historical prices, screening, backtesting, and portfolios.",
          mainEntity: {
            "@type": "Organization",
            name: "Data Captain",
            url: site,
          },
        }}
      />

      <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
        <p className="text-xs font-medium uppercase tracking-widest text-indigo-300/80">Company</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">About Data Captain</h1>
        <p className="mt-4 text-lg text-white/60">
          Data Captain is a US ETF data platform for developers, analysts, and fintech builders.
          One API key unlocks market data, backtests, and portfolio tools — so you ship products
          instead of stitching together vendor spreadsheets.
        </p>

        <section className="mt-12 space-y-4">
          <h2 className="text-xl font-semibold">What we build</h2>
          <p className="text-white/55 leading-relaxed">
            Our REST API and official SDKs (npm <code className="text-indigo-300">datacaptain</code>,
            PyPI <code className="text-indigo-300">datacaptain</code>) cover the ETF universe,
            batch prices, screeners, heatmaps, rankings, historical OHLCV, strategy backtests, and
            portfolio rebalance helpers. Free tier for exploration; paid plans when you need history
            and higher limits.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-semibold">Who it is for</h2>
          <ul className="list-disc space-y-2 pl-5 text-white/55">
            <li>Developers embedding ETF data in apps and dashboards</li>
            <li>Quants and researchers running reproducible backtests</li>
            <li>Analysts comparing funds and screening the ETF universe</li>
            <li>Fintech teams that want predictable JSON and clear rate limits</li>
          </ul>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-semibold">Get started</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/auth/signup"
              className="inline-flex rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600"
            >
              Get a free API key
            </Link>
            <Link
              href="/docs"
              className="inline-flex rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/5"
            >
              Read the docs
            </Link>
            <Link
              href="/pricing"
              className="inline-flex rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/5"
            >
              View pricing
            </Link>
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="text-lg font-semibold">Contact</h2>
          <p className="mt-2 text-sm text-white/55">
            Product &amp; billing:{" "}
            <a href={mailtoSupport("About Data Captain")} className="text-indigo-400 hover:underline">
              {SUPPORT_EMAIL}
            </a>
            <br />
            Sales &amp; enterprise:{" "}
            <a href={mailtoSales("Enterprise inquiry")} className="text-indigo-400 hover:underline">
              {SALES_EMAIL}
            </a>
          </p>
        </section>
      </div>
    </MarketingShell>
  );
}
