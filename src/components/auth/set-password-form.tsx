"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { apiBuilder } from "@/api/builder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { errorMessageHandler, type ErrorType } from "@/utils/error-handler";

type SetPasswordValues = {
  password: string;
  confirmPassword: string;
};

const resolveNextPath = (value: string | null, fallback: string) => {
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
};

export function SetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = resolveNextPath(searchParams.get("next"), "/dashboard");
  const forceSetup = searchParams.get("force") === "1";

  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [canSetPassword, setCanSetPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SetPasswordValues>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    let active = true;

    const checkAccess = async () => {
      try {
        const user = await apiBuilder.auth.getCurrentUser();
        if (!active) return;

        if (!user?.id) {
          router.replace("/login");
          return;
        }

        const requiresPasswordSetup =
          forceSetup || Boolean(user?.user_metadata?.password_setup_required);
        if (!requiresPasswordSetup) {
          router.replace(nextPath);
          return;
        }

        setCanSetPassword(true);
      } catch {
        if (!active) return;
        router.replace("/login");
      } finally {
        if (active) {
          setIsCheckingAccess(false);
        }
      }
    };

    checkAccess();

    return () => {
      active = false;
    };
  }, [forceSetup, nextPath, router]);

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: (values: SetPasswordValues) =>
      apiBuilder.auth.updatePassword(values.password),
    mutationKey: ["auth", "setPasswordAfterClaim"],
    onSuccess: async () => {
      try {
        await apiBuilder.auth.updateUserMetadata({
          password_setup_required: false,
        });
      } catch (metadataError) {
        console.error("Failed to clear password setup requirement:", metadataError);
      }

      toast.success("Password set successfully.");
      reset();
      router.replace(nextPath);
    },
    onError: (error) => {
      errorMessageHandler(error as ErrorType);
    },
  });

  const onSubmit = (values: SetPasswordValues) => {
    if (values.password !== values.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    mutate(values);
  };

  if (isCheckingAccess || !canSetPassword) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-md text-center text-text-gray">
          Checking account status...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-md flex flex-col gap-8">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-4xl font-semibold text-primary-text sm:text-4xl">
            Set Your Password
          </h1>
          <p className="text-text-gray text-base font-normal">
            Before continuing, create a password for your account.
          </p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="password"
              className="text-sm font-normal text-primary-text"
            >
              New Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                aria-invalid={Boolean(errors.password)}
                className="pr-12"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
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

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-normal text-primary-text"
            >
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                aria-invalid={Boolean(errors.confirmPassword)}
                className="pr-12"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-white/70"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-xs text-red-500">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <Button
            type="submit"
            className="w-full rounded-[200px] text-white font-semibold text-base"
            size="default"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? "Saving..." : "Save Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
