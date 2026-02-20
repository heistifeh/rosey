import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication Callback | Rosey",
  description: "Authentication callback handling for Rosey login flows.",
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

export default function AuthCallbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
