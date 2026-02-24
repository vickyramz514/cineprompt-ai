"use client";

import Link from "next/link";
import { TEMPLATES } from "@/lib/templates-data";
import { NICHES } from "@/lib/niches";

export default function AdminTemplatesPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Templates</h1>
        <Link
          href="/admin/templates/new"
          className="rounded-lg bg-indigo-500 px-4 py-2 font-medium text-white hover:bg-indigo-600"
        >
          Create Template
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Niche</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Duration</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Credits</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Fields</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-white/60">Actions</th>
            </tr>
          </thead>
          <tbody>
            {TEMPLATES.map((t) => (
              <tr key={t.id} className="border-b border-white/5">
                <td className="px-4 py-3 font-medium">{t.name}</td>
                <td className="px-4 py-3">
                  {NICHES.find((n) => n.id === t.nicheId)?.name ?? t.nicheId}
                </td>
                <td className="px-4 py-3">{t.duration}s</td>
                <td className="px-4 py-3">{t.creditsCost}</td>
                <td className="px-4 py-3">{t.inputFields.length}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/templates/${t.id}/edit`}
                    className="text-indigo-400 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
