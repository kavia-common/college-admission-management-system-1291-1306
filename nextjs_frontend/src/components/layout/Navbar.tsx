"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

// PUBLIC_INTERFACE
/**
 * Navbar component displays the top navigation bar with role-based links.
 * Shows public links for unauthenticated users, applicant links for applicants,
 * and admin links for administrators.
 */
export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2 no-underline">
            <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-gray-800">AdmitEase</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:no-underline">
              Home
            </Link>
            <Link href="/programs" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:no-underline">
              Programs
            </Link>
            <Link href="/faqs" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:no-underline">
              FAQs
            </Link>
            <Link href="/contact" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:no-underline">
              Contact
            </Link>

            {isAuthenticated && !isAdmin && (
              <>
                <Link href="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:no-underline">
                  My Applications
                </Link>
                <Link href="/notifications" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:no-underline">
                  Notifications
                </Link>
              </>
            )}

            {isAdmin && (
              <Link href="/admin" className="px-3 py-2 rounded-md text-sm font-medium text-amber-700 hover:bg-amber-50 hover:no-underline">
                Admin Panel
              </Link>
            )}
          </div>

          {/* Right side: Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {user?.name}
                  <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
                    {user?.role}
                  </span>
                </span>
                <button onClick={logout} className="btn-outline text-sm !py-1.5 !px-3">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="btn-outline text-sm !py-1.5 !px-3 no-underline hover:no-underline">
                  Login
                </Link>
                <Link href="/register" className="btn-secondary text-sm !py-1.5 !px-4 no-underline hover:no-underline">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            <Link href="/" className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 hover:no-underline" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/programs" className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 hover:no-underline" onClick={() => setMenuOpen(false)}>Programs</Link>
            <Link href="/faqs" className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 hover:no-underline" onClick={() => setMenuOpen(false)}>FAQs</Link>
            <Link href="/contact" className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 hover:no-underline" onClick={() => setMenuOpen(false)}>Contact</Link>

            {isAuthenticated && !isAdmin && (
              <>
                <Link href="/dashboard" className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 hover:no-underline" onClick={() => setMenuOpen(false)}>My Applications</Link>
                <Link href="/notifications" className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 hover:no-underline" onClick={() => setMenuOpen(false)}>Notifications</Link>
              </>
            )}

            {isAdmin && (
              <Link href="/admin" className="block px-3 py-2 rounded-md text-sm text-amber-700 hover:bg-amber-50 hover:no-underline" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
            )}

            <div className="pt-3 border-t border-gray-200">
              {isAuthenticated ? (
                <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50">
                  Logout ({user?.name})
                </button>
              ) : (
                <div className="space-y-1">
                  <Link href="/login" className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 hover:no-underline" onClick={() => setMenuOpen(false)}>Login</Link>
                  <Link href="/register" className="block px-3 py-2 rounded-md text-sm text-amber-700 hover:bg-amber-50 hover:no-underline" onClick={() => setMenuOpen(false)}>Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
