"use client";

import { useQuery } from "@tanstack/react-query";
import { apiBuilder } from "@/api/builder";
import { ProfileImage } from "@/types/types";

export function useProfileImages(profileId?: string) {
  return useQuery<ProfileImage[]>({
    queryKey: ["profileImages", profileId],
    queryFn: () => {
      if (!profileId) {
        return Promise.resolve([]);
      }
      return apiBuilder.images.listByProfile(profileId);
    },
    enabled: !!profileId,
  });
}
