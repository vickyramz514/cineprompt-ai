"use client";

import { useState } from "react";

type Props = {
  title: string;
  url: string;
};

export function ShareButtons({ title, url }: Props) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => {});
      return;
    }
    await copyLink();
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const buttonClass =
    "rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-white/60 transition-colors hover:border-indigo-500/30 hover:text-indigo-300";

  return (
    <div aria-label="Share this article" className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-medium uppercase tracking-wider text-white/35">Share</span>
      <a
        className={buttonClass}
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        LinkedIn
      </a>
      <a
        className={buttonClass}
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        X
      </a>
      <button className={buttonClass} type="button" onClick={copyLink}>
        {copied ? "Copied" : "Copy link"}
      </button>
      <button className={`${buttonClass} sm:hidden`} type="button" onClick={share}>
        More
      </button>
    </div>
  );
}
