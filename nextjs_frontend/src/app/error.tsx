"use client";

import React from "react";

/**
 * Global error boundary for the application.
 * Catches runtime errors during rendering and displays a fallback UI.
 * This prevents unhandled errors (like the 'stack' property TypeError)
 * from crashing the entire page during static export prerendering.
 */
// PUBLIC_INTERFACE
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-[#f9fafb] flex items-center justify-center px-4">
      <section className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4.832c-.77-1.333-2.694-1.333-3.464 0L3.34 16.168c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Something went wrong</h1>
        <p className="text-gray-500 mb-6">
          {error?.message || "An unexpected error occurred. Please try again."}
        </p>
        <button
          onClick={reset}
          className="inline-block px-6 py-3 bg-[#1F2937] text-white rounded-lg font-medium hover:bg-[#374151] transition-colors"
        >
          Try Again
        </button>
      </section>
    </main>
  );
}
