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
import { TabsContent } from "@/components/ui/tabs";
import { useState, useEffect, useCallback } from "react";
import { useProfileStore } from "@/hooks/use-profile-store";
import { toast } from "react-hot-toast";
import { LocationAutocompleteInput } from "@/components/location/location-autocomplete-input";
import { LocationSuggestion } from "@/hooks/use-location-autocomplete";

interface GeneralInformationFormContentProps {
  onNext?: () => void;
}

export function GeneralInformationFormContent({
  onNext,
}: GeneralInformationFormContentProps) {
  const { saveData, getData } = useProfileStore();
  const [formData, setFormData] = useState({
    workingName: "",
    profileType: "Escort",
    genderPresentation: "",
    transgenderStatus: "",
    age: "",
    appearOnOtherProfiles: "90 Days",
    catersTo: "",
    profileUsername: "",
    gender: "",
    pronouns: "",
    appearExclusivelyInTransOnly: "",
    displayedAge: "",
    temporaryProfileHiding: "",
    homeLocations: "",
    homeLocation: null as LocationSuggestion | null,
  });

  useEffect(() => {
    const savedData = getData("general");
      if (savedData) {
        setFormData((prev) => ({
          ...prev,
          ...savedData,
          homeLocation: savedData?.homeLocation ?? null,
        }));
      }
  }, [getData]);

  const handleChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleLocationChange = useCallback(
    (location: LocationSuggestion | null) => {
      setFormData((prev) => ({
        ...prev,
        homeLocations: location?.fullLabel ?? "",
        homeLocation: location,
      }));
    },
    [setFormData]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveData("general", formData);
    toast.success("Progress saved");
    if (onNext) onNext();
  };

  return (
    <TabsContent value="general" className="mt-0">
      <h1 className="text-[18px] sm:text-4xl font-semibold text-primary-text text-center mb-6 md:mb-8 pt-6 md:pt-10">
        General Information
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="flex flex-col gap-6 sm:gap-10">
            <div className="flex flex-col gap-2 md:min-h-[92px]">
              <Label
                htmlFor="workingName"
                className="text-[14px] font-semibold text-primary-text"
              >
                Working Name <span className="text-primary">*</span>
              </Label>
              <Input
                id="workingName"
                type="text"
                value={formData.workingName}
                onChange={(e) => handleChange("workingName", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 md:min-h-[120px]">
              <Label
                htmlFor="profileType"
                className="text-[14px] font-semibold text-primary-text"
              >
                Profile Type <span className="text-primary">*</span>
              </Label>
              <Select
                value={formData.profileType}
                onValueChange={(value) => handleChange("profileType", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Escort">Escort</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[12px] font-normal text-text-gray-opacity">
                This affects your URL as well as the description when linking on
                socials.
              </p>
            </div>

            <div className="flex flex-col gap-2 md:min-h-[120px]">
              <Label
                htmlFor="genderPresentation"
                className="text-[14px] font-semibold text-primary-text"
              >
                Gender Presentation
              </Label>
              <Input
                id="genderPresentation"
                type="text"
                value={formData.genderPresentation}
                onChange={(e) =>
                  handleChange("genderPresentation", e.target.value)
                }
              />
              <p className="text-[12px] font-normal text-text-gray-opacity">
                This affects your URL as well as the description when linking on
                socials.
              </p>
            </div>

            <div className="flex flex-col gap-2 md:min-h-[148px]">
              <Label
                htmlFor="transgenderStatus"
                className="text-[14px] font-semibold text-primary-text"
              >
                Transgender Status
              </Label>
              <Select
                value={formData.transgenderStatus || undefined}
                onValueChange={(value) =>
                  handleChange("transgenderStatus", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Trans Woman">Trans Woman</SelectItem>
                  <SelectItem value="Trans Man">Trans Man</SelectItem>
                  <SelectItem value="Non-Binary">Non-Binary</SelectItem>
                  <SelectItem value="Genderfluid">Genderfluid</SelectItem>
                  <SelectItem value="Genderqueer">Genderqueer</SelectItem>
                  <SelectItem value="Two-Spirit">Two-Spirit</SelectItem>
                  <SelectItem value="Prefer not to say">
                    Prefer not to say
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[12px] font-normal text-text-gray-opacity">
                For transgender individuals who wish to disclose, this is the
                space to do it. Contact us if you'd like to recommend more
                categories.
              </p>
            </div>

            <div className="flex flex-col gap-2 md:min-h-[92px]">
              <Label
                htmlFor="age"
                className="text-[14px] font-semibold text-primary-text"
              >
                Age <span className="text-primary">*</span>
              </Label>
              <Input
                id="age"
                type="text"
                value={formData.age}
                onChange={(e) => handleChange("age", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 md:min-h-[148px]">
              <Label
                htmlFor="appearOnOtherProfiles"
                className="text-[14px] font-semibold text-primary-text"
              >
                Appear on other profiles
              </Label>
              <Select
                value={formData.appearOnOtherProfiles}
                onValueChange={(value) =>
                  handleChange("appearOnOtherProfiles", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Enabled">Enabled</SelectItem>
                  <SelectItem value="30 Days">30 Days</SelectItem>
                  <SelectItem value="60 Days">60 Days</SelectItem>
                  <SelectItem value="90 Days">90 Days</SelectItem>
                  <SelectItem value="Disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[12px] font-normal text-text-gray-opacity">
                Increase reach by appearing in profile carousels across the
                platform. Disabling this stops your profile from showing in
                others' carousels and removes the carousel from yours.
              </p>
            </div>

            <div className="flex flex-col gap-2 md:min-h-[148px]">
              <Label
                htmlFor="catersTo"
                className="text-[14px] font-semibold text-primary-text"
              >
                Caters to <span className="text-primary">*</span>
              </Label>
              <Select
                value={formData.catersTo || undefined}
                onValueChange={(value) => handleChange("catersTo", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Couples">Couples</SelectItem>
                  <SelectItem value="Non-Binary">Non-Binary</SelectItem>
                  <SelectItem value="Male, Female">Male, Female</SelectItem>
                  <SelectItem value="Male, Couples">Male, Couples</SelectItem>
                  <SelectItem value="Female, Couples">
                    Female, Couples
                  </SelectItem>
                  <SelectItem value="Male, Female, Couples">
                    Male, Female, Couples
                  </SelectItem>
                  <SelectItem value="All">All</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[12px] font-normal text-text-gray-opacity">
                Specify the categories of clients you cater to (Male, Female,
                Couples, Non-Binary). Select all four if you cater for all.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6 sm:gap-10">
            <div className="flex flex-col gap-2 md:min-h-[92px]">
              <Label
                htmlFor="profileUsername"
                className="text-[14px] font-semibold text-primary-text"
              >
                Profile Username <span className="text-primary">*</span>
              </Label>
              <Input
                id="profileUsername"
                type="text"
                value={formData.profileUsername}
                onChange={(e) =>
                  handleChange("profileUsername", e.target.value)
                }
              />
            </div>

            <div className="flex flex-col gap-2 md:min-h-[120px]">
              <Label
                htmlFor="gender"
                className="text-[14px] font-semibold text-primary-text"
              >
                Gender <span className="text-primary">*</span>
              </Label>
              <Select
                value={formData.gender || undefined}
                onValueChange={(value) => handleChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Woman">Woman</SelectItem>
                  <SelectItem value="Man">Man</SelectItem>
                  <SelectItem value="Non-Binary">Non-Binary</SelectItem>
                  <SelectItem value="Genderfluid">Genderfluid</SelectItem>
                  <SelectItem value="Genderqueer">Genderqueer</SelectItem>
                  <SelectItem value="Agender">Agender</SelectItem>
                  <SelectItem value="Bigender">Bigender</SelectItem>
                  <SelectItem value="Two-Spirit">Two-Spirit</SelectItem>
                  <SelectItem value="Prefer not to say">
                    Prefer not to say
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2 md:min-h-[120px]">
              <Label
                htmlFor="pronouns"
                className="text-[14px] font-semibold text-primary-text"
              >
                Pronouns <span className="text-primary">*</span>
              </Label>
              <Select
                value={formData.pronouns || undefined}
                onValueChange={(value) => handleChange("pronouns", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="She/Her">She/Her</SelectItem>
                  <SelectItem value="He/Him">He/Him</SelectItem>
                  <SelectItem value="They/Them">They/Them</SelectItem>
                  <SelectItem value="She/They">She/They</SelectItem>
                  <SelectItem value="He/They">He/They</SelectItem>
                  <SelectItem value="He/She/They">He/She/They</SelectItem>
                  <SelectItem value="Any pronouns">Any pronouns</SelectItem>
                  <SelectItem value="He, They, Them, Theirs, Co">
                    He, They, Them, Theirs, Co
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[12px] font-normal text-text-gray-opacity">
                You can select up to 4 pronouns that will be shown on your
                profile.
              </p>
            </div>

            <div className="flex flex-col gap-2 md:min-h-[148px]">
              <Label
                htmlFor="appearExclusivelyInTransOnly"
                className="text-[14px] font-semibold text-primary-text"
              >
                Appear exclusively in trans-only searches
              </Label>
              <Select
                value={formData.appearExclusivelyInTransOnly || undefined}
                onValueChange={(value) =>
                  handleChange("appearExclusivelyInTransOnly", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[12px] font-normal text-text-gray-opacity">
                Restrict your profile so it appears only when users apply the
                trans-only search filter.
              </p>
            </div>

            <div className="flex flex-col gap-2 md:min-h-[92px]">
              <Label
                htmlFor="displayedAge"
                className="text-[14px] font-semibold text-primary-text"
              >
                Displayed age
              </Label>
              <Select
                value={formData.displayedAge || undefined}
                onValueChange={(value) => handleChange("displayedAge", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Show actual age">
                    Show actual age
                  </SelectItem>
                  <SelectItem value="Hide age">Hide age</SelectItem>
                  <SelectItem value="Age range">Age range</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[12px] font-normal text-text-gray-opacity">
                Choose how your age is displayed on your profile.
              </p>
            </div>

            <div className="flex flex-col gap-2 md:min-h-[148px]">
              <Label
                htmlFor="temporaryProfileHiding"
                className="text-[14px] font-semibold text-primary-text"
              >
                Temporary Profile Hiding
              </Label>
              <Select
                value={formData.temporaryProfileHiding || undefined}
                onValueChange={(value) =>
                  handleChange("temporaryProfileHiding", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Disabled">Disabled</SelectItem>
                  <SelectItem value="7 Days">7 Days</SelectItem>
                  <SelectItem value="14 Days">14 Days</SelectItem>
                  <SelectItem value="30 Days">30 Days</SelectItem>
                  <SelectItem value="60 Days">60 Days</SelectItem>
                  <SelectItem value="90 Days">90 Days</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[12px] font-normal text-text-gray-opacity">
                If your account is inactive for a set time, your profile will be
                hidden automatically. You can make it visible again by logging
                into your dashboard and republishing.
              </p>
            </div>

            <div className="flex flex-col gap-2 md:min-h-[148px]">
              <Label
                htmlFor="homeLocations"
                className="text-[14px] font-semibold text-primary-text"
              >
                Home locations <span className="text-primary">*</span>
              </Label>
              <LocationAutocompleteInput
                value={formData.homeLocation}
                onChange={handleLocationChange}
                placeholder="Type city, state, or country"
              />
              <p className="text-[12px] font-normal text-text-gray-opacity">
                Start typing to pull suggestions from Google Places; select the
                result that matches your home city or region.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            className="w-full max-w-[628px] px-8 py-3 rounded-[200px] bg-primary text-white font-semibold text-base cursor-pointer"
            size="default"
          >
            Next
          </Button>
        </div>
      </form>
    </TabsContent>
  );
}
