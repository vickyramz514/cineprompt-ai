import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0f] px-4 text-center text-white">
      <p className="text-xs font-medium uppercase tracking-widest text-indigo-300/80">404</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Page not found</h1>
      <p className="mt-3 max-w-md text-white/55">
        That URL doesn&apos;t exist on Data Captain. Try the docs, pricing, or your dashboard.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600"
        >
          Home
        </Link>
        <Link
          href="/docs"
          className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/5"
        >
          API docs
        </Link>
        <Link
          href="/dashboard"
          className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/5"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
