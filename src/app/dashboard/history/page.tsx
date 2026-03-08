"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HistoryRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/usage");
  }, [router]);
  return null;
}
