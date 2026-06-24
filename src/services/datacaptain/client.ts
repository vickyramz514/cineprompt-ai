/**
 * DataCaptain API client - Uses x-api-key header
 */

import axios, { AxiosError } from "axios";
import { getPublicApiOrigin } from "@/lib/public-env";

const BASE_URL = getPublicApiOrigin();

const STORAGE_KEY = "datacaptain_api_key";

export function getApiKey(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function setApiKey(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, key);
}

export function clearApiKey(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

function createClient(apiKey: string | null) {
  const client = axios.create({
    baseURL: `${BASE_URL}/api`,
    headers: {
      "Content-Type": "application/json",
      ...(apiKey && { "x-api-key": apiKey }),
    },
  });

  return client;
}

export async function datacaptainFetch<T>(
  path: string,
  apiKey: string | null,
  params?: Record<string, string>
): Promise<T> {
  const client = createClient(apiKey);
  const res = await client.get<T>(path, { params });
  return res.data;
}

export async function datacaptainPost<T>(
  path: string,
  apiKey: string | null,
  body?: Record<string, unknown>
): Promise<T> {
  const client = createClient(apiKey);
  const res = await client.post<T>(path, body ?? {});
  return res.data;
}

export function getDataCaptainErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as
      | {
          message?: string;
          code?: string;
          error?: string | { message?: string; details?: string; hint?: string; code?: string };
        }
      | undefined;

    const nested =
      typeof data?.error === "object" && data.error !== null ? data.error : undefined;

    if (data?.code === "PLAN_UPGRADE_REQUIRED" || nested?.code === "PLAN_UPGRADE_REQUIRED") {
      return nested?.message || data?.message || "Upgrade your plan to access this API.";
    }

    if (nested?.message) {
      return nested.hint ? `${nested.message} ${nested.hint}` : nested.message;
    }
    if (typeof data?.error === "string") return data.error;
    if (nested?.details && nested.details !== nested.message) return nested.details;
    if (data?.message) return data.message;

    const status = err.response?.status;
    if (status && err.message?.includes(String(status))) {
      return `Request failed (${status})`;
    }

    return err.message || "Request failed";
  }
  return err instanceof Error ? err.message : "Request failed";
}
