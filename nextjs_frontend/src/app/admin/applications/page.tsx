"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { applicationsApi } from '@/services/api';
import { useNotifications } from '@/context/NotificationContext';

interface Application {
  id: string;
  applicant_name: string;
  email: string;
  program: string;
  status: string;
  date: string;
  gpa: string;
}

const mockApps: Application[] = [
  { id: '1', applicant_name: 'Alice Johnson', email: 'alice@example.com', program: 'Computer Science', status: 'submitted', date: '2025-01-20', gpa: '3.9' },
  { id: '2', applicant_name: 'Bob Smith', email: 'bob@example.com', program: 'Medicine (MBBS)', status: 'under_review', date: '2025-01-19', gpa: '3.7' },
  { id: '3', applicant_name: 'Carol Williams', email: 'carol@example.com', program: 'Business Admin', status: 'submitted', date: '2025-01-18', gpa: '3.5' },
  { id: '4', applicant_name: 'David Brown', email: 'david@example.com', program: 'Data Science', status: 'interview_scheduled', date: '2025-01-17', gpa: '3.8' },
  { id: '5', applicant_name: 'Eve Davis', email: 'eve@example.com', program: 'Psychology', status: 'submitted', date: '2025-01-16', gpa: '3.6' },
];

/**
 * Admin Application Review page for managing and reviewing incoming applications
 */
export default function AdminApplicationsPage() {
  const { addNotification } = useNotifications();
  const [applications, setApplications] = useState<Application[]>(mockApps);
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState<Application | null>(null);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    const fetchApps = async () => {
      setLoading(true);
      const res = await applicationsApi.listAll({ status: filterStatus || undefined });
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setApplications(res.data as unknown as Application[]);
      }
      setLoading(false);
    };
    fetchApps();
  }, [filterStatus]);

  const handleReview = async (status: string) => {
    if (!reviewModal) return;
    await applicationsApi.review(reviewModal.id, { status, remarks });
    setApplications(prev => prev.map(a => a.id === reviewModal.id ? { ...a, status } : a));
    addNotification({ type: 'success', message: `Application ${status === 'accepted' ? 'accepted' : status === 'rejected' ? 'rejected' : 'updated'}` });
    setReviewModal(null);
    setRemarks('');
  };

  const filtered = filterStatus ? applications.filter(a => a.status === filterStatus) : applications;

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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Application Review</h1>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="input-field w-48"
            aria-label="Filter by status"
          >
            <option value="">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="interview_scheduled">Interview Scheduled</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Applicant</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Program</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">GPA</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(app => (
                  <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-800">{app.applicant_name}</div>
                      <div className="text-xs text-gray-400">{app.email}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{app.program}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{app.gpa}</td>
                    <td className="py-3 px-4">
                      <span className={`badge ${statusColors[app.status] || 'badge-info'}`}>
                        {app.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{app.date}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => setReviewModal(app)} className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Review Modal */}
        {reviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setReviewModal(null)}>
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Review Application</h2>
              <div className="space-y-3 mb-4 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Applicant:</span><span className="font-medium">{reviewModal.applicant_name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Program:</span><span>{reviewModal.program}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">GPA:</span><span className="font-medium">{reviewModal.gpa}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Current Status:</span><span className={`badge ${statusColors[reviewModal.status]}`}>{reviewModal.status.replace(/_/g, ' ')}</span></div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea value={remarks} onChange={e => setRemarks(e.target.value)} className="input-field resize-none" rows={3} placeholder="Add review remarks..." />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setReviewModal(null)} className="btn-outline">Cancel</button>
                <button onClick={() => handleReview('rejected')} className="btn-primary !bg-red-600 hover:!bg-red-700">Reject</button>
                <button onClick={() => handleReview('interview_scheduled')} className="btn-outline !border-amber-500 !text-amber-700">Schedule Interview</button>
                <button onClick={() => handleReview('accepted')} className="btn-primary !bg-green-600 hover:!bg-green-700">Accept</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
