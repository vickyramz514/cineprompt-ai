"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5 px-4 py-4 lg:px-8">
        <Link href="/" className="text-xl font-semibold">
          Stock Data <span className="text-indigo-400">API</span>
        </Link>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-16 lg:px-8">
        <h1 className="text-2xl font-semibold">Privacy Policy</h1>
        <p className="mt-4 text-white/60">Privacy policy content will be provided here.</p>
        <Link href="/" className="mt-8 inline-block text-indigo-400 hover:underline">← Back to home</Link>
      </main>
    </div>
  );
}
