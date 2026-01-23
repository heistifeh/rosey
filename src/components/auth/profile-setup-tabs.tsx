"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralInformationFormContent } from "./general-information-form-content";
import { ProfileSetupFormContent } from "./profile-setup-form-content";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiBuilder } from "@/api/builder";
import { useProfileStore } from "@/hooks/use-profile-store";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

import { useProfile } from "@/hooks/use-profile";

export function ProfileSetupTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const isEditMode = searchParams.get("edit") === "true";

  // Prefetch next routes for speed
  useEffect(() => {
    const query = isEditMode ? "?edit=true" : "";
    router.prefetch(`/rates${query}`);
    router.prefetch(`/availability${query}`);
  }, [router, isEditMode]);

  const [activeTab, setActiveTab] = useState(tabParam || "general");
  const { saveData } = useProfileStore();

  // Use cached profile data
  const { data: profile, isLoading } = useProfile();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    if (tabParam && (tabParam === "general" || tabParam === "profile")) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    if (!isEditMode || !profile || hasHydrated) return;

    const hydrate = () => {
      try {
        // Helper to convert CM to Feet/Inches string (e.g., "5'7")
        const cmToFeet = (cm: number | null | undefined): string => {
          if (!cm) return "";
          const totalInches = cm / 2.54;
          const feet = Math.floor(totalInches / 12);
          const inches = Math.round(totalInches % 12);
          return `${feet}'${inches}`;
        };

        const toTitleCase = (str: string | null | undefined) => {
          if (!str) return "";
          return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        };

        const generalData = {
          workingName: profile.working_name || "",
          profileType: "Escort",
          genderPresentation: profile.gender_presentation || "",
          transgenderStatus: profile.trans_status || "",
          age: profile.age?.toString() || "",
          appearOnOtherProfiles: profile.appear_on_other_profiles
            ? "Enabled"
            : "Disabled",
          catersTo: Array.isArray(profile.caters_to)
            ? profile.caters_to.join(", ")
            : profile.caters_to || "",
          profileUsername: profile.username || "",
          gender: profile.gender || "",
          pronouns: Array.isArray(profile.pronouns)
            ? profile.pronouns[0]
            : profile.pronouns || "",
          appearExclusivelyInTransOnly: profile.trans_only ? "Yes" : "No",
          displayedAge: profile.displayed_age?.toString() || "",
          temporaryProfileHiding: profile.temporary_hide_days
            ? `${profile.temporary_hide_days} Days`
            : "Disabled",
          homeLocations:
            (Array.isArray(profile.home_locations)
              ? (profile.home_locations as string[])
                .filter(Boolean)
                .join(", ")
              : null) ||
            [profile.city, profile.country].filter(Boolean).join(", "),
          homeLocation:
            profile.city && profile.country
              ? {
                city: profile.city,
                country: profile.country,
                city_slug: profile.city.toLowerCase().replace(/ /g, "-"),
                country_slug: profile.country
                  .toLowerCase()
                  .replace(/ /g, "-"),
                fullLabel: `${profile.city}, ${profile.country}`,
              }
              : null,
        };

        const profileSetupData = {
          about: profile.about || "",
          tagline: profile.tagline || "",
          height: cmToFeet(profile.height_cm),
          ethnicityCategory: toTitleCase(profile.ethnicity_category),
          languages: Array.isArray(profile.languages)
            ? profile.languages[0]
            : profile.languages || "",
          eyeColor: toTitleCase(profile.eye_color),
          bodyType: toTitleCase(profile.body_type),
          hairColor: toTitleCase(profile.hair_color),
          friendly420: "",
          phoneNumber: "",
          instagramHandle: "",
        };

        const ratesData = {
          baseHourlyRates: profile.base_hourly_rate?.toString() || "",
          baseCurrency: profile.base_currency || "NGN",
        };

        // Parse availability
        const dayTimes: Record<string, string[]> = {};
        if (Array.isArray(profile.available_days)) {
          profile.available_days.forEach((dayStr: string) => {
            const firstColonIndex = dayStr.indexOf(":");
            if (firstColonIndex === -1) return;

            const day = dayStr.substring(0, firstColonIndex).trim();
            const time = dayStr.substring(firstColonIndex + 1).trim();

            if (day && time) {
              if (!dayTimes[day]) {
                dayTimes[day] = [];
              }
              dayTimes[day].push(time);
            }
          });
        }

        const availabilityData = {
          dayTimes,
          timezone: "Africa/Lagos",
          selectedDays: Object.keys(dayTimes)
        };

        console.log("ProfileSetupTabs: Saving data to store:", { generalData, profileSetupData, ratesData, availabilityData });
        saveData("general", generalData);
        saveData("profile", profileSetupData);
        saveData("rates", ratesData);
        saveData("availability", availabilityData);

        setHasHydrated(true);
      } catch (e) {
        console.error("Profile fetch error:", e);
        toast.error("Failed to load profile data");
      }
    };

    hydrate();
  }, [isEditMode, profile, hasHydrated, saveData]);

  const progressSteps = [
    { number: 1, label: "General Information", value: "general" },
    { number: 2, label: "Profile Setup", value: "profile" },
    { number: 3, label: "Rates", value: "rates" },
    { number: 4, label: "Availability", value: "availability" },
  ];

  const handleNext = () => {
    const query = isEditMode ? "?edit=true" : "";
    if (activeTab === "general") {
      setActiveTab("profile");
    } else if (activeTab === "profile") {
      router.push(`/rates${query}`);
    }
  };

  const handleTabChange = (value: string) => {
    const query = isEditMode ? "?edit=true" : "";
    if (value === "rates") {
      router.push(`/rates${query}`);
    } else if (value === "availability") {
      router.push(`/availability${query}`);
    } else {
      setActiveTab(value);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 md:gap-8 pb-6 md:pt-20 pt-10 px-0">
        <div className="flex flex-col gap-6 md:gap-8">
          <div className="flex justify-center w-full">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="flex gap-2 md:gap-4 px-4 py-2 rounded-[200px] w-full max-w-full overflow-x-auto justify-center bg-transparent h-auto p-0 border-0">
                {progressSteps.map((step) => (
                  <TabsTrigger
                    key={step.value}
                    value={step.value}
                    className={`px-3 py-2 sm:px-4 rounded-[200px] border text-primary-text text-xs sm:text-sm font-medium shrink-0 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary data-[state=inactive]:bg-tag-bg data-[state=inactive]:border-primary`}
                  >
                    {step.number}. {step.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <GeneralInformationFormContent onNext={handleNext} />
              <ProfileSetupFormContent onNext={handleNext} />
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
