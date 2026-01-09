"use client";

import {
  Search,
  MapPinned,
  MapPin,
  CircleDollarSign,
  SlidersHorizontal,
  Venus,
  Loader2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiBuilder } from "@/api/builder";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  setFilters: React.Dispatch<React.SetStateAction<{
    gender: string;
    priceRange?: string;
    location?: {
      city: string;
      country: string;
      city_slug: string;
      country_slug: string;
    };
  }>>;
}

export function HeroSection({ filters, setFilters }: HeroSectionProps) {
  const [locationInput, setLocationInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const locationsQuery = useDebounce(locationInput, 300);

  const { data: fetchedLocations, isLoading } = useQuery({
    queryKey: ["locations", locationsQuery],
    queryFn: () => apiBuilder.locations.getLocations(locationsQuery),
    enabled: isLocationOpen || locationsQuery.length > 0,
    staleTime: 1000 * 60 * 5,
  });

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
      searchQuery,
      filters,
    });

  };

  const handleFilter = () => {
    console.log("Filter clicked:", { filters });

  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync locationInput with filters.location if filters.location changes externally
  useEffect(() => {
    if (filters.location) {
      setLocationInput(`${filters.location.city}, ${filters.location.country}`);
    } else {
      setLocationInput("");
    }
  }, [filters.location]);

  const handleLocationSelect = (loc: any) => {
    setLocationInput(`${loc.city}, ${loc.country}`);
    setFilters((prev) => ({
      ...prev,
      location: {
        city: loc.city,
        country: loc.country,
        city_slug: loc.city_slug,
        country_slug: loc.country_slug,
      },
    }));
    setIsLocationOpen(false);
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

          <div className="relative w-full md:w-auto min-w-[180px]" ref={dropdownRef}>
            <div
              className="flex items-center gap-2 h-auto w-full rounded-full bg-[#575757] px-4 py-2 text-base font-normal text-white border-0 hover:bg-[#6a6a6a] transition-colors cursor-text"
              onClick={() => setIsLocationOpen(true)}
            >
              <MapPinned className="h-4 w-4 text-white shrink-0" />
              <input
                type="text"
                placeholder="Choose Location"
                value={locationInput}
                onChange={(e) => {
                  setLocationInput(e.target.value);
                  setIsLocationOpen(true);
                }}
                className="bg-transparent border-none outline-none text-white placeholder:text-text-gray w-full text-sm md:text-base p-0"
              />
              {isLoading && <Loader2 className="h-3 w-3 animate-spin text-white shrink-0" />}
            </div>

            {isLocationOpen && fetchedLocations && (
              <div className="absolute top-full mt-2 w-full bg-[#1a1a1a] border border-[#333] rounded-xl shadow-xl overflow-hidden max-h-[300px] overflow-y-auto z-50 left-0">
                {fetchedLocations?.length === 0 && !isLoading ? (
                  <div className="p-3 text-center text-sm text-gray-400">
                    No locations found
                  </div>
                ) : (
                  fetchedLocations?.map((loc: any, idx: number) => (
                    <button
                      key={`${loc.city_slug}-${idx}`}
                      onClick={() => handleLocationSelect(loc)}
                      className="w-full text-left px-4 py-3 hover:bg-[#333] transition-colors flex items-center gap-2 group border-b border-[#333] last:border-0"
                    >
                      <MapPin className="h-3 w-3 text-gray-400 group-hover:text-primary transition-colors" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-200">
                          {loc.city}
                        </span>
                        <span className="text-xs text-gray-500">
                          {loc.country}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>


          <Select
            value={filters.gender}
            onValueChange={(val) => setFilters(prev => ({ ...prev, gender: val }))}
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
            onValueChange={(val) => setFilters(prev => ({ ...prev, priceRange: val }))}
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
