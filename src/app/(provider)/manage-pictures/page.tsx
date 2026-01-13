"use client";

import Image from "next/image";
import { useRef, useState, type DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { CloudUpload, Trash2, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { apiBuilder } from "@/api/builder";
import { getUserId } from "@/api/axios-config";
import { useProfile } from "@/hooks/use-profile";
import { useProfileImages } from "@/hooks/use-profile-images";

const MAX_IMAGES = 9;

export default function ManagePicturesPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { data: profile, isLoading: profileLoading } = useProfile();
  const {
    data: images = [],
    isLoading: imagesLoading,
    refetch,
  } = useProfileImages(profile?.id);

  const remainingSlots = Math.max(0, MAX_IMAGES - images.length);
  const isUploadDisabled = isUploading || remainingSlots === 0;

  const showMaxPhotosError = () => {
    toast.error(
      "You’ve reached the maximum of 9 photos. Delete a photo to upload a new one."
    );
  };

  const handleBrowseClick = () => {
    if (isUploadDisabled) {
      if (remainingSlots === 0) {
        showMaxPhotosError();
      }
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || isUploading) {
      return;
    }
    if (remainingSlots === 0) {
      showMaxPhotosError();
      return;
    }

    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (!imageFiles.length) {
      return;
    }

    const filesToUpload = imageFiles.slice(0, remainingSlots);
    setIsUploading(true);
    try {
      const userId = getUserId();
      if (!userId || !profile?.id) {
        toast.error("Session expired or profile missing. Please try again.");
        return;
      }

      let successCount = 0;
      let encounteredError = false;
      for (const file of filesToUpload) {
        try {
          const uploadResult = await apiBuilder.storage.uploadImage(file, userId);
          await apiBuilder.profiles.createImage({
            profile_id: profile.id,
            public_url: uploadResult.publicUrl,
            path: uploadResult.path,
            is_primary: false,
          });
          successCount += 1;
        } catch (error) {
          encounteredError = true;
          console.error("Failed to upload image", file.name, error);
        }
      }

      if (successCount > 0) {
        toast.success("Photos uploaded successfully");
        refetch();
      }

      if (encounteredError && successCount === 0) {
        toast.error("Failed to upload one or more photos");
      } else if (encounteredError) {
        toast.error("Some photos failed to upload");
      }
    } catch (error) {
      console.error("Upload error", error);
      toast.error("Failed to upload one or more photos");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (isUploadDisabled) {
      return;
    }
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (isUploadDisabled) {
      if (remainingSlots === 0) {
        showMaxPhotosError();
      }
      return;
    }
    handleFileSelect(event.dataTransfer.files);
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!imageId) return;
    const confirmed = window.confirm("Delete this photo?");
    if (!confirmed) return;

    try {
      await apiBuilder.images.deleteImage(imageId);
      toast.success("Photo deleted");
      refetch();
    } catch (error) {
      console.error("Failed to delete photo", error);
      toast.error("Failed to delete photo");
    }
  };

  const renderSkeleton = () => {
    return Array.from({ length: 6 }, (_, index) => (
      <div
        key={`skeleton-${index}`}
        className="h-[107px] w-[134px] rounded-[16px] bg-[#1F1F22]/20 animate-pulse"
      />
    ));
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 md:gap-8 py-6 px-4 md:px-0 md:pt-20 pt-10">
        <div className="flex flex-col gap-2 md:gap-4">
          <h1 className="text-[18px] sm:text-4xl font-semibold text-primary-text text-center">
            Manage Pictures
          </h1>
          <div className="flex flex-col">
            <p className="text-sm sm:text-base text-primary-text text-center">
              Upload explicit pictures of yourself so clients can see what you
              look like. You can upload up to 9 images.
            </p>
            <p className="text-sm sm:text-base text-primary-text text-center mb-6 md:mb-8">
              Delete any photo you no longer want on your profile.
            </p>
          </div>

          <div
            className={`rounded-[24px] px-6 py-[46px] text-center transition-colors w-full max-w-[436px] mx-auto ${
              isDragging
                ? "border-primary bg-primary/10"
                : "bg-input-bg border border-transparent"
            } ${isUploadDisabled ? "opacity-70" : ""}`}
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
                className="w-full bg-primary text-white px-11 rounded-[200px] font-normal text-[12px] max-w-[156px] cursor-pointer"
                disabled={isUploadDisabled}
              >
                Browse File
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              multiple
              onChange={(event) => handleFileSelect(event.target.files)}
              className="hidden"
            />
          </div>

          <div className="text-center text-sm text-text-gray">
            {imagesLoading || profileLoading ? (
              "Loading photos..."
            ) : (
              `${images.length} / ${MAX_IMAGES} photos uploaded`
            )}
          </div>

          <div className="w-full max-w-[436px] mx-auto bg-input-bg rounded-[24px] p-4">
            {imagesLoading ? (
              <div className="grid grid-cols-3 gap-4">{renderSkeleton()}</div>
            ) : images.length === 0 ? (
              <p className="text-sm text-primary-text text-center">
                No photos uploaded yet.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="relative w-[134px] h-[107px] rounded-[16px] overflow-hidden group cursor-pointer"
                  >
                    <Image
                      src={image.public_url}
                      alt={`Uploaded image ${image.id}`}
                      width={134}
                      height={107}
                      className="object-cover rounded-[16px] group-hover:brightness-75 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(image.id)}
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <div className="bg-black/50 rounded-[8px] p-2">
                        <Trash2 className="h-4 w-4 text-white" />
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-center pt-8">
            <Button
              type="button"
              disabled={isUploadDisabled}
              onClick={handleBrowseClick}
              className="w-full max-w-[443px] px-8 py-3 rounded-[200px] bg-primary text-white font-semibold text-base cursor-pointer disabled:opacity-50"
              size="default"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload more photos"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
