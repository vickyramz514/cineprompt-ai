"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { LegalDocument } from "@/lib/legal-content";
import Footer from "@/components/Footer";
import DataCaptainLogo from "@/components/DataCaptainLogo";
import { MarketingHeaderActions } from "@/components/MarketingHeaderActions";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  document: LegalDocument;
  sibling: { href: string; label: string };
};

export default function LegalDocumentView({ document, sibling }: Props) {
  const { isAuthenticated } = useAuth();
  const { title, subtitle, lastUpdated, sections } = document;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-white/[0.06] bg-[#0a0a0f]/70 px-4 py-3 backdrop-blur-xl lg:px-8">
        <DataCaptainLogo size="md" />
        <MarketingHeaderActions variant="docs" isAuthenticated={isAuthenticated} />
      </header>

      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute top-1/3 right-0 h-80 w-80 rounded-full bg-violet-600/8 blur-3xl" />
      </div>

      <main className="relative px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <p className="text-xs font-medium uppercase tracking-widest text-indigo-300/80">Legal</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
            <p className="mt-3 text-lg text-white/55">{subtitle}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-white/50">
                Last updated {lastUpdated}
              </span>
              <Link href={sibling.href} className="text-indigo-400 hover:text-indigo-300 hover:underline">
                {sibling.label} →
              </Link>
            </div>
          </motion.div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-14">
            <nav
              className="hidden lg:block"
              aria-label="Table of contents"
            >
              <div className="sticky top-28 rounded-2xl border border-white/10 bg-[#0c0c14]/80 p-5 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/40">On this page</p>
                <ul className="mt-4 space-y-2">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="block text-sm text-white/50 transition-colors hover:text-indigo-300"
                      >
                        {s.title.replace(/^\d+\.\s*/, "")}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            <article className="min-w-0 space-y-10">
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 text-sm text-amber-100/90">
                This document is provided for transparency about how Data Captain operates. It is not legal advice.
                For specific compliance needs, consult qualified counsel.
              </div>

              {sections.map((section, i) => (
                <motion.section
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: Math.min(i * 0.03, 0.2) }}
                  className="scroll-mt-28 rounded-2xl border border-white/[0.06] bg-[#0c0c14]/60 p-6 sm:p-8"
                >
                  <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                  <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-white/65">
                    {section.paragraphs.map((p) => (
                      <p key={p.slice(0, 40)}>{p}</p>
                    ))}
                  </div>
                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="mt-4 space-y-2.5 border-t border-white/5 pt-4">
                      {section.bullets.map((b) => (
                        <li key={b.slice(0, 48)} className="flex gap-3 text-sm leading-relaxed text-white/60">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400/80" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.section>
              ))}

              <div className="flex flex-wrap gap-4 border-t border-white/10 pt-8">
                <Link
                  href="/"
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/80 hover:bg-white/[0.08]"
                >
                  ← Home
                </Link>
                <Link
                  href={sibling.href}
                  className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-5 py-2.5 text-sm font-medium text-indigo-200 hover:bg-indigo-500/15"
                >
                  {sibling.label}
                </Link>
                <Link
                  href="/dashboard/support"
                  className="rounded-xl px-5 py-2.5 text-sm font-medium text-white/50 hover:text-white"
                >
                  Contact support
                </Link>
              </div>
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
