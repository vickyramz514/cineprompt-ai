"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getAccessToken } from "@/lib/api";
import Loader from "./Loader";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading, fetchUser } = useAuth();
  const hasFetched = useRef(false);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/auth/login");
      return;
    }
    if (!user) {
      fetchUser();
    }
  }, [router, user, fetchUser]);

  useEffect(() => {
    if (isLoading) hasFetched.current = true;
  }, [isLoading]);

  useEffect(() => {
    if (hasFetched.current && !user && !isLoading && getAccessToken()) {
      router.replace("/auth/login");
    }
  }, [user, isLoading, router]);

  if (typeof window === "undefined") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  const token = getAccessToken();
  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!user && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!user && !isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
