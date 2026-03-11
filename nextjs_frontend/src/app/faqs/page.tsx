"use client";

import React, { useState, useEffect } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { faqApi } from '@/services/api';

/**
 * Mock FAQ data as fallback
 */
const mockFaqs = [
  { id: '1', question: 'What are the admission requirements?', answer: 'Requirements vary by program. Generally, you need a high school diploma or equivalent. Specific programs may require particular subjects or minimum grades. Check individual program pages for details.', category: 'Admission' },
  { id: '2', question: 'How do I apply for a program?', answer: 'Register an account on our portal, fill out the multi-step application form, upload required documents, and pay the application fee. You can save your progress and return later.', category: 'Application' },
  { id: '3', question: 'What documents do I need to upload?', answer: 'Typically required: academic transcripts, ID proof, passport-size photos, recommendation letters, and any program-specific documents. The application form will list all required documents.', category: 'Documents' },
  { id: '4', question: 'How much is the application fee?', answer: 'Application fees vary by program, typically ranging from $50 to $150. Fee details are listed on each program page. Fee waivers may be available for eligible students.', category: 'Fees' },
  { id: '5', question: 'Can I apply to multiple programs?', answer: 'Yes, you can apply to multiple programs simultaneously. Each application requires a separate fee payment.', category: 'Application' },
  { id: '6', question: 'How do I track my application status?', answer: 'After logging in, visit your dashboard to see the real-time status of all your applications. You will also receive email and in-app notifications for status updates.', category: 'Tracking' },
  { id: '7', question: 'What happens after I submit my application?', answer: 'Your application is reviewed by the admissions committee. You may be called for an interview. Merit lists are published and seat allocation is done based on merit and availability.', category: 'Process' },
  { id: '8', question: 'Can I edit my application after submission?', answer: 'Once submitted, applications cannot be edited. However, you can contact the admissions office if you need to make corrections to critical information.', category: 'Application' },
];

/**
 * FAQs page with expandable accordion items grouped by category
 */
export default function FaqsPage() {
  const [faqs, setFaqs] = useState(mockFaqs);
  const [openId, setOpenId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState('');

  const categories = [...new Set(mockFaqs.map(f => f.category))];

  useEffect(() => {
    const fetchFaqs = async () => {
      const res = await faqApi.list();
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setFaqs(res.data as typeof mockFaqs);
      }
    };
    fetchFaqs();
  }, []);

  const filtered = filterCategory
    ? faqs.filter(f => f.category === filterCategory)
    : faqs;

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Frequently Asked Questions</h1>
          <p className="text-gray-500 mt-2">Find answers to common questions about admissions</p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setFilterCategory('')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${!filterCategory ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filterCategory === cat ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {filtered.map((faq) => (
            <div key={faq.id} className="card !p-0 overflow-hidden">
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                aria-expanded={openId === faq.id}
              >
                <span className="font-medium text-gray-800 pr-4">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${openId === faq.id ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openId === faq.id && (
                <div className="px-4 pb-4 pt-0 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                  <p className="pt-3">{faq.answer}</p>
                  <span className="inline-block mt-2 badge badge-info">{faq.category}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
