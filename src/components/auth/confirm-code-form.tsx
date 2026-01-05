"use client";

import { Button } from "@/components/ui/button";
import { CodeInput } from "@/components/ui/code-input";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function ConfirmCodeForm() {
  const router = useRouter();

  const handleCodeComplete = (code: string) => {
    console.log("Code entered:", code);
  };

  const handleActivate = () => {
    router.push("/setup-account");
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full">
      <div className="w-full max-w-[320px] md:max-w-md lg:max-w-[515px] flex flex-col gap-6 sm:gap-10">
        <div className="flex flex-col gap-4 text-center">
          <h1 className="text-[18px] sm:text-4xl font-semibold text-primary-text">
            Enter Confirmation Code
          </h1>
          <p className="text-text-gray text-sm sm:text-base font-normal">
            After scanning the QR code, a six-digit code will appear in your
            app. Type it in below.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:gap-6">
          <CodeInput length={6} onComplete={handleCodeComplete} />

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="h-12 w-12 rounded-full  border border-border-gray flex items-center justify-center hover:bg-dark-surface transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="h-6 w-6 text-primary-text" />
            </button>

            <Button
              type="button"
              onClick={handleActivate}
              className="flex-1 rounded-[200px] text-white font-semibold text-base cursor-pointer"
              size="default"
            >
              Activate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
