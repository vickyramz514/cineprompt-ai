"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/Loader";
import { getAccessToken } from "@/lib/api";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading, fetchUser } = useAuth();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/auth/login");
      return;
    }
    if (!user) fetchUser();
  }, [router, user, fetchUser]);

  useEffect(() => {
    if (!isLoading && user) {
      const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";
      if (!isAdmin) {
        router.replace("/dashboard");
      }
    }
  }, [user, isLoading, router]);

  if (typeof window === "undefined") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!getAccessToken()) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
