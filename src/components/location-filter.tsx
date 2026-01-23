"use client";

import { MapPin } from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { LocationAutocompleteInput } from "@/components/location/location-autocomplete-input";
import { LocationSuggestion } from "@/hooks/use-location-autocomplete";

export interface LocationValue {
  city: string;
  city_slug: string;
  country: string;
  country_slug: string;
}

interface LocationFilterProps {
  value?: LocationValue;
  onChange?: (location: LocationValue | null) => void;
  className?: string;
  variant?: "default" | "minimal";
}

export function LocationFilter({
  value,
  onChange,
  className,
  variant = "default",
}: LocationFilterProps) {
  const suggestionValue = useMemo<LocationSuggestion | null>(() => {
    if (!value) return null;
    return {
      city: value.city,
      country: value.country,
      city_slug: value.city_slug,
      country_slug: value.country_slug,
      fullLabel: `${value.city}, ${value.country}`,
    };
  }, [value]);

  const handleLocationChange = (location: LocationSuggestion | null) => {
    if (!location) {
      onChange?.(null);
      return;
    }
    onChange?.({
      city: location.city,
      city_slug: location.city_slug,
      country: location.country,
      country_slug: location.country_slug,
    });
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "flex items-center justify-center text-white",
          variant === "default"
            ? "h-10 w-10 rounded-full bg-[#1f1f21]"
            : "h-auto w-auto bg-transparent pl-2"
        )}
      >
        <MapPin className={cn("h-5 w-5", variant === "minimal" && "text-[#8E8E93]")} />
      </div>
      <div className="flex-1">
        <LocationAutocompleteInput
          value={suggestionValue}
          onChange={handleLocationChange}
          placeholder="Search city"
        />
      </div>
    </div>
  );
}
