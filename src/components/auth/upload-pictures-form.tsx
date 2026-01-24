"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { CloudUpload, Trash2, Loader2 } from "lucide-react";
import { apiBuilder } from "@/api/builder";
import { errorMessageHandler, type ErrorType } from "@/utils/error-handler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useProfileStore } from "@/hooks/use-profile-store";
import { LocationSuggestion } from "@/hooks/use-location-autocomplete";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useProfile } from "@/hooks/use-profile";

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

type ImageItem = {
  id?: string;
  url: string;
  path?: string | null;
  isExisting?: boolean;
  file?: File;
};

type ProfileFormData = {
  workingName?: string;
  profileUsername?: string;
  profileType?: string;
  gender?: string;
  genderPresentation?: string;
  pronouns?: string;
  transgenderStatus?: string;
  appearExclusivelyInTransOnly?: string;
  age?: string;
  displayedAge?: string;
  appearOnOtherProfiles?: string;
  temporaryProfileHiding?: string;
  catersTo?: string;
  homeLocations?: string;
  homeLocation?: LocationSuggestion;
  tagline?: string;
  about?: string;
  baseHourlyRates?: string;
  baseCurrency?: string;
  dayTimes?: Record<string, string[]>;
  selectedDays?: string[];
  ethnicityCategory?: string;
  bodyType?: string;
  languages?: string;
  height?: string;
  eyeColor?: string;
  hairColor?: string;
  friendly420?: string;
};

const MAX_IMAGES = 9;

interface UploadPicturesFormProps {
  mode?: "create" | "manage" | "update";
}

export function UploadPicturesForm({
  mode = "create",
}: UploadPicturesFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getAllData, clearData } = useProfileStore();

  const isCreateMode = mode === "create";
  const isUpdateMode = mode === "update";
  const submitLabel = isCreateMode ? "Complete" : isUpdateMode ? "Update Profile" : "Submit";
  const successMessage = isCreateMode
    ? "Profile created successfully!"
    : isUpdateMode
      ? "Profile updated successfully!"
      : "Managed successfully";
  const redirectTo = isCreateMode || isUpdateMode ? "/dashboard" : "/dashboard/photos";

  const [photoItems, setPhotoItems] = useState<ImageItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [hasLoadedExistingImages, setHasLoadedExistingImages] = useState(false);

  const { data: profile } = useProfile();
  useCurrentUser();
  const currentUserId = getUserId();

  useEffect(() => {
    if (!profile || hasLoadedExistingImages) return;
    const existingImages =
      profile.images?.map((image) => ({
        id: image.id,
        url: image.public_url,
        path: image.path,
        isExisting: true,
      })) ?? [];
    setPhotoItems(existingImages);
    setHasLoadedExistingImages(true);
  }, [profile, hasLoadedExistingImages]);

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      profile,
      images,
    }: {
      profile: any;
      images: { publicUrl: string; path: string }[];
    }) => {
      let profileId;

      if (isUpdateMode) {

        const { user_id, ...updateData } = profile;
        await apiBuilder.profiles.updateProfileByUserId(user_id, updateData);
        profileId = profile.id; // Using existing profile ID
      } else {

        const result = await apiBuilder.profiles.createProfile(profile);
        profileId = result?.[0]?.id;
      }

      if (isUpdateMode && !profileId) {
        profileId = currentUserId;
      }

      const targetProfileId = isUpdateMode ? (profile as any).id : profileId;

      if (!targetProfileId) {
        if (isCreateMode) throw new Error("Failed to retrieve profile ID");
      }

      // 2. Create Image Records
      if (targetProfileId) {
        const imagePromises = images.map((img, index) =>
          apiBuilder.profiles.createImage({
            profile_id: targetProfileId,
            public_url: img.publicUrl,
            path: img.path,
            is_primary: index === 0,
          })
        );
        await Promise.all(imagePromises);
      }
    },
    onSuccess: () => {
      toast.success(successMessage);
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      if (currentUserId) {
        queryClient.invalidateQueries({
          queryKey: ["profile", currentUserId],
        });
      }
      clearData();
      router.push(redirectTo);
    },
    onError: (error: any) => {
      console.error("Mutation Error:", error);
      const msg =
        error?.response?.data?.message || error?.message || "Unknown error";

      if (
        msg.includes("profiles_username_key") ||
        msg.includes("duplicate key")
      ) {
        toast.error("Username is already taken. Please go back and change it.");
      } else {
        toast.error(`Error: ${msg}`);
      }
      setIsUploading(false);
    },
  });

  // Mutation for deleting images
  const deleteImageMutation = useMutation({
    mutationFn: async ({ id, path }: { id: string; path?: string | null }) => {
      await apiBuilder.profiles.deleteImage(id);
      if (path) {
        await apiBuilder.storage.deleteImage(path);
      }
    },
    onSuccess: () => {
      if (currentUserId) {
        queryClient.invalidateQueries({
          queryKey: ["profile", currentUserId],
        });
      }
      toast.success("Photo removed");
    },
    onError: () => {
      toast.error("Failed to remove photo");
    },
  });

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    const availableSlots = Math.max(MAX_IMAGES - photoItems.length, 0);
    if (availableSlots === 0) return;

    const allowedFiles = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, availableSlots);

    allowedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPhotoItems((prev) => [
          ...prev,
          { url: result, file, isExisting: false },
        ]);
        setSelectedFiles((prev) => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (photoItems.length >= MAX_IMAGES) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (photoItems.length >= MAX_IMAGES) return;
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDeleteImage = async (image: ImageItem, index: number) => {
    if (image.isExisting && image.id) {
      try {
        await deleteImageMutation.mutateAsync({
          id: image.id,
          path: image.path ?? null,
        });
        setPhotoItems((prev) => prev.filter((_, idx) => idx !== index));
      } catch (error) {
        return;
      }
      return;
    }

    setPhotoItems((prev) => prev.filter((_, idx) => idx !== index));
    if (image.file) {
      setSelectedFiles((prev) => prev.filter((file) => file !== image.file));
    }
  };

  const handleBrowseClick = () => {
    if (photoItems.length >= MAX_IMAGES) return;
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const userId = currentUserId ?? getUserId();
      if (!userId) {
        toast.error("Session expired. Please login again.");
        setIsUploading(false);
        return;
      }

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

      if (!(isCreateMode || isUpdateMode)) {
        if (!profile?.id) {
          toast.error("Profile not found");
          setIsUploading(false);
          return;
        }

        if (uploadedImagesData.length === 0) {
          toast.error("No new photos to upload");
          setIsUploading(false);
          return;
        }

        const existingPhotoCount = photoItems.filter(
          (p) => p.isExisting
        ).length;

        const imagePromises = uploadedImagesData.map((img, index) =>
          apiBuilder.profiles.createImage({
            profile_id: profile.id,
            public_url: img.publicUrl,
            path: img.path,
            is_primary: existingPhotoCount === 0 && index === 0,
          })
        );

        await Promise.all(imagePromises);

        toast.success("Photos updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["profile", currentUserId] });
        queryClient.invalidateQueries({ queryKey: ["profiles"] });
        setIsUploading(false);

        setSelectedFiles([]);

        router.push("/dashboard");
      } else {
        const allData = getAllData<ProfileFormData>();

        const parseIntSafe = (val: string | undefined) => {
          if (!val) return null;
          const parsed = parseInt(val);
          return isNaN(parsed) ? null : parsed;
        };

        const slugify = (text: string) => {
          return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "")
            .replace(/--+/g, "-");
        };

        const locationSuggestion = allData.homeLocation;

        const normalizedHomeLocations = locationSuggestion
          ? [locationSuggestion.fullLabel]
          : allData.homeLocations
            ? allData.homeLocations.split(",").map((s) => s.trim())
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

        const availabilityData = allData.dayTimes ?? {};
        const availabilityEntries = Object.entries(availabilityData).flatMap(
          ([day, slots]) =>
            (Array.isArray(slots) ? slots : []).map((slot) => `${day}: ${slot}`)
        );
        const fallbackAvailability =
          allData.selectedDays?.map((day) => `${day}: All day`) ?? [];

        const feetToCm = (heightStr: string | undefined) => {
          if (!heightStr) return null;
          const [feet, inches] = heightStr.replace(/["']/g, "").split("'").map(Number);
          if (isNaN(feet)) return null;
          const totalInches = feet * 12 + (inches || 0);
          return Math.round(totalInches * 2.54);
        };

        const profilePayload = {
          user_id: userId,
          working_name: allData.workingName,
          username: allData.profileUsername,
          profile_type: (allData.profileType ?? "escort").toLowerCase(),
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
          appear_on_other_profiles:
            allData.appearOnOtherProfiles !== "Disabled",
          temporary_hide_days:
            parseIntSafe(allData.temporaryProfileHiding) || 0,
          caters_to: allData.catersTo
            ? allData.catersTo.split(",").map((s) => s.trim())
            : [],
          home_locations: normalizedHomeLocations,
          city: city,
          state: state,
          country: country,

          city_slug: city_slug,
          country_slug: country_slug,
          is_active: true,
          onboarding_completed: true,

          tagline: allData.tagline,
          about: allData.about,
          base_hourly_rate: parseIntSafe(allData.baseHourlyRates),
          base_currency: (allData.baseCurrency || "NGN")
            .substring(0, 3)
            .toUpperCase(),
          available_days:
            availabilityEntries.length > 0
              ? availabilityEntries
              : fallbackAvailability,
          ethnicity_category: allData.ethnicityCategory,
          body_type: allData.bodyType,
          languages: allData.languages ? [allData.languages] : [],

          height_cm: feetToCm(allData.height),
          eye_color: allData.eyeColor,
          hair_color: allData.hairColor,
          is_420_friendly: allData.friendly420 === "Yes",
        };

        mutate({ profile: profilePayload, images: uploadedImagesData });
      }
    } catch (error) {
      console.error(error);
      setIsUploading(false);
      errorMessageHandler(error as ErrorType);
    }
  };

  const totalPhotos = photoItems.length;
  const remainingSlots = Math.max(MAX_IMAGES - totalPhotos, 0);
  const limitReached = totalPhotos >= MAX_IMAGES;

  const isSubmitDisabled = isUploading || isPending;

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 md:gap-8 py-6 px-4 md:px-0 md:pt-20 pt-10">
        <div className="flex flex-col gap-2 md:gap-4">
          <h1 className="text-[18px] sm:text-4xl font-semibold text-primary-text text-center">
            {isCreateMode ? "Upload Pictures" : "Manage Photos"}
          </h1>
          <div className="flex flex-col">
            <p className="text-sm sm:text-base text-primary-text text-center">
              {isCreateMode
                ? "Upload explicit pictures of yourself so clients can see what you look like."
                : "Add or remove photos from your profile. You can upload up to 9 images total."}
            </p>
            <p className="text-sm sm:text-base text-primary-text text-center mb-6 md:mb-8">
              You can upload up to 9 images.
            </p>
          </div>

          <div className="flex flex-col gap-6 md:gap-8 w-full max-w-4xl mx-auto">
            <div
              className={`rounded-[24px] px-6 py-[46px] text-center transition-colors w-full max-w-[436px] mx-auto ${isDragging ? "border-primary bg-primary/10" : "bg-input-bg"
                } ${limitReached ? "cursor-not-allowed opacity-80" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-4">
                <CloudUpload className="h-6 w-6 text-primary-text" />
                <div className="flex flex-col gap-2">
                  <p className="text-primasry-text text-sm sm:text-base">
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
                  disabled={limitReached}
                  className="w-full bg-primary text-white px-11 rounded-[200px] font-normal text-[12px] max-w-[156px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
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
            <p className="text-[12px] mt-2 text-center text-text-gray">
              {limitReached
                ? "You can't post more than 9 photos. Delete one to upload more."
                : `${remainingSlots} slot${remainingSlots === 1 ? "" : "s"
                } remaining.`}
            </p>

            {photoItems.length > 0 && (
              <div className="w-full max-w-[436px] mx-auto bg-input-bg rounded-[24px] p-4">
                <div className="grid grid-cols-3 gap-4">
                  {photoItems.map((image, index) => (
                    <div
                      key={image.id ?? `${image.url}-${index}`}
                      className="relative w-[134px] h-[107px] rounded-[16px] overflow-hidden group cursor-pointer"
                    >
                      <Image
                        src={image.url}
                        alt={`Uploaded image ${index + 1}`}
                        width={134}
                        height={107}
                        className="object-cover rounded-[16px] group-hover:brightness-75 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(image, index)}
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
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
                className="w-full max-w-[443px] px-8 py-3 rounded-[200px] bg-primary text-white font-semibold text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                size="default"
              >
                {isUploading || isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isCreateMode ? "Completing..." : "Saving..."}
                  </>
                ) : (
                  submitLabel
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
