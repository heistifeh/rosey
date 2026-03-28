"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body style={{ margin: 0, backgroundColor: "#0f0f10", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "sans-serif" }}>
        <div style={{ textAlign: "center", padding: "2rem", maxWidth: "400px" }}>
          <h1 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.75rem" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            A critical error occurred. Please reload the page or return to the homepage.
          </p>
          {error?.digest && (
            <p style={{ color: "#6b7280", fontSize: "0.75rem", marginBottom: "1rem" }}>
              Error ID: {error.digest}
            </p>
          )}
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={reset}
              style={{ background: "#e91e8c", color: "#fff", border: "none", borderRadius: "9999px", padding: "0.5rem 1.25rem", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer" }}
            >
              Try again
            </button>
            <button
              onClick={() => { window.location.href = "/"; }}
              style={{ background: "transparent", color: "#d1d5db", border: "1px solid #374151", borderRadius: "9999px", padding: "0.5rem 1.25rem", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer" }}
            >
              Go home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
