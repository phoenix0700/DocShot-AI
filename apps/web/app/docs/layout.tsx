'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Quick Start', href: '/docs' },
      { title: 'Installation', href: '/docs/installation' },
      { title: 'Your First Screenshot', href: '/docs/first-screenshot' },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { title: 'YAML Reference', href: '/docs/yaml-reference' },
      { title: 'Project Settings', href: '/docs/project-settings' },
      { title: 'Advanced Configuration', href: '/docs/advanced-config' },
    ],
  },
  {
    title: 'Integrations',
    items: [
      { title: 'Overview', href: '/docs/integrations' },
      { title: 'GitHub', href: '/docs/integrations/github' },
      { title: 'Slack', href: '/docs/integrations/slack' },
      { title: 'Email Notifications', href: '/docs/integrations/email' },
      { title: 'Webhooks', href: '/docs/integrations/webhooks' },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { title: 'Overview', href: '/docs/api' },
      { title: 'Authentication', href: '/docs/api/authentication' },
      { title: 'Endpoints', href: '/docs/api/endpoints' },
      { title: 'Webhooks', href: '/docs/api/webhooks' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { title: 'Best Practices', href: '/docs/guides/best-practices' },
      { title: 'CSS Selectors', href: '/docs/guides/css-selectors' },
      { title: 'Scheduling', href: '/docs/guides/scheduling' },
      { title: 'Team Collaboration', href: '/docs/guides/teams' },
    ],
  },
  {
    title: 'Help',
    items: [
      { title: 'Troubleshooting', href: '/docs/troubleshooting' },
      { title: 'FAQ', href: '/docs/faq' },
      { title: 'Support', href: '/docs/support' },
    ],
  },
];

function DocsNavigation() {
  const pathname = usePathname();

  return (
    <nav className="space-y-8 sticky top-20">
      {navigation.map((section) => (
        <div key={section.title}>
          <h3 className="font-semibold text-gray-900 mb-3">{section.title}</h3>
          <ul className="space-y-2">
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                DocShot AI
              </Link>
              <span className="ml-4 text-sm text-gray-500">Documentation</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <Link
                href="/support"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0 hidden lg:block">
            <DocsNavigation />
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <article className="prose prose-blue max-w-none">
              {children}
            </article>
          </main>

          {/* Table of Contents */}
          <aside className="w-64 flex-shrink-0 hidden xl:block">
            <div className="sticky top-20">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">On this page</h4>
              <div id="table-of-contents" className="text-sm space-y-2">
                {/* This will be populated by client-side JavaScript */}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}