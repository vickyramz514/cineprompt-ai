import Link from "next/link";
import type { SeoLandingPage } from "@/lib/seo-landing-pages";
import { MarketingShell } from "@/components/MarketingShell";

type Props = {
  page: SeoLandingPage;
  siteUrl: string;
};

export function SeoLandingView({ page, siteUrl }: Props) {
  const url = `${siteUrl}/${page.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.description,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: "Data Captain",
      url: siteUrl,
    },
    about: page.keyword,
  };

  const faqLd =
    page.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: page.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <MarketingShell active="docs">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }}
        />
      )}

      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.18),_transparent_55%)]"
        />
        <div className="relative mx-auto max-w-4xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300/90">
            {page.heroEyebrow}
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-5xl">
            {page.heroHeadline}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/60">{page.heroSubhead}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={page.primaryCta.href}
              className="inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              {page.primaryCta.label}
            </Link>
            <Link
              href={page.secondaryCta.href}
              className="inline-flex rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white/80 hover:border-indigo-500/40 hover:text-white"
            >
              {page.secondaryCta.label}
            </Link>
          </div>

          {page.coverageNote && (
            <p className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/80">
              {page.coverageNote}
            </p>
          )}

          <section className="mt-16" aria-labelledby="endpoints-heading">
            <h2 id="endpoints-heading" className="text-xl font-semibold text-white">
              Key endpoints
            </h2>
            <ul className="mt-5 space-y-3">
              {page.endpoints.map((ep) => (
                <li
                  key={ep.path}
                  className="flex flex-col gap-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
                      {ep.method}
                    </span>
                    <code className="font-mono text-sm text-white/90">{ep.path}</code>
                  </div>
                  <span className="text-sm text-white/45">{ep.note}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-16" aria-labelledby="features-heading">
            <h2 id="features-heading" className="text-xl font-semibold text-white">
              Why teams use Data Captain
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {page.features.map((f) => (
                <div key={f.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="font-medium text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{f.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16" aria-labelledby="use-cases-heading">
            <h2 id="use-cases-heading" className="text-xl font-semibold text-white">
              Common use cases
            </h2>
            <ul className="mt-4 space-y-2">
              {page.useCases.map((u) => (
                <li key={u} className="flex gap-3 text-sm text-white/65">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                  {u}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-16" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-xl font-semibold text-white">
              FAQ
            </h2>
            <div className="mt-5 space-y-4">
              {page.faqs.map((f) => (
                <div key={f.q} className="rounded-xl border border-white/10 bg-black/25 p-5">
                  <h3 className="font-medium text-white">{f.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16 border-t border-white/10 pt-10" aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-lg font-semibold text-white">
              Related pages
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {page.related.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="rounded-lg border border-white/10 px-3 py-2 text-sm text-indigo-300 hover:border-indigo-500/40"
                >
                  {r.label} →
                </Link>
              ))}
            </div>
          </section>

          <div className="mt-14 rounded-2xl border border-indigo-500/25 bg-indigo-500/10 p-8 text-center">
            <p className="text-sm text-white/65">Ship a market-data prototype this week</p>
            <Link
              href="/auth/signup"
              className="mt-4 inline-flex rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Start free
            </Link>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
