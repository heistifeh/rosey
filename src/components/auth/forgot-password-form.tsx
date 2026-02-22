"use client";

import { apiBuilder } from "@/api/builder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { errorMessageHandler, type ErrorType } from "@/utils/error-handler";
import { getPublicSiteOrigin } from "@/lib/public-site-origin";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";

type ForgotPasswordValues = {
    email: string;
};

export function ForgotPasswordForm() {
    const searchParams = useSearchParams();
    const isExpiredResetLink = searchParams.get("expired") === "1";
    const [emailSent, setEmailSent] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        getValues,
    } = useForm<ForgotPasswordValues>({
        defaultValues: {
            email: "",
        },
    });

    const { mutate, isPending: isLoading } = useMutation({
        mutationFn: (values: ForgotPasswordValues) => {
            const redirectUrl = `${getPublicSiteOrigin()}/reset-password`;
            return apiBuilder.auth.resetPassword(values.email, redirectUrl);
        },
        mutationKey: ["auth", "resetPassword"],
        onSuccess: () => {
            setEmailSent(true);
            toast.success("Password reset email sent!");
        },
        onError: (error) => {
            errorMessageHandler(error as ErrorType);
        },
    });

    const onSubmit = (values: ForgotPasswordValues) => {
        mutate(values);
    };

    if (emailSent) {
        return (
            <div className="flex flex-col items-center justify-center">
                <div className="w-full max-w-md flex flex-col gap-10">
                    <div className="flex flex-col gap-6 text-center">
                        <div className="mx-auto p-4 rounded-full bg-primary/10">
                            <Mail className="h-12 w-12 text-primary" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h1 className="text-4xl font-semibold text-primary-text">
                                Check Your Email
                            </h1>
                            <p className="text-text-gray text-base font-normal">
                                We've sent a password reset link to{" "}
                                <span className="text-primary font-medium">
                                    {getValues("email")}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="p-4 rounded-xl bg-input-bg border border-dark-border">
                            <p className="text-sm text-text-gray">
                                Didn't receive the email? Check your spam folder or{" "}
                                <button
                                    onClick={() => setEmailSent(false)}
                                    className="text-primary hover:underline font-medium"
                                >
                                    try again
                                </button>
                            </p>
                        </div>

                        <Link
                            href="/login"
                            className="flex items-center justify-center gap-2 text-primary hover:underline text-base font-medium"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to login
                        </Link>
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
                        Forgot Password?
                    </h1>
                    <p className="text-text-gray text-base font-normal">
                        No worries, we'll send you reset instructions.
                    </p>
                </div>

                <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
                    {isExpiredResetLink && (
                        <div className="rounded-xl border border-[#FEC84B]/40 bg-[#FEC84B]/10 p-3">
                            <p className="text-sm text-primary-text">
                                Your reset link expired or has already been used. Request a fresh link below.
                            </p>
                        </div>
                    )}
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

                    <Button
                        type="submit"
                        className="w-full rounded-[200px] text-white font-semibold text-base"
                        size="default"
                        disabled={isSubmitting || isLoading}
                    >
                        {isSubmitting || isLoading ? "Sending..." : "Reset Password"}
                    </Button>

                    <Link
                        href="/login"
                        className="flex items-center justify-center gap-2 text-primary hover:underline text-base font-medium"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to login
                    </Link>
                </form>
            </div>
        </div>
    );
}
