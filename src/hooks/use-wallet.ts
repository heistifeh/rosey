"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { API, getUserId } from "@/api/axios-config";

type Wallet = {
  id: string | null;
  balance_credits: number;
};

type WalletTransaction = {
  id: string;
  type: string;
  direction: string;
  amount: number;
  reference: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

type ActivityItem = {
  id: string;
  source: "transaction" | "topup";
  type: "topup" | "ad_spend" | "refund" | "adjustment";
  direction: "credit" | "debit";
  amount: number;
  status?: "pending" | "settled";
  reference?: string;
  created_at: string;
};

type WalletActivityResponse = {
  wallet: Wallet | null;
  activity: ActivityItem[];
};

const DEFAULT_WALLET = {
  id: null,
  balance_credits: 0,
};

export function useWallet() {
  const userId = getUserId();
  const [reloadKey, setReloadKey] = useState(0);

  const activityQuery = useQuery<WalletActivityResponse>({
    queryKey: ["walletActivity", userId, reloadKey],
    queryFn: () =>
      fetch("/api/wallet/activity")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch wallet activity");
          }
          return response.json();
        })
        .then((data) => data as WalletActivityResponse),
    enabled: Boolean(userId),
  });

  if (!userId) {
    return {
      wallet: DEFAULT_WALLET,
      activity: [],
      isLoading: false,
      error: null,
      refetch: () => {
        setReloadKey((value) => value + 1);
      },
    };
  }

  const triggerRefetch = () => {
    setReloadKey((value) => value + 1);
  };

  return {
    wallet: activityQuery.data?.wallet ?? DEFAULT_WALLET,
    activity: activityQuery.data?.activity ?? [],
    isLoading: activityQuery.isLoading,
    error: activityQuery.error,
    refetch: triggerRefetch,
  };
}
