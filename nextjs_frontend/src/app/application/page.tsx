"use client";

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PublicLayout from '@/components/layout/PublicLayout';
import { useAuth } from '@/context/AuthContext';
import { applicationsApi } from '@/services/api';
import Link from 'next/link';

/** Timeline event type */
interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
}

/**
 * Inner component that uses useSearchParams - must be inside Suspense
 */
function ApplicationDetailContent() {
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [application, setApplication] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  const id = searchParams.get('id') || '';

  useEffect(() => {
    const fetchApp = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const res = await applicationsApi.get(id);
      if (res.data) {
        setApplication(res.data);
      } else {
        // Mock data fallback
        setApplication({
          id,
          program_name: 'Computer Science',
          status: 'submitted',
          created_at: '2025-01-15',
          updated_at: '2025-01-16',
          payment_status: 'paid',
          personal_info: { full_name: 'John Doe', email: 'john@example.com' },
          academic_info: { institution: 'ABC High School', gpa: '3.8' },
        });
      }
      setLoading(false);
    };
    fetchApp();
  }, [id]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Please login to view application</h2>
          <Link href="/login" className="btn-secondary mt-4 inline-block no-underline hover:no-underline">Login</Link>
        </div>
      </div>
    );
  }

  const status = (application?.status as string) || 'draft';

  // Build timeline based on status
  const getTimeline = (): TimelineEvent[] => {
    const steps: TimelineEvent[] = [
      { date: (application?.created_at as string) || '', title: 'Application Created', description: 'Application form started', status: 'completed' },
      { date: '', title: 'Documents Uploaded', description: 'All required documents submitted', status: 'pending' },
      { date: '', title: 'Application Submitted', description: 'Application submitted for review', status: 'pending' },
      { date: '', title: 'Under Review', description: 'Application is being reviewed by admissions', status: 'pending' },
      { date: '', title: 'Interview', description: 'Interview scheduled/completed', status: 'pending' },
      { date: '', title: 'Decision', description: 'Admission decision made', status: 'pending' },
    ];

    const statusOrder = ['draft', 'submitted', 'under_review', 'interview_scheduled', 'accepted', 'rejected'];
    const currentIdx = statusOrder.indexOf(status);

    if (currentIdx >= 1) { steps[1].status = 'completed'; steps[2].status = 'completed'; }
    if (currentIdx >= 2) { steps[3].status = 'completed'; }
    if (currentIdx >= 3) { steps[4].status = 'completed'; }
    if (currentIdx >= 4) { steps[5].status = 'completed'; }

    // Mark the current step
    const currentStepMap: Record<string, number> = { draft: 0, submitted: 3, under_review: 3, interview_scheduled: 4, accepted: 5, rejected: 5 };
    const ci = currentStepMap[status] ?? 0;
    if (steps[ci] && steps[ci].status !== 'completed') {
      steps[ci].status = 'current';
    }

    return steps;
  };

  const timeline = getTimeline();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/dashboard" className="text-sm text-amber-600 hover:text-amber-700 mb-4 inline-block">← Back to Dashboard</Link>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
        </div>
      ) : !id ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No application ID specified.</p>
        </div>
      ) : application ? (
        <>
          <div className="card mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{application.program_name as string}</h1>
                <p className="text-gray-500 text-sm mt-1">Application ID: {application.id as string}</p>
              </div>
              <span className={`mt-2 sm:mt-0 inline-flex badge ${
                status === 'accepted' ? 'badge-success' :
                status === 'rejected' ? 'badge-error' :
                status === 'submitted' || status === 'under_review' ? 'badge-info' :
                'badge-warning'
              } !text-sm !px-3 !py-1`}>
                {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="card mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Application Timeline</h2>
            <div className="relative">
              {timeline.map((event, idx) => (
                <div key={idx} className="flex gap-4 mb-6 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                      event.status === 'completed' ? 'bg-green-500 text-white' :
                      event.status === 'current' ? 'bg-amber-500 text-white animate-pulse' :
                      'bg-gray-200 text-gray-400'
                    }`}>
                      {event.status === 'completed' ? '✓' : idx + 1}
                    </div>
                    {idx < timeline.length - 1 && (
                      <div className={`w-0.5 flex-1 min-h-[24px] ${event.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'}`} />
                    )}
                  </div>
                  <div className="pb-2">
                    <h3 className={`font-medium ${event.status === 'pending' ? 'text-gray-400' : 'text-gray-800'}`}>{event.title}</h3>
                    <p className="text-sm text-gray-500">{event.description}</p>
                    {event.date && <p className="text-xs text-gray-400 mt-1">{event.date}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Application Details */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Application Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Applied On:</span>
                <span className="ml-2 text-gray-800">{application.created_at as string}</span>
              </div>
              <div>
                <span className="text-gray-500">Last Updated:</span>
                <span className="ml-2 text-gray-800">{application.updated_at as string}</span>
              </div>
              <div>
                <span className="text-gray-500">Payment:</span>
                <span className={`ml-2 font-medium ${application.payment_status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                  {application.payment_status === 'paid' ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Application not found.</p>
        </div>
      )}
    </div>
  );
}

/**
 * Application detail/tracking page showing application info and status timeline.
 * Uses query parameter ?id=xxx for static export compatibility.
 * Wrapped in Suspense boundary as required by Next.js for useSearchParams.
 */
// PUBLIC_INTERFACE
export default function ApplicationDetailPage() {
  /** Application detail page with Suspense wrapper for useSearchParams */
  return (
    <PublicLayout>
      <Suspense fallback={
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
          <p className="text-gray-500 mt-3">Loading application...</p>
        </div>
      }>
        <ApplicationDetailContent />
      </Suspense>
    </PublicLayout>
  );
}
