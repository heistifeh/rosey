"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { BaseCardSkeleton } from "./base-card-skeleton";

export function ProfileHeaderSkeleton() {
  return (
    <div className="flex items-center gap-4 bg-input-bg rounded-2xl p-6">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-48 rounded" />
        <Skeleton className="h-3 w-32 rounded" />
      </div>
    </div>
  );
}

export function ProfileSectionSkeleton() {
  return (
    <BaseCardSkeleton className="w-full" layout="column">
      <div className="h-4 w-32 rounded bg-[#2c2c2f]" />
      <div className="h-3 w-48 rounded bg-[#2c2c2f]" />
      <div className="h-3 w-32 rounded bg-[#2c2c2f]" />
      <div className="h-3 w-40 rounded bg-[#2c2c2f]" />
    </BaseCardSkeleton>
  );
}
