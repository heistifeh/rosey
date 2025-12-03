"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { Copy } from "lucide-react";

export function ScanQrCodeForm() {
  const router = useRouter();
  const [code] = useState("K7J2M4PWQ9XTA6NDK7J2M4PWQ9E9EAEB");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      console.log("Code copied to clipboard");
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const handleProceed = () => {
    console.log("Proceed clicked");
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full">
      <div className="w-full max-w-[320px] md:max-w-md lg:max-w-[515px] flex flex-col gap-6 sm:gap-10">
        <div className="flex flex-col items-center gap-6 sm:gap-8">
          <div className="flex flex-col gap-2 sm:gap-4 text-center">
            <h1 className="text-[18px] sm:text-4xl font-semibold text-primary-text">
              Scan the QR Code
            </h1>
            <p className="text-text-gray text-sm sm:text-base font-normal">
              Launch your authentication app and use your phone's camera to scan
              the QR code.
            </p>
          </div>

          <Image
            src="/svg/qr-code.svg"
            alt="QR Code"
            width={250}
            height={250}
            className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px]"
            priority
          />
        </div>

        <div className="flex flex-col gap-6 sm:gap-8">
          <div className="flex flex-col gap-4">
            <p className="text-text-gray text-sm sm:text-base font-normal ">
              If scanning the QR code doesn't work, enter the text code below
              manually
            </p>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="two-factor-code"
                className="text-base font-normal text-primary-text"
              >
                Two-factor text code
              </Label>
              <div className="flex gap-2">
                <Input
                  id="two-factor-code"
                  type="text"
                  value={code}
                  readOnly
                  className="flex-1 font-mono text-xs sm:text-sm p-2! h-10! border border-border-gray rounded-lg"
                />

                <article
                  onClick={handleCopy}
                  className=" py-2 px-[10px] rounded-lg flex items-center justify-center bg-input-bg hover:bg-dark-surface transition-colors cursor-pointer"
                >
                  <Copy className="h-4 w-4 text-primary-text" />
                  <span className="ml-[6px] text-base font-normal text-primary-text">
                    Copy
                  </span>
                </article>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="h-12 w-12 rounded-full border border-border-gray flex items-center justify-center hover:bg-dark-surface transition-colors"
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
    </div>
  );
}
