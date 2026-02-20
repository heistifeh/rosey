import type { Metadata } from "next";
import ProviderLayoutClient from "./provider-layout-client";

export const metadata: Metadata = {
  title: {
    default: "Provider Dashboard | Rosey",
    template: "%s | Rosey Dashboard",
  },
  description: "Manage profile, ads, wallet, and provider settings on Rosey.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      nosnippet: true,
    },
  },
};

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProviderLayoutClient>{children}</ProviderLayoutClient>;
}
