"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center text-white">
      <p className="text-xs font-medium uppercase tracking-widest text-rose-300/80">Error</p>
      <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Something went wrong</h1>
      <p className="mt-3 max-w-md text-sm text-white/55">
        {error.message || "An unexpected error occurred."}
        {error.digest ? (
          <span className="mt-2 block font-mono text-xs text-white/35">Ref: {error.digest}</span>
        ) : null}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/5"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
