"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { adminApi } from '@/services/api';
import { useNotifications } from '@/context/NotificationContext';

interface MeritEntry {
  rank: number;
  applicant_name: string;
  program: string;
  gpa: string;
  interview_score: number;
  total_score: number;
  status: string;
}

const mockMeritList: MeritEntry[] = [
  { rank: 1, applicant_name: 'Alice Johnson', program: 'Computer Science', gpa: '3.9', interview_score: 92, total_score: 95.5, status: 'eligible' },
  { rank: 2, applicant_name: 'David Brown', program: 'Computer Science', gpa: '3.8', interview_score: 88, total_score: 91.0, status: 'eligible' },
  { rank: 3, applicant_name: 'Carol Williams', program: 'Computer Science', gpa: '3.5', interview_score: 90, total_score: 87.5, status: 'eligible' },
  { rank: 4, applicant_name: 'Eve Davis', program: 'Computer Science', gpa: '3.6', interview_score: 82, total_score: 84.0, status: 'waitlisted' },
  { rank: 5, applicant_name: 'Frank Miller', program: 'Computer Science', gpa: '3.4', interview_score: 78, total_score: 80.0, status: 'waitlisted' },
];

const programs = ['Computer Science', 'Business Administration', 'Medicine (MBBS)', 'Data Science', 'Psychology'];

/**
 * Admin Merit List page for generating and viewing merit rankings
 */
export default function AdminMeritListPage() {
  const { addNotification } = useNotifications();
  const [selectedProgram, setSelectedProgram] = useState('Computer Science');
  const [meritList, setMeritList] = useState<MeritEntry[]>(mockMeritList);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    const res = await adminApi.generateMeritList(selectedProgram);
    if (res.data && Array.isArray(res.data)) {
      setMeritList(res.data as unknown as MeritEntry[]);
    }
    setGenerating(false);
    addNotification({ type: 'success', message: `Merit list generated for ${selectedProgram}` });
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Merit List</h1>
          <div className="flex items-center gap-3">
            <select
              value={selectedProgram}
              onChange={e => setSelectedProgram(e.target.value)}
              className="input-field w-48"
              aria-label="Select program"
            >
              {programs.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <button onClick={handleGenerate} className="btn-secondary" disabled={generating}>
              {generating ? 'Generating...' : 'Generate Merit List'}
            </button>
          </div>
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Rank</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Applicant</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">GPA</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Interview Score</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Total Score</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {meritList.map(entry => (
                <tr key={entry.rank} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                      entry.rank <= 3 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {entry.rank}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-800">{entry.applicant_name}</td>
                  <td className="py-3 px-4 text-gray-600">{entry.gpa}</td>
                  <td className="py-3 px-4 text-gray-600">{entry.interview_score}/100</td>
                  <td className="py-3 px-4 font-bold text-gray-800">{entry.total_score.toFixed(1)}</td>
                  <td className="py-3 px-4">
                    <span className={`badge ${entry.status === 'eligible' ? 'badge-success' : 'badge-warning'}`}>
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
