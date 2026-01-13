"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiBuilder } from "@/api/builder";
import { useWallet } from "@/hooks/use-wallet";

type CityOption = {
  name: string;
  city_slug: string;
};

type StateOption = {
  name: string;
  state_slug: string;
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
const COUNTRY_SLUG = "united-states";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const createCityOptions = (cities: string[]): CityOption[] =>
  cities.map((name) => ({
    name,
    city_slug: slugify(name),
  }));

const stateOptions: StateOption[] = [
  {
    name: "Alabama",
    state_slug: "alabama",
    cities: createCityOptions([
      "Birmingham",
      "Montgomery",
      "Mobile",
      "Huntsville",
      "Tuscaloosa",
      "Auburn",
    ]),
  },
  {
    name: "Florida",
    state_slug: "florida",
    cities: createCityOptions([
      "Jacksonville",
      "Miami",
      "Tampa",
      "Orlando",
      "St. Petersburg",
    ]),
  },
  {
    name: "Georgia",
    state_slug: "georgia",
    cities: createCityOptions([
      "Atlanta",
      "Savannah",
      "Augusta",
      "Columbus",
      "Macon",
    ]),
  },
  {
    name: "Texas",
    state_slug: "texas",
    cities: createCityOptions([
      "Houston",
      "Dallas",
      "Austin",
      "San Antonio",
      "Fort Worth",
      "El Paso",
    ]),
  },
  {
    name: "California",
    state_slug: "california",
    cities: createCityOptions([
      "Los Angeles",
      "San Francisco",
      "San Diego",
      "Sacramento",
      "San Jose",
      "Fresno",
    ]),
  },
  {
    name: "New York",
    state_slug: "new-york",
    cities: createCityOptions([
      "New York",
      "Buffalo",
      "Rochester",
      "Albany",
      "Syracuse",
    ]),
  },
  {
    name: "Illinois",
    state_slug: "illinois",
    cities: createCityOptions(["Chicago", "Springfield", "Naperville", "Peoria"]),
  },
  {
    name: "Colorado",
    state_slug: "colorado",
    cities: createCityOptions([
      "Denver",
      "Aurora",
      "Colorado Springs",
      "Fort Collins",
    ]),
  },
  {
    name: "Nevada",
    state_slug: "nevada",
    cities: createCityOptions(["Las Vegas", "Reno", "Carson City", "Henderson"]),
  },
];

const makeCityKey = (
  state_slug: string,
  city_slug: string,
  country_slug = COUNTRY_SLUG
) => `${country_slug}/${state_slug}/${city_slug}`;

export default function PauseAdPage() {
  const [selectedCities, setSelectedCities] = useState<Record<string, SelectedCity>>({});
  const [isPlacing, setIsPlacing] = useState(false);
  const [title] = useState("My Ad");
  const [placementAvailableNow] = useState(false);
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

  const isAllSelected = useMemo(
    () =>
      stateOptions.every((state) =>
        state.cities.every((city) =>
          Boolean(selectedCities[makeCityKey(state.state_slug, city.city_slug)])
        )
      ),
    [selectedCities]
  );

  const toggleCity = useCallback(
    (state: StateOption, city: CityOption) => {
      const key = makeCityKey(state.state_slug, city.city_slug);
      setSelectedCities((prev) => {
        const next = { ...prev };
        if (next[key]) {
          delete next[key];
        } else {
          next[key] = {
            country_slug: COUNTRY_SLUG,
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
        Boolean(prev[makeCityKey(state.state_slug, city.city_slug)])
      );
      const next = { ...prev };
      state.cities.forEach((city) => {
        const key = makeCityKey(state.state_slug, city.city_slug);
        if (allSelected) {
          delete next[key];
        } else {
          next[key] = {
            country_slug: COUNTRY_SLUG,
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
        const key = makeCityKey(state.state_slug, city.city_slug);
        next[key] = {
          country_slug: COUNTRY_SLUG,
          state_slug: state.state_slug,
          city_slug: city.city_slug,
        };
      });
    });
    setSelectedCities(next);
  }, [isAllSelected]);

  const canPlaceAd = citiesSelected > 0 && creditsUsed <= availableCredits;

  const handlePlaceAd = useCallback(async () => {
    if (citiesSelected === 0) {
      toast.error("Select at least one city.");
      return;
    }
    if (creditsUsed > availableCredits) {
      toast.error(
        `Not enough credits. You need ${creditsUsed}, you have ${availableCredits}.`
      );
      return;
    }

    setIsPlacing(true);
    try {
      const payload: PlaceAdPayload = {
        title,
        placement_available_now: placementAvailableNow,
        cities: selectedValues,
      };
      await apiBuilder.ads.placeAd(payload);
      toast.success("Ad placed successfully.");
      setSelectedCities({});
      router.push("/dashboard/ads");
    } catch (error) {
      console.error("Place ad error:", error);
      toast.error("Something went wrong while placing the ad.");
    } finally {
      setIsPlacing(false);
    }
  }, [
    citiesSelected,
    creditsUsed,
    availableCredits,
    selectedValues,
    title,
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
                Boolean(selectedCities[makeCityKey(state.state_slug, city.city_slug)])
              );
              return (
                <Select key={state.state_slug}>
                  <SelectTrigger className="h-12 rounded-[12px] border border-dark-border bg-input-bg px-4 py-3 text-sm text-primary-text focus:ring-1 focus:ring-primary md:h-auto md:rounded-[10px]">
                    <SelectValue placeholder={state.name} />
                  </SelectTrigger>
                  <SelectContent className="border-dark-border bg-input-bg p-0">
                    <div className="px-4 py-3">
                      <ul className="space-y-4 text-sm text-text-gray-opacity md:text-base">
                        {state.cities.map((city) => {
                          const key = makeCityKey(
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
    </div>
  );
}
