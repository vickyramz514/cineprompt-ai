"use client";

import Image from "next/image";
import { useState } from "react";
import SupportDialog from "@/components/support/SupportDialog";
import { DONATION_CONFIG, DONATION_INFO_COPY } from "@/lib/donation-config";

type Variant = "header" | "footer" | "compact";

const triggerBase =
  "inline-flex items-center justify-center rounded-full border border-[var(--dc-border)] font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dc-accent)]";

const variantStyles: Record<Variant, { wrap: string; button: string; info: string; label: string }> = {
  header: {
    wrap: "flex items-center gap-1",
    button: `${triggerBase} gap-1.5 bg-[var(--dc-accent-soft)] px-3 py-2 text-xs text-[var(--dc-fg)] hover:border-[var(--dc-accent)]/40 sm:text-sm`,
    info: `${triggerBase} h-9 w-9 bg-[var(--dc-elevated)] text-[var(--dc-muted)] hover:border-[var(--dc-accent)]/40 hover:bg-[var(--dc-accent-soft)] hover:text-[var(--dc-fg)]`,
    label: "hidden sm:inline",
  },
  footer: {
    wrap: "flex flex-wrap items-center gap-2",
    button: `${triggerBase} gap-2 bg-[var(--dc-accent-soft)] px-4 py-2.5 text-sm text-[var(--dc-fg)] hover:border-[var(--dc-accent)]/40`,
    info: `${triggerBase} h-10 w-10 bg-[var(--dc-elevated)] text-[var(--dc-muted)] hover:border-[var(--dc-accent)]/40 hover:bg-[var(--dc-accent-soft)] hover:text-[var(--dc-fg)]`,
    label: "inline",
  },
  compact: {
    wrap: "flex items-center gap-1",
    button: `${triggerBase} gap-1 bg-[var(--dc-accent-soft)] px-2.5 py-1.5 text-[11px] text-[var(--dc-fg)] hover:border-[var(--dc-accent)]/40`,
    info: `${triggerBase} h-8 w-8 bg-[var(--dc-elevated)] text-[var(--dc-muted)] hover:border-[var(--dc-accent)]/40 hover:bg-[var(--dc-accent-soft)] hover:text-[var(--dc-fg)]`,
    label: "hidden lg:inline",
  },
};

function InfoIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
  );
}

export default function SupportDataCaptain({ variant = "header" }: { variant?: Variant }) {
  const [infoOpen, setInfoOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const styles = variantStyles[variant];

  return (
    <>
      <div className={styles.wrap}>
        <button
          type="button"
          onClick={() => setDonateOpen(true)}
          className={styles.button}
          aria-haspopup="dialog"
        >
          <span aria-hidden>❤️</span>
          <span className={styles.label}>Support DataCaptain</span>
          {variant === "compact" ? <span className="lg:hidden">Support</span> : null}
        </button>
        <button
          type="button"
          onClick={() => setInfoOpen(true)}
          className={styles.info}
          aria-label="Why support DataCaptain"
          title="Why support DataCaptain?"
        >
          <InfoIcon />
        </button>
      </div>

      <SupportDialog open={infoOpen} onClose={() => setInfoOpen(false)} title={DONATION_INFO_COPY.title}>
        <div className="space-y-4 text-sm leading-relaxed text-[var(--dc-muted)]">
          <div>
            <p className="mb-2 text-[var(--dc-fg)]">{DONATION_INFO_COPY.paragraphs[0]}</p>
            <ul className="list-inside list-disc space-y-1.5 pl-1">
              {DONATION_INFO_COPY.bulletItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <p>{DONATION_INFO_COPY.paragraphs[1]}</p>
          <p>{DONATION_INFO_COPY.paragraphs[2]}</p>
          <p className="font-medium text-[var(--dc-fg)]">{DONATION_INFO_COPY.paragraphs[3]}</p>
        </div>
      </SupportDialog>

      <SupportDialog
        open={donateOpen}
        onClose={() => setDonateOpen(false)}
        title={`❤️ ${DONATION_INFO_COPY.donationTitle}`}
        maxWidth="sm"
      >
        <div className="flex flex-col items-center text-center">
          <p className="text-sm text-[var(--dc-muted)]">{DONATION_INFO_COPY.donationSubtitle}</p>

          <div className="relative mt-5 overflow-hidden rounded-2xl border border-[var(--dc-border)] bg-white p-3 shadow-inner">
            <Image
              src={DONATION_CONFIG.qrImagePath}
              alt={DONATION_CONFIG.qrImageAlt}
              width={240}
              height={240}
              className="h-auto w-[min(240px,70vw)]"
              priority={false}
            />
          </div>

          <p className="mt-5 text-sm font-medium text-[var(--dc-fg)]">{DONATION_INFO_COPY.thankYou}</p>
          <p className="mt-1 text-xs font-medium text-[var(--dc-muted)]">
            100+ developers already donated.
          </p>
        </div>
      </SupportDialog>
    </>
  );
}
