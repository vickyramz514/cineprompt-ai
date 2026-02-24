"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TEMPLATES,
  getTemplatesByNiche,
  getTrendingTemplates,
} from "@/lib/templates-data";
import { NICHES } from "@/lib/niches";
import { useTemplateStore } from "@/store/useStore";
import type { Template } from "@/lib/template-schema";

function DashboardTemplatesContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const nicheParam = searchParams.get("niche");
  const [nicheFilter, setNicheFilter] = useState<string | null>(nicheParam);

  const { favorites, usedTemplates, addFavorite, removeFavorite, isFavorite } =
    useTemplateStore();

  let displayTemplates: Template[] = [];

  if (tab === "favorites") {
    displayTemplates = favorites
      .map((f) => TEMPLATES.find((t) => t.id === f.templateId))
      .filter(Boolean) as Template[];
  } else if (tab === "my") {
    const usedIds = [...new Set(usedTemplates.map((u) => u.templateId))];
    displayTemplates = usedIds
      .map((id) => TEMPLATES.find((t) => t.id === id))
      .filter(Boolean) as Template[];
  } else {
    displayTemplates = nicheFilter
      ? getTemplatesByNiche(nicheFilter)
      : TEMPLATES;
  }

  const trending = getTrendingTemplates();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Templates</h1>
      <p className="mt-1 text-white/60">
        {tab === "favorites"
          ? "Your favorite templates"
          : tab === "my"
          ? "Templates you've used"
          : "Browse and use templates"}
      </p>

      {/* Tabs */}
      <div className="mt-6 flex gap-2">
        <Link
          href="/dashboard/templates"
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            !tab ? "bg-indigo-500 text-white" : "bg-white/5 text-white/80 hover:bg-white/10"
          }`}
        >
          All
        </Link>
        <Link
          href="/dashboard/templates?tab=my"
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            tab === "my" ? "bg-indigo-500 text-white" : "bg-white/5 text-white/80 hover:bg-white/10"
          }`}
        >
          My Templates
        </Link>
        <Link
          href="/dashboard/templates?tab=favorites"
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            tab === "favorites" ? "bg-indigo-500 text-white" : "bg-white/5 text-white/80 hover:bg-white/10"
          }`}
        >
          Favorites
        </Link>
      </div>

      {/* Niche filter - only when not in tab */}
      {!tab && (
        <div className="mt-6 flex flex-wrap gap-2">
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
      )}

      {/* Trending - when on All */}
      {!tab && !nicheFilter && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">Trending</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trending.map((t) => (
              <TemplateGridCard
                key={t.id}
                template={t}
                isFavorite={isFavorite(t.id)}
                onFavorite={() => (isFavorite(t.id) ? removeFavorite(t.id) : addFavorite(t.id))}
              />
            ))}
          </div>
        </section>
      )}

      {/* Grid */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold">
          {tab === "favorites"
            ? "Favorite Templates"
            : tab === "my"
            ? "Used Templates"
            : nicheFilter
            ? NICHES.find((n) => n.id === nicheFilter)?.name
            : "All Templates"}
        </h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayTemplates.map((t) => (
            <TemplateGridCard
              key={t.id}
              template={t}
              isFavorite={isFavorite(t.id)}
              onFavorite={() => (isFavorite(t.id) ? removeFavorite(t.id) : addFavorite(t.id))}
            />
          ))}
        </div>
        {displayTemplates.length === 0 && (
          <p className="mt-8 text-center text-white/60">
            {tab === "favorites"
              ? "No favorites yet. Browse templates and add some!"
              : tab === "my"
              ? "No templates used yet. Create your first video!"
              : "No templates in this category."}
          </p>
        )}
      </section>
    </div>
  );
}

function TemplateGridCard({
  template,
  isFavorite,
  onFavorite,
}: {
  template: Template;
  isFavorite: boolean;
  onFavorite: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-all hover:border-white/10"
    >
      <Link href={`/templates/${template.id}`}>
        <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-indigo-900/30 to-purple-900/20">
          <div className="flex h-full items-center justify-center text-6xl opacity-50 transition-transform group-hover:scale-110">
            🎬
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              onFavorite();
            }}
            className="absolute right-2 top-2 rounded-full bg-black/50 p-2 hover:bg-black/70"
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/templates/${template.id}`}>
          <h3 className="font-semibold hover:text-indigo-400">{template.name}</h3>
        </Link>
        <p className="mt-1 text-sm text-white/60">{template.category}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-white/50">{template.creditsCost} credits</span>
          <Link
            href={`/templates/${template.id}`}
            className="rounded-lg bg-indigo-500/20 px-3 py-1.5 text-sm font-medium text-indigo-300 hover:bg-indigo-500/30"
          >
            Use Template
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardTemplatesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardTemplatesContent />
    </Suspense>
  );
}
