"use client";

import { Country, City, type ICountry, type ICity } from "country-state-city";
import { MapPin, MapPinned } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiBuilder } from "@/api/builder";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

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

type CityOption = {
  name: string;
  slug: string;
  stateCode?: string | null;
  country?: string;
  country_slug?: string;
};

const slugify = (text?: string) => {
  return text
    ?.toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-") ?? "";
};

const getCountryIsoFromSlug = (slug: string | undefined, countries: ICountry[]) => {
  if (!slug) return undefined;
  return countries.find((country) => slugify(country.name) === slug)?.isoCode;
};

export function LocationFilter({
  value,
  onChange,
  className,
}: LocationFilterProps) {
  const countries = useMemo(() => Country.getAllCountries(), []);
  const defaultCountryCode =
    getCountryIsoFromSlug(value?.country_slug, countries) ?? "NG";

  const [selectedCountry, setSelectedCountry] = useState(defaultCountryCode);
  const [selectedCity, setSelectedCity] = useState(value?.city_slug ?? "");
  const [countrySearch, setCountrySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const countryRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const debouncedCitySearch = useDebounce(citySearch, 300);

  useEffect(() => {
    if (value?.country_slug) {
      const iso = getCountryIsoFromSlug(value.country_slug, countries);
      setSelectedCountry(iso ?? "NG");
    } else {
      setSelectedCountry("NG");
    }
  }, [value?.country_slug, countries]);

  useEffect(() => {
    setSelectedCity(value?.city_slug ?? "");
  }, [value?.city_slug]);

  const cities = useMemo<CityOption[]>(() => {
    if (!selectedCountry) return [];
    const activeCountry = countries.find((country) => country.isoCode === selectedCountry);
    const normalizedCountry = activeCountry?.name;
    const normalizedCountrySlug = slugify(normalizedCountry);
    return (City.getCitiesOfCountry(selectedCountry) ?? []).map(
      (city: ICity) => ({
        name: city.name,
        slug: slugify(city.name),
        stateCode: city.stateCode,
        country: normalizedCountry,
        country_slug: normalizedCountrySlug,
      })
    );
  }, [selectedCountry, countries]);

  const filteredCountries = useMemo(() => {
    const term = countrySearch.trim().toLowerCase();
    if (!term) return countries;
    return countries.filter((country) =>
      country.name.toLowerCase().includes(term)
    );
  }, [countries, countrySearch]);

  useEffect(() => {
    const selected = countries.find((country) => country.isoCode === selectedCountry);
    if (selected) {
      setCountrySearch(selected.name);
    }
  }, [selectedCountry, countries]);

  const { data: locationSuggestions } = useQuery({
    queryKey: ["locations", debouncedCitySearch],
    queryFn: () => apiBuilder.locations.getLocations(debouncedCitySearch),
    enabled: Boolean(debouncedCitySearch),
    staleTime: 1000 * 60 * 5,
  });

  const selectedCountrySlug = useMemo(() => {
    const country = countries.find((country) => country.isoCode === selectedCountry);
    return slugify(country?.name);
  }, [countries, selectedCountry]);

  const remoteCityOptions = useMemo<CityOption[]>(() => {
    if (!locationSuggestions) return [];
    return locationSuggestions
      .filter(
        (loc) =>
          !selectedCountrySlug ||
          (loc.country_slug ?? "").toLowerCase() === selectedCountrySlug
      )
      .map((loc) => ({
        name: loc.city,
        slug: loc.city_slug,
        country: loc.country,
        country_slug: loc.country_slug,
      }));
  }, [locationSuggestions, selectedCountrySlug]);

  const cityOptions = debouncedCitySearch ? remoteCityOptions : cities;

  useEffect(() => {
    if (debouncedCitySearch) return;
    const selected = cities.find((city) => city.slug === selectedCity);
    if (selected) {
      setCitySearch(selected.name);
    }
  }, [selectedCity, cities, debouncedCitySearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setIsCountryOpen(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setIsCityOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setSelectedCity("");
    setCitySearch("");
    onChange?.(null);
  };

  const handleCitySelect = (city: CityOption) => {
    setSelectedCity(city.slug);
    const resolvedCountry =
      city.country ?? countries.find((item) => item.isoCode === selectedCountry)?.name ?? "";
    const resolvedCountrySlug = city.country_slug ?? slugify(resolvedCountry);
    const locationValue: LocationValue = {
      country: resolvedCountry,
      country_slug: resolvedCountrySlug,
      city: city.name,
      city_slug: city.slug,
    };
    setCitySearch(city.name);
    setIsCityOpen(false);
    onChange?.(locationValue);
  };

  return (
    <div className={cn("flex flex-col gap-2 text-sm md:text-base", className)}>
      <div ref={countryRef} className="relative">
        <div className="flex items-center gap-3 rounded-full bg-[#575757] px-4 py-2 text-white">
          <MapPinned className="h-4 w-4 text-white shrink-0" />
          <input
            className="flex-1 bg-transparent text-white outline-none placeholder:text-text-gray"
            placeholder="Search country"
            value={countrySearch}
            onChange={(event) => {
              setCountrySearch(event.target.value);
              setIsCountryOpen(true);
            }}
            onFocus={() => setIsCountryOpen(true)}
          />
        </div>
        {isCountryOpen && (
          <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-[#333] bg-[#1a1a1a]">
            {filteredCountries.map((country) => (
              <button
                key={country.isoCode}
                className="w-full px-4 py-2 text-left text-white hover:bg-[#2a2a2d]"
                onClick={() => {
                  handleCountryChange(country.isoCode);
                  setCountrySearch(country.name);
                  setIsCountryOpen(false);
                }}
              >
                {country.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div ref={cityRef} className="relative">
        <div className="flex items-center gap-3 rounded-full bg-[#575757] px-4 py-2 text-white">
          <MapPin className="h-4 w-4 text-white shrink-0" />
          <input
            className="flex-1 bg-transparent text-white outline-none placeholder:text-text-gray disabled:cursor-not-allowed"
            placeholder="Search city"
            value={citySearch}
            onChange={(event) => {
              setCitySearch(event.target.value);
              setIsCityOpen(true);
            }}
            onFocus={() => setIsCityOpen(true)}
            disabled={!selectedCountry}
          />
        </div>
        {isCityOpen && selectedCountry && (
          <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-[#333] bg-[#1a1a1a]">
            {cityOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-300">
                No cities found
              </div>
            ) : (
              cityOptions.map((city) => (
                <button
                  key={`${city.slug}-${city.stateCode ?? city.country_slug ?? ""}`}
                  className="w-full px-4 py-2 text-left text-white hover:bg-[#2a2a2d]"
                  onClick={() => handleCitySelect(city)}
                >
                  {city.name}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
