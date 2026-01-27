"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EmailConfirmationModal } from "@/components/modals/email-confirmation-modal";
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
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type CreateAccountValues = {
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

export function CreateAccountForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    reset,
  } = useForm<CreateAccountValues>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const [showModal, setShowModal] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: (values: CreateAccountValues & { role?: string }) =>
      apiBuilder.auth.signUp({
        email: values.email,
        password: values.password,
        data: {
          role: values.role || "escort", // Default to escort if not specified
        },
      }),
    mutationKey: ["auth", "signUp"],
    onSuccess: (data, variables) => {
      console.log("Signup success response:", data);

      // Handle Supabase Email Enumeration Protection (Fake Success)
      if (data?.identities && data.identities.length === 0) {
        toast.error("This email is already registered. Please log in instead.");
        return;
      }

      setSubmittedEmail(variables.email);
      setShowModal(true);
      reset();
    },
    onError: (error: any) => {
      console.error("Signup error response:", error);
      if (
        error?.response?.status === 422 ||
        error?.message?.toLowerCase().includes("registered") ||
        error?.response?.data?.msg?.toLowerCase().includes("registered")
      ) {
        toast.error("This email is already registered. Please log in instead.");
        return;
      }
      errorMessageHandler(error as ErrorType);
    },
  });

  const onSubmit = (values: CreateAccountValues) => {
    mutate({ ...values, role: "escort" });
  };

  const onClientSubmit = (values: CreateAccountValues) => {
    mutate({ ...values, role: "client" });
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      <EmailConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onVerify={() => {
          setShowModal(false);
          router.push(`/enter-otp?email=${encodeURIComponent(submittedEmail)}`);
        }}
      />
      <div className="w-full min-h-screen bg-primary-bg flex flex-col lg:flex-row">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 md:px-[60px] py-6 lg:py-4 h-screen overflow-y-auto">
          <div className="flex flex-col gap-6 max-w-md mx-auto w-full">
            <div className="flex justify-start mb-2">
              <Link href="/" className="inline-flex items-center">
                <Image
                  src="/images/logo.svg"
                  alt="Rosey"
                  width={120}
                  height={32}
                  className="h-auto"
                  priority
                />
              </Link>
            </div>

            <div className="lg:hidden mb-2">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold text-white">
                  Welcome to{" "}
                  <span className="text-primary petemoss text-[32px]">
                    Rosey
                  </span>
                </h2>
                <p className="text-text-gray text-xs font-normal">
                  A platform for adults providing companionship and paid intimate
                  services.
                </p>
              </div>
            </div>

            <div className="w-full flex flex-col gap-4">
              <div className="hidden lg:flex flex-col gap-1 items-start">
                <h1 className="text-2xl font-semibold text-primary-text">
                  Create Your Account
                </h1>
                <p className="text-text-gray text-sm font-normal">
                  Enter your details to create an account.
                </p>
              </div>

              <Button
                variant="outline"
                size="default"
                className="w-full justify-center rounded-[200px] bg-input-bg text-sm font-normal h-10"
              >
                <Image
                  src="/svg/google.svg"
                  alt="Google"
                  width={18}
                  height={18}
                  className="h-5 w-5 mr-2"
                />
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border-gray"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-primary-bg text-text-gray">
                    or sign up with
                  </span>
                </div>
              </div>

              <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor="email"
                      className="text-sm font-normal text-primary-text"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      className="h-10"
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

                  <div className="flex flex-col gap-1.5">
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
                        className="pr-12 h-10"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center text-white/70"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
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

                  <div className="flex flex-col gap-1.5">
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
                        className="pr-12 h-10"
                        {...register("confirmPassword", {
                          required: "Confirm password is required",
                          validate: (value) =>
                            value === getValues("password") ||
                            "Passwords do not match",
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
                    className="text-xs text-primary-text font-normal cursor-pointer leading-tight"
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

                <div className="flex flex-col gap-3 mt-1">
                  <Button
                    type="submit"
                    className="w-full rounded-[200px] text-white font-semibold text-sm h-11"
                    size="default"
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting || isLoading ? "Creating..." : "Create Account"}
                  </Button>

                  <Button
                    type="button"
                    className="w-full rounded-[200px] text-[#FCFCFD] font-semibold text-sm bg-[#222222] hover:bg-[#1a1a1a] h-11"
                    size="default"
                    onClick={handleSubmit(onClientSubmit)}
                    disabled={isSubmitting || isLoading}
                  >
                    Sign Up as a Client Instead
                  </Button>
                </div>
              </form>

              <div className="text-center text-sm font-normal flex items-center justify-center gap-1">
                <span className="text-text-gray">Already have an Account? </span>
                <Link
                  href="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Login
                </Link>
                <span className="text-text-gray">or</span>
                <Link
                  href="/claim-profile"
                  className="text-primary hover:underline font-medium"
                >
                  Claim Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div
          className="hidden lg:flex lg:w-1/2 relative bg-cover bg-no-repeat bg-position-[center_top]"
          style={{ backgroundImage: "url('/images/setup-bg.png')" }}
        >
          <div className="absolute inset-0 flex items-end px-[52px] pb-[60px]">
            <div className="flex flex-col gap-4 max-w-md">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl xl:text-4xl font-semibold text-white">
                  Welcome to{" "}
                  <span className="text-primary petemoss text-[40px] font-normal">
                    {" "}
                    Rosey
                  </span>
                </h2>
                <p className="text-white text-sm xl:text-base font-normal leading-relaxed">
                  A platform for adults providing companionship and paid
                  intimate services, created by those who understand the work.
                  Gain control, visibility, and a safe space to reach clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
