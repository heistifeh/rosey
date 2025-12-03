"use client";

import { Button } from "@/src/components/ui/button";
import { CodeInput } from "@/src/components/ui/code-input";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

export function EnterOtpForm() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(45);
  const [email] = useState("Johndoe419@gmail.com");

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleCodeComplete = (code: string) => {
    console.log("OTP entered:", code);
  };

  const handleConfirm = () => {
    console.log("Confirm button clicked");
  };

  const handleResend = () => {
    if (countdown === 0) {
      setCountdown(45);
      console.log("Resending code...");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full">
      <div className="w-full max-w-[320px] md:max-w-md lg:max-w-[515px] flex flex-col gap-6 sm:gap-10">
        <div className="flex flex-col items-center ">
          <Image
            src="/svg/mail-box.svg"
            alt="Mailbox"
            width={150}
            height={150}
            className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px]"
            priority
          />

          <div className="flex flex-col gap-2 sm:gap-4 text-center">
            <h1 className="text-[18px] sm:text-4xl font-semibold text-primary-text">
              Enter OTP
            </h1>
            <p className="text-text-gray text-sm sm:text-base font-normal">
              Enter the 6-digit code that was sent to{" "}
              <span className="text-primary-text">{email}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-[26px] sm:gap-10">
          <section className=" flex flex-col gap-4 sm:gap-6">
            <CodeInput length={6} onComplete={handleCodeComplete} />

            <div className="flex justify-center">
              <button
                onClick={handleResend}
                disabled={countdown > 0}
                className={`text-base font-normal ${
                  countdown > 0
                    ? "text-text-gray cursor-not-allowed"
                    : "text-primary hover:underline cursor-pointer"
                }`}
              >
                Resend Code {countdown > 0 && `(${countdown}s)`}
              </button>
            </div>
          </section>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="h-12 w-12 rounded-full border border-border-gray flex items-center justify-center hover:bg-dark-surface transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="h-6 w-6 text-primary-text" />
            </button>

            <Button
              type="button"
              onClick={handleConfirm}
              className="flex-1 rounded-[200px] text-white font-semibold text-base cursor-pointer"
              size="default"
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
