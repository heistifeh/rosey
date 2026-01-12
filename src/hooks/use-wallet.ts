"use client";

import { useQuery } from "@tanstack/react-query";
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

const DEFAULT_WALLET = {
  id: null,
  balance_credits: 0,
};

export function useWallet() {
  const userId = getUserId();

  const walletQuery = useQuery<Wallet | null>({
    queryKey: ["wallet", userId],
    queryFn: () =>
      API.get<Wallet[]>("/wallets", {
        params: {
          select: "id,balance_credits",
          user_id: `eq.${userId}`,
          limit: 1,
        },
      }).then((response) => response.data?.[0] ?? null),
    enabled: Boolean(userId),
  });

  const walletId = walletQuery.data?.id ?? null;

  const transactionsQuery = useQuery<WalletTransaction[]>({
    queryKey: ["walletTransactions", walletId],
    queryFn: () =>
      API.get<WalletTransaction[]>("/wallet_transactions", {
        params: {
          select: "id,type,direction,amount,reference,metadata,created_at",
          wallet_id: `eq.${walletId}`,
          order: "created_at.desc",
          limit: 50,
        },
      }).then((response) => response.data ?? []),
    enabled: Boolean(walletId),
  });

  if (!userId) {
    return {
      wallet: DEFAULT_WALLET,
      transactions: [],
      isLoading: false,
      error: null,
    };
  }

  return {
    wallet: walletQuery.data ?? DEFAULT_WALLET,
    transactions: transactionsQuery.data ?? [],
    isLoading: walletQuery.isLoading || transactionsQuery.isLoading,
    error: walletQuery.error || transactionsQuery.error,
  };
}
