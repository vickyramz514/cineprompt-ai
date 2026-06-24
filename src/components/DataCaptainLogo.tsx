"use client";

import Image from "next/image";
import Link from "next/link";
import logoImage from "@/logo/logo.jpeg";
import {
  LOGO_ICON_SIZE,
  LOGO_SHOW_WORDMARK,
  LOGO_SIZE,
  LOGO_TEXT_CLASS,
  type LogoVariant,
} from "@/lib/brand";

interface DataCaptainLogoProps {
  variant?: LogoVariant;
  /** @deprecated use `variant` */
  size?: "sm" | "md" | "lg";
  /** Force wordmark on/off (default follows variant) */
  showText?: boolean;
  href?: string;
  className?: string;
}

const sizeToVariant: Record<NonNullable<DataCaptainLogoProps["size"]>, LogoVariant> = {
  sm: "sidebar",
  md: "header",
  lg: "auth",
};

const LOGO_ALT = "Data Captain — Navigate Smarter Investments";

function LegacyLogoIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 text-indigo-400"
      aria-hidden
    >
      <rect x="6" y="24" width="6" height="10" rx="1.5" fill="currentColor" opacity={0.85} />
      <rect x="14" y="18" width="6" height="16" rx="1.5" fill="currentColor" opacity={0.95} />
      <rect x="22" y="12" width="6" height="22" rx="1.5" fill="currentColor" opacity={0.9} />
      <rect x="30" y="6" width="6" height="28" rx="1.5" fill="currentColor" />
      <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.35} />
    </svg>
  );
}

function LogoImage({ variant }: { variant: LogoVariant }) {
  const px = LOGO_SIZE[variant];

  return (
    <Image
      src={logoImage}
      alt={LOGO_ALT}
      width={px}
      height={px}
      className="logo-brand-mark shrink-0 rounded-md object-contain"
      style={{ width: px, height: px, maxWidth: px, maxHeight: px }}
      priority={variant === "header"}
    />
  );
}

function LogoWordmark({ variant }: { variant: LogoVariant }) {
  return (
    <span className={`font-semibold tracking-tight whitespace-nowrap ${LOGO_TEXT_CLASS[variant]}`}>
      Data <span className="text-indigo-400">Captain</span>
    </span>
  );
}

function LogoLockup({ variant, showWordmark }: { variant: LogoVariant; showWordmark: boolean }) {
  const iconSize = LOGO_ICON_SIZE[variant];

  return (
    <span className="inline-flex items-center gap-2 sm:gap-2.5">
      <LogoImage variant={variant} />
      <span className="inline-flex items-center gap-1.5 border-l border-white/10 pl-2 sm:gap-2 sm:pl-2.5">
        <LegacyLogoIcon size={iconSize} />
        {showWordmark && <LogoWordmark variant={variant} />}
      </span>
    </span>
  );
}

export default function DataCaptainLogo({
  variant,
  size,
  showText,
  href = "/",
  className = "",
}: DataCaptainLogoProps) {
  const resolvedVariant = variant ?? (size ? sizeToVariant[size] : "header");
  const wordmark = showText ?? LOGO_SHOW_WORDMARK[resolvedVariant];
  const content = <LogoLockup variant={resolvedVariant} showWordmark={wordmark} />;

  if (!href) {
    return <div className={`inline-flex items-center ${className}`}>{content}</div>;
  }

  return (
    <Link
      href={href}
      className={`inline-flex items-center rounded-md outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-indigo-400/50 ${className}`}
    >
      {content}
    </Link>
  );
}
