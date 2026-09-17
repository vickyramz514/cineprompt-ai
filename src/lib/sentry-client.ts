/**
 * Optional browser Sentry. Enabled only when NEXT_PUBLIC_SENTRY_DSN is set.
 */

import * as Sentry from "@sentry/browser";

let started = false;

export function initBrowserSentry() {
  if (started || typeof window === "undefined") return;
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;
  started = true;
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,
    tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE || "0.1"),
  });
}

export function captureClientException(error: unknown) {
  initBrowserSentry();
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  Sentry.captureException(error);
}
