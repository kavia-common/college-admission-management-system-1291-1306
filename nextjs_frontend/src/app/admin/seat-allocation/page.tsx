"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { adminApi } from '@/services/api';
import { useNotifications } from '@/context/NotificationContext';

interface SeatAllocation {
  program: string;
  total_seats: number;
  allocated: number;
  remaining: number;
  waitlisted: number;
}

const mockAllocations: SeatAllocation[] = [
  { program: 'Computer Science', total_seats: 120, allocated: 98, remaining: 22, waitlisted: 15 },
  { program: 'Business Administration', total_seats: 80, allocated: 65, remaining: 15, waitlisted: 8 },
  { program: 'Medicine (MBBS)', total_seats: 60, allocated: 58, remaining: 2, waitlisted: 20 },
  { program: 'Electrical Engineering', total_seats: 100, allocated: 72, remaining: 28, waitlisted: 5 },
  { program: 'Data Science', total_seats: 90, allocated: 45, remaining: 45, waitlisted: 10 },
  { program: 'Psychology', total_seats: 70, allocated: 55, remaining: 15, waitlisted: 7 },
];

/**
 * Admin Seat Allocation page for managing seat distribution
 */
export default function AdminSeatAllocationPage() {
  const { addNotification } = useNotifications();
  const [allocations, setAllocations] = useState<SeatAllocation[]>(mockAllocations);

  const handleAllocate = async (program: string) => {
    await adminApi.allocateSeats(program, { action: 'allocate_from_waitlist' });
    setAllocations(prev => prev.map(a => {
      if (a.program === program && a.remaining > 0 && a.waitlisted > 0) {
        return { ...a, allocated: a.allocated + 1, remaining: a.remaining - 1, waitlisted: a.waitlisted - 1 };
      }
      return a;
    }));
    addNotification({ type: 'success', message: `Seat allocated from waitlist for ${program}` });
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Seat Allocation</h1>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="card text-center">
            <p className="text-sm text-gray-500">Total Seats</p>
            <p className="text-3xl font-bold text-gray-800">{allocations.reduce((s, a) => s + a.total_seats, 0)}</p>
          </div>
          <div className="card text-center">
            <p className="text-sm text-gray-500">Allocated</p>
            <p className="text-3xl font-bold text-green-600">{allocations.reduce((s, a) => s + a.allocated, 0)}</p>
          </div>
          <div className="card text-center">
            <p className="text-sm text-gray-500">Remaining</p>
            <p className="text-3xl font-bold text-amber-600">{allocations.reduce((s, a) => s + a.remaining, 0)}</p>
          </div>
        </div>

        {/* Allocation Table */}
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Program</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Total Seats</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Allocated</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Remaining</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Waitlisted</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Fill Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map(a => {
                const fillRate = Math.round((a.allocated / a.total_seats) * 100);
                return (
                  <tr key={a.program} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">{a.program}</td>
                    <td className="py-3 px-4 text-gray-600">{a.total_seats}</td>
                    <td className="py-3 px-4 text-green-600 font-medium">{a.allocated}</td>
                    <td className="py-3 px-4 text-amber-600 font-medium">{a.remaining}</td>
                    <td className="py-3 px-4 text-gray-600">{a.waitlisted}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className={`h-2 rounded-full ${fillRate >= 90 ? 'bg-red-500' : fillRate >= 70 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${fillRate}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{fillRate}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleAllocate(a.program)}
                        disabled={a.remaining === 0 || a.waitlisted === 0}
                        className="text-amber-600 hover:text-amber-700 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Allocate from Waitlist
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
