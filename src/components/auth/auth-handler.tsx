"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";

export function AuthHandler() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Only run on client side
        if (typeof window === "undefined") return;

        // Get the hash from the URL
        const hash = window.location.hash;

        // Check if we have an auth token or error in the hash
        if (hash && (hash.includes("access_token") || hash.includes("error"))) {
            const params = new URLSearchParams(hash.substring(1));
            const type = params.get("type");
            const error = params.get("error");
            const errorDescription = params.get("error_description");
            const errorCode = params.get("error_code");

            // If we're already on the reset-password page, don't redirect
            if (pathname === "/reset-password") {
                return;
            }

            // If we're on the auth callback page, don't redirect
            if (pathname === "/auth/callback") {
                return;
            }

            // If we're on forgot-password page, don't redirect
            if (pathname === "/forgot-password") {
                return;
            }

            // Handle errors
            if (error) {
                // Clean up the URL
                window.history.replaceState({}, document.title, window.location.pathname);

                // Show appropriate error message
                if (errorCode === "otp_expired") {
                    toast.error("Password reset link has expired. Please request a new one.");
                    router.push("/forgot-password");
                } else {
                    toast.error(errorDescription || "Authentication error occurred");
                    router.push("/login");
                }
                return;
            }

            // Handle password recovery
            if (type === "recovery") {
                // Use window.location.href to preserve the hash (router.push strips it)
                window.location.href = `/reset-password${hash}`;
                return;
            }
        }
    }, [router, pathname]);

    return null;
}
