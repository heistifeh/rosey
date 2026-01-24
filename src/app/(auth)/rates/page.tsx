import { Suspense } from "react";
import { RatesForm } from "@/components/auth/rates-form";

export default function RatesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RatesForm />
    </Suspense>
  );
}
