import { ProfileSetupTabs } from "@/components/auth/profile-setup-tabs";
import { Suspense } from "react";

export default function GeneralInformationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileSetupTabs />
    </Suspense>
  );
}

