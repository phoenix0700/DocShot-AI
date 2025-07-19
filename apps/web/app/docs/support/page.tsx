export default function SupportPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Support
      </h1>

      <p className="text-xl text-gray-600 mb-8">
        Get help with DocShot AI from our support team and community resources.
      </p>

      {/* Contact Options */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Support</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Email Support</h3>
                <p className="text-sm text-gray-600">Get help from our team</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Send us an email and we&apos;ll get back to you within 24 hours (usually much faster).
            </p>
            <a href="mailto:support@docshot.ai" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
              support@docshot.ai
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">GitHub Issues</h3>
                <p className="text-sm text-gray-600">Report bugs or request features</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Found a bug or have a feature request? Open an issue on GitHub for the community to see and discuss.
            </p>
            <a href="https://github.com/phoenix0700/DocShot-AI/issues" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
              GitHub Issues
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Response Times */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Response Times</h2>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-700">Plan</th>
                <th className="text-left py-3 text-sm font-medium text-gray-700">Email Support</th>
                <th className="text-left py-3 text-sm font-medium text-gray-700">Priority</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-gray-200">
                <td className="py-3">Free</td>
                <td className="py-3 text-gray-600">48 hours</td>
                <td className="py-3 text-gray-600">Standard</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3">Pro</td>
                <td className="py-3 text-gray-600">24 hours</td>
                <td className="py-3 text-gray-600">High</td>
              </tr>
              <tr>
                <td className="py-3">Enterprise</td>
                <td className="py-3 text-gray-600">4 hours</td>
                <td className="py-3 text-gray-600">Critical</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Self-Help Resources */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Self-Help Resources</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="/docs" className="block p-6 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Documentation</h3>
            <p className="text-gray-600 text-sm">
              Comprehensive guides, API reference, and configuration examples.
            </p>
          </a>

          <a href="/docs/faq" className="block p-6 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">FAQ</h3>
            <p className="text-gray-600 text-sm">
              Answers to frequently asked questions about features and billing.
            </p>
          </a>

          <a href="/docs/troubleshooting" className="block p-6 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Troubleshooting</h3>
            <p className="text-gray-600 text-sm">
              Step-by-step solutions to common issues and error messages.
            </p>
          </a>
        </div>
      </section>

      {/* Before You Contact Us */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Before You Contact Us</h2>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Help Us Help You Faster</h3>
          <p className="text-blue-800 mb-4">
            When contacting support, please include:
          </p>
          <ul className="space-y-2 text-blue-800">
            <li>• Your account email address</li>
            <li>• Project ID (if applicable)</li>
            <li>• Detailed description of the issue</li>
            <li>• Steps to reproduce the problem</li>
            <li>• Error messages or screenshots</li>
            <li>• Your YAML configuration (remove sensitive data)</li>
            <li>• Browser and operating system information</li>
          </ul>
        </div>
      </section>

      {/* Status Page */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">System Status</h2>
        
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Check Service Status</h3>
              <p className="text-gray-700">
                Before reporting an issue, check if it&apos;s a known system-wide problem.
              </p>
            </div>
            <a href="https://status.docshot.ai" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              View Status Page
            </a>
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Community Resources
        </h2>
        
        <p className="text-gray-700 mb-4">
          Connect with other DocShot AI users and stay updated:
        </p>
        
        <div className="space-y-3">
          <a href="https://github.com/phoenix0700/DocShot-AI/discussions" target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-700">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub Discussions
          </a>
          
          <a href="https://twitter.com/docshotai" target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-700">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            @docshotai
          </a>
          
          <p className="text-gray-600 text-sm">
            Follow for updates, tips, and community highlights
          </p>
        </div>
      </section>
    </div>
  );
}