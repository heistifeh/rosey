"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import Link from "next/link";

type ClaimProfileValues = {
  email: string;
  phone: string;
};

export function ClaimProfileForm() {
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

  const onSubmit = (values: ClaimProfileValues) => {
    console.log(values);
  };

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
            onSubmit={handleSubmit(onSubmit)}
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
                      required: "Email is required",
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
                    {...register("phone", {
                      required: "Phone number is required",
                      // Basic phone validation??
                    })}
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
                {isSubmitting ? "Processing..." : "Continue"}
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
