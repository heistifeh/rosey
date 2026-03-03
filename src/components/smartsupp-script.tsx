"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

export function SmartSuppScript() {
  const pathname = usePathname();

  // Skip the chat widget on dashboard and auth/onboarding routes
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/create-account") ||
    pathname.startsWith("/general-information") ||
    pathname.startsWith("/profile-setup") ||
    pathname.startsWith("/rates") ||
    pathname.startsWith("/availability") ||
    pathname.startsWith("/upload-pictures") ||
    pathname.startsWith("/upload-id") ||
    pathname.startsWith("/verify-identity") ||
    pathname.startsWith("/enable-2fa") ||
    pathname.startsWith("/setup-account") ||
    pathname.startsWith("/setup-profile")
  ) {
    return null;
  }

  return (
    <>
      <Script id="smartsupp-chat" strategy="afterInteractive">
        {`
          var _smartsupp = window._smartsupp || {};
          _smartsupp.key = 'b58ac1b21861c5a6c49ddc529a61cee15ff800de';
          window._smartsupp = _smartsupp;
          window.smartsupp || (function(d) {
            var s, c, o = window.smartsupp = function() { o._.push(arguments); };
            o._ = [];
            s = d.getElementsByTagName('script')[0];
            c = d.createElement('script');
            c.type = 'text/javascript';
            c.charset = 'utf-8';
            c.async = true;
            c.src = 'https://www.smartsuppchat.com/loader.js?';
            s.parentNode.insertBefore(c, s);
          })(document);
        `}
      </Script>
      <noscript>
        Powered by{" "}
        <a
          href="https://www.smartsupp.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Smartsupp
        </a>
      </noscript>
    </>
  );
}
