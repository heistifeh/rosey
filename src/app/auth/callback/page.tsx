"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setAuthCookie } from "@/api/axios-config";
import { apiBuilder } from "@/api/builder";
import { toast } from "react-hot-toast";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const handleCallback = async () => {
            const routeAuthenticatedUser = async (user: any) => {
                // Determine redirect based on user metadata
                let role = user?.user_metadata?.role;
                let onboardingStep = user?.user_metadata?.onboarding_step;

                console.log("🔍 User role:", role, "Onboarding step:", onboardingStep);

                // If user is new (no role set), check localStorage for intended role
                if (!role) {
                    const intendedRoleRaw = localStorage.getItem('oauth_intended_role');
                    const intendedRole =
                        intendedRoleRaw === "escort" || intendedRoleRaw === "client"
                            ? intendedRoleRaw
                            : null;
                    localStorage.removeItem("oauth_intended_role");
                    console.log("🔍 Intended role from localStorage:", intendedRole);

                    if (intendedRole) {
                        role = intendedRole;
                        onboardingStep = intendedRole === "escort" ? "started" : "completed";

                        // Update user metadata with the intended role
                        try {
                            console.log("✅ Updating user metadata with role:", intendedRole);
                            await apiBuilder.auth.updateUserMetadata({
                                role: intendedRole,
                                onboarding_step: intendedRole === 'escort' ? 'started' : 'completed'
                            });
                            console.log("✅ User metadata updated successfully");
                        } catch (updateError) {
                            console.error("❌ Failed to update user metadata:", updateError);
                        }
                    }

                    // If still no role, default to client
                    if (!role) {
                        console.log("⚠️ No role found, defaulting to client");
                        role = 'client';
                    }
                }

                // If escort and onboarding not complete
                if (role === "escort" && onboardingStep !== "completed") {
                    const isNewUser = onboardingStep === 'started';

                    console.log("🔍 Escort redirect check:");
                    console.log("   - onboardingStep:", onboardingStep);
                    console.log("   - isNewUser:", isNewUser);
                    console.log("   - Comparison:", `'${onboardingStep}' === 'started'`, onboardingStep === 'started');

                    if (isNewUser) {
                        console.log("✅ New escort - redirecting to identity verification");
                        toast.success("Welcome! Let's verify your identity");
                        router.push("/verify-identity");
                    } else {
                        console.log("✅ Returning escort with incomplete profile");
                        toast.success("Welcome back! Please complete your profile");
                        router.push("/general-information?tab=profile");
                    }
                    return;
                }

                // If escort and onboarding complete
                if (role === "escort") {
                    console.log("✅ Redirecting escort to dashboard");
                    toast.success("Welcome back!");
                    router.push("/dashboard");
                    return;
                }

                // Client or default
                console.log("✅ Redirecting to home");
                toast.success("Welcome!");
                router.push("/");
            };

            try {
                const hash = window.location.hash;
                const queryParams = new URLSearchParams(window.location.search);
                const hashParams = hash ? new URLSearchParams(hash.substring(1)) : null;
                console.log("🔍 Auth Callback - Hash:", hash);

                const hashError = hashParams?.get("error");
                const hashErrorDescription = hashParams?.get("error_description");
                const queryError = queryParams.get("error");
                const queryErrorDescription = queryParams.get("error_description");
                const error = hashError || queryError;
                const errorDescription = hashErrorDescription || queryErrorDescription;

                if (error) {
                    console.error("❌ Auth error:", error, errorDescription);
                    toast.error(errorDescription || "Authentication failed");
                    router.push("/login");
                    return;
                }

                const hashType = hashParams?.get("type");
                if (hashType === "recovery") {
                    console.log("🔄 Recovery type detected, redirecting to reset-password");
                    router.push(`/reset-password${hash}`);
                    return;
                }

                const code = queryParams.get("code");
                if (code) {
                    console.log("✅ OAuth code found, exchanging for session (PKCE)...");
                    const supabase = getSupabaseBrowserClient();
                    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

                    if (exchangeError || !data.session?.access_token) {
                        console.error("❌ Code exchange failed:", exchangeError);
                        toast.error("Authentication failed");
                        router.push("/login");
                        return;
                    }

                    setAuthCookie(data.session);
                    console.log("✅ Session saved to cookie (PKCE)");
                    await routeAuthenticatedUser(data.session.user);
                    return;
                }

                const accessToken = hashParams?.get("access_token");
                const refreshToken = hashParams?.get("refresh_token");
                const expiresIn = hashParams?.get("expires_in");

                if (accessToken) {
                    console.log("✅ Access token found, saving session...");

                    try {
                        const base64Url = accessToken.split('.')[1];
                        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                        }).join(''));

                        const payload = JSON.parse(jsonPayload);
                        console.log("✅ Decoded JWT:", payload);

                        const user = {
                            id: payload.sub,
                            email: payload.email,
                            phone: payload.phone,
                            user_metadata: payload.user_metadata,
                            app_metadata: payload.app_metadata,
                            role: payload.role,
                        };

                        setAuthCookie({
                            access_token: accessToken,
                            refresh_token: refreshToken,
                            expires_in: expiresIn ? parseInt(expiresIn) : 3600,
                            token_type: "bearer",
                            user: user
                        });

                        console.log("✅ Session saved to cookie (hash)");
                        await routeAuthenticatedUser(user);
                        return;
                    } catch (decodeError) {
                        console.error("❌ Failed to decode JWT:", decodeError);
                        toast.error("Authentication failed");
                        router.push("/login");
                        return;
                    }
                }

                console.log("❌ No OAuth code or access token found");
                router.push("/");
            } catch (error) {
                console.error("❌ Callback error:", error);
                toast.error("Authentication failed");
                router.push("/login");
            } finally {
                setIsProcessing(false);
            }
        };

        handleCallback();
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-primary-bg">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-text-gray">
                    {isProcessing ? "Processing authentication..." : "Redirecting..."}
                </p>
            </div>
        </div>
    );
}
