"use client";

import { cn } from "@/lib/utils";

interface TaglineRevealProps {
  tagline?: string | null;
}

export function TaglineReveal({ tagline }: TaglineRevealProps) {
  const value = tagline?.trim();

  if (!value) return null;

  return (
    <div className="relative z-20">
      <span className="text-[11px] font-medium text-primary md:text-xs">
        Tagline
      </span>
      <div
        className={cn(
          "pointer-events-none absolute bottom-full left-0 mb-1 w-56 max-w-[calc(100vw-4rem)] rounded-xl border border-dark-border bg-input-bg/95 p-2 text-xs text-text-gray-opacity shadow-xl backdrop-blur-sm transition-all duration-250 ease-out md:text-sm",
          "opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0"
        )}
      >
        <p className="line-clamp-3">{value}</p>
      </div>
    </div>
  );
}
