import type { Metadata } from "next";
import { SetupAccountForm } from "@/components/auth/setup-account-form";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Setup Account | Rosey",
  description: "Complete account setup to continue onboarding on Rosey.",
  path: "/setup-account",
  noIndex: true,
});

export default function SetupAccountPage() {
  return <SetupAccountForm />;
}
