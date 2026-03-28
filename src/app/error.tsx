"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
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
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-primary-bg px-4 text-center">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-2xl font-semibold text-primary-text md:text-3xl">
          Something went wrong
        </h1>
        <p className="max-w-sm text-sm text-text-gray-opacity md:text-base">
          An unexpected error occurred. If this keeps happening please contact
          support.
        </p>
        {error?.digest && (
          <p className="text-xs text-text-gray-opacity opacity-60">
            Error ID: {error.digest}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full border border-dark-border bg-input-bg px-5 py-2 text-sm font-semibold text-primary-text transition hover:border-primary/40"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
