"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function CapturePhotoForm() {
  const router = useRouter();

  const handleProceed = () => {
    router.push("/take-photo");
  };

  const instructions = [
    {
      text: "Remove anything that covers your face.",
      icon: "/svg/cover-face.svg",
    },
    {
      text: "Take off your glasses or face cap.",
      icon: "/svg/face-cap.svg",
    },
    {
      text: "Make sure your environment is well lit.",
      icon: "/svg/lit-profile.svg",
    },
    {
      text: "Make sure your I.D card is visible to the camera",
      icon: "/svg/id-profile.svg",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full">
      <div className="w-full max-w-[320px] md:max-w-md lg:max-w-[500px] flex flex-col gap-6 sm:gap-10">
        <div className="flex flex-col items-center gap-4  text-center">
          <h1 className="text-[18px] sm:text-4xl font-semibold text-primary-text">
            Verify Your Identity
          </h1>
          <p className="text-text-gray text-sm sm:text-base font-normal">
            Capture a clear photo of yourself while holding your identification
            card.
          </p>
        </div>

        <div className="flex flex-col items-center gap-10">
          <div className="relative w-full max-w-[200px] sm:max-w-[280px] md:max-w-[320px] aspect-square rounded-full overflow-hidden bg-dark-surface">
            <div className="w-full h-full flex items-center justify-center">
              <Image
                src="/svg/verify-identity2.svg"
                alt="Verify identity"
                width={176}
                height={176}
                className="w-full h-full object-contain rounded-full"
                priority
              />
            </div>
          </div>

          <div className="w-full bg-[#1d1d1e] rounded-[25px] border border-[#3d3e40] p-4 sm:p-6 flex flex-col">
            {instructions.map((instruction, index) => (
              <div
                key={index}
                className={`flex gap-1 items-center ${
                  index !== instructions.length - 1
                    ? "pb-[10px] sm:pb-[15px] border-b border-[#3d3e40] mb-[10px] sm:mb-[15px]"
                    : ""
                }`}
              >
                <div className="shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full  flex items-center justify-center mt-0.5">
                  <Image
                    src={instruction.icon}
                    alt=""
                    width={36}
                    height={36}
                    className="w-8 h-8 sm:w-5 sm:h-5"
                  />
                </div>
                <p className="text-text-gray text-sm sm:text-base font-normal leading-relaxed flex-1">
                  {instruction.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => router.back()}
            className="h-12 w-12 rounded-full border border-border-gray flex items-center justify-center hover:bg-dark-surface transition-colors shrink-0"
            aria-label="Go back"
          >
            <ChevronLeft className="h-6 w-6 text-primary-text" />
          </button>
          <Button
            type="button"
            onClick={handleProceed}
            className="flex-1 rounded-[200px] text-white font-semibold text-base cursor-pointer"
            size="default"
          >
            Proceed
          </Button>
        </div>
      </div>
    </div>
  );
}
