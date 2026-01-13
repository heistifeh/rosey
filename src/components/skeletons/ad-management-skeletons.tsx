"use client";

import { BaseCardSkeleton } from "./base-card-skeleton";

export function AdSummarySkeleton() {
  return (
    <BaseCardSkeleton className="min-w-full" layout="column">
      <div className="h-4 w-1/2 rounded bg-[#2c2c2f] mb-3" />
      <div className="h-10 w-full rounded bg-[#2c2c2f] mb-4" />
      <div className="h-3 w-32 rounded bg-[#2c2c2f]" />
    </BaseCardSkeleton>
  );
}

export function AdViewsChartSkeleton() {
  return (
    <BaseCardSkeleton
      className="min-h-[360px] flex-col justify-start gap-4"
      layout="column"
    >
      <div className="h-4 w-1/2 rounded bg-[#2c2c2f]" />
      <div className="h-64 w-full rounded-2xl bg-[#2c2c2f]" />
    </BaseCardSkeleton>
  );
}
