"use client";

import { useCallback, useEffect, useState } from "react";
import { getApiKey, setApiKey } from "@/services/datacaptain/client";
import { useApiKey } from "@/hooks/useApiKey";

export function useDataCaptainKey() {
  const { apiKey: dashboardKey } = useApiKey();
  const [localKey, setLocalKeyState] = useState<string | null>(null);

  useEffect(() => {
    setLocalKeyState(getApiKey());
  }, []);

  const effectiveKey = localKey || dashboardKey?.key || null;

  const saveKey = useCallback((key: string) => {
    setApiKey(key);
    setLocalKeyState(key);
  }, []);

  return { apiKey: effectiveKey, saveKey };
}
