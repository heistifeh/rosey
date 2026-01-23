"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiBuilder } from "@/api/builder";
import { Profile } from "@/types/types";
import { Search, SlidersHorizontal, MapPin, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LocationFilter, LocationValue } from "@/components/location-filter";

interface SearchPageContentProps {
    initialCitySlug?: string;
    initialCountrySlug?: string;
    initialGender?: string;
}

export function SearchPageContent({
    initialCitySlug,
    initialCountrySlug,
    initialGender = "All",
}: SearchPageContentProps) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [location, setLocation] = useState<LocationValue | null>(null);
    const [selectedGender, setSelectedGender] = useState<string>(initialGender);

    const formatSlug = (slug: string) => {
        return slug
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    useEffect(() => {
        const citySlug = initialCitySlug || searchParams.get("city_slug");
        const countrySlug = initialCountrySlug || searchParams.get("country_slug");

        const city = searchParams.get("city") || (citySlug ? formatSlug(citySlug) : "");
        const country = searchParams.get("country") || (countrySlug ? formatSlug(countrySlug) : "");

        const gender = searchParams.get("gender") || initialGender;

        if (citySlug && countrySlug) {
            setLocation({
                city,
                country,
                city_slug: citySlug,
                country_slug: countrySlug,
            });
        }

        if (gender) {
            setSelectedGender(gender);
        }
    }, [initialCitySlug, initialCountrySlug, initialGender, searchParams]);

    const fetchProfiles = async () => {
        setIsLoading(true);
        try {
            const effectiveCitySlug = location?.city_slug || initialCitySlug || searchParams.get("city_slug") || undefined;
            const effectiveCountrySlug = location?.country_slug || initialCountrySlug || searchParams.get("country_slug") || undefined;
            const effectiveGender = selectedGender !== "All" ? selectedGender : (searchParams.get("gender") || undefined);

            const data = await apiBuilder.profiles.getProfiles({
                citySlug: effectiveCitySlug,
                countrySlug: effectiveCountrySlug,
                gender: effectiveGender === "All" ? undefined : effectiveGender,
            });

            setProfiles(data || []);
        } catch (error) {
            console.error("Failed to fetch profiles", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, [location, selectedGender, searchParams]);

    const handleSearch = () => {
        if (location) {
            const basePath = `/escorts/${location.country_slug}/${location.city_slug}`;
            const params = new URLSearchParams();

            if (selectedGender && selectedGender !== "All") {
                params.set("gender", selectedGender);
            }

            params.set("city", location.city);
            params.set("country", location.country);

            router.push(`${basePath}?${params.toString()}`);
        } else {
            const params = new URLSearchParams();
            if (selectedGender && selectedGender !== "All") {
                params.set("gender", selectedGender);
            }
            router.push(`/search?${params.toString()}`);
        }
    };

    const handleClear = () => {
        setLocation(null);
        setSelectedGender("All");
        router.push("/search");
    };

    const genderOptions = [
        { label: "Female", value: "Female" },
        { label: "Male", value: "Male" },
        { label: "Non-binary", value: "Non-binary" },
        { label: "Trans Only", value: "Transgender" },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-[#0f0f10]">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-[#0f0f10] border-b border-white/10 px-4 py-4 md:px-[60px]">
                <div className="flex flex-col gap-6 max-w-7xl mx-auto">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between">
                        <Link href="/" className="inline-flex items-center">
                            <Image
                                src="/images/logo.svg"
                                alt="Rosey"
                                width={100}
                                height={30}
                                className="h-auto w-24 md:w-32"
                                priority
                            />
                        </Link>
                        <div className="hidden md:flex gap-4">
                            <Link href="/" className="text-white font-medium hover:text-primary transition-colors">Home</Link>
                            <Link href="/blog" className="text-[#8E8E93] font-medium hover:text-primary transition-colors">Blog</Link>
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <h1 className="text-2xl md:text-3xl font-semibold text-white">Find Independent Escorts {location ? `in ${location.city}` : ""}</h1>
                        <p className="text-text-gray mt-2 text-sm md:text-base">Discover all the adult entertainers {location ? `in ${location.city}` : ""}. From Escorts, BDSM, Kink, Video, Massage and much more.</p>
                    </div>

                    {/* Filter Bar */}
                    <div className="bg-[#1f1f21] p-1.5 md:p-2 rounded-[24px] md:rounded-full border border-white/10 flex flex-col md:flex-row gap-2 md:gap-4 md:items-center">
                        <div className="flex-1 flex flex-col md:flex-row gap-2 md:gap-0 md:items-center min-w-0">
                            {/* Location */}
                            <div className="relative flex-1 min-w-[200px]">
                                <LocationFilter
                                    value={location || undefined}
                                    onChange={setLocation}
                                    variant="minimal"
                                    className="w-full bg-transparent border-none text-white focus:ring-0 pl-2"
                                />
                            </div>

                            {/* Separator/Distance Mock */}
                            <div className="hidden md:flex items-center text-sm text-[#8E8E93] border-l border-white/10 px-4 whitespace-nowrap">
                                within 30mi
                            </div>
                        </div>

                        <div className="hidden md:block w-px h-8 bg-white/10"></div>

                        {/* Gender Toggles */}
                        <div className="flex flex-wrap gap-1 items-center px-1">
                            {genderOptions.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => setSelectedGender(prev => prev === opt.value ? 'All' : opt.value)}
                                    className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-colors border ${selectedGender === opt.value
                                        ? 'bg-white text-black border-white'
                                        : 'bg-transparent text-[#8E8E93] border-transparent hover:text-white'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        {/* Search Button */}
                        <button
                            onClick={handleSearch}
                            className="bg-primary hover:bg-primary/90 text-white rounded-[20px] md:rounded-full h-10 md:h-12 px-6 md:px-8 font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                            <Search className="h-5 w-5" />
                            <span>Search</span>
                        </button>
                    </div>

                    <div className="flex items-center justify-end">
                        <button className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
                            <SlidersHorizontal className="h-4 w-4" />
                            MORE FILTERS
                        </button>
                    </div>
                </div>
            </header>

            {/* Results */}
            <main className="flex-1 px-4 py-8 md:px-[60px] max-w-7xl mx-auto w-full">
                <div className="mb-6 pb-4 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white">
                        {location ? `${location.city} escorts` : "All profiles"}
                    </h2>
                    <span className="text-sm text-text-gray">Listing {profiles.length} profiles</span>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : profiles.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {profiles.map((profile) => (
                            <Link
                                key={profile.id}
                                href={`/profile/${profile.id}`}
                                className="group flex flex-col bg-input-bg rounded-[24px] overflow-hidden hover:opacity-90 transition-all duration-300"
                            >
                                <div className="relative aspect-[3/4] w-full bg-gray-800">
                                    {profile.images && profile.images.length > 0 ? (
                                        <Image
                                            src={profile.images.find(img => img.is_primary)?.public_url || profile.images[0].public_url}
                                            alt={profile.working_name || "Profile"}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-900">
                                            No Image
                                        </div>
                                    )}

                                    {/* Badges */}
                                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                                        {/* <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                             ESCORT
                         </span> */}
                                    </div>
                                </div>

                                <div className="p-4 flex flex-col gap-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-bold text-white leading-tight">{profile.working_name}</h3>
                                            <p className="text-sm text-text-gray line-clamp-1">{profile.tagline || profile.about?.substring(0, 30)}</p>
                                        </div>
                                        <div className="bg-white/10 px-2 py-1 rounded-md">
                                            <span className="text-white font-bold text-sm">${profile.base_hourly_rate}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-text-gray mt-2">
                                        <MapPin className="h-3 w-3" />
                                        <span>{profile.city}, {profile.country}</span>
                                    </div>

                                    <div className="flex items-center gap-2 mt-1">
                                        <div className={`w-2 h-2 rounded-full ${profile.is_active ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                                        <span className="text-xs text-white">{profile.is_active ? 'Available' : 'Unavailable'}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <Search className="h-6 w-6 text-text-gray" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No profiles found</h3>
                        <button onClick={handleClear} className="text-primary hover:underline">
                            Clear filters and search again
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
