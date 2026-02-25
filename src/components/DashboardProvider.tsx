"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { useVideoJobs } from "@/hooks/useVideoJobs";

export default function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { user, fetchUser } = useAuth();
  const { fetchBalance } = useWallet();
  const { fetchHistory } = useVideoJobs();

  useEffect(() => {
    if (user) {
      fetchBalance();
      fetchHistory();
    }
  }, [user, fetchBalance, fetchHistory]);

  return <>{children}</>;
}
