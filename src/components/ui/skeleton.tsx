"use client";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-[20px] bg-primary-bg border border-[#26262a] shadow-sm ${className}`}
      {...props}
    />
  );
}
