"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/layout/PublicLayout';
import { useAuth } from '@/context/AuthContext';
import { applicationsApi } from '@/services/api';

/**
 * Status badge component for application status display
 */
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: 'badge-warning',
    submitted: 'badge-info',
    under_review: 'badge-info',
    interview_scheduled: 'badge-warning',
    accepted: 'badge-success',
    rejected: 'badge-error',
    waitlisted: 'badge-warning',
  };
  const labels: Record<string, string> = {
    draft: 'Draft',
    submitted: 'Submitted',
    under_review: 'Under Review',
    interview_scheduled: 'Interview Scheduled',
    accepted: 'Accepted',
    rejected: 'Rejected',
    waitlisted: 'Waitlisted',
  };
  return <span className={`badge ${styles[status] || 'badge-info'}`}>{labels[status] || status}</span>;
}

/**
 * Mock applications data
 */
const mockApplications = [
  { id: '1', program_name: 'Computer Science', program_id: '1', status: 'submitted', created_at: '2025-01-15', updated_at: '2025-01-16', payment_status: 'paid' },
  { id: '2', program_name: 'Data Science', program_id: '6', status: 'draft', created_at: '2025-01-20', updated_at: '2025-01-20', payment_status: 'pending' },
];

/**
 * Applicant Dashboard page showing all applications and their statuses
 */
export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const [applications, setApplications] = useState(mockApplications);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      setLoading(true);
      const res = await applicationsApi.list();
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setApplications(res.data as typeof mockApplications);
      }
      setLoading(false);
    };
    fetchApps();
  }, []);

  if (!isAuthenticated) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Please login to view your dashboard</h2>
            <Link href="/login" className="btn-secondary mt-4 inline-block no-underline hover:no-underline">Login</Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name || 'Applicant'}</h1>
            <p className="text-gray-500 mt-1">Manage your applications and track their progress</p>
          </div>
          <Link href="/apply" className="btn-secondary mt-4 sm:mt-0 text-center no-underline hover:no-underline">
            + New Application
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Applications', value: applications.length, color: 'text-gray-800' },
            { label: 'Submitted', value: applications.filter(a => a.status !== 'draft').length, color: 'text-blue-600' },
            { label: 'Accepted', value: applications.filter(a => a.status === 'accepted').length, color: 'text-green-600' },
            { label: 'Pending', value: applications.filter(a => a.status === 'draft').length, color: 'text-amber-600' },
          ].map(stat => (
            <div key={stat.label} className="card text-center">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Applications List */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">My Applications</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 mb-4">No applications yet</p>
              <Link href="/apply" className="btn-secondary no-underline hover:no-underline">Start Your First Application</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Program</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Payment</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Applied On</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-800">{app.program_name}</td>
                      <td className="py-3 px-4"><StatusBadge status={app.status} /></td>
                      <td className="py-3 px-4">
                        <span className={`badge ${app.payment_status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                          {app.payment_status === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{app.created_at}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Link href={`/application?id=${app.id}`} className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                            View
                          </Link>
                          {app.status === 'draft' && (
                            <Link href={`/apply?id=${app.id}`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                              Continue
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
