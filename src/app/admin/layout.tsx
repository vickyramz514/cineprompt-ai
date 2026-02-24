export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5 bg-black/40 px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span className="text-lg font-semibold">
            CinePrompt <span className="text-amber-400">Admin</span>
          </span>
          <a href="/dashboard" className="text-sm text-white/60 hover:text-white">
            ← Back to app
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
