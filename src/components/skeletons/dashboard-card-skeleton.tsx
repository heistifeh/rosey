"use client";

import { BaseCardSkeleton } from "./base-card-skeleton";

export function DashboardCardSkeleton() {
  return (
    <BaseCardSkeleton className="min-w-0">
      <div className="h-3 w-24 rounded bg-[#2c2c2f] mb-2" />
      <div className="h-10 w-3/4 rounded bg-[#2c2c2f] mb-3" />
      <div className="h-3 w-1/2 rounded bg-[#2c2c2f]" />
    </BaseCardSkeleton>
  );
}
