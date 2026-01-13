"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  LocationSuggestion,
  useLocationAutocomplete,
} from "@/hooks/use-location-autocomplete";

interface LocationAutocompleteInputProps {
  value?: LocationSuggestion | null;
  onChange: (value: LocationSuggestion | null) => void;
  placeholder?: string;
  className?: string;
  countryRestriction?: string;
}

export function LocationAutocompleteInput({
  value,
  onChange,
  placeholder = "Search city",
  className,
  countryRestriction,
}: LocationAutocompleteInputProps) {
  const { query, setQuery, results, isLoading, error } =
    useLocationAutocomplete(value?.fullLabel ?? "", {
      country: countryRestriction,
    });
  const [inputValue, setInputValue] = useState(value?.fullLabel ?? "");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setInputValue(value?.fullLabel ?? "");
    setQuery(value?.fullLabel ?? "");
  }, [value?.fullLabel, setQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (suggestion: LocationSuggestion) => {
    setInputValue(suggestion.fullLabel);
    setQuery(suggestion.fullLabel);
    onChange(suggestion);
    setOpen(false);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setInputValue(next);
    setQuery(next);
    setOpen(true);
    if (!next.trim()) {
      onChange(null);
    }
  };

  const handleClear = () => {
    setInputValue("");
    setQuery("");
    onChange(null);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <div className="relative">
        <input
          type="text"
          className="w-full rounded-full border border-dark-border bg-transparent px-4 py-2 text-sm text-primary-text placeholder:text-text-gray outline-none focus:border-primary"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-text-gray-opacity"
          >
            Clear
          </button>
        )}
      </div>
      {open && (
        <div className="absolute right-0 left-0 z-20 mt-2 rounded-2xl border border-dark-border bg-input-bg/95 shadow-lg">
          {isLoading ? (
            <p className="px-4 py-3 text-sm text-text-gray-opacity">Loading…</p>
          ) : error ? (
            <p className="px-4 py-3 text-sm text-rose-400">{error}</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-text-gray-opacity">
              No suggestions
            </p>
          ) : (
            <ul className="divide-y divide-dark-border/30 max-h-72 overflow-y-auto">
              {results.map((suggestion) => (
                <li
                  key={`${suggestion.city_slug}-${suggestion.country_slug}`}
                >
                  <button
                    type="button"
                    onClick={() => handleSelect(suggestion)}
                    className="w-full px-4 py-3 text-left text-sm text-primary-text hover:bg-input-bg/60"
                  >
                    <div className="font-semibold">{suggestion.fullLabel}</div>
                    <div className="text-xs text-text-gray-opacity">
                      {suggestion.country}
                      {suggestion.state ? ` · ${suggestion.state}` : ""}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
