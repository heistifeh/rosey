"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useState, useEffect } from "react";
import { apiBuilder } from "@/api/builder";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { CodeInput } from "@/components/ui/code-input";
import { ChevronLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import {
  errorMessageHandler,
  type ErrorType,
} from "@/utils/error-handler";

type ClaimProfileValues = {
  email: string;
  phone: string;
};

export function ClaimProfileForm() {
  const router = useRouter();
  const [step, setStep] = useState<"input" | "otp">("input");
  const [foundProfileId, setFoundProfileId] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState<{
    email: string;
    phone: string;
  } | null>(null);
  const [otpCountdown, setOtpCountdown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClaimProfileValues>({
    defaultValues: {
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => {
        setOtpCountdown(otpCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  const onSearchSubmit = async (values: ClaimProfileValues) => {
    // Ensure we pass empty strings if undefined, though hook form handles this
    const emailToCheck = values.email?.trim() || "";
    const phoneToCheck = values.phone?.trim() || "";

    if (!emailToCheck && !phoneToCheck) {
      toast.error("Please enter either an email address or phone number");
      return;
    }

    try {

      const profile = await apiBuilder.profiles.verifyProfileContact(
        emailToCheck,
        phoneToCheck
      );

      if (profile) {
        setFoundProfileId(profile.id);
        setContactInfo(values);

        // Trigger OTP
        toast.loading("Sending OTP...", { id: "send-otp" });
        if (values.email) {
          // Use type: "email" to request a code instead of a magic link
          await apiBuilder.auth.sendOtp({
            email: values.email,
            type: "email",
          } as any);
        } else if (values.phone) {
          await apiBuilder.auth.sendOtp({
            phone: values.phone,
            type: "sms",
          } as any);
        }
        toast.success("Profile found! OTP sent.", { id: "send-otp" });

        setStep("otp");
        setOtpCountdown(45);
      } else {
        toast.error("No profile found with these details.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to verify profile contact. Please check your connection.");
    }
  };

  const handleOtpComplete = async (code: string) => {
    if (!contactInfo) return;

    toast.loading("Verifying...", { id: "verify-otp" });
    try {
      let authResponse;
      if (contactInfo.email) {
        // We used POST /otp with type: "email", so verification must be type: "email"
        // Ensure email is clean
        const cleanEmail = contactInfo.email.trim().toLowerCase();

        authResponse = await apiBuilder.auth.verifyOtp({
          email: cleanEmail,
          token: code,
          type: "email",
        });
      } else if (contactInfo.phone) {
        authResponse = await apiBuilder.auth.verifyOtp({
          phone: contactInfo.phone,
          token: code,
          type: "sms",
        });
      }

      // Link profile to the verified user
      if (authResponse?.user?.id && foundProfileId) {
        await apiBuilder.profiles.updateProfile(foundProfileId, {
          user_id: authResponse.user.id,
          claim_status: "claimed",
        });
        toast.success("Profile claimed successfully!", { id: "verify-otp" });
        router.push("/dashboard/profile");
      } else {
        toast.success("Verified successfully!", { id: "verify-otp" });
        router.push("/dashboard/profile");
      }
    } catch (error: unknown) {
      console.error("OTP verification failed", error);
      errorMessageHandler(error as ErrorType);
      toast.error("Invalid OTP code", { id: "verify-otp" });
    }
  };

  const handleResendOtp = async () => {
    if (otpCountdown === 0 && contactInfo) {
      setOtpCountdown(45);
      try {
        if (contactInfo.email) {
          await apiBuilder.auth.sendOtp({
            email: contactInfo.email,
            type: "email",
          } as any);
        } else {
          await apiBuilder.auth.sendOtp({
            phone: contactInfo.phone,
            type: "sms",
          } as any);
        }
        toast.success("OTP Code resent!");
      } catch (error) {
        console.error(error);
        toast.error("Failed to resend code");
      }
    }
  };

  if (step === "otp") {
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
                Enter the 6-digit code sent to{" "}
                <span className="text-primary-text">{contactInfo?.email}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-[26px] sm:gap-10">
            <section className=" flex flex-col gap-4 sm:gap-6">
              <CodeInput length={8} onComplete={handleOtpComplete} />

              <div className="flex justify-center">
                <button
                  onClick={handleResendOtp}
                  disabled={otpCountdown > 0}
                  className={`text-base font-normal ${otpCountdown > 0
                    ? "text-text-gray cursor-not-allowed"
                    : "text-primary hover:underline cursor-pointer"
                    }`}
                >
                  Resend Code {otpCountdown > 0 && `(${otpCountdown}s)`}
                </button>
              </div>
            </section>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setStep("input")}
                className="h-12 w-12 rounded-full border border-border-gray flex items-center justify-center hover:bg-dark-surface transition-colors"
                aria-label="Go back"
              >
                <ChevronLeft className="h-6 w-6 text-primary-text" />
              </button>

              <div className="flex-1"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-md flex flex-col gap-10">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-4xl font-semibold text-primary-text sm:text-4xl">
            Claim Your Profile
          </h1>
          <p className=" text-text-gray text-base font-normal">
            Enter your details to claim your existing profile.
          </p>
        </div>

        <div className="flex flex-col gap-10">
          <form
            className="flex flex-col gap-10"
            onSubmit={handleSubmit(onSearchSubmit)}
          >
            <section className=" flex flex-col gap-4">
              <div className=" flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-normal text-primary-text"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    aria-invalid={Boolean(errors.email)}
                    {...register("email", {
                      //   required: "Email is required",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Enter a valid email",
                      },
                    })}
                  />
                  {errors.email && (
                    <span className="text-xs text-red-500">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-normal text-primary-text"
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    aria-invalid={Boolean(errors.phone)}
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <span className="text-xs text-red-500">
                      {errors.phone.message}
                    </span>
                  )}
                </div>
              </div>
            </section>

            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full rounded-[200px] text-white font-semibold text-base"
                size="default"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          </form>

          <div className="text-center text-base font-normal">
            <span className="text-text-gray">Don't have a profile yet? </span>
            <Link
              href="/create-account"
              className="text-primary hover:underline font-medium"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
