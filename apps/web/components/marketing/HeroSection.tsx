'use client';

import Link from 'next/link';
import { Button } from '../ui/Button';
import { useUser } from '@clerk/nextjs';

export function HeroSection() {
  const { isSignedIn } = useUser();

  return (
    <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-600/20 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-600/20 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 mb-8">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Now in Public Beta - Join 500+ teams automating their screenshots
          </div>

          {/* Main heading */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Keep Your Documentation
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Visually Perfect
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Automatically capture, update, and manage screenshots in your documentation, help centers, and release notes. 
            Never worry about outdated screenshots again.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild className="px-8 py-4 text-lg">
              <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
                {isSignedIn ? "Go to Dashboard" : "Start Free Trial"}
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="px-8 py-4 text-lg">
              <Link href="#demo">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Watch Demo
              </Link>
            </Button>
          </div>

          {/* Social proof */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 mb-6">Trusted by teams at</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {/* Company logos placeholder */}
              {['GitHub', 'Notion', 'Linear', 'Vercel', 'Stripe'].map((company) => (
                <div key={company} className="text-gray-400 font-semibold text-lg">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hero image/demo */}
        <div className="mt-16 sm:mt-20">
          <div className="relative mx-auto max-w-5xl">
            <div className="rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="ml-4 text-sm text-gray-600 font-medium">DocShot AI Dashboard</div>
                </div>
              </div>
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                {/* Placeholder for actual dashboard screenshot */}
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Automated Screenshot Management</h3>
                  <p className="text-gray-600">See how DocShot AI keeps your documentation visually perfect</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}