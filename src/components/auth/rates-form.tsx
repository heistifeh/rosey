"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function RatesForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    baseHourlyRates: "",
    baseCurrency: "",
  });

  const progressSteps = [
    {
      number: 1,
      label: "General Information",
      value: "general",
      isActive: false,
    },
    { number: 2, label: "Profile Setup", value: "profile", isActive: false },
    { number: 3, label: "Rates", value: "rates", isActive: true },
    {
      number: 4,
      label: "Availability",
      value: "availability",
      isActive: false,
    },
  ];

  const handleTabClick = (value: string) => {
    if (value === "general") {
      router.push("/general-information?tab=general");
    } else if (value === "profile") {
      router.push("/general-information?tab=profile");
    } else if (value === "rates") {
      // Already on rates page
      return;
    } else if (value === "availability") {
      router.push("/availability");
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    router.push("/availability");
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 md:gap-8 py-6 px-4 md:px-0 md:pt-20 pt-10 items-center justify-center">
        <div className="flex flex-col gap-6 md:gap-8">
          <div className="flex justify-center w-full">
            <div className="flex gap-2 md:gap-4 px-4 py-2 rounded-[200px] w-full max-w-full overflow-x-auto scrollbar-hide justify-start md:justify-center">
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

          <h1 className="text-[18px] sm:text-4xl font-semibold text-primary-text text-center mb-6 md:mb-8">
            Rates
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 md:gap-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="baseHourlyRates"
                  className="text-base font-normal text-primary-text"
                >
                  Base Hourly Rates
                </Label>
                <Input
                  id="baseHourlyRates"
                  type="text"
                  value={formData.baseHourlyRates}
                  onChange={(e) =>
                    handleChange("baseHourlyRates", e.target.value)
                  }
                />
                <p className="text-[12px] font-normal text-text-gray-opacity">
                  Use digits only without commas or decimal points. This lets
                  users search by rate. Misuse of this function may lead to
                  profile deletion.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="baseCurrency"
                  className="text-base font-normal text-primary-text"
                >
                  Base Currency
                </Label>
                <Input
                  id="baseCurrency"
                  type="text"
                  value={formData.baseCurrency}
                  onChange={(e) => handleChange("baseCurrency", e.target.value)}
                />
                <p className="text-[12px] font-normal text-text-gray-opacity">
                  This is your primary currency and will apply to your rates
                  unless stated otherwise.
                </p>
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <Button
                type="submit"
                className="w-full max-w-[628px] px-8 py-3 rounded-[200px] bg-primary text-white font-semibold text-base cursor-pointer"
                size="default"
              >
                Next
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
