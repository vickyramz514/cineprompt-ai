"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/store/useStore";
import * as profileService from "@/services/profile.service";
import type { UserProfile, UpdateProfilePayload } from "@/services/profile.service";

export function useProfile() {
  const { user, setUser } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await profileService.getProfile();
      setUser(data.user);
      setProfile(data.profile);
    } catch (err) {
      setError(profileService.getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await profileService.updateProfile(payload);
        setUser(data.user);
        setProfile(data.profile);
      } catch (err) {
        const msg = profileService.getErrorMessage(err);
        setError(msg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setUser]
  );

  return {
    user,
    profile,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
  };
}
