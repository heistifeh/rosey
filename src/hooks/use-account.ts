"use client";

import { useQuery } from "@tanstack/react-query";
import { apiBuilder } from "@/api/builder";
import { getUserId } from "@/api/axios-config";

export function useAccount() {
  const userId = getUserId();
  return useQuery({
    queryKey: ["account", userId],
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5,
    queryFn: () => apiBuilder.account.getAccount(),
  });
}

export function useTwoFactorStatus() {
  const { data: account, isLoading } = useAccount();
  return {
    enabled: !!account?.two_factor_enabled,
    method: account?.two_factor_method ?? "email",
    isLoading,
  };
}
