"use client";

import { useQuery } from "@tanstack/react-query";
import { apiBuilder } from "@/api/builder";
import { getUserId } from "@/api/axios-config";
import { Profile } from "@/types/types";

export function useProfile() {
  const userId = getUserId();

  return useQuery<Profile | null>({
    queryKey: ["profile", userId],
    queryFn: () => apiBuilder.profiles.getMyProfile(),
    enabled: !!userId,
  });
}
