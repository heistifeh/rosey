"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { apiBuilder } from "@/api/builder";

export function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isVerifying, setIsVerifying] = useState(true);
    const [hasValidSession, setHasValidSession] = useState(false);

    useEffect(() => {
        const verifySession = async () => {
            try {
                const user = await apiBuilder.auth.getCurrentUser();

                if (user) {
                    console.log("✅ Valid session detected for password reset");
                    setHasValidSession(true);
                } else {
                    console.log("❌ No valid session found");
                    setHasValidSession(false);
                }
            } catch (error) {
                console.error("Error verifying session:", error);
                setHasValidSession(false);
            } finally {
                setIsVerifying(false);
            }
        };

        verifySession();
    }, []);

    if (isVerifying) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-full max-w-md flex flex-col gap-6 text-center">
                    <div className="animate-pulse">
                        <div className="h-4 bg-input-bg rounded w-3/4 mx-auto mb-4"></div>
                        <div className="h-4 bg-input-bg rounded w-1/2 mx-auto"></div>
                    </div>
                    <p className="text-text-gray text-base">Verifying reset link...</p>
                </div>
            </div>
        );
    }

    if (!hasValidSession) {
        return (
            <div className="flex flex-col items-center justify-center">
                <div className="w-full max-w-md flex flex-col gap-6 text-center">
                    <h1 className="text-4xl font-semibold text-primary-text">
                        Invalid Reset Link
                    </h1>
                    <p className="text-text-gray text-base">
                        This password reset link is invalid or has expired. Please request a
                        new one.
                    </p>
                    <button
                        onClick={() => router.push("/forgot-password")}
                        className="w-full rounded-[200px] bg-primary text-white font-semibold text-base py-3 hover:bg-primary/90 transition-colors"
                    >
                        Request New Link
                    </button>
                </div>
            </div>
        );
    }

    return <ResetPasswordFormContent />;
}


function ResetPasswordFormContent() {

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-md flex flex-col gap-6 text-center">
                <h1 className="text-4xl font-semibold text-primary-text">
                    Set New Password
                </h1>
                <p className="text-text-gray text-base">
                    Password reset form will appear here
                </p>
            </div>
        </div>
    );
}
