"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import Image from "next/image";
import { CloudUpload, Trash2, Loader2 } from "lucide-react";
import { apiBuilder } from "@/api/builder";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useProfileStore } from "@/hooks/use-profile-store";
import { LocationSuggestion } from "@/hooks/use-location-autocomplete";

const getUserId = () => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )rosey-auth=([^;]*)`));
  if (!match) return null;
  try {
    const data = JSON.parse(decodeURIComponent(match[1]));
    return data?.user?.id;
  } catch {
    return null;
  }
};

export function UploadPicturesForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getAllData, clearData } = useProfileStore();

  const [uploadedImages, setUploadedImages] = useState<string[]>([]); // Previews
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // Actual files
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ profile, images }: { profile: any; images: { publicUrl: string; path: string }[] }) => {
      // 1. Create/Update Profile
      const result = await apiBuilder.profiles.createProfile(profile);

      const profileId = result?.[0]?.id;
      if (!profileId) {
        throw new Error("Failed to retrieve profile ID");
      }

      // 2. Create Image Records
      const imagePromises = images.map((img, index) =>
        apiBuilder.profiles.createImage({
          profile_id: profileId,
          public_url: img.publicUrl,
          path: img.path,
          is_primary: index === 0,
        })
      );
      await Promise.all(imagePromises);
    },
    onSuccess: () => {
      toast.success("Profile created successfully!");
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      clearData();
      router.push("/dashboard");
    },
    onError: (error: any) => {
      console.error("Mutation Error:", error);
      const msg = error?.response?.data?.message || error?.message || "Unknown error";

      if (msg.includes("profiles_username_key") || msg.includes("duplicate key")) {
        toast.error("Username is already taken. Please go back and change it.");
      } else {
        toast.error(`Error: ${msg}`);
      }
      setIsUploading(false);
    },
  });

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newImages: string[] = [];
    const newFiles: File[] = [];
    const remainingSlots = 9 - uploadedImages.length;

    Array.from(files)
      .slice(0, remainingSlots)
      .forEach((file) => {
        if (file.type.startsWith("image/")) {
          newFiles.push(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            newImages.push(result);
            if (newImages.length === newFiles.length) {
              setUploadedImages((prev) => [...prev, ...newImages]);
              setSelectedFiles((prev) => [...prev, ...newFiles]);
            }
          };
          reader.readAsDataURL(file);
        }
      });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDeleteImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const userId = getUserId();
      if (!userId) {
        toast.error("Session expired. Please login again.");
        return;
      }

      // 1. Upload Images
      const uploadedImagesData: { publicUrl: string; path: string }[] = [];
      for (const file of selectedFiles) {
        try {
          const result = await apiBuilder.storage.uploadImage(file, userId);
          uploadedImagesData.push(result);
        } catch (err) {
          console.error("Failed to upload image", file.name, err);
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      // 2. Aggregate Data
      const allData = getAllData();

      // Helper to parse ints
      const parseIntSafe = (val: unknown) => {
        if (typeof val !== "string" && typeof val !== "number") return null;
        const parsed = parseInt(String(val));
        return Number.isNaN(parsed) ? null : parsed;
      };

      // 3. Construct Profile Payload
      // Helper to slugify
      const slugify = (text: string) => {
        return text
          .toString()
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "")
          .replace(/--+/g, "-");
      };

      const locationSuggestion = allData.homeLocation as
        | LocationSuggestion
        | undefined;

      const rawHomeLocations =
        typeof allData.homeLocations === "string"
          ? allData.homeLocations
          : "";

      const normalizedHomeLocations = locationSuggestion
        ? [locationSuggestion.fullLabel]
        : rawHomeLocations
        ? rawHomeLocations.split(",").map((s: string) => s.trim())
        : [];

      const city =
        locationSuggestion?.city ??
        (normalizedHomeLocations.length
          ? normalizedHomeLocations[0].split(",")[0].trim()
          : null);
      const country = locationSuggestion?.country ?? "Nigeria";
      const state = locationSuggestion?.state ?? city;
      const city_slug =
        locationSuggestion?.city_slug ?? (city ? slugify(city) : null);
      const country_slug =
        locationSuggestion?.country_slug ?? slugify(country);

      const normalizedProfileType =
        typeof allData.profileType === "string"
          ? allData.profileType
          : "escort";

      const rawCatersTo =
        typeof allData.catersTo === "string" ? allData.catersTo : "";
      const catersToArray = rawCatersTo
        ? rawCatersTo.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [];

      const normalizedBaseCurrency =
        typeof allData.baseCurrency === "string"
          ? allData.baseCurrency
          : "NGN";

      // 3. Construct Profile Payload
      const profilePayload = {
        user_id: userId,
        working_name: allData.workingName,
        username: allData.profileUsername,
        profile_type: normalizedProfileType.toLowerCase(),
        gender: allData.gender,
        gender_presentation: allData.genderPresentation,
        pronouns: allData.pronouns ? [allData.pronouns] : [],
        trans_status: allData.transgenderStatus,
        trans_only: allData.appearExclusivelyInTransOnly === "Yes",
        age: parseIntSafe(allData.age),
        displayed_age:
          allData.displayedAge === "Show actual age"
            ? parseIntSafe(allData.age)
            : null,
        appear_on_other_profiles: allData.appearOnOtherProfiles !== "Disabled",
        temporary_hide_days:
          parseIntSafe(allData.temporaryProfileHiding) || null,
        caters_to: catersToArray,
        home_locations: normalizedHomeLocations,
        city: city,
        state: state,
        country: country,

        // Required for Listing visibility
        city_slug: city_slug,
        country_slug: country_slug,
        is_active: true,
        onboarding_completed: true,

        // Listing details
        tagline: allData.tagline,
        about: allData.about,
        base_hourly_rate: parseIntSafe(allData.baseHourlyRates),
        base_currency: normalizedBaseCurrency.substring(0, 3).toUpperCase(),
        available_days: allData.availableDays || [],
        ethnicity_category: allData.ethnicityCategory,
        body_type: allData.bodyType,
        // height: allData.height,
        // hair_color: allData.hairColor,
        // eye_color: allData.eyeColor,
        languages: allData.languages ? [allData.languages] : [],
      };

      // 4. Submit
      mutate({ profile: profilePayload, images: uploadedImagesData });
    } catch (error) {
      console.error(error);
      setIsUploading(false);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 md:gap-8 py-6 px-4 md:px-0 md:pt-20 pt-10">
        <div className="flex flex-col gap-2 md:gap-4">
          <h1 className="text-[18px] sm:text-4xl font-semibold text-primary-text text-center">
            Upload Pictures
          </h1>
          <div className=" flex flex-col">
            <p className="text-sm sm:text-base text-primary-text text-center">
              Upload explicit pictures of yourself so clients can see what you
              look like. You can upload up to 9 images.
            </p>
            <p className="text-sm sm:text-base text-primary-text text-center mb-6 md:mb-8">
              You can upload up to 9 images.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 md:gap-8 w-full max-w-4xl mx-auto"
          >
            <div
              className={`rounded-[24px] px-6 py-[46px] text-center transition-colors w-full max-w-[436px] mx-auto ${isDragging ? "border-primary bg-primary/10" : " bg-input-bg"
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-4">
                <CloudUpload className="h-6 w-6 text-primary-text" />
                <div className="flex flex-col gap-2">
                  <p className="text-primary-text text-sm sm:text-base">
                    Choose a file or drag and drop it here
                  </p>
                  <p className="text-text-gray text-sm sm:text-base">
                    JPEG, PNG - Up to 10MB
                  </p>
                </div>
                <Button
                  size="default"
                  type="button"
                  onClick={handleBrowseClick}
                  className="w-full bg-primary text-white px-11  rounded-[200px]  font-normal text-[12px] max-w-[156px] cursor-pointer"
                >
                  Browse File
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>

            {uploadedImages.length > 0 && (
              <div className="w-full max-w-[436px] mx-auto bg-input-bg rounded-[24px] p-4">
                <div className="grid grid-cols-3 gap-4">
                  {uploadedImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative w-[134px] h-[107px] rounded-[16px] overflow-hidden group cursor-pointer"
                    >
                      <Image
                        src={image}
                        alt={`Uploaded image ${index + 1}`}
                        width={134}
                        height={107}
                        className="object-cover rounded-[16px] group-hover:brightness-75 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(index)}
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <div className="bg-black/50 rounded-[8px] p-2">
                          <Trash2 className="h-4 w-4 text-white" />
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center pt-8">
              <Button
                type="submit"
                disabled={isUploading || isPending}
                className="w-full max-w-[443px] px-8 py-3 rounded-[200px] bg-primary text-white font-semibold text-base cursor-pointer disabled:opacity-50"
                size="default"
              >
                {isUploading || isPending ? (
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
        </div>
      </div>
    </div>
  );
}
