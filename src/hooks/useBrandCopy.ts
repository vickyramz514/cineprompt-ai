"use client";

import { useMemo } from "react";
import { emotionalUX } from "@/lib/brand-copy";

/**
 * Hook for dynamic emotional UX messages (queue, rendering, completion)
 * Returns random message from the appropriate array based on job status
 */
export function useEmotionalMessage(status: "queued" | "rendering" | "completed") {
  return useMemo(() => {
    const arr =
      status === "queued"
        ? emotionalUX.queue
        : status === "rendering"
          ? emotionalUX.rendering
          : emotionalUX.completion;
    return arr[Math.floor(Math.random() * arr.length)];
  }, [status]);
}

/**
 * Get a random encouragement message for form validation / submission
 */
export function useEncouragement() {
  return useMemo(
    () =>
      emotionalUX.encouragement[
        Math.floor(Math.random() * emotionalUX.encouragement.length)
      ],
    []
  );
}
