"use client";

import { useCallback, useEffect, useState } from "react";
import * as apiKeyService from "@/services/api-key.service";
import type { ApiKeyInfo } from "@/services/api-key.service";

export function useApiKey() {
  const [apiKey, setApiKey] = useState<ApiKeyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApiKey = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiKeyService.getApiKey();
      setApiKey(data);
    } catch (err) {
      setError(apiKeyService.getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApiKey();
  }, [fetchApiKey]);

  return { apiKey, isLoading, error, refetch: fetchApiKey };
}
