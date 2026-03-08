"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";

export default function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { fetchBalance } = useWallet();

  useEffect(() => {
    if (user) {
      fetchBalance();
    }
  }, [user, fetchBalance]);

  return <>{children}</>;
}
