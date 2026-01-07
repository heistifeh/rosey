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
    onSuccess: () => {
      toast.success("Welcome back.");
      reset();
      router.push("/dashboard");
    },
    onError: (error) => {
      errorMessageHandler(error as ErrorType);
    },
  });

  const onSubmit = (values: LoginValues) => {
    mutate(values);
  };

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
                  <Input
                    id="password"
                    type="password"
                    aria-invalid={Boolean(errors.password)}
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
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
              href="/auth/create-account"
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
