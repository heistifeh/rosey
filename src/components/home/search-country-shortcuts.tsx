"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

type CountryShortcut = {
  label: string;
  slug: string;
};

type SearchCountryShortcutsProps = {
  countries: CountryShortcut[];
  viewAllLabel: string;
  showMoreLabel: string;
  showLessLabel: string;
  mobilePreviewCount?: number;
};

const DEFAULT_MOBILE_PREVIEW_COUNT = 10;

export function SearchCountryShortcuts({
  countries,
  viewAllLabel,
  showMoreLabel,
  showLessLabel,
  mobilePreviewCount = DEFAULT_MOBILE_PREVIEW_COUNT,
}: SearchCountryShortcutsProps) {
  const [isExpandedMobile, setIsExpandedMobile] = useState(false);
  const shouldShowToggle = countries.length > mobilePreviewCount;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {countries.map((country, index) => (
          <Link
            key={country.slug}
            href={`/search?country=${country.slug}`}
            className={cn(
              "rounded-full border border-dark-border bg-input-bg px-3 py-1.5 text-xs text-primary-text transition-colors hover:border-primary hover:text-primary md:text-sm",
              !isExpandedMobile &&
                index >= mobilePreviewCount &&
                "hidden md:inline-flex",
            )}
          >
            {country.label}
          </Link>
        ))}
      </div>

      {shouldShowToggle && (
        <button
          type="button"
          onClick={() => setIsExpandedMobile((prev) => !prev)}
          className="w-fit rounded-full border border-dark-border bg-input-bg px-3 py-1 text-xs font-semibold text-primary-text transition-colors hover:border-primary/40 hover:bg-primary/10 md:hidden"
        >
          {isExpandedMobile ? showLessLabel : showMoreLabel}
        </button>
      )}

      <div>
        <Link
          href="/locations"
          className="text-xs font-semibold text-primary underline underline-offset-4 transition-opacity hover:opacity-80 md:text-sm"
        >
          {viewAllLabel}
        </Link>
      </div>
    </div>
  );
}
