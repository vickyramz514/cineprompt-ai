"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useVideoJobsStore } from "@/store/useStore";
import { useTemplateStore } from "@/store/useStore";
import {
  getTrendingTemplates,
  getRecommendedTemplates,
  getTemplateById,
} from "@/lib/templates-data";
import VideoCard from "@/components/VideoCard";

function TemplateThumb({ id, name }: { id: string; name: string }) {
  return (
    <Link href={`/templates/${id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] transition-colors hover:border-white/10"
      >
        <div className="aspect-video w-full bg-gradient-to-br from-indigo-900/30 to-purple-900/20" />
        <p className="p-3 text-sm font-medium">{name}</p>
      </motion.div>
    </Link>
  );
}

export default function DashboardPage() {
  const jobs = useVideoJobsStore((s) => s.jobs).slice(0, 6);
  const favorites = useTemplateStore((s) => s.favorites);
  const usedTemplates = useTemplateStore((s) => s.usedTemplates);

  const trending = getTrendingTemplates();
  const recommended = getRecommendedTemplates();
  const myTemplates = usedTemplates
    .slice(0, 6)
    .map((u) => getTemplateById(u.templateId))
    .filter(Boolean);
  const favTemplates = favorites
    .slice(0, 6)
    .map((f) => getTemplateById(f.templateId))
    .filter(Boolean);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-white/60">Your creative hub</p>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-4">
        <Link
          href="/templates"
          className="rounded-xl bg-indigo-500 px-6 py-2.5 font-medium text-white hover:bg-indigo-600"
        >
          Explore Templates
        </Link>
        <Link
          href="/dashboard/create"
          className="rounded-xl border border-white/20 px-6 py-2.5 font-medium text-white hover:bg-white/5"
        >
          Create from Scratch
        </Link>
      </div>

      {/* Recent videos */}
      <section>
        <h2 className="text-lg font-semibold">Recent Videos</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <VideoCard key={job.id} job={job} onDownload={() => {}} />
          ))}
        </div>
        <Link href="/dashboard/history" className="mt-4 inline-block text-indigo-400 hover:underline">
          View all history →
        </Link>
      </section>

      {/* Trending */}
      <section>
        <h2 className="text-lg font-semibold">Trending Templates</h2>
        <p className="mt-1 text-sm text-white/60">Popular this week</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((t) => (
            <TemplateThumb key={t.id} id={t.id} name={t.name} />
          ))}
        </div>
      </section>

      {/* Recommended */}
      <section>
        <h2 className="text-lg font-semibold">Recommended for You</h2>
        <p className="mt-1 text-sm text-white/60">Based on your activity</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recommended.map((t) => (
            <TemplateThumb key={t.id} id={t.id} name={t.name} />
          ))}
        </div>
      </section>

      {/* My Templates */}
      {myTemplates.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold">My Templates</h2>
          <p className="mt-1 text-sm text-white/60">Templates you&apos;ve used</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {myTemplates.map((t) => (
              <TemplateThumb key={t!.id} id={t!.id} name={t!.name} />
            ))}
          </div>
        </section>
      )}

      {/* Favorites */}
      {favTemplates.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold">Favorite Templates</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {favTemplates.map((t) => (
              <TemplateThumb key={t!.id} id={t!.id} name={t!.name} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
