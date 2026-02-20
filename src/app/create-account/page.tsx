import type { Metadata } from "next";
import { CreateAccountForm } from "@/components/auth/create-account-form";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Create Account | Rosey",
  description: "Create your Rosey account to browse, save favorites, and manage profile access.",
  path: "/create-account",
  noIndex: true,
});

export default function CreateAccountPage() {
  return <CreateAccountForm />;
}
