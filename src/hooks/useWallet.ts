"use client";

import { useCallback } from "react";
import { useCreditsStore } from "@/store/useStore";
import * as walletService from "@/services/wallet.service";

export function useWallet() {
  const { credits, setCredits, setLoading, setError } = useCreditsStore();

  const fetchBalance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await walletService.getBalance();
      setCredits(data.credits);
    } catch (err) {
      setError(walletService.getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [setCredits, setLoading, setError]);

  const addCredits = useCallback(
    async (amount: number, paymentId?: string) => {
      setLoading(true);
      setError(null);
      try {
        const data = await walletService.addCredits({ amount, paymentId });
        setCredits(data.credits);
        return data;
      } catch (err) {
        const msg = walletService.getErrorMessage(err);
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setCredits, setLoading, setError]
  );

  return {
    credits,
    fetchBalance,
    addCredits,
  };
}
