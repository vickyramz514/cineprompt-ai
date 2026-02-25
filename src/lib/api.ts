/**
 * Centralized Axios instance with JWT interceptors
 * - Auto-attach Bearer token
 * - Handle 401 → logout
 * - Global error handling
 */

import axios, { AxiosError } from "axios";

const TOKEN_KEY = "cineprompt_access_token";
const REFRESH_KEY = "cineprompt_refresh_token";

export const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setTokens = (accessToken: string, refreshToken?: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
};

export const clearTokens = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

export const getRefreshToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
};

const baseURL =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api"
    : process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Request interceptor: attach JWT
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// Response interceptor: handle 401
let logoutCallback: (() => void) | null = null;
export const setLogoutCallback = (cb: (() => void) | null) => {
  logoutCallback = cb;
};

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    // Attach API error message to the error so it propagates correctly
    const data = err.response?.data as { error?: { message?: string }; message?: string } | undefined;
    const apiMessage = data?.error?.message ?? data?.message;
    if (apiMessage && typeof apiMessage === "string") {
      err.message = apiMessage;
    }

    const originalRequest = err.config as typeof err.config & { _retry?: boolean };

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const { data } = await axios.post<{ success: boolean; data: { accessToken: string; refreshToken: string } }>(
            `${baseURL}/auth/refresh`,
            { refreshToken }
          );
          if (data.success && data.data.accessToken) {
            setTokens(data.data.accessToken, data.data.refreshToken);
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
            return api(originalRequest);
          }
        } catch {
          // Refresh failed, logout
        }
      }

      clearTokens();
      logoutCallback?.();
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(err);
  }
);

export type ApiError = {
  message?: string;
  code?: string;
  errors?: unknown[];
};

export const getErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as
      | { error?: { message?: string; code?: string }; message?: string }
      | undefined;
    // Prefer API error message over Axios generic "Request failed with status code X"
    const apiMessage = data?.error?.message ?? data?.message;
    if (apiMessage && typeof apiMessage === "string") {
      return apiMessage;
    }
    return err.message || "Something went wrong";
  }
  return err instanceof Error ? err.message : "Something went wrong";
};
