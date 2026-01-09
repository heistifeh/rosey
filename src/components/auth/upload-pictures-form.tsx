"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import Image from "next/image";
import { CloudUpload, Upload, Trash2, Loader2 } from "lucide-react";
import { apiBuilder } from "@/api/builder";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useProfileStore } from "@/hooks/use-profile-store";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getAllData, clearData } = useProfileStore();

  const [uploadedImages, setUploadedImages] = useState<string[]>([]); // Previews
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // Actual files
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ profile, images }: { profile: any; images: string[] }) => {
      // 1. Create/Update Profile
      await apiBuilder.profiles.createProfile(profile);

      // 2. Create Image Records
      const imagePromises = images.map((url, index) =>
        apiBuilder.profiles.createImage({
          user_id: profile.user_id,
          public_url: url,
          is_primary: index === 0,
        })
      );
      await Promise.all(imagePromises);
    },
    onSuccess: () => {
      toast.success("Profile created successfully!");
      clearData();
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create profile");
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
      const imageUrls: string[] = [];
      for (const file of selectedFiles) {
        try {
          const url = await apiBuilder.storage.uploadImage(file, userId);
          imageUrls.push(url);
        } catch (err) {
          console.error("Failed to upload image", file.name, err);
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      // 2. Aggregate Data
      const allData = getAllData();

      // Helper to parse ints
      const parseIntSafe = (val: string) => {
        const parsed = parseInt(val);
        return isNaN(parsed) ? null : parsed;
      };

      // 3. Construct Profile Payload
      const profilePayload = {
        user_id: userId,
        working_name: allData.workingName,
        username: allData.profileUsername,
        profile_type: allData.profileType,
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
        caters_to: allData.catersTo
          ? allData.catersTo.split(",").map((s: string) => s.trim())
          : [],
        home_locations: allData.homeLocations
          ? allData.homeLocations.split(",").map((s: string) => s.trim())
          : [],
        city: allData.homeLocations
          ? allData.homeLocations.split(",")[0].trim()
          : null,
        state: allData.homeLocations
          ? allData.homeLocations.split(",")[0].trim()
          : null, // Fallback
        country: "Nigeria", // Default
      };

      // 4. Submit
      mutate({ profile: profilePayload, images: imageUrls });
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
