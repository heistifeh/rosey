"use client";

import { apiBuilder } from "@/api/builder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { errorMessageHandler, type ErrorType } from "@/utils/error-handler";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type LoginValues = {
  email: string;
  password: string;
};

export function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: (values: LoginValues) =>
      apiBuilder.auth.signIn({
        email: values.email,
        password: values.password,
      }),
    mutationKey: ["auth", "signIn"],
    onSuccess: async () => {
      toast.success("Welcome back.");
      reset();

      try {
        const profile = await apiBuilder.profiles.getMyProfile();
        const profileType = typeof profile?.profile_type === "string" ? profile.profile_type : "";

        if (profile && profileType.toLowerCase() === "escort") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      } catch (error) {
        // If fetching profile fails or no profile exists, redirect to home
        router.push("/");
      }
    },
    onError: (error) => {
      errorMessageHandler(error as ErrorType);
    },
  });

  const onSubmit = (values: LoginValues) => {
    mutate(values);
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-md flex flex-col gap-10">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-4xl font-semibold text-primary-text sm:text-4xl">
            Welcome Back
          </h1>
          <p className=" text-text-gray text-base font-normal">
            Enter your details to sign in.
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
                or sign in with
              </span>
            </div>
          </div>

          <form className="flex flex-col gap-10" onSubmit={handleSubmit(onSubmit)}>
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
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      aria-invalid={Boolean(errors.password)}
                      className="pr-12"
                      {...register("password", {
                        required: "Password is required",
                      })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center text-white/70"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="text-xs text-red-500">
                      {errors.password.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right text-sm">
                <Link href="/auth/forgot-password" className="text-primary">
                  Forgot password?
                </Link>
              </div>
            </section>

            <Button
              type="submit"
              className="w-full rounded-[200px] text-white font-semibold text-base"
              size="default"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? "Signing in..." : "Login"}
            </Button>
          </form>

          <div className="text-center text-base font-normal">
            <span className="text-text-gray">Don&apos;t have an Account? </span>
            <Link
              href="/create-account"
              className="text-primary hover:underline font-medium"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
