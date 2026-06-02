"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { clearApiKey, getApiKey, setApiKey } from "@/services/datacaptain/client";
import { isValidApiKey } from "@/services/datacaptain/apiKeyValidation";
import { useApiKey } from "@/hooks/useApiKey";

export function useDataCaptainKey() {
  const { apiKey: dashboardKey, refetch: refetchApiKey } = useApiKey();
  const [localKey, setLocalKeyState] = useState<string | null>(null);

  useEffect(() => {
    const stored = getApiKey();
    if (stored && !isValidApiKey(stored)) {
      clearApiKey();
      setLocalKeyState(null);
      return;
    }
    setLocalKeyState(stored);
  }, []);

  useEffect(() => {
    const fromServer = dashboardKey?.key;
    if (fromServer && isValidApiKey(fromServer)) {
      setApiKey(fromServer);
      setLocalKeyState(fromServer);
    }
  }, [dashboardKey?.key]);

  const effectiveKey = useMemo(() => {
    if (localKey && isValidApiKey(localKey)) return localKey;
    if (dashboardKey?.key && isValidApiKey(dashboardKey.key)) return dashboardKey.key;
    return null;
  }, [localKey, dashboardKey?.key]);

  const saveKey = useCallback((key: string) => {
    if (!isValidApiKey(key)) return;
    setApiKey(key);
    setLocalKeyState(key);
  }, []);

  return { apiKey: effectiveKey, saveKey, refetchApiKey };
}
