import { Suspense } from "react";
import { AvailabilityForm } from "@/components/auth/availability-form";

export default function AvailabilityPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AvailabilityForm />
    </Suspense>
  );
}
