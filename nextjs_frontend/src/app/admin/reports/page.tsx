"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { adminApi } from '@/services/api';

const reportTypes = [
  { key: 'applications_summary', label: 'Applications Summary', description: 'Overview of all applications by status and program' },
  { key: 'program_wise', label: 'Program-wise Report', description: 'Detailed breakdown by program' },
  { key: 'revenue', label: 'Revenue Report', description: 'Application fee collection summary' },
  { key: 'demographics', label: 'Demographics Report', description: 'Applicant demographics and distribution' },
];

/**
 * Admin Reports page with various report types and data visualization
 */
export default function AdminReportsPage() {
  const [selectedReport, setSelectedReport] = useState('applications_summary');
  const [loading, setLoading] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  const handleGenerateReport = async () => {
    setLoading(true);
    await adminApi.getReports(selectedReport);
    setLoading(false);
    setReportGenerated(true);
  };

  // Mock report data
  const applicationsSummary = {
    total: 342,
    byStatus: [
      { status: 'Submitted', count: 78, percentage: 23 },
      { status: 'Under Review', count: 66, percentage: 19 },
      { status: 'Interview Scheduled', count: 28, percentage: 8 },
      { status: 'Accepted', count: 128, percentage: 37 },
      { status: 'Rejected', count: 42, percentage: 13 },
    ],
    byProgram: [
      { program: 'Computer Science', count: 95 },
      { program: 'Business Admin', count: 68 },
      { program: 'Medicine', count: 52 },
      { program: 'Data Science', count: 48 },
      { program: 'Psychology', count: 42 },
      { program: 'Electrical Eng.', count: 37 },
    ],
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Reports & Analytics</h1>

        {/* Report Type Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {reportTypes.map(rt => (
            <button
              key={rt.key}
              onClick={() => { setSelectedReport(rt.key); setReportGenerated(false); }}
              className={`card text-left transition-all ${selectedReport === rt.key ? '!border-amber-500 !bg-amber-50' : 'hover:shadow-md'}`}
            >
              <h3 className="font-medium text-gray-800 text-sm">{rt.label}</h3>
              <p className="text-xs text-gray-500 mt-1">{rt.description}</p>
            </button>
          ))}
        </div>

        <div className="flex justify-end mb-6">
          <button onClick={handleGenerateReport} className="btn-secondary" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>

        {/* Report Content */}
        {reportGenerated && selectedReport === 'applications_summary' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Applications by Status</h2>
              <div className="space-y-3">
                {applicationsSummary.byStatus.map(item => (
                  <div key={item.status} className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 w-40">{item.status}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                      <div
                        className="h-6 rounded-full bg-amber-500 flex items-center justify-end pr-2"
                        style={{ width: `${item.percentage}%`, minWidth: '40px' }}
                      >
                        <span className="text-xs text-white font-medium">{item.count}</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 w-12 text-right">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Applications by Program</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {applicationsSummary.byProgram.map(item => (
                  <div key={item.program} className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">{item.program}</p>
                    <p className="text-2xl font-bold text-gray-800">{item.count}</p>
                    <p className="text-xs text-gray-400">{Math.round((item.count / applicationsSummary.total) * 100)}% of total</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {reportGenerated && selectedReport === 'revenue' && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Revenue Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-500">Total Collected</p>
                <p className="text-2xl font-bold text-green-700">$2,850,000</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <p className="text-sm text-gray-500">Pending Payments</p>
                <p className="text-2xl font-bold text-amber-700">$185,000</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-500">Average Fee</p>
                <p className="text-2xl font-bold text-blue-700">$14,250</p>
              </div>
            </div>
          </div>
        )}

        {reportGenerated && selectedReport === 'program_wise' && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Program-wise Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Program</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Applications</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Accepted</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Rejected</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Pending</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Acceptance Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { program: 'Computer Science', apps: 95, accepted: 42, rejected: 12, pending: 41 },
                    { program: 'Business Admin', apps: 68, accepted: 30, rejected: 8, pending: 30 },
                    { program: 'Medicine', apps: 52, accepted: 28, rejected: 10, pending: 14 },
                    { program: 'Data Science', apps: 48, accepted: 15, rejected: 5, pending: 28 },
                    { program: 'Psychology', apps: 42, accepted: 13, rejected: 7, pending: 22 },
                  ].map(row => (
                    <tr key={row.program} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-800">{row.program}</td>
                      <td className="py-3 px-4 text-gray-600">{row.apps}</td>
                      <td className="py-3 px-4 text-green-600">{row.accepted}</td>
                      <td className="py-3 px-4 text-red-600">{row.rejected}</td>
                      <td className="py-3 px-4 text-amber-600">{row.pending}</td>
                      <td className="py-3 px-4 font-medium">{Math.round((row.accepted / row.apps) * 100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportGenerated && selectedReport === 'demographics' && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Demographics Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Gender Distribution</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Male', value: 58, color: 'bg-blue-500' },
                    { label: 'Female', value: 38, color: 'bg-pink-500' },
                    { label: 'Other', value: 4, color: 'bg-purple-500' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-16">{item.label}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-4">
                        <div className={`h-4 rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                      </div>
                      <span className="text-sm text-gray-500 w-12 text-right">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Top Locations</h3>
                <div className="space-y-2">
                  {[
                    { location: 'New York', count: 45 },
                    { location: 'California', count: 38 },
                    { location: 'Texas', count: 32 },
                    { location: 'Florida', count: 28 },
                    { location: 'International', count: 25 },
                  ].map(item => (
                    <div key={item.location} className="flex justify-between items-center py-1.5 border-b border-gray-100">
                      <span className="text-sm text-gray-600">{item.location}</span>
                      <span className="text-sm font-medium text-gray-800">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {!reportGenerated && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-gray-500">Select a report type and click &quot;Generate Report&quot; to view data.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
