"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AvailabilityForm() {
  const router = useRouter();
  const [selectedDays, setSelectedDays] = useState<string[]>(["Monday"]);

  const progressSteps = [
    {
      number: 1,
      label: "General Information",
      value: "general",
      isActive: false,
    },
    { number: 2, label: "Profile Setup", value: "profile", isActive: false },
    { number: 3, label: "Rates", value: "rates", isActive: false },
    {
      number: 4,
      label: "Availability",
      value: "availability",
      isActive: true,
    },
  ];

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleTabClick = (value: string) => {
    if (value === "general") {
      router.push("/general-information?tab=general");
    } else if (value === "profile") {
      router.push("/general-information?tab=profile");
    } else if (value === "rates") {
      router.push("/rates");
    } else if (value === "availability") {
      // Already on availability page
      return;
    }
  };

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Selected days (unavailable):", selectedDays);
    router.push("/upload-pictures");
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 md:gap-8 py-6 px-0 md:pt-20 pt-10 items-center justify-center">
        <div className="flex flex-col gap-6 md:gap-8 w-full">
          <div className="flex justify-center w-full">
            <div className="flex gap-2 md:gap-4 px-4 py-2 rounded-[200px] w-full max-w-full overflow-x-auto justify-center">
              {progressSteps.map((step) => (
                <button
                  key={step.number}
                  onClick={() => handleTabClick(step.value)}
                  className={`px-3 py-2 sm:px-4 rounded-[200px] border text-primary-text text-xs sm:text-sm font-medium shrink-0 cursor-pointer ${
                    step.isActive
                      ? "bg-primary text-white border-primary"
                      : "bg-tag-bg border-primary"
                  }`}
                >
                  {step.number}. {step.label}
                </button>
              ))}
            </div>
          </div>

          <h1 className="text-[18px] sm:text-4xl font-semibold text-primary-text text-center ">
            Availability
          </h1>

          <p className="text-base sm:text-[24px] text-primary-text text-center mb-6 md:mb-10 font-normal">
            Avoid choosing any days when you are unavailable.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 md:gap-8 w-full max-w-2xl mx-auto"
          >
            <div className="flex flex-col gap-6">
              {daysOfWeek.map((day) => {
                const isSelected = selectedDays.includes(day);
                return (
                  <div
                    key={day}
                    onClick={() => handleDayToggle(day)}
                    className={`flex items-center justify-between px-4 py-4 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-tag-bg border border-primary"
                        : "bg-input-bg border border-transparent hover:border-primary/50"
                    }`}
                  >
                    <span
                      className={`text-sm sm:text-base font-medium ${
                        isSelected ? "text-white" : "text-primary-text"
                      }`}
                    >
                      {day}
                    </span>
                    <div
                      className="relative flex items-center justify-center h-[18px] w-[18px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleDayToggle(day)}
                        className={`h-[18px] w-[18px] rounded-[4px] border cursor-pointer ${
                          isSelected
                            ? "border-transparent bg-primary"
                            : "border-border-gray bg-transparent"
                        }`}
                        style={{ appearance: "none" }}
                      />
                      {isSelected && (
                        <Check
                          className="absolute h-3 w-3 text-tag-bg pointer-events-none"
                          strokeWidth={3}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center pt-11">
              <Button
                type="submit"
                className="w-full max-w-[628px] px-8 py-3 rounded-[200px] bg-primary text-white font-semibold text-base cursor-pointer"
                size="default"
              >
                Complete
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
