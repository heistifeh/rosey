"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useProfileStore } from "@/hooks/use-profile-store";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

const currencyOptions = [
  { value: "$", label: "$ – US Dollar" },
  { value: "C$", label: "C$ – Canadian Dollar" },
  { value: "Fr.", label: "Fr. – Swiss Franc" },
  { value: "€", label: "€ – Euro" },
  { value: "£", label: "£ – British Pound" },
  { value: "HK$", label: "HK$ – Hong Kong Dollar" },
  { value: "₦", label: "₦ – Nigerian Naira" },
  { value: "¥", label: "¥ – Japanese Yen / Chinese Yuan" },
  { value: "R$", label: "R$ – Brazilian Real" },
  { value: "R", label: "R – South African Rand" },
  { value: "S$", label: "S$ – Singapore Dollar" },
  { value: "₹", label: "₹ – Indian Rupee" },
  { value: "kr", label: "kr – Swedish Krona" },
  { value: "₩", label: "₩ – South Korean Won" },
  { value: "₺", label: "₺ – Turkish Lira" },
  { value: "د.إ", label: "د.إ – UAE Dirham" },
  { value: "﷼", label: "﷼ – Saudi Riyal" },
  { value: "₪", label: "₪ – Israeli Shekel" },
  { value: "฿", label: "฿ – Thai Baht" },
  { value: "RM", label: "RM – Malaysian Ringgit" },
  { value: "₱", label: "₱ – Philippine Peso" },
  { value: "Rp", label: "Rp – Indonesian Rupiah" },
  { value: "₫", label: "₫ – Vietnamese Dong" },
  { value: "₨", label: "₨ – Pakistani Rupee" },
  { value: "zł", label: "zł – Polish Zloty" },
  { value: "Kč", label: "Kč – Czech Koruna" },
  { value: "Ft", label: "Ft – Hungarian Forint" },
  { value: "₽", label: "₽ – Russian Ruble" },
  { value: "KSh", label: "KSh – Kenyan Shilling" },
  { value: "₵", label: "₵ – Ghanaian Cedi" },
  { value: "S/", label: "S/ – Peruvian Sol" },
  { value: "A$", label: "A$ – Australian Dollar" },
  { value: "lei", label: "lei – Romanian Leu" },
  { value: "лв", label: "лв – Bulgarian Lev" },
  { value: "NT$", label: "NT$ – Taiwan Dollar" },
  { value: "৳", label: "৳ – Bangladeshi Taka" },
  { value: "Rs", label: "Rs – Sri Lankan Rupee" },
];
export function RatesForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";
  const { saveData, getData } = useProfileStore();
  const [formData, setFormData] = useState({
    baseHourlyRates: "",
    baseCurrency: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedData = getData("rates");
    if (savedData) {
      setFormData((prev) => ({ ...prev, ...savedData }));
    }
  }, [getData]);

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
    const query = isEditMode ? "&edit=true" : "";
    if (value === "general") {
      router.push(`/general-information?tab=general${query}`);
    } else if (value === "profile") {
      router.push(`/general-information?tab=profile${query}`);
    } else if (value === "rates") {
      // Already on rates page
      return;
    } else if (value === "availability") {
      const q = isEditMode ? "?edit=true" : "";
      router.push(`/availability${q}`);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    saveData("rates", formData);
    // toast.success("Progress saved"); // Optional: remove toast for faster feel? User said "loading time takes time". Keeping it is verify feedback.
    const query = isEditMode ? "?edit=true" : "";
    router.push(`/availability${query}`);
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
                  className={`px-3 py-2 sm:px-4 rounded-[200px] border text-primary-text text-xs sm:text-sm font-medium shrink-0 cursor-pointer ${step.isActive
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
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  min="0"
                  step="1"
                  value={formData.baseHourlyRates}
                  onChange={(e) =>
                    handleChange(
                      "baseHourlyRates",
                      e.target.value.replace(/\D/g, "")
                    )
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
                <Select
                  value={formData.baseCurrency}
                  onValueChange={(value) => handleChange("baseCurrency", value)}
                >
                  <SelectTrigger className="border border-border-gray bg-input-bg">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent className="max-h-80 overflow-y-auto">
                    {currencyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[12px] font-normal text-text-gray-opacity">
                  This is your primary currency and will apply to your rates
                  unless stated otherwise.
                </p>
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full max-w-[628px] px-8 py-3 rounded-[200px] bg-primary text-white font-semibold text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                size="default"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Next"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
