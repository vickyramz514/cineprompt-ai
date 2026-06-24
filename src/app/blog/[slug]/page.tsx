import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MarketingShell } from "@/components/MarketingShell";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog-posts";
import { getSiteUrl } from "@/lib/site-url";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Not found" };

  const url = `${getSiteUrl()}/blog/${post.slug}`;
  return {
    title: `${post.title} | Data Captain`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.publishedAt,
    },
    alternates: { canonical: url },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <MarketingShell active="home">
      <article className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
        <Link href="/blog" className="text-sm text-indigo-400 hover:underline">
          ← All articles
        </Link>
        <header className="mt-6">
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
          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">{post.title}</h1>
          <p className="mt-4 text-lg text-white/55">{post.description}</p>
          <p className="mt-3 text-sm text-white/35">
            {post.publishedAt} · {post.readMinutes} min read
          </p>
        </header>

        <div className="prose prose-invert mt-12 max-w-none space-y-10">
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-semibold text-white">{section.heading}</h2>
              <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-white/65">
                {section.paragraphs.map((p) => (
                  <p key={p.slice(0, 48)}>{p}</p>
                ))}
              </div>
              {section.bullets && (
                <ul className="mt-4 space-y-2">
                  {section.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-sm text-white/60">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {post.cta && (
          <div className="mt-14 rounded-2xl border border-indigo-500/25 bg-indigo-500/10 p-8 text-center">
            <p className="text-sm text-white/60">Ready to build with Data Captain?</p>
            <Link
              href={post.cta.href}
              className="mt-4 inline-flex rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              {post.cta.label}
            </Link>
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-4 border-t border-white/10 pt-8 text-sm">
          <Link href="/docs" className="text-indigo-400 hover:underline">
            API documentation
          </Link>
          <Link href="/backtesting" className="text-indigo-400 hover:underline">
            Backtesting
          </Link>
          <Link href="/pricing" className="text-indigo-400 hover:underline">
            Pricing
          </Link>
        </div>
      </article>
    </MarketingShell>
  );
}
