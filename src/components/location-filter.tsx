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
}

export function LocationFilter({
  value,
  onChange,
  className,
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
    <div className={cn("flex items-center gap-3 text-sm md:text-base", className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f1f21] text-white">
        <MapPin className="h-5 w-5" />
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
