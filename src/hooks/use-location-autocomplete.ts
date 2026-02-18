"use client";

import { useEffect, useState } from "react";
import {
  AddressComponent,
  getAddressComponentValue,
  loadGooglePlacesScript,
  slugifyLocation,
} from "@/lib/google-places";
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

const getApiKey = () =>
  process.env.NEXT_PUBLIC_GOOGLEMAP_API_KEY ||
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
  process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;

const buildLocationLabel = (city: string, country: string, state?: string) =>
  [city, state, country].filter(Boolean).join(", ");

const normalizePredictionFallback = (prediction: any): LocationSuggestion | null => {
  const terms = prediction?.terms as Array<{ value?: string }> | undefined;
  const secondaryParts =
    prediction?.structured_formatting?.secondary_text
      ?.split(",")
      .map((part: string) => part.trim())
      .filter(Boolean) ?? [];
  const city =
    prediction?.structured_formatting?.main_text ??
    terms?.[0]?.value ??
    "";
  const state =
    terms && terms.length > 2 && terms[terms.length - 2]?.value
      ? terms[terms.length - 2].value
      : secondaryParts.length > 1
        ? secondaryParts[0]
        : "";
  const country =
    terms?.length && terms[terms.length - 1]?.value
      ? terms[terms.length - 1].value
      : secondaryParts.at(-1) ?? "";

  if (!city || !country) {
    return null;
  }

  return {
    placeId: prediction.place_id,
    city,
    state: state || undefined,
    state_slug: state ? slugifyLocation(state) : undefined,
    country,
    city_slug: slugifyLocation(city),
    country_slug: slugifyLocation(country),
    fullLabel:
      prediction.description ?? buildLocationLabel(city, country, state || undefined),
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
    if (typeof window === "undefined") {
      return;
    }

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
    let placesService: any = null;
    let autocompleteService: any = null;

    setIsLoading(true);
    setError(null);

    loadGooglePlacesScript(apiKey)
      .then(() => {
        if (!active) return;
        const google = (window as typeof window & { google?: any }).google;
        const places = google?.maps?.places;
        if (!places) {
          loadFallbackSuggestions(query)
            .catch(() => {
              setResults([]);
              setError("Google Places unavailable");
            })
            .finally(() => setIsLoading(false));
          return;
        }

        autocompleteService = new places.AutocompleteService();
        placesService = new places.PlacesService(
          document.createElement("div")
        );

        const request: any = {
          input: query,
          types: ["(cities)"],
        };

        if (options?.country) {
          request.componentRestrictions = {
            country: options.country,
          };
        }

        autocompleteService.getPlacePredictions(
          request,
          (predictions: any, status: any) => {
            if (!active) return;
            if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
              setResults([]);
              setIsLoading(false);
              return;
            }
            if (
              status !== google.maps.places.PlacesServiceStatus.OK ||
              !predictions
            ) {
              loadFallbackSuggestions(query)
                .catch(() => {
                  setResults([]);
                  setError(`Location lookup failed (${status})`);
                })
                .finally(() => {
                  if (active) {
                    setIsLoading(false);
                  }
                });
              return;
            }

          const limited = predictions.slice(0, MAX_SUGGESTIONS);
          Promise.all(
            limited.map(
              (prediction: any) =>
                new Promise<LocationSuggestion | null>((resolve) => {
                  placesService?.getDetails(
                    {
                      placeId: prediction.place_id,
                      fields: [
                          "address_components",
                          "formatted_address",
                          "name",
                        ],
                      },
                      (details: any, detailStatus: any) => {
                        if (!active) {
                          resolve(null);
                          return;
                        }
                        if (
                          detailStatus !==
                          google.maps.places.PlacesServiceStatus.OK ||
                          !details
                        ) {
                          resolve(normalizePredictionFallback(prediction));
                          return;
                        }

                        const components =
                          details.address_components as
                          | AddressComponent[]
                          | undefined;
                        const city =
                          getAddressComponentValue(components, [
                            "locality",
                            "postal_town",
                            "administrative_area_level_2",
                            "administrative_area_level_3",
                          ]) ??
                          details.name ??
                          prediction.description;
                        const state =
                          getAddressComponentValue(components, [
                            "administrative_area_level_1",
                          ]) ?? null;
                        const country =
                          getAddressComponentValue(components, [
                            "country",
                          ]) ?? prediction.structured_formatting?.secondary_text ?? "";

                        if (!city || !country) {
                          resolve(normalizePredictionFallback(prediction));
                          return;
                        }

                        resolve({
                          placeId: prediction.place_id,
                          city,
                          state: state ?? undefined,
                          state_slug: state ? slugifyLocation(state) : undefined,
                          country,
                          city_slug: slugifyLocation(city),
                          country_slug: slugifyLocation(country),
                          fullLabel:
                            details.formatted_address ??
                            prediction.description ??
                            buildLocationLabel(city, country, state ?? undefined),
                        });
                      }
                    );
                  })
              )
            )
              .then((items) => {
                if (!active) return;
                const normalized = items.filter(
                  (item): item is LocationSuggestion => Boolean(item)
                );
                if (normalized.length > 0) {
                  setResults(normalized);
                  return;
                }

                const predictionFallback = limited
                  .map((prediction: any) => normalizePredictionFallback(prediction))
                  .filter(
                    (item: LocationSuggestion | null): item is LocationSuggestion =>
                      Boolean(item)
                  );
                setResults(predictionFallback);
              })
              .finally(() => {
                if (active) {
                  setIsLoading(false);
                }
              });
          }
        );
      })
      .catch((err) => {
        if (!active) return;
        loadFallbackSuggestions(query)
          .catch(() => {
            setResults([]);
            setError(err instanceof Error ? err.message : String(err));
          })
          .finally(() => setIsLoading(false));
      });

    return () => {
      active = false;
    };
  }, [query, options?.country]);

  return { query, setQuery, results, isLoading, error };
}
