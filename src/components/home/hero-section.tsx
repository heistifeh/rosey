"use client";

import {
  Search,
  CircleDollarSign,
  SlidersHorizontal,
  Venus,
} from "lucide-react";
import { useRouter } from "next/navigation";
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
import { useI18n } from "@/lib/i18n/provider";

interface HeroSectionProps {
  filters: {
    gender: string;
    priceRange: string;
    location?: {
      city: string;
      state?: string;
      country: string;
      city_slug: string;
      state_slug?: string;
      country_slug: string;
    };
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      gender: string;
      priceRange: string;
      location?: {
        city: string;
        state?: string;
        country: string;
        city_slug: string;
        state_slug?: string;
        country_slug: string;
      };
    }>
  >;
}

export function HeroSection({ filters, setFilters }: HeroSectionProps) {
  const { t } = useI18n();
  const genders = [
    { value: "All", label: t("hero.gender.all") },
    { value: "Male", label: t("hero.gender.male") },
    { value: "Female", label: t("hero.gender.female") },
    { value: "Transgender", label: t("hero.gender.transgender") },
    { value: "Non-binary", label: t("hero.gender.nonBinary") },
  ];
  const router = useRouter();

  const priceRanges = [
    "$0 - $100",
    "$100 - $200",
    "$200 - $300",
    "$300 - $500",
    "$500+",
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (filters.location?.country_slug) {
      params.set("country", filters.location.country_slug);
    }
    if (filters.location?.city_slug) {
      params.set("city", filters.location.city_slug);
    }
    if (filters.location?.state_slug) {
      params.set("state", filters.location.state_slug);
    }

    if (filters.gender && filters.gender !== "All") {
      params.set("gender", filters.gender);
    }

    if (filters.priceRange) {
      const clean = filters.priceRange.replace(/[\$\s]/g, "");
      if (clean.includes("-")) {
        const [min, max] = clean.split("-").map((val) => Number(val));
        if (!Number.isNaN(min)) params.set("min", String(min));
        if (!Number.isNaN(max)) params.set("max", String(max));
      } else if (clean.includes("+")) {
        const min = Number(clean.replace("+", ""));
        if (!Number.isNaN(min)) params.set("min", String(min));
      }
    }

    const queryString = params.toString();
    router.push(queryString ? `/search?${queryString}` : "/search");
  };

  const handleFilter = () => {
    handleSearch();
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
          <h1 className="text-2xl font-semibold leading-tight sm:text-4xl lg:text-[72px] text-primary-text animate-fadeInUp">
            {t("hero.titleLine1")}
            <br />
            {t("hero.titleLine2")}
          </h1>
          <p className="max-w-[500px] text-base sm:text-lg font-normal text-primary-text text-center animate-fadeInUp animation-delay-200">
            {t("hero.subtitle")}
          </p>
        </section>

        {/* Mobile Search Area - Trendy & Cute Design */}
        <div className="flex md:hidden w-full flex-col gap-3 rounded-3xl bg-[#2C2C2E] backdrop-blur-xl p-5 shadow-2xl shadow-black/20 z-20">
          {/* Location Input - Clean & Modern */}
          <div className="relative">
            <LocationFilter
              value={filters.location}
              onChange={handleLocationChange}
              placeholder={t("hero.locationPlaceholder")}
              className="w-full [&>button]:bg-[#1C1C1E] [&>button]:border [&>button]:border-gray-700 [&>button]:h-12 [&>button]:text-sm [&>button]:text-white [&>button]:px-4 [&>button]:rounded-2xl [&>button]:shadow-sm [&>button]:hover:shadow-md [&>button]:transition-all"
            />
          </div>

          {/* Gender & Price in a Row - Compact & Cute */}
          <div className="grid grid-cols-2 gap-3">
            <Select
              value={filters.gender}
              onValueChange={(val) =>
                setFilters((prev) => ({ ...prev, gender: val }))
              }
            >
              <SelectTrigger className="h-12 rounded-2xl bg-[#575757] border-0 px-4 text-sm font-medium text-white hover:bg-[#6a6a6a] transition-all focus:ring-2 focus:ring-primary/20 focus:ring-offset-0">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Venus className="h-4 w-4 text-white" />
                  <SelectValue placeholder={t("hero.gender.all")} />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-gray-700 bg-[#2C2C2E]">
                {genders.map((gen) => (
                  <SelectItem key={gen.value} value={gen.value} className="rounded-lg text-white focus:bg-[#3C3C3E] focus:text-white">
                    {gen.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              key={`price-select-${filters.priceRange || "empty"}`}
              value={filters.priceRange || undefined}
              onValueChange={(val) =>
                setFilters((prev) => ({ ...prev, priceRange: val }))
              }
            >
              <SelectTrigger className="h-12 rounded-2xl bg-[#575757] border-0 px-4 text-sm font-medium text-white hover:bg-[#6a6a6a] transition-all focus:ring-2 focus:ring-primary/20 focus:ring-offset-0">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CircleDollarSign className="h-4 w-4 text-white" />
                  <SelectValue placeholder={t("hero.price")} />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-gray-700 bg-[#2C2C2E]">
                {priceRanges.map((range) => (
                  <SelectItem key={range} value={range} className="rounded-lg text-white focus:bg-[#3C3C3E] focus:text-white">
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filter & Search Buttons in a Row */}
          <div className="grid grid-cols-[auto_1fr] gap-3">
            <button
              onClick={handleFilter}
              className="h-14 w-14 rounded-2xl bg-[#1C1C1E] hover:bg-[#2a2a2d] text-white transition-all flex items-center justify-center flex-shrink-0"
              aria-label="Filter"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </button>

            <button
              onClick={handleSearch}
              className="h-14 w-full rounded-2xl bg-gradient-to-r from-primary via-pink-500 to-primary bg-size-200 bg-pos-0 hover:bg-pos-100 text-white text-base font-bold transition-all duration-500 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Search className="h-5 w-5" />
              <span>{t("hero.findCompanions")}</span>
            </button>
          </div>
        </div>

        {/* Desktop Search Area - Horizontal Layout */}
        <div className="hidden md:flex w-auto flex-row items-center justify-center gap-3 rounded-full bg-input-bg px-4 py-3 backdrop-blur-md z-20">
          <div className="w-auto min-w-[180px]">
            <LocationFilter
              value={filters.location}
              onChange={handleLocationChange}
              placeholder={t("hero.locationPlaceholder")}
              className="w-full"
            />
          </div>

          <Select
            value={filters.gender}
            onValueChange={(val) =>
              setFilters((prev) => ({ ...prev, gender: val }))
            }
          >
            <SelectTrigger className="h-auto w-auto rounded-full bg-[#575757] px-5 py-2 text-base font-normal text-white border-0 hover:bg-[#6a6a6a] focus:ring-0 focus:ring-offset-0 min-w-[140px] justify-between gap-1">
              <div className="flex items-center gap-1 pr-1 text-base font-normal whitespace-nowrap">
                <Venus className="h-4 w-4 text-white" />
                <SelectValue placeholder={t("hero.selectGender")} />
              </div>
            </SelectTrigger>
            <SelectContent>
              {genders.map((gen) => (
                <SelectItem key={gen.value} value={gen.value}>
                  {gen.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            key={`price-select-${filters.priceRange || "empty"}`}
            value={filters.priceRange || undefined}
            onValueChange={(val) =>
              setFilters((prev) => ({ ...prev, priceRange: val }))
            }
          >
            <SelectTrigger className="h-auto w-auto rounded-full bg-[#575757] px-5 py-2 text-white border-0 hover:bg-[#6a6a6a] focus:ring-0 focus:ring-offset-0 min-w-[160px] justify-between gap-1">
              <div className="flex items-center gap-1 text-base font-normal pr-1 whitespace-nowrap">
                <CircleDollarSign className="h-4 w-4 text-white" />
                <SelectValue
                  placeholder="Select price range"
                  className="text-base font-normal"
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

          <div className="flex items-center gap-3">
            <button
              onClick={handleFilter}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f1f21] text-white transition hover:bg-[#2a2a2d]"
              aria-label="Filter"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </button>

            <button
              onClick={handleSearch}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white text-base font-semibold transition hover:bg-primary/90 shadow-lg"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
