import React from 'react';
import Link from 'next/link';

// PUBLIC_INTERFACE
/**
 * Footer component displayed on all public-facing pages
 */
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-white">AdmitEase</span>
            </div>
            <p className="text-sm text-gray-400">
              Your gateway to higher education. Simplifying the college admission process for students and institutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/programs" className="text-sm text-gray-400 hover:text-white">Programs</Link></li>
              <li><Link href="/faqs" className="text-sm text-gray-400 hover:text-white">FAQs</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-400 hover:text-white">Contact Us</Link></li>
            </ul>
          </div>

          {/* For Applicants */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">For Applicants</h3>
            <ul className="space-y-2">
              <li><Link href="/register" className="text-sm text-gray-400 hover:text-white">Register</Link></li>
              <li><Link href="/login" className="text-sm text-gray-400 hover:text-white">Login</Link></li>
              <li><Link href="/dashboard" className="text-sm text-gray-400 hover:text-white">Track Application</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                admissions@admitease.edu
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +1 (555) 123-4567
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} AdmitEase College Admission System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
