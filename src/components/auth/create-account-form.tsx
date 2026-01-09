"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiBuilder } from "@/api/builder";
import { errorMessageHandler, type ErrorType } from "@/utils/error-handler";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

type CreateAccountValues = {
  email: string;
  password: string;
  terms: boolean;
};

export function CreateAccountForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateAccountValues>({
    defaultValues: {
      email: "",
      password: "",
      terms: false,
    },
  });

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: (values: CreateAccountValues) =>
      apiBuilder.auth.signUp({
        email: values.email,
        password: values.password,
      }),
    mutationKey: ["auth", "signUp"],
    onSuccess: () => {
      toast.success("Account created successfully");
      reset();
    },
    onError: (error) => {
      errorMessageHandler(error as ErrorType);
    },
  });

  const onSubmit = (values: CreateAccountValues) => {
    mutate(values, {
      onSuccess: () => {
        router.push("/general-information");
      },
    });
  };

  const onClientSubmit = (values: CreateAccountValues) => {
    mutate(values, {
      onSuccess: () => {
        router.push("/");
      },
    });
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
                    htmlFor="password"
                    className="text-sm font-normal text-primary-text"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    aria-invalid={Boolean(errors.password)}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  {errors.password && (
                    <span className="text-xs text-red-500">
                      {errors.password.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  className="mt-1"
                  aria-invalid={Boolean(errors.terms)}
                  {...register("terms", {
                    required: "You must accept the terms",
                  })}
                />
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
              {errors.terms && (
                <span className="text-xs text-red-500">
                  {errors.terms.message}
                </span>
              )}
            </section>

            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full rounded-[200px] text-white font-semibold text-base"
                size="default"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? "Creating..." : "Create Account"}
              </Button>
              <Button
                type="button"
                className="w-full rounded-[200px] text-[#FCFCFD] font-semibold text-base bg-[#222222] hover:bg-[#1a1a1a]"
                size="default"
                onClick={handleSubmit(onClientSubmit)}
                disabled={isSubmitting || isLoading}
              >
                Sign Up as a Client Instead
              </Button>
            </div>
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
