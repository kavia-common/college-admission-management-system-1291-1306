"use client";

import React from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

// PUBLIC_INTERFACE
/**
 * AdminLayout wraps admin pages with sidebar navigation and top navbar
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f9fafb]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Admin Access Required</h2>
            <p className="text-gray-500 mb-4">You need admin privileges to access this page.</p>
            <Link href="/login" className="btn-secondary inline-block no-underline hover:no-underline">Login as Admin</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      <Navbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
