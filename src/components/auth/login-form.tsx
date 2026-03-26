"use client";

import { apiBuilder } from "@/api/builder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { errorMessageHandler, type ErrorType } from "@/utils/error-handler";
import { getPublicSiteOrigin } from "@/lib/public-site-origin";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";

type LoginValues = {
  email: string;
  password: string;
};

const resolveOnboardingRedirect = (params: {
  role?: string | null;
  onboardingStep?: string | null;
  hasProfile: boolean;
}) => {
  const role = (params.role ?? "").toLowerCase();
  const rawStep =
    typeof params.onboardingStep === "string" ? params.onboardingStep.trim() : "";

  if (!rawStep) {
    if (role === "escort") {
      return params.hasProfile ? "/general-information" : "/setup-account";
    }
    return "/";
  }

  const normalizedStep = rawStep.replace(/^\//, "").toLowerCase();

  if (normalizedStep === "completed") {
    return role === "escort" ? "/dashboard" : "/";
  }

  if (normalizedStep === "started") {
    return role === "escort"
      ? params.hasProfile
        ? "/general-information"
        : "/setup-account"
      : "/";
  }

  // Stored onboarding steps are internal paths; ensure they remain app-relative.
  return rawStep.startsWith("/") ? rawStep : `/${rawStep}`;
};

export function LoginForm() {
  const router = useRouter();
  const setAuthUser = useAuthStore((state) => state.setUser);
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
        const user = await apiBuilder.auth.getCurrentUser();
        const roleFromMetadata = (user?.user_metadata?.role ?? "").toLowerCase();
        if (roleFromMetadata === "admin") {
          router.push("/admin");
          return;
        }

        const requiresPasswordSetup = Boolean(
          user?.user_metadata?.password_setup_required,
        );
        if (requiresPasswordSetup) {
          const nextPath = roleFromMetadata === "escort" ? "/dashboard" : "/";
          router.push(`/set-password?next=${encodeURIComponent(nextPath)}`);
          return;
        }

        let onboardingStep = user?.user_metadata?.onboarding_step;
        let role = user?.user_metadata?.role;

        const profile = await apiBuilder.profiles.getMyProfile();

        // If profile exists...
        if (profile) {
          const profileType = typeof profile?.profile_type === "string" ? profile.profile_type : "";
          const isEscortProfile = profileType.toLowerCase() === "escort";

          // Repair missing auth metadata for claimed/legacy escort profiles.
          if (isEscortProfile && (role ?? "").toLowerCase() !== "escort") {
            try {
              await apiBuilder.auth.updateUserMetadata({
                role: "escort",
                onboarding_step: profile.onboarding_completed ? "completed" : "started",
              });
              role = "escort";
              onboardingStep = profile.onboarding_completed ? "completed" : "started";
            } catch (metadataError) {
              console.error("Failed to sync escort role metadata:", metadataError);
            }
          }

          setAuthUser({
            id: user?.id ?? profile.user_id ?? "",
            email:
              user?.email ??
              user?.user_metadata?.email ??
              profile.contact_email ??
              "",
            name: user?.user_metadata?.name,
            role: isEscortProfile ? "escort" : (role ?? "client"),
          });

          // Check if onboarding is completed
          if (profile.onboarding_completed) {
            if (isEscortProfile) {
              router.push("/dashboard");
            } else {
              router.push("/");
            }
            return;
          } else {
            // Profile exists but incomplete
            // If we have a stored step, go there. 
            // If NOT, and profile exists, the next logical step isn't 'setup-account' (which creates the profile), 
            // but likely 'general-information' or 'verify-identity' depending on flow.
            // Let's assume general-information is safe if they have a profile row but no specific step.
            const resumeRoute = resolveOnboardingRedirect({
              role,
              onboardingStep,
              hasProfile: true,
            });
            console.log("Profile incomplete, resuming to:", resumeRoute);
            router.push(resumeRoute);
            return;
          }
        }

        // If no profile found, check user metadata for role/step
        if (user?.id) {
          setAuthUser({
            id: user.id,
            email: user.email ?? user.user_metadata?.email ?? "",
            name: user.user_metadata?.name,
            role: role ?? "client",
          });
        }
        if (role === "escort") {
          const resumeRoute = resolveOnboardingRedirect({
            role,
            onboardingStep,
            hasProfile: false,
          });
          console.log("No profile found, resuming to:", resumeRoute);
          router.push(resumeRoute);
        } else {
          router.push("/");
        }

      } catch {
        // Fallback
        router.push("/");
      }
    },
    onError: (error) => {
      errorMessageHandler(error as ErrorType);
    },
  });

  const onSubmit = async (values: LoginValues) => {
    const normalizedEmail = values.email.trim().toLowerCase();
    mutate({ ...values, email: normalizedEmail });
  };

  const handleGoogleSignIn = async () => {
    const redirectUrl = `${getPublicSiteOrigin()}/auth/callback`;
    try {
      await apiBuilder.auth.signInWithGoogle(redirectUrl);
    } catch (error) {
      console.error("Google sign-in failed:", error);
      toast.error("Unable to continue with Google. Please try again.");
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
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
                <Link href="/forgot-password" className="text-primary">
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
    </>
  );
}
