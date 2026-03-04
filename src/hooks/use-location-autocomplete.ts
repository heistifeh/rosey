"use client";

import { useEffect, useState } from "react";
import { slugifyLocation } from "@/lib/google-places";
import { apiBuilder } from "@/api/builder";

export interface LocationSuggestion {
  placeId?: string;
  city: string;
  state?: string;
  state_slug?: string;
  country: string;
  city_slug: string;
  country_slug: string;
  fullLabel: string;
}

interface UseLocationAutocompleteOptions {
  country?: string;
}

const MIN_QUERY_LENGTH = 2;
const MAX_SUGGESTIONS = 5;
const POPULAR_CITY_FALLBACK: Array<{ city: string; country: string }> = [
  { city: "Houston", country: "United States" },
  { city: "Los Angeles", country: "United States" },
  { city: "New York", country: "United States" },
  { city: "Miami", country: "United States" },
  { city: "Dallas", country: "United States" },
  { city: "San Diego", country: "United States" },
  { city: "San Francisco", country: "United States" },
  { city: "Chicago", country: "United States" },
  { city: "Atlanta", country: "United States" },
  { city: "Las Vegas", country: "United States" },
  { city: "Lagos", country: "Nigeria" },
  { city: "Abuja", country: "Nigeria" },
];

const getApiKey = () => process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const buildLocationLabel = (city: string, country: string, state?: string) =>
  [city, state, country].filter(Boolean).join(", ");

interface MapboxContext {
  id: string;
  text: string;
}

interface MapboxFeature {
  id: string;
  text: string;
  place_name: string;
  context?: MapboxContext[];
}

const normalizeMapboxFeature = (feature: MapboxFeature): LocationSuggestion | null => {
  const city = feature.text?.trim();
  const context = feature.context ?? [];

  const regionEntry = context.find((c) => c.id.startsWith("region."));
  const countryEntry = context.find((c) => c.id.startsWith("country."));

  const state = regionEntry?.text?.trim() ?? undefined;
  const country = countryEntry?.text?.trim() ?? "";

  if (!city || !country) return null;

  return {
    placeId: feature.id,
    city,
    state,
    state_slug: state ? slugifyLocation(state) : undefined,
    country,
    city_slug: slugifyLocation(city),
    country_slug: slugifyLocation(country),
    fullLabel: feature.place_name ?? buildLocationLabel(city, country, state),
  };
};

export function useLocationAutocomplete(
  initialQuery = "",
  options?: UseLocationAutocompleteOptions
) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFallbackSuggestions = async (rawQuery: string) => {
    const trimmed = rawQuery.trim().toLowerCase();
    const rows = await apiBuilder.locations.getLocations(rawQuery);
    const normalizedFromDb = (rows ?? []).map((row: any) => ({
      city: row.city,
      state: row.state ?? undefined,
      state_slug:
        row.state_slug ?? (row.state ? slugifyLocation(row.state) : undefined),
      country: row.country,
      city_slug: row.city_slug ?? slugifyLocation(row.city ?? ""),
      country_slug: row.country_slug ?? slugifyLocation(row.country ?? ""),
      fullLabel: buildLocationLabel(row.city, row.country, row.state ?? undefined),
    }));
    if (normalizedFromDb.length > 0) {
      setResults(normalizedFromDb);
      return;
    }

    const localFallback = POPULAR_CITY_FALLBACK.filter(
      (item) =>
        item.city.toLowerCase().includes(trimmed) ||
        item.country.toLowerCase().includes(trimmed)
    )
      .slice(0, MAX_SUGGESTIONS)
      .map((item) => ({
        city: item.city,
        country: item.country,
        city_slug: slugifyLocation(item.city),
        country_slug: slugifyLocation(item.country),
        fullLabel: buildLocationLabel(item.city, item.country),
      }));

    setResults(localFallback);
  };

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const apiKey = getApiKey();
    if (!apiKey) {
      setError(null);
      setIsLoading(true);
      loadFallbackSuggestions(query)
        .catch(() => {
          setResults([]);
          setError("Location suggestions unavailable");
        })
        .finally(() => setIsLoading(false));
      return;
    }

    if (query.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    let active = true;
    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams({
      access_token: apiKey,
      types: "place",
      limit: String(MAX_SUGGESTIONS),
    });

    if (options?.country) {
      params.set("country", options.country);
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${params.toString()}`;

    fetch(url)
      .then((res) => res.json())
      .then((data: { features?: MapboxFeature[] }) => {
        if (!active) return;
        const normalized = (data.features ?? [])
          .map(normalizeMapboxFeature)
          .filter((item): item is LocationSuggestion => Boolean(item));

        if (normalized.length > 0) {
          setResults(normalized);
        } else {
          return loadFallbackSuggestions(query).catch(() => setResults([]));
        }
      })
      .catch(() => {
        if (!active) return;
        loadFallbackSuggestions(query)
          .catch(() => {
            setResults([]);
            setError("Location suggestions unavailable");
          })
          .finally(() => {
            if (active) setIsLoading(false);
          });
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [query, options?.country]);

  return { query, setQuery, results, isLoading, error };
}
