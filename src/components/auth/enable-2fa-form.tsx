"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function Enable2FAForm() {
  const router = useRouter();

  const handleSetup2FA = () => {
    router.push("/scan-qr");
  };

  const handleSkip = () => {
    router.push("/setup-account");
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full">
      <div className="w-full max-w-[320px] md:max-w-md lg:max-w-[569px] flex flex-col gap-6 sm:gap-10">
        <div className="flex flex-col items-center gap-10">
          <Image
            src="/svg/auth-factor.svg"
            alt="Two-factor authentication shield"
            width={150}
            height={150}
            className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px]"
            priority
          />

          <div className="flex flex-col gap-2 sm:gap-4 text-center">
            <h1 className="text-[18px] sm:text-4xl font-semibold text-primary-text">
              Enable two-factor Authenticator
            </h1>
            <p className="text-text-gray text-sm sm:text-base font-normal">
              Add an extra security step to protect your account with a
              verification code during login. Choose one of the options in the
              next screen to link your{" "}
              <span className="text-white font-semibold">
                Google Authenticator app
              </span>
              .
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <button
            onClick={() => router.back()}
            className="h-12 w-12 rounded-full border border-border-gray flex items-center justify-center hover:bg-dark-surface transition-colors shrink-0"
            aria-label="Go back"
          >
            <ChevronLeft className="h-6 w-6 text-primary-text" />
          </button>

          <Button
            type="button"
            onClick={handleSetup2FA}
            className="flex-1 min-w-[120px] sm:min-w-0 rounded-[200px] text-white font-semibold text-base cursor-pointer"
            size="default"
          >
            Setup 2FA
          </Button>

          <Button
            type="button"
            onClick={handleSkip}
            variant="outline"
            className="flex-1 min-w-[120px] sm:min-w-0 rounded-[200px] text-white font-semibold text-base cursor-pointer bg-dark-surface hover:bg-dark-border"
            size="default"
          >
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
}
