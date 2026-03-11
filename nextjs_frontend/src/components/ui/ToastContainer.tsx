"use client";

import React from 'react';
import { useNotifications } from '@/context/NotificationContext';

/**
 * Icon components for different notification types
 */
function SuccessIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

const typeStyles: Record<string, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
  success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: <SuccessIcon /> },
  error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: <ErrorIcon /> },
  warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', icon: <WarningIcon /> },
  info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: <InfoIcon /> },
};

// PUBLIC_INTERFACE
/**
 * ToastContainer renders the stack of active toast notifications
 */
export default function ToastContainer() {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm" role="alert" aria-live="polite">
      {notifications.map((n) => {
        const style = typeStyles[n.type] || typeStyles.info;
        return (
          <div
            key={n.id}
            className={`flex items-start gap-3 p-4 rounded-lg border ${style.bg} ${style.border} ${style.text} shadow-lg animate-in`}
          >
            <span className="mt-0.5 flex-shrink-0">{style.icon}</span>
            <p className="text-sm flex-1">{n.message}</p>
            <button
              onClick={() => removeNotification(n.id)}
              className="flex-shrink-0 opacity-60 hover:opacity-100"
              aria-label="Close notification"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}
