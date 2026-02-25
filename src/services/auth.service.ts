/**
 * Auth API service
 */

import { api, setTokens, getErrorMessage } from "@/lib/api";

export type User = {
  id: string;
  name: string;
  email: string;
  credits?: number;
  plan?: string;
  planExpiresAt?: string | null;
  avatar?: string | null;
  provider?: string | null;
};

export type SignupData = {
  name: string;
  email: string;
  password: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export async function signup(data: SignupData): Promise<AuthResponse> {
  const res = await api.post<ApiResponse<AuthResponse>>("/auth/signup", data);
  if (!res.data.success) throw new Error("Signup failed");
  const auth = res.data.data;
  setTokens(auth.accessToken, auth.refreshToken);
  return auth;
}

export async function login(data: LoginData): Promise<AuthResponse> {
  const res = await api.post<ApiResponse<AuthResponse>>("/auth/login", data);
  if (!res.data.success) throw new Error("Login failed");
  const auth = res.data.data;
  setTokens(auth.accessToken, auth.refreshToken);
  return auth;
}

export async function getCurrentUser(): Promise<User> {
  const res = await api.get<ApiResponse<{ user: User }>>("/auth/me");
  if (!res.data.success) throw new Error("Failed to fetch user");
  return res.data.data.user;
}

export async function loginWithGoogle(credential: string): Promise<AuthResponse> {
  const res = await api.post<ApiResponse<AuthResponse>>("/auth/google", { credential });
  if (!res.data.success) throw new Error("Google sign-in failed");
  const auth = res.data.data;
  setTokens(auth.accessToken, auth.refreshToken);
  return auth;
}

export { getErrorMessage };
