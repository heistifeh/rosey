"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import Image from "next/image";
import { CloudUpload, Upload, Trash2 } from "lucide-react";

export function UploadPicturesForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newImages: string[] = [];
    const remainingSlots = 9 - uploadedImages.length;

    Array.from(files)
      .slice(0, remainingSlots)
      .forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            newImages.push(result);
            if (newImages.length === Math.min(files.length, remainingSlots)) {
              setUploadedImages((prev) => [...prev, ...newImages]);
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
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Uploaded images:", uploadedImages);
    // Handle completion - could navigate to dashboard or success page
    // router.push("/dashboard");
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
              className={`rounded-[24px] px-6 py-[46px] text-center transition-colors w-full max-w-[436px] mx-auto ${
                isDragging ? "border-primary bg-primary/10" : " bg-input-bg"
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
                className="w-full max-w-[443px] px-8 py-3 rounded-[200px] bg-primary text-white font-semibold text-base cursor-pointer"
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
