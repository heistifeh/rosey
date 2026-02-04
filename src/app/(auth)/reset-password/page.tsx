import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <div className="p-6 text-text-gray-opacity">Loading...</div>
            }
        >
            <ResetPasswordForm />
        </Suspense>
    );
}
