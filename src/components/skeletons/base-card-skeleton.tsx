"use client";

import { ReactNode } from "react";

interface BaseCardSkeletonProps {
  className?: string;
  children?: ReactNode;
  layout?: "row" | "column";
}

export function BaseCardSkeleton({
  className = "",
  children,
  layout = "column",
}: BaseCardSkeletonProps) {
  const defaultContent = (
    <>
      <div className="h-3 w-24 rounded bg-[#2c2c2f] mb-2" />
      <div className="h-6 w-32 rounded bg-[#2c2c2f] mb-2" />
      <div className="h-3 w-20 rounded bg-[#2c2c2f]" />
    </>
  );

  const directionClass = layout === "row" ? "flex-row" : "flex-col";

  return (
    <div
      className={`flex h-full ${directionClass} overflow-hidden rounded-[20px] border border-[#26262a] bg-primary-bg shadow-sm p-2.5 md:p-3 animate-pulse min-w-[220px] sm:min-w-0 ${className}`}
    >
      {children ?? defaultContent}
    </div>
  );
}
