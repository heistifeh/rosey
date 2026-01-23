"use client";

import { useEffect, useState } from "react";
import {
  AddressComponent,
  getAddressComponentValue,
  loadGooglePlacesScript,
  slugifyLocation,
} from "@/lib/google-places";

export interface LocationSuggestion {
  placeId?: string;
  city: string;
  state?: string;
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

export function useLocationAutocomplete(
  initialQuery = "",
  options?: UseLocationAutocompleteOptions
) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLEMAP_API_KEY;
    if (!apiKey) {
      setError("Missing Google Maps API key");
      setResults([]);
      setIsLoading(false);
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
          setError("Google Places unavailable");
          setIsLoading(false);
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
          if (
            status !== google.maps.places.PlacesServiceStatus.OK ||
            !predictions
          ) {
            setResults([]);
              setIsLoading(false);
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
                          resolve(null);
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
                          resolve(null);
                          return;
                        }

                        resolve({
                          placeId: prediction.place_id,
                          city,
                          state: state ?? undefined,
                          country,
                          city_slug: slugifyLocation(city),
                          country_slug: slugifyLocation(country),
                          fullLabel:
                            details.formatted_address ?? prediction.description,
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
                setResults(normalized);
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
        setError(err instanceof Error ? err.message : String(err));
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [query, options?.country]);

  return { query, setQuery, results, isLoading, error };
}
