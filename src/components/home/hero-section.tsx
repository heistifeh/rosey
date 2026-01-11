"use client";

import {
  Search,
  CircleDollarSign,
  SlidersHorizontal,
  Venus,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LocationFilter,
  type LocationValue,
} from "@/components/location-filter";

interface HeroSectionProps {
  filters: {
    gender: string;
    priceRange?: string;
    location?: {
      city: string;
      country: string;
      city_slug: string;
      country_slug: string;
    };
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      gender: string;
      priceRange?: string;
      location?: {
        city: string;
        country: string;
        city_slug: string;
        country_slug: string;
      };
    }>
  >;
}

export function HeroSection({ filters, setFilters }: HeroSectionProps) {
  const genders = ["All", "Male", "Female", "Transgender", "Non-binary"];

  const priceRanges = [
    "$0 - $100",
    "$100 - $200",
    "$200 - $300",
    "$300 - $500",
    "$500+",
  ];

  const handleSearch = () => {
    console.log("Searching for:", {
      filters,
    });
  };

  const handleFilter = () => {
    console.log("Filter clicked:", { filters });
  };

  const handleLocationChange = (location: LocationValue | null) => {
    setFilters((prev) => ({
      ...prev,
      location: location ?? undefined,
    }));
  };

  return (
    <section className="flex flex-1 items-center justify-center px-4 pb-10 pt-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 text-center ">
        <section className=" flex flex-col gap-4 items-center">
          <h1 className="text-2xl font-semibold leading-tight sm:text-4xl lg:text-[72px] text-primary-text">
            Where Adult Companions
            <br />
            Grow and Connect
          </h1>
          <p className="max-w-[500px] text-base sm:text-lg font-normal text-primary-text text-center">
            Created for providers of adult companionship and intimate services
            to showcase their offerings and reach paying clients.
          </p>
        </section>

        <div className="flex w-full flex-col items-stretch gap-3 rounded-[32px] bg-input-bg px-4 py-4 backdrop-blur-md md:inline-flex md:w-auto md:flex-row md:items-center md:justify-center md:gap-3 md:rounded-full md:px-4 md:py-3 z-20">
          <div className="w-full md:w-auto min-w-[180px]">
            <LocationFilter
              value={filters.location}
              onChange={handleLocationChange}
              className="w-full"
            />
          </div>

          <Select
            value={filters.gender}
            onValueChange={(val) =>
              setFilters((prev) => ({ ...prev, gender: val }))
            }
          >
            <SelectTrigger className="h-auto w-full md:w-auto rounded-full bg-[#575757] px-4 py-2 text-base font-normal text-white border-0 hover:bg-[#6a6a6a] focus:ring-0 focus:ring-offset-0 min-w-[140px] justify-center gap-1 md:justify-between md:gap-0">
              <div className="flex items-center gap-1 pr-1 text-sm md:text-base font-normal whitespace-nowrap">
                <Venus className="h-4 w-4 text-white" />
                <SelectValue placeholder="Select Gender" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {genders.map((gen) => (
                <SelectItem key={gen} value={gen}>
                  {gen}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.priceRange}
            onValueChange={(val) =>
              setFilters((prev) => ({ ...prev, priceRange: val }))
            }
          >
            <SelectTrigger className="h-auto w-full md:w-auto rounded-full bg-[#575757] px-4 text-white border-0 hover:bg-[#6a6a6a] focus:ring-0 focus:ring-offset-0 min-w-[160px] justify-center gap-1 md:justify-between md:gap-0">
              <div className="flex items-center gap-1 text-sm md:text-base font-normal pr-1 whitespace-nowrap">
                <CircleDollarSign className="h-4 w-4 text-white" />
                <SelectValue
                  placeholder="Select price range"
                  className="text-base font-normal "
                />
              </div>
            </SelectTrigger>
            <SelectContent>
              {priceRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-3 md:gap-3">
            <button
              onClick={handleFilter}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f1f21] text-white transition hover:bg-[#2a2a2d]"
              aria-label="Filter"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </button>

            <button
              onClick={handleSearch}
              className="flex h-12 flex-1 md:h-10 md:w-10 md:flex-none items-center justify-center gap-2 md:gap-0 rounded-full bg-primary text-white text-base font-semibold transition hover:bg-primary/90"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
              <span className="md:hidden">Search</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
