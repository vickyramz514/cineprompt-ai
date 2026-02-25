/**
 * Profile API service
 */

import { api, getErrorMessage } from "@/lib/api";

export type UserProfile = {
  bio?: string | null;
  company?: string | null;
  website?: string | null;
  timezone?: string;
  locale?: string;
};

export type ProfileResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    plan?: string;
  };
  profile: UserProfile;
};

export type UpdateProfilePayload = {
  name?: string;
  bio?: string;
  company?: string;
  website?: string;
  timezone?: string;
  locale?: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export async function getProfile(): Promise<ProfileResponse> {
  const res = await api.get<ApiResponse<ProfileResponse>>("/profile");
  if (!res.data.success) throw new Error("Failed to fetch profile");
  return res.data.data;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<ProfileResponse> {
  const res = await api.patch<ApiResponse<ProfileResponse>>("/profile", payload);
  if (!res.data.success) throw new Error("Failed to update profile");
  return res.data.data;
}

export { getErrorMessage };
