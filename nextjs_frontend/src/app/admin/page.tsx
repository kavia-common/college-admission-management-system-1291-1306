"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { adminApi } from '@/services/api';

/** Mock dashboard stats */
const mockStats = {
  total_applications: 342,
  pending_review: 78,
  accepted: 156,
  rejected: 42,
  interviews_scheduled: 28,
  total_revenue: 2850000,
  programs_count: 12,
  active_applicants: 265,
};

/** Mock recent applications */
const mockRecent = [
  { id: '1', applicant: 'Alice Johnson', program: 'Computer Science', status: 'submitted', date: '2025-01-20' },
  { id: '2', applicant: 'Bob Smith', program: 'Medicine (MBBS)', status: 'under_review', date: '2025-01-19' },
  { id: '3', applicant: 'Carol Williams', program: 'Business Admin', status: 'accepted', date: '2025-01-18' },
  { id: '4', applicant: 'David Brown', program: 'Data Science', status: 'interview_scheduled', date: '2025-01-17' },
  { id: '5', applicant: 'Eve Davis', program: 'Psychology', status: 'submitted', date: '2025-01-16' },
];

/**
 * Admin Dashboard page with statistics, recent applications, and overview
 */
export default function AdminDashboardPage() {
  const [stats, setStats] = useState(mockStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const res = await adminApi.getDashboardStats();
      if (res.data) {
        setStats(res.data as typeof mockStats);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Applications', value: stats.total_applications, color: 'bg-blue-50 text-blue-700', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { label: 'Pending Review', value: stats.pending_review, color: 'bg-amber-50 text-amber-700', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Accepted', value: stats.accepted, color: 'bg-green-50 text-green-700', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Rejected', value: stats.rejected, color: 'bg-red-50 text-red-700', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Interviews Scheduled', value: stats.interviews_scheduled, color: 'bg-purple-50 text-purple-700', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { label: 'Total Revenue', value: `$${stats.total_revenue.toLocaleString()}`, color: 'bg-teal-50 text-teal-700', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  const statusColors: Record<string, string> = {
    submitted: 'badge-info',
    under_review: 'badge-info',
    accepted: 'badge-success',
    rejected: 'badge-error',
    interview_scheduled: 'badge-warning',
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {statCards.map(card => (
                <div key={card.label} className="card flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.color}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{card.label}</p>
                    <p className="text-xl font-bold text-gray-800">{card.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Applications Table */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Applications</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Applicant</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Program</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockRecent.map(app => (
                      <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-800">{app.applicant}</td>
                        <td className="py-3 px-4 text-gray-600">{app.program}</td>
                        <td className="py-3 px-4">
                          <span className={`badge ${statusColors[app.status] || 'badge-info'}`}>
                            {app.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500">{app.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
