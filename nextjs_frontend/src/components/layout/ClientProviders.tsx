"use client";

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import ToastContainer from '@/components/ui/ToastContainer';

// PUBLIC_INTERFACE
/**
 * ClientProviders wraps children with all client-side context providers
 */
export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        {children}
        <ToastContainer />
      </NotificationProvider>
    </AuthProvider>
  );
}
