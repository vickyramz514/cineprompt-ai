import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MarketingShell } from "@/components/MarketingShell";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog-posts";
import { getSiteUrl } from "@/lib/site-url";

type Props = { params: Promise<{ slug: string }> };

function headingId(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Not found" };

  const url = `${getSiteUrl()}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: "/logo/logo.jpeg",
          width: 1254,
          height: 1254,
          alt: `${post.title} — Data Captain`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ["/logo/logo.jpeg"],
    },
    alternates: { canonical: url },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const siteUrl = getSiteUrl();
  const articleUrl = `${siteUrl}/blog/${post.slug}`;
  const relatedPosts = (post.relatedSlugs ?? [])
    .map((relatedSlug) => getBlogPost(relatedSlug))
    .filter((related): related is NonNullable<typeof related> => Boolean(related))
    .slice(0, 3);
  const wordCount = post.sections
    .flatMap((section) => [...section.paragraphs, ...(section.bullets ?? [])])
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: articleUrl,
    mainEntityOfPage: articleUrl,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    wordCount,
    articleSection: post.tags,
    author: {
      "@type": "Organization",
      name: post.author,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Data Captain",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo/logo.jpeg`,
      },
    },
    image: `${siteUrl}/logo/logo.jpeg`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: articleUrl },
    ],
  };

  return (
    <MarketingShell active="home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <article className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8">
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
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/40">
            <span>By {post.author}</span>
            <span aria-hidden="true">·</span>
            <span>{post.readMinutes} min read</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.updatedAt}>Updated {formatDate(post.updatedAt)}</time>
          </div>
          <div className="mt-6">
            <ShareButtons title={post.title} url={articleUrl} />
          </div>
        </header>

        <nav
          aria-label="Table of contents"
          className="mt-10 rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-300/80">
            Table of contents
          </p>
          <ol className="mt-4 space-y-2">
            {post.sections.map((section, index) => (
              <li key={section.heading}>
                <a
                  href={`#${headingId(section.heading)}`}
                  className="text-sm text-white/55 transition-colors hover:text-indigo-300"
                >
                  {index + 1}. {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="prose prose-invert mt-12 max-w-none space-y-10">
          {post.sections.map((section) => (
            <section
              key={section.heading}
              id={headingId(section.heading)}
              className="scroll-mt-24"
            >
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

        {relatedPosts.length > 0 && (
          <section className="mt-14 border-t border-white/10 pt-10" aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-xl font-semibold text-white">
              Related articles
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="rounded-xl border border-white/10 bg-white/[0.025] p-4 transition-colors hover:border-indigo-500/30 hover:bg-indigo-500/5"
                >
                  <p className="text-sm font-medium leading-snug text-white/80">{related.title}</p>
                  <p className="mt-2 text-xs text-white/35">{related.readMinutes} min read</p>
                </Link>
              ))}
            </div>
          </section>
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
