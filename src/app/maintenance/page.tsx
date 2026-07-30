"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import DataCaptainLogo from "@/components/DataCaptainLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { MAINTENANCE_COPY, getMaintenanceMessage } from "@/lib/maintenance";
import { STATUS_PAGE_PATH, SUPPORT_EMAIL, mailtoSupport } from "@/lib/site";

export default function MaintenancePage() {
  const message = getMaintenanceMessage();

  useEffect(() => {
    document.title = "Maintenance — Data Captain";
  }, []);

  return (
    <div className="dc-page relative flex min-h-screen flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 50% at 50% -10%, color-mix(in srgb, var(--dc-accent) 28%, transparent), transparent 60%), radial-gradient(ellipse 50% 40% at 90% 80%, color-mix(in srgb, var(--dc-accent-2) 16%, transparent), transparent 55%)",
        }}
      />

      <header className="relative z-10 flex items-center justify-between px-4 py-4 sm:px-8">
        <DataCaptainLogo variant="header" href="/" />
        <ThemeToggle compact />
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-16 pt-8">
        <motion.div
          className="w-full max-w-xl text-center"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--dc-border)] bg-[var(--dc-accent-soft)]">
            <motion.svg
              className="h-8 w-8 text-[var(--dc-accent)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.174.1.31.245.41.41l.094.15a1.125 1.125 0 001.45.38l1.194-.597c.5-.25 1.1-.072 1.43.38l1.296 2.247c.33.452.24 1.07-.22 1.38l-1.12.747a1.125 1.125 0 00-.42 1.21c.03.13.047.268.047.41s-.017.28-.047.41c-.1.386.05.79.42 1.02l1.12.748c.46.31.55.928.22 1.38l-1.296 2.247c-.33.452-.93.63-1.43.38l-1.194-.597a1.125 1.125 0 00-1.45.38l-.094.15c-.1.165-.236.31-.41.41-.332.183-.582.495-.645.87l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a1.125 1.125 0 01-.41-.41l-.094-.15a1.125 1.125 0 00-1.45-.38l-1.194.597c-.5.25-1.1.072-1.43-.38L3.16 15.48c-.33-.452-.24-1.07.22-1.38l1.12-.747a1.125 1.125 0 00.42-1.21 1.87 1.87 0 010-.82 1.125 1.125 0 00-.42-1.21l-1.12-.748c-.46-.31-.55-.928-.22-1.38L4.556 5.99c.33-.452.93-.63 1.43-.38l1.194.597a1.125 1.125 0 001.45-.38l.094-.15c.1-.165.236-.31.41-.41.332-.183.582-.495.645-.87l.213-1.28z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </motion.svg>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--dc-accent)]">
            {MAINTENANCE_COPY.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--dc-fg)] sm:text-4xl">
            {MAINTENANCE_COPY.title}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[var(--dc-muted)]">
            {message}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={STATUS_PAGE_PATH}
              className="inline-flex min-w-[10rem] items-center justify-center rounded-xl bg-[var(--dc-accent)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              {MAINTENANCE_COPY.statusCta}
            </Link>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex min-w-[10rem] items-center justify-center rounded-xl border border-[var(--dc-border)] bg-[var(--dc-elevated)] px-5 py-3 text-sm font-semibold text-[var(--dc-fg)] transition hover:border-[var(--dc-accent)]/40 hover:bg-[var(--dc-accent-soft)]"
            >
              {MAINTENANCE_COPY.retryCta}
            </button>
          </div>

          <div className="mt-10 rounded-2xl border border-[var(--dc-border)] bg-[var(--dc-elevated)] px-5 py-4 text-sm text-[var(--dc-muted)]">
            <p className="font-medium text-[var(--dc-fg)]">{MAINTENANCE_COPY.supportHint}</p>
            <a
              href={mailtoSupport("Deployment / maintenance help")}
              className="mt-1 inline-block text-[var(--dc-accent)] hover:underline"
            >
              {SUPPORT_EMAIL}
            </a>
          </div>

          <p className="mt-6 text-xs text-[var(--dc-muted)]">
            We’ll be back shortly. Thank you for your patience.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
