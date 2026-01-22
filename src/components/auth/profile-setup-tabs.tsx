"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralInformationFormContent } from "./general-information-form-content";
import { ProfileSetupFormContent } from "./profile-setup-form-content";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function ProfileSetupTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam || "general");

  useEffect(() => {
    if (tabParam && (tabParam === "general" || tabParam === "profile")) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const progressSteps = [
    { number: 1, label: "General Information", value: "general" },
    { number: 2, label: "Profile Setup", value: "profile" },
    { number: 3, label: "Rates", value: "rates" },
    { number: 4, label: "Availability", value: "availability" },
  ];

  const handleNext = () => {
    if (activeTab === "general") {
      setActiveTab("profile");
    } else if (activeTab === "profile") {
      router.push("/rates");
    }
  };

  const handleTabChange = (value: string) => {
    if (value === "rates") {
      router.push("/rates");
    } else if (value === "availability") {
      router.push("/availability");
    } else {
      setActiveTab(value);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 md:gap-8 pb-6 md:pt-20 pt-10  px-0">
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
