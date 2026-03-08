"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { City, Country, State } from "country-state-city";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiBuilder } from "@/api/builder";
import { useWallet } from "@/hooks/use-wallet";

type CityOption = {
  name: string;
  city_slug: string;
};

type StateOption = {
  name: string;
  state_slug: string | null;
  country_name: string;
  country_code: string;
  country_slug: string;
  cities: CityOption[];
};

type SelectedCity = {
  country_slug: string;
  state_slug: string | null;
  city_slug: string;
};

type CountryOption = {
  name: string;
  isoCode: string;
  country_slug: string;
};

type PlaceAdPayload = {
  title: string;
  placement_available_now: boolean;
  cities: SelectedCity[];
};

const CREDITS_PER_CITY = 1;
const PRIORITY_COUNTRY_ISO_CODES = ["US", "CA"] as const;
const DEFAULT_AD_TITLE = "Featured Campaign";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const makeCityKey = (
  country_slug: string,
  state_slug: string | null,
  city_slug: string
) => `${country_slug}/${state_slug ?? "all"}/${city_slug}`;

const makeStateKey = (country_slug: string, state_slug: string | null) =>
  `${country_slug}/${state_slug ?? "all"}`;

export default function PlaceAdPage() {
  const countryOptions = useMemo<CountryOption[]>(() => {
    const priorityIndex = (isoCode: string) => {
      const index = PRIORITY_COUNTRY_ISO_CODES.indexOf(
        isoCode as (typeof PRIORITY_COUNTRY_ISO_CODES)[number]
      );
      return index === -1 ? Number.MAX_SAFE_INTEGER : index;
    };

    return Country.getAllCountries()
      .map((country) => ({
        name: country.name,
        isoCode: country.isoCode,
        country_slug: slugify(country.name),
      }))
      .sort((a, b) => {
        const aPriority = priorityIndex(a.isoCode);
        const bPriority = priorityIndex(b.isoCode);

        if (aPriority !== bPriority) {
          return aPriority - bPriority;
        }

        return a.name.localeCompare(b.name);
      });
  }, []);

  const [selectedCities, setSelectedCities] = useState<Record<string, SelectedCity>>({});
  const [isPlacing, setIsPlacing] = useState(false);
  const [isLowBalanceOpen, setIsLowBalanceOpen] = useState(false);
  const [adTitle, setAdTitle] = useState("");
  const [placementAvailableNow, setPlacementAvailableNow] = useState(false);
  const [selectedCountrySlug, setSelectedCountrySlug] = useState("");
  const [countrySearchQuery, setCountrySearchQuery] = useState("");
  const [citySearchByStateKey, setCitySearchByStateKey] = useState<
    Record<string, string>
  >({});
  const [openStateKey, setOpenStateKey] = useState<string | null>(null);
  const router = useRouter();
  const { wallet } = useWallet();
  const availableCredits = wallet?.balance_credits ?? 0;

  const selectedCountry = useMemo(
    () =>
      countryOptions.find((country) => country.country_slug === selectedCountrySlug) ??
      null,
    [countryOptions, selectedCountrySlug]
  );

  const filteredCountryOptions = useMemo(() => {
    const query = countrySearchQuery.trim().toLowerCase();
    if (!query) {
      return countryOptions;
    }
    return countryOptions.filter((country) =>
      country.name.toLowerCase().includes(query)
    );
  }, [countryOptions, countrySearchQuery]);

  const stateOptions = useMemo<StateOption[]>(() => {
    if (!selectedCountry) {
      return [];
    }

    const toUniqueCities = (rawCities: { name: string }[]) => {
      const uniqueCities = new Map<string, CityOption>();

      rawCities.forEach((city) => {
        const city_slug = slugify(city.name);
        if (!city_slug || uniqueCities.has(city_slug)) {
          return;
        }
        uniqueCities.set(city_slug, {
          name: city.name,
          city_slug,
        });
      });

      return Array.from(uniqueCities.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    };

    const stateEntries = State.getStatesOfCountry(selectedCountry.isoCode)
      .map((state) => {
        const cities = toUniqueCities(
          City.getCitiesOfState(selectedCountry.isoCode, state.isoCode)
        );

        return {
          name: state.name,
          state_slug: slugify(state.name),
          country_name: selectedCountry.name,
          country_code: selectedCountry.isoCode,
          country_slug: selectedCountry.country_slug,
          cities,
        };
      })
      .filter((state) => state.cities.length > 0)
      .sort((a, b) => a.name.localeCompare(b.name));

    if (stateEntries.length > 0) {
      return stateEntries;
    }

    const countryCities = toUniqueCities(
      City.getCitiesOfCountry(selectedCountry.isoCode) ?? []
    );
    if (countryCities.length === 0) {
      return [];
    }

    return [
      {
        name: selectedCountry.name,
        state_slug: null,
        country_name: selectedCountry.name,
        country_code: selectedCountry.isoCode,
        country_slug: selectedCountry.country_slug,
        cities: countryCities,
      },
    ];
  }, [selectedCountry]);

  const citiesSelected = useMemo(
    () => Object.keys(selectedCities).length,
    [selectedCities]
  );
  const creditsUsed = citiesSelected * CREDITS_PER_CITY;
  const selectedValues = useMemo(
    () => Object.values(selectedCities),
    [selectedCities]
  );
  const trimmedTitle = adTitle.trim();
  const resolvedAdTitle = trimmedTitle || DEFAULT_AD_TITLE;
  const hasInsufficientCredits = creditsUsed > availableCredits;

  const isAllSelected = useMemo(
    () =>
      stateOptions.length > 0 &&
      stateOptions.every((state) =>
        state.cities.every((city) =>
          Boolean(
            selectedCities[
              makeCityKey(state.country_slug, state.state_slug, city.city_slug)
            ]
          )
        )
      ),
    [selectedCities, stateOptions]
  );

  const toggleCity = useCallback(
    (state: StateOption, city: CityOption) => {
      const key = makeCityKey(state.country_slug, state.state_slug, city.city_slug);
      setSelectedCities((prev) => {
        const next = { ...prev };
        if (next[key]) {
          delete next[key];
        } else {
          next[key] = {
            country_slug: state.country_slug,
            state_slug: state.state_slug,
            city_slug: city.city_slug,
          };
        }
        return next;
      });
    },
    []
  );

  const selectAllInState = useCallback((state: StateOption) => {
    setSelectedCities((prev) => {
      const allSelected = state.cities.every((city) =>
        Boolean(
          prev[makeCityKey(state.country_slug, state.state_slug, city.city_slug)]
        )
      );
      const next = { ...prev };
      state.cities.forEach((city) => {
        const key = makeCityKey(state.country_slug, state.state_slug, city.city_slug);
        if (allSelected) {
          delete next[key];
        } else {
          next[key] = {
            country_slug: state.country_slug,
            state_slug: state.state_slug,
            city_slug: city.city_slug,
          };
        }
      });
      return next;
    });
  }, []);

  const toggleAllCities = useCallback(() => {
    if (stateOptions.length === 0) {
      return;
    }

    setSelectedCities((prev) => {
      const next = { ...prev };

      if (isAllSelected) {
        stateOptions.forEach((state) => {
          state.cities.forEach((city) => {
            delete next[
              makeCityKey(state.country_slug, state.state_slug, city.city_slug)
            ];
          });
        });
        return next;
      }

      stateOptions.forEach((state) => {
        state.cities.forEach((city) => {
          const key = makeCityKey(
            state.country_slug,
            state.state_slug,
            city.city_slug
          );
          next[key] = {
            country_slug: state.country_slug,
            state_slug: state.state_slug,
            city_slug: city.city_slug,
          };
        });
      });

      return next;
    });
  }, [isAllSelected, stateOptions]);

  const canPlaceAd = citiesSelected > 0;

  const handlePlaceAd = useCallback(async () => {
    if (citiesSelected === 0) {
      toast.error("Select at least one city.");
      return;
    }
    if (hasInsufficientCredits) {
      setIsLowBalanceOpen(true);
      return;
    }

    setIsPlacing(true);
    try {
      const payload: PlaceAdPayload = {
        title: resolvedAdTitle,
        placement_available_now: placementAvailableNow,
        cities: selectedValues,
      };
      await apiBuilder.ads.placeAd(payload);
      toast.success("Ad placed successfully.");
      setSelectedCities({});
      router.push("/dashboard/ad-management");
    } catch (error) {
      console.error("Place ad error:", error);
      toast.error("Something went wrong while placing the ad.");
    } finally {
      setIsPlacing(false);
    }
  }, [
    citiesSelected,
    selectedValues,
    resolvedAdTitle,
    hasInsufficientCredits,
    placementAvailableNow,
    router,
  ]);

  return (
    <div className="min-h-screen bg-primary-bg px-4 pt-10 text-white md:px-[60px] md:pt-20">
      <div className="mx-auto w-full max-w-5xl pb-10 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-primary-text md:text-[36px]">
            Choose Where Your Ad Appears
          </h1>
          <p className="mt-2 text-sm text-primary-text md:mt-3 md:text-base">
            Each city costs {CREDITS_PER_CITY} credits. Add more cities to
            increase your reach.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-lg space-y-4">
          <div className="flex flex-col gap-2 text-left">
            <label className="text-sm font-semibold text-primary-text">
              Ad title
            </label>
            <Input
              value={adTitle}
              onChange={(event) => setAdTitle(event.target.value)}
              placeholder="Optional: Holiday Promo"
              className="bg-input-bg text-primary-text"
            />
            <p className="text-xs text-text-gray-opacity">
              Leave blank to use the default title: "{DEFAULT_AD_TITLE}".
            </p>
          </div>
          <label className="flex items-start gap-3 text-sm text-primary-text">
            <input
              type="checkbox"
              checked={placementAvailableNow}
              onChange={(event) =>
                setPlacementAvailableNow(event.target.checked)
              }
              className="mt-1 h-4 w-4 rounded border-dark-border bg-primary-bg"
            />
            <span>
              Feature this ad in Available Now.
              <span className="block text-xs text-text-gray-opacity">
                Highlight this campaign so clients see you as currently available.
              </span>
            </span>
          </label>
        </div>

        <div className="mx-auto mt-6 w-full max-w-lg space-y-2">
          <label className="text-sm font-semibold text-primary-text">
            Country
          </label>
          <Select
            value={selectedCountrySlug || undefined}
            onValueChange={(value) => {
              setSelectedCountrySlug(value);
              setCountrySearchQuery("");
              setOpenStateKey(null);
            }}
          >
            <SelectTrigger className="h-12 rounded-[12px] border border-dark-border bg-input-bg px-4 py-3 text-sm text-primary-text focus:ring-1 focus:ring-primary md:h-auto md:rounded-[10px]">
              <SelectValue placeholder="Select a country to load cities" />
            </SelectTrigger>
            <SelectContent className="border-dark-border bg-input-bg p-0">
              <div className="border-b border-dark-border p-2">
                <input
                  type="text"
                  value={countrySearchQuery}
                  onChange={(event) => setCountrySearchQuery(event.target.value)}
                  onKeyDown={(event) => event.stopPropagation()}
                  placeholder="Search country"
                  className="h-9 w-full rounded-md border border-dark-border bg-primary-bg px-3 text-sm text-primary-text placeholder:text-text-gray-opacity focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="max-h-72 overflow-y-auto p-1 pr-3 [scrollbar-gutter:stable]">
                {filteredCountryOptions.map((country) => (
                  <SelectItem
                    key={country.isoCode}
                    value={country.country_slug}
                    className="text-sm"
                  >
                    {country.name}
                  </SelectItem>
                ))}
                {filteredCountryOptions.length === 0 && (
                  <div className="px-3 py-2 text-sm text-text-gray-opacity">
                    No countries found.
                  </div>
                )}
              </div>
            </SelectContent>
          </Select>
          <p className="text-xs text-text-gray-opacity">
            United States and Canada are pinned to the top.
          </p>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3 md:mt-10 md:flex-row md:justify-center md:gap-8">
          <div className="w-full rounded-2xl border border-dark-border bg-tag-bg px-4 py-3 md:w-auto md:rounded-full md:px-6 md:py-2">
            <div className="grid grid-cols-3 divide-x divide-dark-border text-center md:flex md:items-center md:divide-x-0">
              <div className="px-2 md:px-0">
                <p className="text-[10px] uppercase tracking-wide text-text-gray-opacity md:hidden">Cities</p>
                <p className="text-sm font-medium text-primary-text md:text-base">
                  <span className="hidden md:inline">Cities Selected:&nbsp;</span>
                  {citiesSelected}
                </p>
              </div>
              <div className="px-2 md:px-0">
                <p className="text-[10px] uppercase tracking-wide text-text-gray-opacity md:hidden">Used</p>
                <p className="text-sm font-medium text-primary-text md:text-base">
                  <span className="hidden md:inline">&nbsp;&nbsp;·&nbsp;&nbsp;Credits Used:&nbsp;</span>
                  {creditsUsed.toLocaleString()}
                </p>
              </div>
              <div className="px-2 md:px-0">
                <p className="text-[10px] uppercase tracking-wide text-text-gray-opacity md:hidden">Balance</p>
                <p className="text-sm font-medium text-primary-text md:text-base">
                  <span className="hidden md:inline">&nbsp;&nbsp;·&nbsp;&nbsp;Available:&nbsp;</span>
                  {availableCredits.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleAllCities}
            disabled={!selectedCountry || stateOptions.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dark-border bg-tag-bg px-4 py-2.5 text-sm text-primary-text transition-colors hover:text-primary disabled:cursor-not-allowed disabled:text-text-gray-opacity md:w-auto md:rounded-none md:border-0 md:bg-transparent md:px-0 md:py-0"
          >
            <input
              type="checkbox"
              checked={isAllSelected}
              readOnly
              className="h-4 w-4 rounded border-dark-border bg-primary-bg text-primary"
            />
            <span>
              {isAllSelected
                ? "Deselect all shown"
                : selectedCountry
                ? `Select all in ${selectedCountry.name}`
                : "Select a country first"}
            </span>
          </button>
        </div>

        <div className="mt-6 pr-0 md:pr-2">
          {!selectedCountry ? (
            <div className="rounded-2xl border border-dark-border bg-input-bg px-4 py-6 text-sm text-text-gray-opacity">
              Select a country above to view available states and cities.
            </div>
          ) : stateOptions.length === 0 ? (
            <div className="rounded-2xl border border-dark-border bg-input-bg px-4 py-6 text-sm text-text-gray-opacity">
              No city coverage data is currently available for {selectedCountry.name}.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {stateOptions.map((state) => {
                const stateCost = state.cities.length * CREDITS_PER_CITY;
                const isStateFullySelected = state.cities.every((city) =>
                  Boolean(
                    selectedCities[
                      makeCityKey(state.country_slug, state.state_slug, city.city_slug)
                    ]
                  )
                );
                const stateKey = makeStateKey(state.country_slug, state.state_slug);
                const citySearch = citySearchByStateKey[stateKey] ?? "";
                const normalizedCitySearch = citySearch.trim().toLowerCase();
                const filteredCities = normalizedCitySearch
                  ? state.cities.filter((city) =>
                      city.name.toLowerCase().includes(normalizedCitySearch)
                    )
                  : state.cities;
                return (
                  <Select
                    key={stateKey}
                    open={openStateKey === stateKey}
                    onOpenChange={(open) => {
                      if (!open) {
                        setCitySearchByStateKey((prev) =>
                          prev[stateKey] ? { ...prev, [stateKey]: "" } : prev
                        );
                      }
                      setOpenStateKey((prev) =>
                        open ? stateKey : prev === stateKey ? null : prev
                      );
                    }}
                  >
                    <SelectTrigger className="h-12 rounded-[12px] border border-dark-border bg-input-bg px-4 py-3 text-sm text-primary-text focus:ring-1 focus:ring-primary md:h-auto md:rounded-[10px]">
                      <SelectValue placeholder={`${state.name}, ${state.country_name}`} />
                    </SelectTrigger>
                    <SelectContent className="w-[min(calc(100vw-2rem),420px)] border-dark-border bg-input-bg p-0">
                      <div className="px-4 py-3">
                        <div className="mb-3">
                          <input
                            type="text"
                            value={citySearch}
                            onChange={(event) =>
                              setCitySearchByStateKey((prev) => ({
                                ...prev,
                                [stateKey]: event.target.value,
                              }))
                            }
                            onKeyDown={(event) => event.stopPropagation()}
                            placeholder={`Search cities in ${state.name}`}
                            className="h-9 w-full rounded-md border border-dark-border bg-primary-bg px-3 text-sm text-primary-text placeholder:text-text-gray-opacity focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <div className="max-h-[35vh] overflow-y-auto pr-4 md:max-h-64 [scrollbar-gutter:stable]">
                          <ul className="space-y-3 text-sm text-text-gray-opacity">
                            {filteredCities.map((city) => {
                              const key = makeCityKey(
                                state.country_slug,
                                state.state_slug,
                                city.city_slug
                              );
                              const checked = Boolean(selectedCities[key]);
                              return (
                                <li
                                  key={key}
                                  className="flex items-center justify-between gap-4 pr-1"
                                >
                                  <span>{city.name}</span>
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggleCity(state, city)}
                                    className="h-4 w-4 rounded border-dark-border bg-primary-bg text-primary"
                                  />
                                </li>
                              );
                            })}
                          </ul>
                          {filteredCities.length === 0 && (
                            <p className="pt-2 text-sm text-text-gray-opacity">
                              No cities found.
                            </p>
                          )}
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-3 border-t border-dark-border pt-3 text-sm font-semibold text-primary-text md:mt-4 md:pt-4">
                          <span className="truncate">
                            {isStateFullySelected
                              ? "All selected"
                              : `${state.name} (${stateCost} cr)`}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => selectAllInState(state)}
                              className="text-xs uppercase tracking-wide text-primary transition-colors hover:text-primary/80"
                            >
                              {isStateFullySelected ? "Clear" : "Select all"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setOpenStateKey(null);
                                setCitySearchByStateKey((prev) =>
                                  prev[stateKey] ? { ...prev, [stateKey]: "" } : prev
                                );
                              }}
                              className="rounded-full border border-dark-border bg-primary-bg px-3 py-1 text-[11px] font-semibold text-primary-text transition-colors hover:border-primary/50 hover:bg-primary/10"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      </div>
                    </SelectContent>
                  </Select>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/dashboard/ad-management" className="shrink-0">
            <button
              type="button"
              className="flex h-10 items-center justify-center gap-1.5 rounded-full border border-dark-border bg-primary-bg px-4 text-sm text-text-gray-opacity transition-colors hover:text-primary-text"
            >
              <span className="text-base leading-none">‹</span>
              <span>Back</span>
            </button>
          </Link>
          <Button
            type="button"
            className="w-full max-w-md"
            disabled={!canPlaceAd || isPlacing}
            onClick={handlePlaceAd}
          >
            {isPlacing ? "Placing Ad…" : "Place Ad"}
          </Button>
        </div>
      </div>

      <Dialog open={isLowBalanceOpen} onOpenChange={setIsLowBalanceOpen}>
        <DialogContent className="sm:max-w-md bg-[#1E1E1E] border-border-gray text-white">
          <DialogHeader>
            <DialogTitle>Insufficient credits</DialogTitle>
            <DialogDescription className="text-text-gray">
              You need {creditsUsed.toLocaleString()} credits to place this ad,
              but your wallet has {availableCredits.toLocaleString()}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => setIsLowBalanceOpen(false)}
              className="bg-transparent border-border-gray text-white hover:bg-white/10"
            >
              Close
            </Button>
            <Link href="/dashboard/wallet" className="w-full sm:w-auto">
              <Button className="w-full bg-primary text-white hover:bg-primary/90">
                Add credits
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
