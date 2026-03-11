import type { Metadata } from "next";
import React from "react";
import ClientProviders from "@/components/layout/ClientProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "AdmitEase - College Admission System",
  description: "Simplifying the college admission process for students and institutions",
};

/**
 * Root layout wrapping the entire application with providers and global layout elements.
 * Uses ClientProviders for client-side context (auth, notifications).
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
