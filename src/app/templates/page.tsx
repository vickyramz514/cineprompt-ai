"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TEMPLATES,
  getTemplatesByNiche,
  getTrendingTemplates,
} from "@/lib/templates-data";
import { NICHES } from "@/lib/niches";
import { useTemplateStore } from "@/store/useStore";

const LANGUAGES = ["English", "Tamil", "Hindi", "Telugu"];
const DURATIONS = [5, 10, 15];
const STYLES = ["cinematic", "fantasy", "realistic"];

function TemplateMarketplaceContent() {
  const searchParams = useSearchParams();
  const nicheParam = searchParams.get("niche");
  const [nicheFilter, setNicheFilter] = useState<string | null>(nicheParam);
  const [durationFilter, setDurationFilter] = useState<number | null>(null);
  const [styleFilter, setStyleFilter] = useState<string | null>(null);
  const [langFilter, setLangFilter] = useState<string | null>(null);
  const setSelectedNiche = useTemplateStore((s) => s.setSelectedNiche);

  useEffect(() => {
    if (nicheParam) {
      setNicheFilter(nicheParam);
      setSelectedNiche(nicheParam);
    }
  }, [nicheParam, setSelectedNiche]);

  let filtered = nicheFilter
    ? getTemplatesByNiche(nicheFilter)
    : TEMPLATES;

  if (durationFilter)
    filtered = filtered.filter((t) => t.duration === durationFilter);
  if (styleFilter) filtered = filtered.filter((t) => t.style === styleFilter);
  if (langFilter)
    filtered = filtered.filter((t) => t.languages.includes(langFilter));

  const trending = getTrendingTemplates();

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <Link href="/" className="text-xl font-semibold">
            CinePrompt <span className="text-indigo-400">AI</span>
          </Link>
          <div className="flex gap-4">
            <Link href="/auth/login" className="text-sm text-white/70 hover:text-white">
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold"
        >
          Template Marketplace
        </motion.h1>
        <p className="mt-2 text-white/60">
          Netflix + Canva + Runway — pick a template and create in seconds
        </p>

        {/* Filters */}
        <div className="mt-8 flex flex-wrap gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-white/50">Niche:</span>
            <button
              onClick={() => setNicheFilter(null)}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                !nicheFilter ? "bg-indigo-500 text-white" : "bg-white/5 text-white/80 hover:bg-white/10"
              }`}
            >
              All
            </button>
            {NICHES.map((n) => (
              <button
                key={n.id}
                onClick={() => setNicheFilter(n.id)}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  nicheFilter === n.id ? "bg-indigo-500 text-white" : "bg-white/5 text-white/80 hover:bg-white/10"
                }`}
              >
                {n.icon} {n.name}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <span className="text-sm text-white/50">Duration:</span>
            {DURATIONS.map((d) => (
              <button
                key={d}
                onClick={() => setDurationFilter(durationFilter === d ? null : d)}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  durationFilter === d ? "bg-indigo-500 text-white" : "bg-white/5 text-white/80 hover:bg-white/10"
                }`}
              >
                {d}s
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <span className="text-sm text-white/50">Language:</span>
            {LANGUAGES.map((l) => (
              <button
                key={l}
                onClick={() => setLangFilter(langFilter === l ? null : l)}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  langFilter === l ? "bg-indigo-500 text-white" : "bg-white/5 text-white/80 hover:bg-white/10"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Trending */}
        {!nicheFilter && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold">Trending</h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {trending.map((t) => (
                <TemplateCard key={t.id} template={t} />
              ))}
            </div>
          </section>
        )}

        {/* All templates */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold">
            {nicheFilter ? NICHES.find((n) => n.id === nicheFilter)?.name : "All Templates"}
          </h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function TemplateCard({
  template,
}: {
  template: (typeof TEMPLATES)[0];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-all hover:border-white/10 hover:bg-white/[0.04]"
    >
      <Link href={`/templates/${template.id}`}>
        <div className="aspect-video w-full overflow-hidden bg-gradient-to-br from-indigo-900/30 to-purple-900/20">
          <div className="flex h-full items-center justify-center text-6xl opacity-50 group-hover:scale-110 transition-transform">
            🎬
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{template.name}</h3>
            {template.isTrending && (
              <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-xs text-amber-400">
                Trending
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-white/60">{template.category}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded bg-white/10 px-2 py-0.5 text-xs">
              {template.duration}s
            </span>
            <span className="text-xs text-white/50">{template.creditsCost} credits</span>
          </div>
          <div className="mt-3">
            <span className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-500/20 py-2 text-sm font-medium text-indigo-300 group-hover:bg-indigo-500/30">
              Use Template
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <TemplateMarketplaceContent />
    </Suspense>
  );
}
