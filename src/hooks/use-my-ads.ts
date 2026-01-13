"use client";

"use client";

import { useQuery } from "@tanstack/react-query";
import { apiBuilder } from "@/api/builder";
import { useProfile } from "@/hooks/use-profile";

export function useMyAds() {
  const { data: profile } = useProfile();
  const profileId = profile?.id;

  const query = useQuery({
    queryKey: ["ads", profileId],
    queryFn: () => apiBuilder.ads.getMyAds(profileId!),
    enabled: Boolean(profileId),
  });

  return {
    ads: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}
