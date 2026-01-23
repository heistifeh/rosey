"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useProfileStore } from "@/hooks/use-profile-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TIME_SLOT_OPTIONS } from "@/constants/availability";
import { Loader2 } from "lucide-react";

export function AvailabilityForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { saveData, getData } = useProfileStore();

  type AvailabilityStoreData = {
    selectedDays: string[];
    dayTimes: Record<string, string[]>;
  };

  const [selectedDays, setSelectedDays] = useState<string[]>(["Monday"]);
  const [dayTimes, setDayTimes] = useState<Record<string, string[]>>({
    Monday: ["All day"],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom Time State
  const [isCustomTimeOpen, setIsCustomTimeOpen] = useState(false);
  const [customTimeDay, setCustomTimeDay] = useState<string>("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSelectChange = (day: string, value: string) => {
    if (value === "custom_time") {
      setCustomTimeDay(day);
      setStartTime("");
      setEndTime("");
      setIsCustomTimeOpen(true);
    } else {
      toggleTimeSlot(day, value);
    }
  };

  const handleAddCustomTime = () => {
    if (!startTime || !endTime) {
      toast.error("Please select both start and end times");
      return;
    }
    const formattedTime = `${startTime} - ${endTime}`;
    toggleTimeSlot(customTimeDay, formattedTime);
    setIsCustomTimeOpen(false);
    toast.success("Time added");
  };

  useEffect(() => {
    const savedData = getData("availability");
    const savedDays =
      savedData && Array.isArray((savedData as any).selectedDays)
        ? (savedData as any).selectedDays
        : null;
    if (savedDays) {
      setSelectedDays(
        savedDays.map((day: unknown) => String(day)).filter(Boolean),
      );
    }
    if (savedData?.dayTimes) {
      setDayTimes(savedData.dayTimes as Record<string, string[]>);
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
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
    setDayTimes((prev) => {
      const next = { ...prev };
      if (next[day]) {
        delete next[day];
      } else {
        next[day] = ["All day"];
      }
      return next;
    });
  };

  const toggleTimeSlot = (day: string, slot: string) => {
    setDayTimes((prev) => {
      const current = prev[day] ?? [];
      if (current.includes(slot)) return prev;
      const next = [...current, slot];
      setSelectedDays((prevDays) =>
        prevDays.includes(day) ? prevDays : [...prevDays, day],
      );
      return { ...prev, [day]: next };
    });
  };

  const removeTimeSlot = (day: string, slot: string) => {
    setDayTimes((prev) => {
      const current = prev[day] ?? [];
      const next = current.filter((value) => value !== slot);
      if (next.length === 0) {
        const copy = { ...prev };
        delete copy[day];
        setSelectedDays((prevDays) =>
          prevDays.filter((value) => value !== day),
        );
        return copy;
      }
      return { ...prev, [day]: next };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Save to local storage under "availability" key
    saveData("availability", { selectedDays, dayTimes });
    toast.success("Availability saved");
    // Redirect to the final step: Upload Pictures
    const query = searchParams.get("edit") === "true" ? "?edit=true" : "";
    router.push(`/upload-pictures${query}`);
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
                  <div key={day} className="space-y-2">
                    <div
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
                    {isSelected && (
                      <div className="flex flex-col gap-2 px-4">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {(dayTimes[day] ?? []).map((slot) => (
                            <span
                              key={`${day}-${slot}`}
                              className="flex items-center gap-1 rounded-full bg-primary text-primary-text px-3 py-1 text-xs font-semibold"
                            >
                              <span>{slot}</span>
                              <span
                                role="button"
                                tabIndex={0}
                                aria-label={`Remove ${slot}`}
                                onClick={() => removeTimeSlot(day, slot)}
                                className="rounded-full bg-transparent p-[2px] text-white text-xs font-medium cursor-pointer hover:bg-white/20"
                              >
                                ×
                              </span>
                            </span>
                          ))}
                        </div>
                        <Select
                          value=""
                          onValueChange={(value) =>
                            handleSelectChange(day, value)
                          }
                        >
                          <SelectTrigger className="cursor-pointer border border-[#B6D4FF] focus-visible:ring-2 focus-visible:ring-primary">
                            <span className="text-xs text-text-gray-opacity">
                              Tap to add time...
                            </span>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All day">
                              <span className="font-medium">All Day</span>
                            </SelectItem>
                            <SelectItem value="custom_time">
                              <span className="font-semibold text-primary">
                                + Add Specific Time
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center pt-11">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full max-w-[628px] px-8 py-3 rounded-[200px] bg-primary text-white font-semibold text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                size="default"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Completing...
                  </>
                ) : (
                  "Complete"
                )}
              </Button>
            </div>
          </form>

          <Dialog open={isCustomTimeOpen} onOpenChange={setIsCustomTimeOpen}>
            <DialogContent className="sm:max-w-[425px] bg-[#1E1E1E] border-border-gray text-white">
              <DialogHeader>
                <DialogTitle>Add Custom Time for {customTimeDay}</DialogTitle>
                <DialogDescription className="text-text-gray">
                  Select a start and end time for your availability.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="bg-input-bg border-border-gray text-white [color-scheme:dark]"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="bg-input-bg border-border-gray text-white [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCustomTimeOpen(false)}
                  className="bg-transparent border-border-gray text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCustomTime}
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  Add Time
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
