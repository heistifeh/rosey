"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiBuilder } from "@/api/builder";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Assuming utils is aliased to lib or utils depending on setup, but typically shadcn uses lib/utils. I saw src/utils/error-handler, but shadcn components usually import from @/lib/utils. I need to check where cn is.

// Let's check where `cn` is.
// Looking at src/components/ui/button.tsx would tell me.
// I'll assume standard shadcn structure for now and correct if needed.
// Actually, I should verify `cn` location first to avoid errors. 
// Step 25 output showed src/lib has 1 file. It might be utils.ts.
// Step 16 output showed src/utils has utils.ts. 
// Step 47 (package.json) showed "clsx" and "tailwind-merge".
// I'll bet it's in @/lib/utils or @/utils/utils. 
// I'll assume @/lib/utils for now as per shadcn standard, but will check.

// Implementation of Debounce
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

type Location = {
    country: string;
    city: string;
    country_slug: string;
    city_slug: string;
};

export function LocationSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const { data: locations, isLoading } = useQuery({
        queryKey: ["locations", debouncedSearchTerm],
        queryFn: () => apiBuilder.locations.getLocations(debouncedSearchTerm),
        enabled: isOpen || debouncedSearchTerm.length > 0,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });


    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (location: Location) => {
        setSelectedLocation(location);
        setSearchTerm(`${location.city}, ${location.country}`);
        setIsOpen(false);

        console.log("Selected location:", location);
    };

    return (
        <div className="relative w-full max-w-xs md:max-w-sm" ref={dropdownRef}>
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-gray-opacity" />
                <Input
                    placeholder="Choose location..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    className="pl-9 bg-primary-bg rounded-full border-dark-border focus-visible:ring-primary w-full"
                />
                {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
                )}
            </div>

            {isOpen && locations && (
                <div className="absolute top-full mt-2 w-full bg-input-bg border border-dark-border rounded-xl shadow-lg z-50 overflow-hidden max-h-[300px] overflow-y-auto">
                    {locations?.length === 0 && !isLoading ? (
                        <div className="p-4 text-center text-sm text-text-gray-opacity">
                            No locations found
                        </div>
                    ) : (
                        locations?.map((location: Location, index: number) => (
                            <button
                                key={`${location.city_slug}-${index}`}
                                onClick={() => handleSelect(location)}
                                className="w-full text-left px-4 py-3 hover:bg-primary-bg transition-colors flex items-center gap-2 group"
                            >
                                <div className="p-2 rounded-full bg-primary-bg group-hover:bg-input-bg transition-colors">
                                    <MapPin className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-primary-text">
                                        {location.city}
                                    </span>
                                    <span className="text-xs text-text-gray-opacity">
                                        {location.country}
                                    </span>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
