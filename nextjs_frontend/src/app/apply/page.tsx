"use client";

import React, { useState } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { applicationsApi, documentsApi, paymentsApi } from '@/services/api';
import Link from 'next/link';

/** Steps in the application wizard */
const STEPS = ['Program Selection', 'Personal Info', 'Academic Details', 'Documents', 'Fee Payment', 'Review & Submit'];

/** Available programs for selection */
const availablePrograms = [
  { id: '1', name: 'Computer Science', department: 'Engineering', fees: 15000 },
  { id: '2', name: 'Business Administration', department: 'Business', fees: 12000 },
  { id: '3', name: 'Medicine (MBBS)', department: 'Medical Sciences', fees: 25000 },
  { id: '4', name: 'Electrical Engineering', department: 'Engineering', fees: 14000 },
  { id: '5', name: 'Psychology', department: 'Arts & Sciences', fees: 10000 },
  { id: '6', name: 'Data Science', department: 'Engineering', fees: 16000 },
];

/** Document types required */
const documentTypes = [
  { key: 'transcript', label: 'Academic Transcript', required: true },
  { key: 'id_proof', label: 'ID Proof (Passport/National ID)', required: true },
  { key: 'photo', label: 'Passport-size Photo', required: true },
  { key: 'recommendation', label: 'Recommendation Letter', required: false },
  { key: 'essay', label: 'Personal Statement / Essay', required: false },
];

/**
 * Multi-step Application Wizard with validation, document upload, and fee payment mock
 */
export default function ApplyPage() {
  const { isAuthenticated, user } = useAuth();
  const { addNotification } = useNotifications();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [programId, setProgramId] = useState('');
  const [personal, setPersonal] = useState({
    full_name: user?.name || '',
    email: user?.email || '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
  });
  const [academic, setAcademic] = useState({
    highest_qualification: '',
    institution: '',
    year_of_completion: '',
    gpa: '',
    major_subject: '',
  });
  const [documents, setDocuments] = useState<Record<string, File | null>>({});
  const [paymentDone, setPaymentDone] = useState(false);

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation per step
  const validateStep = (s: number): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (s === 0) {
      if (!programId) errs.programId = 'Please select a program';
    } else if (s === 1) {
      if (!personal.full_name.trim()) errs.full_name = 'Full name is required';
      if (!personal.email.trim()) errs.email = 'Email is required';
      if (!personal.date_of_birth) errs.date_of_birth = 'Date of birth is required';
      if (!personal.gender) errs.gender = 'Gender is required';
      if (!personal.address.trim()) errs.address = 'Address is required';
      if (!personal.city.trim()) errs.city = 'City is required';
      if (!personal.country.trim()) errs.country = 'Country is required';
    } else if (s === 2) {
      if (!academic.highest_qualification) errs.highest_qualification = 'Qualification is required';
      if (!academic.institution.trim()) errs.institution = 'Institution is required';
      if (!academic.year_of_completion) errs.year_of_completion = 'Year is required';
      if (!academic.gpa.trim()) errs.gpa = 'GPA/Score is required';
    } else if (s === 3) {
      documentTypes.forEach(dt => {
        if (dt.required && !documents[dt.key]) {
          errs[dt.key] = `${dt.label} is required`;
        }
      });
    } else if (s === 4) {
      if (!paymentDone) errs.payment = 'Payment is required to proceed';
    }
    return errs;
  };

  const handleNext = () => {
    const errs = validateStep(step);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setStep(s => Math.max(s - 1, 0));
  };

  const handleFileChange = (key: string, file: File | null) => {
    setDocuments(prev => ({ ...prev, [key]: file }));
  };

  const handlePayment = () => {
    // Mock payment processing
    setSubmitting(true);
    setTimeout(() => {
      setPaymentDone(true);
      setSubmitting(false);
      addNotification({ type: 'success', message: 'Payment processed successfully (mock)!' });
    }, 1500);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const selectedProgram = availablePrograms.find(p => p.id === programId);
    const applicationData = {
      program_id: programId,
      program_name: selectedProgram?.name,
      personal_info: personal,
      academic_info: academic,
      payment_status: 'paid',
    };

    const res = await applicationsApi.create(applicationData);
    if (res.data) {
      // Upload documents
      const appId = (res.data as Record<string, string>).id || 'new';
      for (const [key, file] of Object.entries(documents)) {
        if (file) {
          await documentsApi.upload(appId, file, key);
        }
      }
      // Initiate payment record
      await paymentsApi.initiate(appId, selectedProgram?.fees || 0);
    }

    setSubmitting(false);
    addNotification({ type: 'success', message: 'Application submitted successfully!' });
    setTimeout(() => { window.location.href = '/dashboard'; }, 1000);
  };

  if (!isAuthenticated) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Please login to apply</h2>
            <Link href="/login" className="btn-secondary mt-4 inline-block no-underline hover:no-underline">Login</Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const selectedProgram = availablePrograms.find(p => p.id === programId);

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Application Form</h1>

        {/* Step Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i < step ? 'bg-green-500 text-white' :
                  i === step ? 'bg-amber-600 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-xs mt-1 text-center hidden sm:block ${i === step ? 'text-amber-600 font-medium' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-amber-600 h-1.5 rounded-full transition-all" style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />
          </div>
        </div>

        <div className="card">
          {/* Step 0: Program Selection */}
          {step === 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Select a Program</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availablePrograms.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setProgramId(p.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${
                      programId === p.id
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-800">{p.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{p.department} • Fee: ${p.fees.toLocaleString()}</div>
                  </button>
                ))}
              </div>
              {errors.programId && <p className="error-text mt-2">{errors.programId}</p>}
            </div>
          )}

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input type="text" value={personal.full_name} onChange={e => setPersonal({ ...personal, full_name: e.target.value })} className={`input-field ${errors.full_name ? 'input-error' : ''}`} />
                  {errors.full_name && <p className="error-text">{errors.full_name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" value={personal.email} onChange={e => setPersonal({ ...personal, email: e.target.value })} className={`input-field ${errors.email ? 'input-error' : ''}`} />
                  {errors.email && <p className="error-text">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" value={personal.phone} onChange={e => setPersonal({ ...personal, phone: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                  <input type="date" value={personal.date_of_birth} onChange={e => setPersonal({ ...personal, date_of_birth: e.target.value })} className={`input-field ${errors.date_of_birth ? 'input-error' : ''}`} />
                  {errors.date_of_birth && <p className="error-text">{errors.date_of_birth}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                  <select value={personal.gender} onChange={e => setPersonal({ ...personal, gender: e.target.value })} className={`input-field ${errors.gender ? 'input-error' : ''}`}>
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                  {errors.gender && <p className="error-text">{errors.gender}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <input type="text" value={personal.address} onChange={e => setPersonal({ ...personal, address: e.target.value })} className={`input-field ${errors.address ? 'input-error' : ''}`} />
                  {errors.address && <p className="error-text">{errors.address}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input type="text" value={personal.city} onChange={e => setPersonal({ ...personal, city: e.target.value })} className={`input-field ${errors.city ? 'input-error' : ''}`} />
                  {errors.city && <p className="error-text">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                  <input type="text" value={personal.state} onChange={e => setPersonal({ ...personal, state: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input type="text" value={personal.zip_code} onChange={e => setPersonal({ ...personal, zip_code: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                  <input type="text" value={personal.country} onChange={e => setPersonal({ ...personal, country: e.target.value })} className={`input-field ${errors.country ? 'input-error' : ''}`} />
                  {errors.country && <p className="error-text">{errors.country}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Academic Details */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Academic Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Highest Qualification *</label>
                  <select value={academic.highest_qualification} onChange={e => setAcademic({ ...academic, highest_qualification: e.target.value })} className={`input-field ${errors.highest_qualification ? 'input-error' : ''}`}>
                    <option value="">Select qualification</option>
                    <option value="high_school">High School Diploma</option>
                    <option value="associate">Associate Degree</option>
                    <option value="bachelor">Bachelor&apos;s Degree</option>
                    <option value="master">Master&apos;s Degree</option>
                  </select>
                  {errors.highest_qualification && <p className="error-text">{errors.highest_qualification}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institution Name *</label>
                  <input type="text" value={academic.institution} onChange={e => setAcademic({ ...academic, institution: e.target.value })} className={`input-field ${errors.institution ? 'input-error' : ''}`} placeholder="Name of school/college" />
                  {errors.institution && <p className="error-text">{errors.institution}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year of Completion *</label>
                  <input type="number" min="1990" max="2030" value={academic.year_of_completion} onChange={e => setAcademic({ ...academic, year_of_completion: e.target.value })} className={`input-field ${errors.year_of_completion ? 'input-error' : ''}`} placeholder="e.g. 2024" />
                  {errors.year_of_completion && <p className="error-text">{errors.year_of_completion}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GPA / Score *</label>
                  <input type="text" value={academic.gpa} onChange={e => setAcademic({ ...academic, gpa: e.target.value })} className={`input-field ${errors.gpa ? 'input-error' : ''}`} placeholder="e.g. 3.8 / 4.0" />
                  {errors.gpa && <p className="error-text">{errors.gpa}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Major Subject</label>
                  <input type="text" value={academic.major_subject} onChange={e => setAcademic({ ...academic, major_subject: e.target.value })} className="input-field" placeholder="e.g. Mathematics" />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Documents */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload Documents</h2>
              <p className="text-sm text-gray-500 mb-6">Upload the required documents. Accepted formats: PDF, JPG, PNG (max 5MB each).</p>
              <div className="space-y-4">
                {documentTypes.map(dt => (
                  <div key={dt.key} className={`p-4 rounded-lg border ${errors[dt.key] ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        {dt.label} {dt.required && <span className="text-red-500">*</span>}
                      </label>
                      {documents[dt.key] && (
                        <span className="text-xs text-green-600 font-medium">✓ Uploaded</span>
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={e => handleFileChange(dt.key, e.target.files?.[0] || null)}
                      className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                    />
                    {errors[dt.key] && <p className="error-text">{errors[dt.key]}</p>}
                    {documents[dt.key] && (
                      <p className="text-xs text-gray-400 mt-1">{documents[dt.key]?.name} ({((documents[dt.key]?.size || 0) / 1024).toFixed(1)} KB)</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Fee Payment */}
          {step === 4 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Application Fee Payment</h2>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Program</span>
                  <span className="font-medium text-gray-800">{selectedProgram?.name}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Application Fee</span>
                  <span className="text-2xl font-bold text-amber-600">${selectedProgram?.fees.toLocaleString()}</span>
                </div>
                <hr className="my-4" />
                {paymentDone ? (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-green-700 font-medium">Payment Successful</p>
                    <p className="text-sm text-gray-500 mt-1">Transaction ID: TXN-{Date.now().toString().slice(-8)}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-500 mb-4">This is a simulated payment. Click below to process.</p>
                    <button onClick={handlePayment} className="btn-secondary w-full" disabled={submitting}>
                      {submitting ? 'Processing Payment...' : `Pay $${selectedProgram?.fees.toLocaleString()}`}
                    </button>
                  </div>
                )}
              </div>
              {errors.payment && <p className="error-text">{errors.payment}</p>}
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {step === 5 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Review & Submit</h2>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Program</h3>
                  <p className="text-gray-800">{selectedProgram?.name} — {selectedProgram?.department}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-500">Name:</span><span>{personal.full_name}</span>
                    <span className="text-gray-500">Email:</span><span>{personal.email}</span>
                    <span className="text-gray-500">DOB:</span><span>{personal.date_of_birth}</span>
                    <span className="text-gray-500">Gender:</span><span>{personal.gender}</span>
                    <span className="text-gray-500">Address:</span><span>{personal.address}, {personal.city}, {personal.country}</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Academic Details</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-500">Qualification:</span><span>{academic.highest_qualification}</span>
                    <span className="text-gray-500">Institution:</span><span>{academic.institution}</span>
                    <span className="text-gray-500">Year:</span><span>{academic.year_of_completion}</span>
                    <span className="text-gray-500">GPA:</span><span>{academic.gpa}</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Documents</h3>
                  <ul className="text-sm space-y-1">
                    {Object.entries(documents).filter(([, f]) => f).map(([key, file]) => (
                      <li key={key} className="flex items-center gap-2 text-green-700">
                        <span>✓</span>
                        <span>{documentTypes.find(d => d.key === key)?.label}: {file?.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-green-800 font-medium">✓ Payment Complete — ${selectedProgram?.fees.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button onClick={handleBack} disabled={step === 0} className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed">
              ← Back
            </button>
            {step < STEPS.length - 1 ? (
              <button onClick={handleNext} className="btn-secondary">
                Next →
              </button>
            ) : (
              <button onClick={handleSubmit} className="btn-primary !bg-green-600 hover:!bg-green-700" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
