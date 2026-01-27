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
import { useState, useEffect } from "react";
import { useProfileStore } from "@/hooks/use-profile-store";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface ProfileSetupFormContentProps {
  onNext?: () => void;
}

export function ProfileSetupFormContent({
  onNext,
}: ProfileSetupFormContentProps) {
  const { saveData, getData } = useProfileStore();
  const [formData, setFormData] = useState({
    about: "",
    tagline: "",
    height: "",
    ethnicityCategory: "",
    languages: [] as string[],
    eyeColor: "",
    bodyType: "",
    hairColor: "",
    friendly420: "",
    phoneNumber: "",
    instagramHandle: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedData = getData("profile") as any;
    if (savedData) {
      setFormData((prev) => ({
        ...prev,
        ...savedData,
        languages: Array.isArray(savedData.languages)
          ? savedData.languages
          : savedData.languages
            ? [savedData.languages]
            : [],
      }));
    }
  }, [getData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddLanguage = (value: string) => {
    if (!formData.languages.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, value],
      }));
    }
  };

  const handleRemoveLanguage = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    saveData("profile", formData);
    if (onNext) onNext();
  };

  const availableLanguages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Russian",
    "Chinese",
    "Japanese",
    "Korean",
    "Arabic",
    "Hindi",
  ];

  return (
    <TabsContent value="profile" className="mt-0">
      <h1 className="text-[18px] sm:text-4xl font-semibold text-primary-text text-center mb-6 md:mb-8 pt-6 md:pt-10">
        Profile Setup
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:gap-8">
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="about"
            className="text-[14px] font-semibold text-primary-text"
          >
            About <span className="text-primary">*</span>
          </Label>
          <textarea
            id="about"
            value={formData.about}
            onChange={(e) => handleChange("about", e.target.value)}
            className="flex min-h-[200px] w-full rounded-lg border border-transparent bg-input-bg px-4 py-3 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset disabled:cursor-not-allowed disabled:opacity-50 resize-y"
            rows={8}
          />
          <p className="text-[12px] font-normal text-text-gray-opacity">
            Write a short bio about yourself. Profiles with at least three
            paragraphs get more views. Keep it over 300 characters, and don't
            include contact info, stats, or rates. Limit emojis and ASCII so
            your profile stays accessible and searchable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="flex flex-col gap-6 sm:gap-10">
            <div className="flex flex-col gap-2 md:min-h-[120px]">
              <Label
                htmlFor="tagline"
                className="text-[14px] font-semibold text-primary-text"
              >
                Tagline
              </Label>
              <Input
                id="tagline"
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange("tagline", e.target.value)}
              />
              <p className="text-[12px] font-normal text-text-gray-opacity">
                Use a quick, catchy line to stand out, shown clearly on your
                search thumbnail.
              </p>
            </div>

            <div className="flex flex-col gap-2 md:min-h-[120px]">
              <Label
                htmlFor="ethnicityCategory"
                className="text-[14px] font-semibold text-primary-text"
              >
                Ethnicity Category
              </Label>
              <Select
                value={formData.ethnicityCategory || undefined}
                onValueChange={(value) => handleChange("ethnicityCategory", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-44">
                  <SelectItem value="Asian">Asian</SelectItem>
                  <SelectItem value="Black">Black</SelectItem>
                  <SelectItem value="White">White</SelectItem>
                  <SelectItem value="Hispanic">Hispanic</SelectItem>
                  <SelectItem value="Latino">Latino</SelectItem>
                  <SelectItem value="Middle Eastern">Middle Eastern</SelectItem>
                  <SelectItem value="Native American">Native American</SelectItem>
                  <SelectItem value="Mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[12px] font-normal text-text-gray-opacity">
                This will be displayed on your profile, select to show up in the
                relevant categories.
              </p>
            </div>

            <div className="flex flex-col gap-2 md:min-h-[92px]">
              <Label
                htmlFor="eyeColor"
                className="text-[14px] font-semibold text-primary-text"
              >
                Eye Color
              </Label>
              <Select
                value={formData.eyeColor || undefined}
                onValueChange={(value) => handleChange("eyeColor", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Brown">Brown</SelectItem>
                  <SelectItem value="Blue">Blue</SelectItem>
                  <SelectItem value="Green">Green</SelectItem>
                  <SelectItem value="Hazel">Hazel</SelectItem>
                  <SelectItem value="Gray">Gray</SelectItem>
                  <SelectItem value="Amber">Amber</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2 md:min-h-[92px]">
              <Label
                htmlFor="hairColor"
                className="text-[14px] font-semibold text-primary-text"
              >
                Hair Color
              </Label>
              <Select
                value={formData.hairColor || undefined}
                onValueChange={(value) => handleChange("hairColor", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Black">Black</SelectItem>
                  <SelectItem value="Brown">Brown</SelectItem>
                  <SelectItem value="Blonde">Blonde</SelectItem>
                  <SelectItem value="Red">Red</SelectItem>
                  <SelectItem value="Auburn">Auburn</SelectItem>
                  <SelectItem value="Gray">Gray</SelectItem>
                  <SelectItem value="White">White</SelectItem>
                  <SelectItem value="Bald">Bald</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-6 sm:gap-10">
            <div className="flex flex-col gap-2 md:min-h-[120px]">
              <Label
                htmlFor="height"
                className="text-[14px] font-semibold text-primary-text"
              >
                Height
              </Label>
              <Select
                value={formData.height || undefined}
                onValueChange={(value) => handleChange("height", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4'0">4'0"</SelectItem>
                  <SelectItem value="4'1">4'1"</SelectItem>
                  <SelectItem value="4'2">4'2"</SelectItem>
                  <SelectItem value="4'3">4'3"</SelectItem>
                  <SelectItem value="4'4">4'4"</SelectItem>
                  <SelectItem value="4'5">4'5"</SelectItem>
                  <SelectItem value="4'6">4'6"</SelectItem>
                  <SelectItem value="4'7">4'7"</SelectItem>
                  <SelectItem value="4'8">4'8"</SelectItem>
                  <SelectItem value="4'9">4'9"</SelectItem>
                  <SelectItem value="4'10">4'10"</SelectItem>
                  <SelectItem value="4'11">4'11"</SelectItem>
                  <SelectItem value="5'0">5'0"</SelectItem>
                  <SelectItem value="5'1">5'1"</SelectItem>
                  <SelectItem value="5'2">5'2"</SelectItem>
                  <SelectItem value="5'3">5'3"</SelectItem>
                  <SelectItem value="5'4">5'4"</SelectItem>
                  <SelectItem value="5'5">5'5"</SelectItem>
                  <SelectItem value="5'6">5'6"</SelectItem>
                  <SelectItem value="5'7">5'7"</SelectItem>
                  <SelectItem value="5'8">5'8"</SelectItem>
                  <SelectItem value="5'9">5'9"</SelectItem>
                  <SelectItem value="5'10">5'10"</SelectItem>
                  <SelectItem value="5'11">5'11"</SelectItem>
                  <SelectItem value="6'0">6'0"</SelectItem>
                  <SelectItem value="6'1">6'1"</SelectItem>
                  <SelectItem value="6'2">6'2"</SelectItem>
                  <SelectItem value="6'3">6'3"</SelectItem>
                  <SelectItem value="6'4">6'4"</SelectItem>
                  <SelectItem value="6'5">6'5"</SelectItem>
                  <SelectItem value="6'6">6'6"</SelectItem>
                  <SelectItem value="6'7">6'7"</SelectItem>
                  <SelectItem value="6'8">6'8"</SelectItem>
                  <SelectItem value="6'9">6'9"</SelectItem>
                  <SelectItem value="6'10">6'10"</SelectItem>
                  <SelectItem value="6'11">6'11"</SelectItem>
                  <SelectItem value="7'0">7'0"</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2 md:min-h-[120px]">
              <Label
                htmlFor="languages"
                className="text-[14px] font-semibold text-primary-text"
              >
                Languages
              </Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.languages.map((lang) => (
                  <span
                    key={lang}
                    className="flex items-center gap-1 rounded-full bg-primary text-primary-text px-3 py-1 text-xs font-semibold"
                  >
                    {lang}
                    <button
                      type="button"
                      onClick={() => handleRemoveLanguage(lang)}
                      className="ml-1 rounded-full hover:bg-white/20 p-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <Select
                value="" // Always empty to allow re-selection
                onValueChange={handleAddLanguage}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Add a language..." />
                </SelectTrigger>
                <SelectContent>
                  {availableLanguages.map((lang) => (
                    <SelectItem
                      key={lang}
                      value={lang}
                      disabled={formData.languages.includes(lang)}
                    >
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[12px] font-normal text-text-gray-opacity">
                Select the languages you speak fluently.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="bodyType"
                className="text-[14px] font-semibold text-primary-text"
              >
                Body Type
              </Label>
              <Select
                value={formData.bodyType || undefined}
                onValueChange={(value) => handleChange("bodyType", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Average">Average</SelectItem>
                  <SelectItem value="BBW">BBW</SelectItem>
                  <SelectItem value="Curvy">Curvy</SelectItem>
                  <SelectItem value="Muscular">Muscular</SelectItem>
                  <SelectItem value="Petite">Petite</SelectItem>
                  <SelectItem value="Pregnant">Pregnant</SelectItem>
                  <SelectItem value="Slim">Slim</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[12px] font-normal text-text-gray-opacity">
                If set, your profile will be searchable under this category.
              </p>
            </div>

            <div className="flex flex-col gap-2 md:min-h-[148px]">
              <Label
                htmlFor="friendly420"
                className="text-[14px] font-semibold text-primary-text"
              >
                420-Friendly
              </Label>
              <Select
                value={formData.friendly420 || undefined}
                onValueChange={(value) => handleChange("friendly420", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Sometimes">Sometimes</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[12px] font-normal text-text-gray-opacity">
                Mark this field if you are 420-friendly; it helps with search.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="phoneNumber"
              className="text-[14px] font-semibold text-primary-text"
            >
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
            />
            <p className="text-[12px] font-normal text-text-gray-opacity">
              Provide a number where clients can reach you for bookings.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="instagramHandle"
              className="text-[14px] font-semibold text-primary-text"
            >
              Instagram Handle
            </Label>
            <Input
              id="instagramHandle"
              type="text"
              value={formData.instagramHandle}
              onChange={(e) => handleChange("instagramHandle", e.target.value)}
            />
            <p className="text-[12px] font-normal text-text-gray-opacity">
              Add your Instagram username so we can highlight your social media.
            </p>
          </div>
        </div>

        <div className="flex justify-center pt-4">
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
    </TabsContent>
  );
}
