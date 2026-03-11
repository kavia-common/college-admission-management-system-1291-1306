"use client";

import React, { useState, useEffect } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { programsApi } from '@/services/api';

/**
 * Mock programs data as fallback when backend is not available
 */
const mockPrograms = [
  { id: '1', name: 'Computer Science', department: 'Engineering', duration: '4 Years', seats: 120, fees: 15000, description: 'Learn cutting-edge technology, algorithms, and software engineering.', eligibility: 'High school diploma with Mathematics', deadline: '2025-03-31' },
  { id: '2', name: 'Business Administration', department: 'Business', duration: '3 Years', seats: 80, fees: 12000, description: 'Develop leadership, management, and strategic business skills.', eligibility: 'High school diploma', deadline: '2025-04-15' },
  { id: '3', name: 'Medicine (MBBS)', department: 'Medical Sciences', duration: '5 Years', seats: 60, fees: 25000, description: 'Train to become a medical professional.', eligibility: 'High school diploma with Biology & Chemistry', deadline: '2025-02-28' },
  { id: '4', name: 'Electrical Engineering', department: 'Engineering', duration: '4 Years', seats: 100, fees: 14000, description: 'Study circuits, electronics, and power systems.', eligibility: 'High school diploma with Physics & Mathematics', deadline: '2025-03-31' },
  { id: '5', name: 'Psychology', department: 'Arts & Sciences', duration: '3 Years', seats: 70, fees: 10000, description: 'Understand human behavior and mental processes.', eligibility: 'High school diploma', deadline: '2025-04-30' },
  { id: '6', name: 'Data Science', department: 'Engineering', duration: '4 Years', seats: 90, fees: 16000, description: 'Master data analysis, machine learning, and AI.', eligibility: 'High school diploma with Mathematics', deadline: '2025-03-31' },
];

/**
 * Programs listing page with search and filter functionality
 */
export default function ProgramsPage() {
  const [programs, setPrograms] = useState(mockPrograms);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);

  const departments = [...new Set(mockPrograms.map(p => p.department))];

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      const res = await programsApi.list({ search, department });
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setPrograms(res.data as typeof mockPrograms);
      } else {
        // Use mock data with client-side filtering
        let filtered = mockPrograms;
        if (search) {
          filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase())
          );
        }
        if (department) {
          filtered = filtered.filter(p => p.department === department);
        }
        setPrograms(filtered);
      }
      setLoading(false);
    };
    fetchPrograms();
  }, [search, department]);

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Academic Programs</h1>
          <p className="text-gray-500 mt-2">Browse our available programs and find the right fit for you</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search programs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
              aria-label="Search programs"
            />
          </div>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="input-field sm:w-48"
            aria-label="Filter by department"
          >
            <option value="">All Departments</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Programs Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
            <p className="text-gray-500 mt-3">Loading programs...</p>
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No programs found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <div key={program.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <span className="badge badge-warning">{program.department}</span>
                  <span className="text-xs text-gray-500">{program.duration}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{program.name}</h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{program.description}</p>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Seats Available:</span>
                    <span className="font-medium text-gray-700">{program.seats}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Application Fee:</span>
                    <span className="font-medium text-gray-700">${program.fees?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Eligibility:</span>
                    <span className="font-medium text-gray-700 text-right max-w-[60%]">{program.eligibility}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Deadline:</span>
                    <span className="font-medium text-amber-700">{program.deadline}</span>
                  </div>
                </div>

                <button className="btn-secondary w-full text-sm !py-2"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.href = '/register';
                    }
                  }}
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
