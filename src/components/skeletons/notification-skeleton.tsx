"use client";

import { BaseCardSkeleton } from "./base-card-skeleton";

export function NotificationItemSkeleton() {
  return (
    <BaseCardSkeleton className="flex-row items-start justify-between gap-3" layout="row">
      <div className="flex-1 space-y-2">
        <div className="h-3 w-3/4 rounded bg-[#2c2c2f]" />
        <div className="h-3 w-1/2 rounded bg-[#2c2c2f]" />
      </div>
      <div className="h-3 w-20 rounded bg-[#2c2c2f]" />
    </BaseCardSkeleton>
  );
}
