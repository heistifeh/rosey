"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { City, State } from "country-state-city";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
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
  state_slug: string;
  country_name: string;
  country_code: string;
  country_slug: string;
  cities: CityOption[];
};

type SelectedCity = {
  country_slug: string;
  state_slug: string;
  city_slug: string;
};

type PlaceAdPayload = {
  title: string;
  placement_available_now: boolean;
  cities: SelectedCity[];
};

const CREDITS_PER_CITY = 15;

const AD_COUNTRIES = [
  {
    name: "United States",
    isoCode: "US",
    country_slug: "united-states",
  },
  {
    name: "Canada",
    isoCode: "CA",
    country_slug: "canada",
  },
] as const;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const makeCityKey = (
  country_slug: string,
  state_slug: string,
  city_slug: string
) => `${country_slug}/${state_slug}/${city_slug}`;

export default function PlaceAdPage() {
  const stateOptions = useMemo<StateOption[]>(() => {
    return AD_COUNTRIES.flatMap((country) => {
      const states = State.getStatesOfCountry(country.isoCode);
      return states
        .map((state) => {
          const rawCities = City.getCitiesOfState(country.isoCode, state.isoCode);
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

          const cities = Array.from(uniqueCities.values()).sort((a, b) =>
            a.name.localeCompare(b.name)
          );

          return {
            name: state.name,
            state_slug: slugify(state.name),
            country_name: country.name,
            country_code: country.isoCode,
            country_slug: country.country_slug,
            cities,
          };
        })
        .filter((state) => state.cities.length > 0);
    });
  }, []);

  const [selectedCities, setSelectedCities] = useState<Record<string, SelectedCity>>({});
  const [isPlacing, setIsPlacing] = useState(false);
  const [isLowBalanceOpen, setIsLowBalanceOpen] = useState(false);
  const [adTitle, setAdTitle] = useState("");
  const [placementAvailableNow, setPlacementAvailableNow] = useState(false);
  const router = useRouter();
  const { wallet } = useWallet();
  const availableCredits = wallet?.balance_credits ?? 0;

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
  const hasTitle = trimmedTitle.length > 0;
  const hasInsufficientCredits = creditsUsed > availableCredits;

  const isAllSelected = useMemo(
    () =>
      stateOptions.every((state) =>
        state.cities.every((city) =>
          Boolean(
            selectedCities[
              makeCityKey(state.country_slug, state.state_slug, city.city_slug)
            ]
          )
        )
      ),
    [selectedCities]
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
    if (isAllSelected) {
      setSelectedCities({});
      return;
    }

    const next: typeof selectedCities = {};
    stateOptions.forEach((state) => {
      state.cities.forEach((city) => {
        const key = makeCityKey(state.country_slug, state.state_slug, city.city_slug);
        next[key] = {
          country_slug: state.country_slug,
          state_slug: state.state_slug,
          city_slug: city.city_slug,
        };
      });
    });
    setSelectedCities(next);
  }, [isAllSelected]);

  const canPlaceAd = hasTitle && citiesSelected > 0;

  const handlePlaceAd = useCallback(async () => {
    if (!hasTitle) {
      toast.error("Please enter an ad title.");
      return;
    }
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
        title: trimmedTitle,
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
    availableCredits,
    creditsUsed,
    selectedValues,
    trimmedTitle,
    hasTitle,
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
              placeholder="Holiday Lagos Promo"
              className="bg-input-bg text-primary-text"
            />
            <p className="text-xs text-text-gray-opacity">
              This title will appear to clients when they view your campaigns.
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

        <div className="mt-6 flex flex-col items-center justify-center gap-3 md:mt-10 md:flex-row md:gap-24">
          <div className="w-full rounded-2xl border border-dark-border bg-tag-bg px-4 py-4 text-center text-sm text-primary-text md:w-auto md:rounded-full md:py-2 md:text-base">
            <span className="block md:inline">
              Cities Selected: {citiesSelected}
            </span>
            <span className="hidden md:inline">
              &nbsp;&nbsp;&middot;&nbsp;&nbsp;Credit Used: {creditsUsed.toLocaleString()}
              &nbsp;&nbsp;&middot;&nbsp;&nbsp;Available Credit:{" "}
              {availableCredits.toLocaleString()}
            </span>
            <span className="mt-2 block md:hidden">
              Credit Used: {creditsUsed.toLocaleString()}
            </span>
            <span className="mt-1 block md:hidden">
              Available Credit: {availableCredits.toLocaleString()}
            </span>
          </div>
          <button
            type="button"
            onClick={toggleAllCities}
            className="flex items-center gap-2 text-sm text-primary-text hover:text-primary transition-colors"
          >
            <span className="w-4 h-4">
              <input
                type="checkbox"
                checked={isAllSelected}
                readOnly
                className="h-4 w-4 rounded border-dark-border bg-primary-bg text-primary"
              />
            </span>
            <span>{isAllSelected ? "Deselect all" : "Select All"}</span>
          </button>
        </div>

        <div className="mt-6 pr-0 md:pr-2">
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
              return (
                <Select key={state.state_slug}>
                  <SelectTrigger className="h-12 rounded-[12px] border border-dark-border bg-input-bg px-4 py-3 text-sm text-primary-text focus:ring-1 focus:ring-primary md:h-auto md:rounded-[10px]">
                    <SelectValue placeholder={`${state.name}, ${state.country_name}`} />
                  </SelectTrigger>
                  <SelectContent className="border-dark-border bg-input-bg p-0">
                    <div className="px-4 py-3">
                      <ul className="max-h-72 overflow-y-auto pr-1 space-y-4 text-sm text-text-gray-opacity md:text-base">
                        {state.cities.map((city) => {
                          const key = makeCityKey(
                            state.country_slug,
                            state.state_slug,
                            city.city_slug
                          );
                          const checked = Boolean(selectedCities[key]);
                          return (
                            <li
                              key={key}
                              className="flex items-center justify-between gap-4"
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
                      <div className="mt-6 flex items-center justify-between gap-4 text-sm font-semibold text-primary-text md:text-base">
                        <span>
                          {isStateFullySelected
                            ? "Selected all cities"
                            : `Select all cities in ${state.name} (${stateCost} Credits)`}
                        </span>
                        <button
                          type="button"
                          onClick={() => selectAllInState(state)}
                          className="text-xs uppercase tracking-wide text-primary text-primary transition-colors hover:text-primary/80"
                        >
                          {isStateFullySelected ? "Clear" : "Select all"}
                        </button>
                      </div>
                    </div>
                  </SelectContent>
                </Select>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/dashboard/ad-management">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-dark-border bg-primary-bg text-text-gray-opacity"
              aria-label="Back"
            >
              <span className="text-lg">‹</span>
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
