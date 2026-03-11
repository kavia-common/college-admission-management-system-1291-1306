"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { adminApi } from '@/services/api';
import { useNotifications } from '@/context/NotificationContext';

interface Interview {
  id: string;
  applicant_name: string;
  program: string;
  date: string;
  time: string;
  status: string;
  interviewer: string;
}

const mockInterviews: Interview[] = [
  { id: '1', applicant_name: 'Alice Johnson', program: 'Computer Science', date: '2025-01-25', time: '10:00 AM', status: 'scheduled', interviewer: 'Dr. Smith' },
  { id: '2', applicant_name: 'David Brown', program: 'Data Science', date: '2025-01-26', time: '2:00 PM', status: 'scheduled', interviewer: 'Prof. Jones' },
  { id: '3', applicant_name: 'Frank Miller', program: 'Medicine (MBBS)', date: '2025-01-22', time: '11:00 AM', status: 'completed', interviewer: 'Dr. Williams' },
];

/**
 * Admin Interviews page for scheduling and managing interviews
 */
export default function AdminInterviewsPage() {
  const { addNotification } = useNotifications();
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ applicant_name: '', program: '', date: '', time: '', interviewer: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      setLoading(true);
      const res = await adminApi.listInterviews();
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setInterviews(res.data as unknown as Interview[]);
      }
      setLoading(false);
    };
    fetchInterviews();
  }, []);

  const handleSchedule = async () => {
    await adminApi.scheduleInterview(form);
    const newInterview: Interview = {
      id: String(Date.now()),
      ...form,
      status: 'scheduled',
    };
    setInterviews(prev => [...prev, newInterview]);
    setShowModal(false);
    setForm({ applicant_name: '', program: '', date: '', time: '', interviewer: '' });
    addNotification({ type: 'success', message: 'Interview scheduled successfully' });
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Interview Management</h1>
          <button onClick={() => setShowModal(true)} className="btn-secondary">+ Schedule Interview</button>
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
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Interviewer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {interviews.map(iv => (
                  <tr key={iv.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">{iv.applicant_name}</td>
                    <td className="py-3 px-4 text-gray-600">{iv.program}</td>
                    <td className="py-3 px-4 text-gray-600">{iv.date}</td>
                    <td className="py-3 px-4 text-gray-600">{iv.time}</td>
                    <td className="py-3 px-4 text-gray-600">{iv.interviewer}</td>
                    <td className="py-3 px-4">
                      <span className={`badge ${iv.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                        {iv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Schedule Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Schedule Interview</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Applicant Name</label>
                  <input type="text" value={form.applicant_name} onChange={e => setForm({ ...form, applicant_name: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                  <input type="text" value={form.program} onChange={e => setForm({ ...form, program: e.target.value })} className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interviewer</label>
                  <input type="text" value={form.interviewer} onChange={e => setForm({ ...form, interviewer: e.target.value })} className="input-field" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
                <button onClick={handleSchedule} className="btn-secondary">Schedule</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
