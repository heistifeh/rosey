"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function SetupProfileForm() {
  const router = useRouter();

  const handleProceed = () => {
    router.push("/general-information");
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full px-4 py-6 overflow-y-auto">
      <div className="w-full max-w-[320px] md:max-w-md lg:max-w-[600px] flex flex-col gap-6 sm:gap-[30px]">
        <div className="flex flex-col items-center text-center">
          <div className="w-full max-w-[200px] sm:max-w-[280px] aspect-square">
            <Image
              src="/svg/profile.svg"
              alt="Profile setup"
              width={280}
              height={280}
              className="w-full h-full object-contain"
              priority
            />
          </div>

          <div className="flex flex-col gap-4 ">
            <h1 className="text-[18px] sm:text-4xl font-semibold text-primary-text">
              Let's Set Up Your Profile
            </h1>
            <p className="text-text-gray text-sm sm:text-base font-normal leading-relaxed">
              A little extra polish on your profile makes a big impact. We go
              beyond just photos to help you attract clients who truly fit,
              offering a more complete picture of who you are as an escort.
              Updating your profile is quick and easy from your dashboard.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4  ">
          <button
            onClick={() => router.back()}
            className="h-12 w-12 rounded-full border border-border-gray flex items-center justify-center hover:bg-dark-surface transition-colors shrink-0 cursor-pointer"
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
