"use client";

import Link from "next/link";

interface DataCaptainLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: 24, text: "text-lg" },
  md: { icon: 32, text: "text-xl" },
  lg: { icon: 40, text: "text-2xl" },
};

export default function DataCaptainLogo({ size = "md", showText = true, className = "" }: DataCaptainLogoProps) {
  const { icon: iconSize, text: textClass } = sizes[size];

  const logoSvg = (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 text-indigo-400"
    >
      {/* Chart bars (data) - ascending trend */}
      <rect x="6" y="24" width="6" height="10" rx="1.5" fill="currentColor" opacity={0.85} />
      <rect x="14" y="18" width="6" height="16" rx="1.5" fill="currentColor" opacity={0.95} />
      <rect x="22" y="12" width="6" height="22" rx="1.5" fill="currentColor" opacity={0.9} />
      <rect x="30" y="6" width="6" height="28" rx="1.5" fill="currentColor" />
      {/* Captain helm / compass ring - subtle */}
      <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.35} />
    </svg>
  );

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 font-semibold tracking-tight ${className}`}>
      {logoSvg}
      {showText && (
        <span className={textClass}>
          Data <span className="text-indigo-400">Captain</span>
        </span>
      )}
    </Link>
  );
}
