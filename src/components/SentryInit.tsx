"use client";

import { useEffect } from "react";
import { initBrowserSentry } from "@/lib/sentry-client";

/** Boots browser Sentry when NEXT_PUBLIC_SENTRY_DSN is set. */
export default function SentryInit() {
  useEffect(() => {
    initBrowserSentry();
  }, []);
  return null;
}
