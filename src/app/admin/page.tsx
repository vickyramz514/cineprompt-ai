"use client";

import Link from "next/link";

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <p className="mt-1 text-white/60">Template management</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/templates"
          className="rounded-xl border border-white/5 bg-white/[0.02] p-6 transition-colors hover:border-white/10"
        >
          <h2 className="font-semibold">Templates</h2>
          <p className="mt-2 text-sm text-white/60">Create and manage templates</p>
        </Link>
        <Link
          href="/admin/templates/new"
          className="rounded-xl border border-white/5 bg-white/[0.02] p-6 transition-colors hover:border-white/10"
        >
          <h2 className="font-semibold">Create Template</h2>
          <p className="mt-2 text-sm text-white/60">Add new template</p>
        </Link>
      </div>
    </div>
  );
}
