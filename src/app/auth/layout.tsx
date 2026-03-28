import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication Callback | Rosey",
  description: "Authentication callback handling for Rosey login flows.",
};

export default function AuthCallbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
