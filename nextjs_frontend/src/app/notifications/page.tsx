"use client";

import React, { useState, useEffect } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { useAuth } from '@/context/AuthContext';
import { notificationsApi } from '@/services/api';
import Link from 'next/link';

/** Notification item type */
interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

const mockNotifications: NotificationItem[] = [
  { id: '1', title: 'Application Received', message: 'Your application for Computer Science has been received and is under review.', type: 'info', read: false, created_at: '2025-01-16' },
  { id: '2', title: 'Document Verified', message: 'Your academic transcript has been verified successfully.', type: 'success', read: false, created_at: '2025-01-17' },
  { id: '3', title: 'Payment Confirmed', message: 'Application fee payment of $15,000 has been confirmed.', type: 'success', read: true, created_at: '2025-01-15' },
  { id: '4', title: 'Interview Scheduled', message: 'An interview has been scheduled for Jan 25, 2025 at 10:00 AM.', type: 'warning', read: true, created_at: '2025-01-18' },
];

/**
 * Notifications page showing all user notifications with read/unread status
 */
export default function NotificationsPage() {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const res = await notificationsApi.list();
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setNotifications(res.data as unknown as NotificationItem[]);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const markAsRead = async (id: string) => {
    await notificationsApi.markRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = async () => {
    await notificationsApi.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (!isAuthenticated) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Please login to view notifications</h2>
            <Link href="/login" className="btn-secondary mt-4 inline-block no-underline hover:no-underline">Login</Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  const typeIcons: Record<string, string> = {
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z',
    error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  };

  const typeColors: Record<string, string> = {
    info: 'text-blue-500',
    success: 'text-green-500',
    warning: 'text-amber-500',
    error: 'text-red-500',
  };

  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
            <p className="text-gray-500 text-sm mt-1">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="btn-outline text-sm">
              Mark All as Read
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(n => (
              <div
                key={n.id}
                className={`card flex items-start gap-4 cursor-pointer transition-colors ${!n.read ? 'bg-amber-50/50 border-amber-200' : ''}`}
                onClick={() => !n.read && markAsRead(n.id)}
                role="button"
                tabIndex={0}
                aria-label={`Notification: ${n.title}`}
              >
                <svg className={`w-6 h-6 mt-0.5 flex-shrink-0 ${typeColors[n.type] || 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={typeIcons[n.type] || typeIcons.info} />
                </svg>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-medium ${!n.read ? 'text-gray-900' : 'text-gray-600'}`}>{n.title}</h3>
                    <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{n.created_at}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                </div>
                {!n.read && (
                  <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
