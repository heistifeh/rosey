"use client";

import { useState } from "react";
import { HeroSection } from "@/components/home/hero-section";

type Filters = {
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

export function HeroShell() {
  const [filters, setFilters] = useState<Filters>({
    gender: "All",
    priceRange: "",
  });

  return <HeroSection filters={filters} setFilters={setFilters} />;
}
