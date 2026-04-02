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

export function getDataCaptainErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string } | undefined;
    return data?.message || err.message || "Request failed";
  }
  return err instanceof Error ? err.message : "Request failed";
}
