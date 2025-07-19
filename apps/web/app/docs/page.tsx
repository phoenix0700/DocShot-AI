import { Button } from '../../components/ui/Button';
import Link from 'next/link';

export default function DocsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Welcome to DocShot AI Documentation
      </h1>
      
      <p className="text-xl text-gray-600 mb-8">
        Learn how to automate your screenshot management and keep your documentation always up-to-date.
      </p>

      {/* Quick Start Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Start</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Get up and running in 5 minutes
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Create your account and first project</li>
            <li>Configure your screenshots with YAML</li>
            <li>Run your first screenshot capture</li>
            <li>Set up automatic scheduling</li>
            <li>Connect your integrations</li>
          </ol>
          <div className="mt-4">
            <Link href="/docs/first-screenshot">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Start Tutorial →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🎯 Automated Screenshot Capture
            </h3>
            <p className="text-gray-600 mb-3">
              Schedule screenshots to run automatically on any interval. Never manually update screenshots again.
            </p>
            <Link href="/docs/guides/scheduling" className="text-blue-600 hover:text-blue-700">
              Learn about scheduling →
            </Link>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🔍 Visual Diff Detection
            </h3>
            <p className="text-gray-600 mb-3">
              Automatically detect changes in your UI and get notified. Review and approve changes before they go live.
            </p>
            <Link href="/docs/guides/best-practices#visual-diff" className="text-blue-600 hover:text-blue-700">
              How it works →
            </Link>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🔗 Seamless Integrations
            </h3>
            <p className="text-gray-600 mb-3">
              Push approved screenshots directly to GitHub, notify your team via Slack, and more.
            </p>
            <Link href="/docs/integrations" className="text-blue-600 hover:text-blue-700">
              View integrations →
            </Link>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              📝 Simple YAML Configuration
            </h3>
            <p className="text-gray-600 mb-3">
              Configure everything with simple, readable YAML. No complex UI, just straightforward configuration.
            </p>
            <Link href="/docs/yaml-reference" className="text-blue-600 hover:text-blue-700">
              YAML reference →
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Popular Topics</h2>
        <div className="space-y-3">
          <Link href="/docs/yaml-reference" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
            <h3 className="font-semibold text-gray-900">Complete YAML Reference</h3>
            <p className="text-gray-600 text-sm">Learn every configuration option available</p>
          </Link>
          
          <Link href="/docs/integrations/github" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
            <h3 className="font-semibold text-gray-900">GitHub Integration</h3>
            <p className="text-gray-600 text-sm">Automatically push screenshots to your repository</p>
          </Link>
          
          <Link href="/docs/troubleshooting" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
            <h3 className="font-semibold text-gray-900">Troubleshooting Guide</h3>
            <p className="text-gray-600 text-sm">Solutions to common issues and error messages</p>
          </Link>
        </div>
      </section>

      {/* Need Help */}
      <section className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Need Help?</h2>
        <p className="text-gray-600 mb-4">
          Can't find what you're looking for? We're here to help.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/docs/support">
            <Button variant="outline">Contact Support</Button>
          </Link>
          <Link href="/docs/faq">
            <Button variant="outline">Browse FAQ</Button>
          </Link>
          <a href="https://github.com/phoenix0700/DocShot-AI/issues" target="_blank" rel="noopener noreferrer">
            <Button variant="outline">Report an Issue</Button>
          </a>
        </div>
      </section>
    </div>
  );
}