import Link from "next/link";
import { MarketingShell } from "@/components/MarketingShell";
import { BLOG_POSTS } from "@/lib/blog-posts";

export const metadata = {
  title: "Blog | Data Captain — ETF APIs, backtests & market data",
  description:
    "Guides for developers and analysts: best ETF APIs, QQQ historical returns, SPY vs QQQ comparisons, and fintech integration tips.",
};

export default function BlogIndexPage() {
  return (
    <MarketingShell active="home">
      <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
        <p className="text-xs font-medium uppercase tracking-widest text-indigo-300/80">Resources</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Data Captain Blog</h1>
        <p className="mt-3 text-lg text-white/55">
          SEO-friendly guides for developers, quants, and fintech builders using US ETF data APIs.
        </p>

        <ul className="mt-12 space-y-6">
          {BLOG_POSTS.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="block rounded-2xl border border-white/10 bg-[#0c0c14]/80 p-6 transition-colors hover:border-indigo-500/30 hover:bg-indigo-500/5"
              >
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="mt-3 text-xl font-semibold text-white">{post.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{post.description}</p>
                <p className="mt-3 text-xs text-white/35">
                  {post.publishedAt} · {post.readMinutes} min read
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </MarketingShell>
  );
}
