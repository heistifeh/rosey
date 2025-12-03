"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";

export function CreateAccountForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-md flex flex-col gap-10">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-4xl font-semibold text-primary-text sm:text-4xl">
            Create Your Account
          </h1>
          <p className=" text-text-gray text-base font-normal">
            Enter your details to create an account.
          </p>
        </div>

        <div className="flex flex-col gap-10">
          <Button
            variant="outline"
            size="default"
            className="w-full justify-center rounded-[200px] bg-input-bg text-base font-normal"
          >
            <Image
              src="/svg/google.svg"
              alt="Google"
              width={20}
              height={20}
              className="h-6 w-6"
            />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-gray"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-primary-bg text-text-gray text-base font-normal">
                or sign up with
              </span>
            </div>
          </div>

          <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
            <section className=" flex flex-col gap-4">
              <div className=" flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-normal text-primary-text"
                  >
                    Email Address
                  </Label>
                  <Input id="email" type="email" required />
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-normal text-primary-text"
                  >
                    Password
                  </Label>
                  <Input id="password" type="password" required />
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox id="terms" className="mt-1" required />
                <Label
                  htmlFor="terms"
                  className="text-xs text-text-gray font-normal  cursor-pointer"
                >
                  By checking this box, you confirm that you have read,
                  understood, and agree to our{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </Label>
              </div>
            </section>

            <Button
              type="submit"
              className="w-full rounded-[200px] text-white font-semibold text-base"
              size="default"
            >
              Create Account
            </Button>
          </form>

          <div className="text-center text-base font-normal">
            <span className="text-text-gray">Already have an Account? </span>
            <Link
              href="/auth/login"
              className="text-primary hover:underline font-medium"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
