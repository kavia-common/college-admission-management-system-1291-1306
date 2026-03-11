"use client";

import React from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/layout/PublicLayout';

/**
 * Featured program cards for the homepage
 */
const featuredPrograms = [
  { id: '1', name: 'Computer Science', department: 'Engineering', duration: '4 Years', seats: 120, description: 'Learn cutting-edge technology, algorithms, and software engineering practices.' },
  { id: '2', name: 'Business Administration', department: 'Business', duration: '3 Years', seats: 80, description: 'Develop leadership, management, and strategic business skills.' },
  { id: '3', name: 'Medicine (MBBS)', department: 'Medical Sciences', duration: '5 Years', seats: 60, description: 'Train to become a medical professional with world-class education.' },
];

const stats = [
  { label: 'Programs Offered', value: '50+' },
  { label: 'Students Enrolled', value: '10,000+' },
  { label: 'Faculty Members', value: '500+' },
  { label: 'Placement Rate', value: '95%' },
];

/**
 * Home page - public landing page with hero, featured programs, stats, and CTA
 */
export default function HomePage() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, rgba(180,83,9,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(15,118,110,0.3) 0%, transparent 50%)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Your Journey to
              <span className="text-amber-400"> Excellence </span>
              Starts Here
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              Apply to top-tier programs with our streamlined admission process. Track your application, upload documents, and stay updated every step of the way.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/programs" className="btn-secondary text-base !py-3 !px-8 no-underline hover:no-underline">
                Explore Programs
              </Link>
              <Link href="/register" className="btn-outline !border-white/30 !text-white hover:!bg-white/10 text-base !py-3 !px-8 no-underline hover:no-underline">
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-amber-600">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Featured Programs</h2>
          <p className="text-gray-500 mt-3 text-lg">Discover our most popular academic programs</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredPrograms.map((program) => (
            <div key={program.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {program.department}
                </span>
                <span className="text-xs text-gray-500">{program.duration}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{program.name}</h3>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">{program.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  <strong className="text-gray-700">{program.seats}</strong> seats
                </span>
                <Link href="/programs" className="text-sm font-medium text-amber-600 hover:text-amber-700">
                  Learn More →
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/programs" className="btn-outline">View All Programs</Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">How It Works</h2>
            <p className="text-gray-500 mt-3 text-lg">Simple steps to your admission</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Register', desc: 'Create your account to get started with the application process.' },
              { step: '2', title: 'Apply', desc: 'Fill out the multi-step application form with your details.' },
              { step: '3', title: 'Upload Documents', desc: 'Submit required documents and pay the application fee.' },
              { step: '4', title: 'Track Status', desc: 'Monitor your application status and receive notifications.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-gray-300 text-lg mb-8">Join thousands of students who have found their path through AdmitEase.</p>
          <Link href="/register" className="btn-secondary text-base !py-3 !px-8 no-underline hover:no-underline">
            Get Started Today
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
