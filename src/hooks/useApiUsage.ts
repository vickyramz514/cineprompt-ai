"use client";

import { useCallback, useEffect, useState } from "react";
import * as apiUsageService from "@/services/api-usage.service";
import type { UsageStats } from "@/services/api-usage.service";

export function useApiUsage() {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiUsageService.getUsageStats();
      setStats(data);
    } catch (err) {
      setError(apiUsageService.getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  return { stats, isLoading, error, refetch: fetchUsage };
}
