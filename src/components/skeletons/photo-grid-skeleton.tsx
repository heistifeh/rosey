"use client";

import { BaseCardSkeleton } from "./base-card-skeleton";

export function PhotoGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 bg-input-bg rounded-2xl p-2">
      {Array.from({ length: count }).map((_, index) => (
        <BaseCardSkeleton key={index} />
      ))}
    </div>
  );
}
