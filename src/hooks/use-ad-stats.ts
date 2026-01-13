"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiBuilder } from "@/api/builder";

type StatsPoint = {
  day: string;
  impressions: number;
  clicks: number;
};

const formatDate = (date: Date) => date.toISOString().split("T")[0];

export function useAdStats({
  adId,
  days = 7,
}: {
  adId?: string;
  days?: number;
}) {
  const fromDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return formatDate(date);
  }, [days]);

  const shouldFetch = Boolean(adId);
  const query = useQuery<StatsPoint[]>({
    queryKey: ["adStats", adId, days],
    queryFn: () =>
      shouldFetch
        ? apiBuilder.ads.getAdDailyStats(adId!, fromDate)
        : Promise.resolve([]),
    enabled: shouldFetch,
  });

  const points = query.data ?? [];
  const totalImpressions = points.reduce(
    (sum, point) => sum + (point.impressions ?? 0),
    0
  );
  const totalClicks = points.reduce(
    (sum, point) => sum + (point.clicks ?? 0),
    0
  );

  return {
    points,
    totalImpressions,
    totalClicks,
    isLoading: query.isLoading,
    error: query.error,
  };
}
