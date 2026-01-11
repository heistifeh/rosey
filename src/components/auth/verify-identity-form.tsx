"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function VerifyIdentityForm() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/capture-photo");
  };

  const handleSkip = () => {
    router.push("/capture-photo");
  };

  const instructions = [
    {
      number: 1,
      text: "Get a sheet of paper or card and a dark-coloured pen or marker. The back of a shipping invoice or cardboard box is fine as long as it's easy to hold and read. On your paper, write in English:",
    },
    {
      number: 2,
      text: "The working name you signed up to Rosey with.",
    },
    {
      number: 3,
      text: "The email address you used to sign up to Rosey with.",
    },
    {
      number: 4,
      text: "Today's date",
    },
    {
      number: 5,
      text: 'The phrase "I am signing up for Rosey"',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full">
      <div className="w-full max-w-[320px] md:max-w-md lg:max-w-[600px] flex flex-col gap-6 sm:gap-10">
        <div className="flex flex-col items-center gap-4 sm:gap-2 text-center">
          <h1 className="text-[18px] sm:text-4xl font-semibold text-primary-text">
            Verify Your Identity
          </h1>
          <p className="text-text-gray text-sm sm:text-base font-normal">
            Your Privacy is Our Priority: 100% Confidential & Discreet
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:gap-8">
          <h2 className="text-base sm:text-[24px] font-semibold text-primary-text text-center">
            Follow the Instructions
          </h2>

          <div className="flex flex-col gap-4 sm:gap-5">
            {instructions.map((instruction) => (
              <div key={instruction.number} className="flex gap-4 items-center">
                <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white text-sm sm:text-base font-semibold">
                    {instruction.number}
                  </span>
                </div>
                <p className="text-text-gray text-sm sm:text-base font-normal leading-relaxed flex-1">
                  {instruction.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 ">
          <Button
            type="button"
            onClick={handleSkip}
            variant="outline"
            className="flex-1 min-w-[120px] sm:min-w-0 rounded-[200px] text-white font-semibold text-base cursor-pointer bg-dark-surface hover:bg-dark-border"
            size="default"
          >
            Skip
          </Button>

          <Button
            type="button"
            onClick={handleNext}
            className="flex-1 min-w-[120px] sm:min-w-0 rounded-[200px] text-white font-semibold text-base cursor-pointer"
            size="default"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
