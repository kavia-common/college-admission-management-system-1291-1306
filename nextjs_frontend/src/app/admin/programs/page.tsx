"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { programsApi } from '@/services/api';
import { useNotifications } from '@/context/NotificationContext';

/** Program type */
interface Program {
  id: string;
  name: string;
  department: string;
  duration: string;
  seats: number;
  fees: number;
  status: string;
  deadline: string;
}

const mockPrograms: Program[] = [
  { id: '1', name: 'Computer Science', department: 'Engineering', duration: '4 Years', seats: 120, fees: 15000, status: 'active', deadline: '2025-03-31' },
  { id: '2', name: 'Business Administration', department: 'Business', duration: '3 Years', seats: 80, fees: 12000, status: 'active', deadline: '2025-04-15' },
  { id: '3', name: 'Medicine (MBBS)', department: 'Medical Sciences', duration: '5 Years', seats: 60, fees: 25000, status: 'active', deadline: '2025-02-28' },
  { id: '4', name: 'Electrical Engineering', department: 'Engineering', duration: '4 Years', seats: 100, fees: 14000, status: 'draft', deadline: '2025-03-31' },
];

/**
 * Admin Programs Management page - CRUD for academic programs
 */
export default function AdminProgramsPage() {
  const { addNotification } = useNotifications();
  const [programs, setPrograms] = useState<Program[]>(mockPrograms);
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [form, setForm] = useState({ name: '', department: '', duration: '', seats: '', fees: '', deadline: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      const res = await programsApi.list();
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setPrograms(res.data as unknown as Program[]);
      }
      setLoading(false);
    };
    fetchPrograms();
  }, []);

  const openCreate = () => {
    setEditingProgram(null);
    setForm({ name: '', department: '', duration: '', seats: '', fees: '', deadline: '' });
    setShowModal(true);
  };

  const openEdit = (p: Program) => {
    setEditingProgram(p);
    setForm({ name: p.name, department: p.department, duration: p.duration, seats: String(p.seats), fees: String(p.fees), deadline: p.deadline });
    setShowModal(true);
  };

  const handleSave = async () => {
    const data = { ...form, seats: Number(form.seats), fees: Number(form.fees), status: 'active' };
    if (editingProgram) {
      await programsApi.update(editingProgram.id, data);
      setPrograms(prev => prev.map(p => p.id === editingProgram.id ? { ...p, ...data } as Program : p));
      addNotification({ type: 'success', message: 'Program updated successfully' });
    } else {
      const res = await programsApi.create(data);
      const newProgram: Program = { id: (res.data as Record<string, string>)?.id || String(Date.now()), ...data, status: 'active' } as Program;
      setPrograms(prev => [...prev, newProgram]);
      addNotification({ type: 'success', message: 'Program created successfully' });
    }
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this program?')) {
      await programsApi.delete(id);
      setPrograms(prev => prev.filter(p => p.id !== id));
      addNotification({ type: 'success', message: 'Program deleted' });
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Program Management</h1>
          <button onClick={openCreate} className="btn-secondary">+ Add Program</button>
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
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Program Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Duration</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Seats</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Fees</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Deadline</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {programs.map(p => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">{p.name}</td>
                    <td className="py-3 px-4 text-gray-600">{p.department}</td>
                    <td className="py-3 px-4 text-gray-600">{p.duration}</td>
                    <td className="py-3 px-4 text-gray-600">{p.seats}</td>
                    <td className="py-3 px-4 text-gray-600">${p.fees?.toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-600">{p.deadline}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="text-blue-600 hover:text-blue-700 text-sm font-medium">Edit</button>
                        <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-700 text-sm font-medium">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">{editingProgram ? 'Edit Program' : 'Add New Program'}</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Program Name</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input type="text" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <input type="text" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} className="input-field" placeholder="e.g. 4 Years" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                    <input type="number" value={form.seats} onChange={e => setForm({ ...form, seats: e.target.value })} className="input-field" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Application Fee ($)</label>
                    <input type="number" value={form.fees} onChange={e => setForm({ ...form, fees: e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                    <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} className="input-field" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
                <button onClick={handleSave} className="btn-secondary">Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
