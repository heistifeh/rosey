import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope, Petemoss } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AuthHandler } from "@/components/auth/auth-handler";
import { SmartSuppScript } from "@/components/smartsupp-script";
import { getServerLocale } from "@/lib/i18n/server";
import {
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  SITE_TWITTER_HANDLE,
  SITE_URL,
  absoluteUrl,
} from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const petemoss = Petemoss({
  variable: "--font-petemoss",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} | Independent Escort Directory`,
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  applicationName: SITE_NAME,
  referrer: "origin-when-cross-origin",
  category: "adult escort directory",
  publisher: SITE_NAME,
  creator: SITE_NAME,
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    title: `${SITE_NAME} | Independent Escort Directory`,
    description: DEFAULT_DESCRIPTION,
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    images: [
      {
        url: absoluteUrl("/images/hero-bg.png"),
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} homepage`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Independent Escort Directory`,
    description: DEFAULT_DESCRIPTION,
    site: SITE_TWITTER_HANDLE,
    creator: SITE_TWITTER_HANDLE,
    images: [absoluteUrl("/images/hero-bg.png")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "bYfaU3gCdtyqmYFK8BsVCOeaAgzTxr8ciGWTCEMDm8s",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getServerLocale();
  const siteSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/images/rose.png"),
        },
        sameAs: ["https://x.com/rosey_link", "https://t.me/rosey_link"],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/search?city={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <html lang={locale}>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} ${petemoss.variable} antialiased`}
      >
        <Providers initialLocale={locale}>
          <AuthHandler />
          {children}
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
        <SmartSuppScript />
      </body>
    </html>
  );
}
