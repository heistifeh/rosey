"use client";

import { apiBuilder } from "@/api/builder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { errorMessageHandler, type ErrorType } from "@/utils/error-handler";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { setAuthCookie } from "@/api/axios-config";

type ResetPasswordValues = {
    password: string;
    confirmPassword: string;
};

export function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        reset,
    } = useForm<ResetPasswordValues>({
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const password = watch("password");

    // Calculate password strength
    useEffect(() => {
        if (!password) {
            setPasswordStrength(0);
            return;
        }

        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (password.length >= 12) strength += 25;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 12.5;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 12.5;

        setPasswordStrength(strength);
    }, [password]);

    const getStrengthColor = () => {
        if (passwordStrength < 25) return "bg-red-500";
        if (passwordStrength < 50) return "bg-orange-500";
        if (passwordStrength < 75) return "bg-yellow-500";
        return "bg-green-500";
    };

    const getStrengthText = () => {
        if (passwordStrength < 25) return "Weak";
        if (passwordStrength < 50) return "Fair";
        if (passwordStrength < 75) return "Good";
        return "Strong";
    };

    const { mutate, isPending: isLoading } = useMutation({
        mutationFn: (values: ResetPasswordValues) =>
            apiBuilder.auth.updatePassword(values.password),
        mutationKey: ["auth", "updatePassword"],
        onSuccess: async () => {
            toast.success("Password updated successfully!");
            reset();

            // Get user info to determine redirect
            try {
                console.log("🔍 Fetching user profile for redirect...");
                const user = await apiBuilder.auth.getCurrentUser();
                console.log("✅ Current user:", user);

                const profile = await apiBuilder.profiles.getMyProfile();
                console.log("✅ User profile:", profile);
                console.log("🔍 Profile type:", profile?.profile_type);

                if (profile?.profile_type && typeof profile.profile_type === "string" && profile.profile_type.toLowerCase() === "escort") {
                    console.log("✅ Redirecting escort to /login");
                    toast.success("Please log in with your new password");
                    router.push("/login");
                } else {
                    console.log("✅ Redirecting client to /");
                    router.push("/");
                }
            } catch (error) {
                console.error("❌ Error fetching profile, redirecting to login:", error);
                toast.success("Please log in with your new password");
                router.push("/login");
            }
        },
        onError: (error) => {
            errorMessageHandler(error as ErrorType);
        },
    });

    const onSubmit = (values: ResetPasswordValues) => {
        if (values.password !== values.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        mutate(values);
    };

    // Check if we have the recovery token from URL params or hash
    const [hasValidToken, setHasValidToken] = useState(false);
    const [isCheckingToken, setIsCheckingToken] = useState(true);

    useEffect(() => {
        console.log("🔍 Reset Password - Checking for token...");

        // Check URL params first (type=recovery)
        const typeParam = searchParams?.get("type");
        console.log("🔍 Reset Password - URL param type:", typeParam);

        if (typeParam === "recovery") {
            console.log("✅ Reset Password - Found recovery type in URL params");
            setHasValidToken(true);
            setIsCheckingToken(false);
            return;
        }

        // Check for hash-based token (Supabase default)
        const hash = window.location.hash;
        console.log("🔍 Reset Password - Current hash:", hash);

        if (hash && hash.includes("access_token")) {
            console.log("✅ Reset Password - Found access_token in hash");
            // Extract token from hash
            const params = new URLSearchParams(hash.substring(1));
            const accessToken = params.get("access_token");
            const refreshToken = params.get("refresh_token");
            const expiresIn = params.get("expires_in");
            const type = params.get("type");

            console.log("🔍 Reset Password - Token details:", {
                hasAccessToken: !!accessToken,
                hasRefreshToken: !!refreshToken,
                type
            });

            if (accessToken && type === "recovery") {
                console.log("✅ Reset Password - Valid recovery token found!");

                // Decode the JWT to get user info
                try {
                    const base64Url = accessToken.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));

                    const payload = JSON.parse(jsonPayload);
                    console.log("✅ Decoded JWT payload:", payload);

                    // Extract user data from JWT
                    const user = {
                        id: payload.sub,
                        email: payload.email,
                        phone: payload.phone,
                        user_metadata: payload.user_metadata,
                        app_metadata: payload.app_metadata,
                        role: payload.role,
                    };

                    // Save the session to cookie with user data
                    setAuthCookie({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                        expires_in: expiresIn ? parseInt(expiresIn) : 3600,
                        token_type: "bearer",
                        user: user
                    });

                    console.log("✅ Reset Password - Session saved to cookie with user data");
                } catch (decodeError) {
                    console.error("❌ Failed to decode JWT:", decodeError);
                    // Save without user data as fallback
                    setAuthCookie({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                        expires_in: expiresIn ? parseInt(expiresIn) : 3600,
                        token_type: "bearer"
                    });
                }

                // Token is valid
                setHasValidToken(true);
                // Clean up the URL
                window.history.replaceState({}, document.title, window.location.pathname);
            } else {
                console.log("❌ Reset Password - Invalid token or wrong type");
                setHasValidToken(false);
            }
        } else {
            console.log("❌ Reset Password - No hash or access_token found");
            setHasValidToken(false);
        }

        setIsCheckingToken(false);
    }, []); // Remove searchParams dependency to run only once on mount

    if (isCheckingToken) {
        return (
            <div className="flex flex-col items-center justify-center">
                <div className="w-full max-w-md flex flex-col gap-6 text-center">
                    <p className="text-text-gray text-base">Verifying reset link...</p>
                </div>
            </div>
        );
    }

    if (!hasValidToken) {
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
                    <Button
                        onClick={() => router.push("/forgot-password")}
                        className="w-full rounded-[200px] text-white font-semibold text-base"
                    >
                        Request New Link
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-md flex flex-col gap-10">
                <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-4xl font-semibold text-primary-text sm:text-4xl">
                        Set New Password
                    </h1>
                    <p className="text-text-gray text-base font-normal">
                        Your new password must be different from previously used passwords.
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
                                placeholder="Enter new password"
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

                        {/* Password Strength Indicator */}
                        {password && (
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-text-gray">Password strength:</span>
                                    <span className={`font-medium ${passwordStrength < 50 ? "text-red-500" :
                                        passwordStrength < 75 ? "text-yellow-500" :
                                            "text-green-500"
                                        }`}>
                                        {getStrengthText()}
                                    </span>
                                </div>
                                <div className="h-2 bg-input-bg rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                                        style={{ width: `${passwordStrength}%` }}
                                    />
                                </div>
                            </div>
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
                                placeholder="Confirm new password"
                                aria-invalid={Boolean(errors.confirmPassword)}
                                className="pr-12"
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (value) =>
                                        value === password || "Passwords do not match",
                                })}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center text-white/70"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                aria-label={
                                    showConfirmPassword ? "Hide password" : "Show password"
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
                        {!errors.confirmPassword &&
                            watch("confirmPassword") &&
                            watch("confirmPassword") === password && (
                                <div className="flex items-center gap-1 text-xs text-green-500">
                                    <CheckCircle2 className="h-3 w-3" />
                                    <span>Passwords match</span>
                                </div>
                            )}
                    </div>

                    <div className="p-4 rounded-xl bg-input-bg border border-dark-border">
                        <p className="text-xs text-text-gray">
                            Password must contain at least 8 characters, including uppercase,
                            lowercase, and numbers.
                        </p>
                    </div>

                    <Button
                        type="submit"
                        className="w-full rounded-[200px] text-white font-semibold text-base"
                        size="default"
                        disabled={isSubmitting || isLoading}
                    >
                        {isSubmitting || isLoading ? "Updating..." : "Reset Password"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
