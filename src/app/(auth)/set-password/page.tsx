import { Suspense } from "react";
import { SetPasswordForm } from "@/components/auth/set-password-form";

export default function SetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-6 text-text-gray-opacity">Loading...</div>}>
      <SetPasswordForm />
    </Suspense>
  );
}

