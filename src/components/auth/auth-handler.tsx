"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { toast } from "react-hot-toast";

export function AuthHandler() {
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
            const currentPathWithSearch = `${window.location.pathname}${window.location.search}`;

            // If we're on the auth callback page, don't redirect
            if (pathname === "/auth/callback") {
                return;
            }

            // Handle errors
            if (error) {
                if (errorCode === "otp_expired") {
                    const target = "/forgot-password?expired=1";
                    if (currentPathWithSearch === target) {
                        window.history.replaceState({}, document.title, target);
                    } else {
                        window.location.replace(target);
                    }
                } else {
                    toast.error(errorDescription || "Authentication error occurred");
                    const target = "/login";
                    if (currentPathWithSearch === target) {
                        window.history.replaceState({}, document.title, target);
                    } else {
                        window.location.replace(target);
                    }
                }
                return;
            }

            // Let reset-password page handle valid recovery tokens directly.
            if (pathname === "/reset-password") {
                return;
            }

            // Handle password recovery
            if (type === "recovery") {
                // Use replace to preserve hash payload and avoid polluted browser history.
                window.location.replace(`/reset-password${hash}`);
                return;
            }
        }
    }, [pathname]);

    return null;
}
