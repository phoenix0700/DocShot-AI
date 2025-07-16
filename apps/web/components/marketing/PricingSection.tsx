'use client';

import Link from 'next/link';
import { Button } from '../ui/Button';
import { useUser } from '@clerk/nextjs';

export function PricingSection() {
  const { isSignedIn } = useUser();

  const plans = [
    {
      name: 'Starter',
      price: 0,
      description: 'Perfect for individual developers and small projects',
      features: [
        '50 screenshots per month',
        '1 project',
        'Basic visual diff detection',
        'Email notifications',
        'GitHub integration',
        'Community support',
      ],
      limitations: [
        'No advanced scheduling',
        'Basic analytics only',
      ],
      cta: 'Start Free',
      href: isSignedIn ? '/dashboard' : '/sign-up',
      popular: false,
    },
    {
      name: 'Pro',
      price: 29,
      description: 'Ideal for growing teams and professional documentation',
      features: [
        '500 screenshots per month',
        'Unlimited projects',
        'Advanced visual diff detection',
        'Smart notifications (Email + Slack)',
        'All integrations (GitHub, Notion, Confluence)',
        'Advanced scheduling & automation',
        'Team collaboration',
        'Priority support',
        'Advanced analytics',
        'Custom domains',
      ],
      limitations: [],
      cta: 'Start Pro Trial',
      href: isSignedIn ? '/dashboard?upgrade=pro' : '/sign-up?plan=pro',
      popular: true,
    },
    {
      name: 'Team',
      price: 99,
      description: 'For larger teams with enterprise-grade requirements',
      features: [
        '2,500 screenshots per month',
        'Unlimited projects & users',
        'Enterprise visual diff engine',
        'Custom notification channels',
        'All integrations + custom webhooks',
        'Advanced automation workflows',
        'Team management & permissions',
        'SSO integration',
        'Advanced analytics & reporting',
        'Custom domains & branding',
        'SLA & dedicated support',
        'On-premise deployment options',
      ],
      limitations: [],
      cta: 'Start Team Trial',
      href: isSignedIn ? '/dashboard?upgrade=team' : '/sign-up?plan=team',
      popular: false,
    },
  ];

  const enterpriseFeatures = [
    'Custom screenshot limits',
    'On-premise deployment',
    'Custom integrations',
    'Dedicated account manager',
    'SLA guarantees',
    'Advanced security & compliance',
    'Custom training & onboarding',
    'Priority feature requests',
  ];

  return (
    <section id="pricing" className="py-20 sm:py-32 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Start free and scale as you grow. No hidden fees, no surprises. 
            Cancel anytime with 30-day money-back guarantee.
          </p>
        </div>

        {/* Pricing toggle */}
        <div className="mt-8 flex justify-center">
          <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <div className="flex">
              <button className="px-4 py-2 text-sm font-medium text-gray-900 bg-blue-100 rounded-md">
                Monthly
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                Annual <span className="text-green-600 text-xs font-bold ml-1">Save 20%</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 ${
                plan.popular
                  ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 shadow-xl scale-105'
                  : 'bg-white border border-gray-200 shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-gray-600">{plan.description}</p>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-lg text-gray-600">/month</span>
                </div>
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
                {plan.limitations.map((limitation, limitationIndex) => (
                  <li key={limitationIndex} className="flex items-start">
                    <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-500 line-through">{limitation}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button
                  asChild
                  className={`w-full ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                      : ''
                  }`}
                  variant={plan.popular ? undefined : 'outline'}
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </div>

              {plan.name === 'Starter' && (
                <p className="mt-4 text-xs text-center text-gray-500">
                  No credit card required
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Enterprise section */}
        <div className="mt-16 bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="px-8 py-12 text-center">
            <h3 className="text-3xl font-bold text-gray-900">Enterprise</h3>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Custom solutions for large organizations with specific requirements. 
              Get dedicated support and tailored features for your team.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
          <div className="bg-gray-50 px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enterpriseFeatures.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ preview */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Questions about pricing?
          </h3>
          <p className="text-gray-600 mb-6">
            Check out our FAQ section or contact our team for personalized help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link href="#faq">View FAQ</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}