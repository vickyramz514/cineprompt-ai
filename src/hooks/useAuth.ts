"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useCreditsStore } from "@/store/useStore";
import * as authService from "@/services/auth.service";
import type { User } from "@/services/auth.service";
import { clearTokens, setLogoutCallback } from "@/lib/api";
import { readRedirectFromSearch } from "@/lib/auth-redirect";

export function useAuth() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    setUser,
    setLoading,
    setError,
    logout: storeLogout,
  } = useAuthStore();

  const logout = useCallback(() => {
    clearTokens();
    storeLogout();
    router.push("/auth/login");
  }, [storeLogout, router]);

  useEffect(() => {
    setLogoutCallback(logout);
    return () => setLogoutCallback(null);
  }, [logout]);

  const setCredits = useCreditsStore((s) => s.setCredits);

  const postAuthRedirect = useCallback(() => {
    if (typeof window === "undefined") {
      router.push("/dashboard");
      return;
    }
    router.push(readRedirectFromSearch(window.location.search));
  }, [router]);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const nextUser = await authService.getCurrentUser();
      setUser(nextUser);
      if (nextUser?.credits != null) setCredits(nextUser.credits);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading, setError, setCredits]);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const auth = await authService.login({ email, password });
        setUser(auth.user);
        if (auth.user?.credits != null) setCredits(auth.user.credits);
        postAuthRedirect();
      } catch (err) {
        const msg = authService.getErrorMessage(err);
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading, setError, setCredits, postAuthRedirect]
  );

  const signup = useCallback(
    async (name: string, email: string, password: string, referralCode?: string) => {
      setLoading(true);
      setError(null);
      try {
        const auth = await authService.signup({ name, email, password, referralCode });
        setUser(auth.user);
        if (auth.user?.credits != null) setCredits(auth.user.credits);
        postAuthRedirect();
      } catch (err) {
        const msg = authService.getErrorMessage(err);
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading, setError, setCredits, postAuthRedirect]
  );

  const loginWithGoogle = useCallback(
    (googleUser: User) => {
      setUser(googleUser);
      if (googleUser?.credits != null) setCredits(googleUser.credits);
      postAuthRedirect();
    },
    [setUser, setCredits, postAuthRedirect]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    setError,
    login,
    signup,
    loginWithGoogle,
    logout,
    fetchUser,
  };
}
