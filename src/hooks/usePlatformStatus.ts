"use client";

import { useCallback, useEffect, useState } from "react";
import { getPublicApiBaseUrl } from "@/lib/public-env";

export type PlatformStatus = {
  status: "operational" | "degraded" | "down";
  checkedAt: string;
  services: Array<{
    id: string;
    name: string;
    status: "operational" | "degraded" | "down";
    message: string;
  }>;
  data: {
    latestPriceDate: string | null;
    etfMetricsAsOf: string | null;
    etfCount: number | null;
    historicalPriceRows: number | null;
  };
};

let cached: PlatformStatus | null = null;
let cachedAt = 0;
const CACHE_MS = 60_000;

export function usePlatformStatus(refreshMs = 0) {
  const [status, setStatus] = useState<PlatformStatus | null>(cached);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && cached && now - cachedAt < CACHE_MS) {
      setStatus(cached);
      setLoading(false);
      return cached;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${getPublicApiBaseUrl()}/status`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Status check failed (${res.status})`);
      const data = (await res.json()) as PlatformStatus;
      cached = data;
      cachedAt = Date.now();
      setStatus(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to reach API";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    if (!refreshMs) return;
    const id = setInterval(() => void fetchStatus(true), refreshMs);
    return () => clearInterval(id);
  }, [refreshMs, fetchStatus]);

  return { status, loading, error, refresh: () => fetchStatus(true) };
}
