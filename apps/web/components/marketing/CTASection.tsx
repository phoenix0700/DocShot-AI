'use client';

import Link from 'next/link';
import { Button } from '../ui/Button';
import { useUser } from '@clerk/nextjs';

export function CTASection() {
  const { isSignedIn } = useUser();

  return (
    <section className="py-20 sm:py-32 bg-gradient-to-r from-blue-600 to-purple-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to automate your screenshots?
          </h2>
          <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
            Join thousands of teams who have transformed their documentation workflow. Start your
            free trial today and experience the difference automated screenshot management can make.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              asChild
              className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-100 font-semibold"
            >
              <Link href={isSignedIn ? '/dashboard' : '/sign-up'}>
                {isSignedIn ? 'Go to Dashboard' : 'Start Free Trial'}
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-600 font-semibold"
            >
              <Link href="/contact">Schedule Demo</Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-blue-100">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              No credit card required
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              50 free screenshots per month
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Cancel anytime
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
