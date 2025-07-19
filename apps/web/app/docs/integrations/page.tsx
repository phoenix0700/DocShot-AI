export default function IntegrationsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Integrations Overview
      </h1>

      <p className="text-xl text-gray-600 mb-8">
        Connect DocShot AI with your favorite tools to automate your screenshot workflow.
      </p>

      {/* Available Integrations */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Available Integrations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* GitHub */}
          <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">GitHub</h3>
                <p className="text-sm text-gray-600">Push screenshots to your repository</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Automatically commit approved screenshots to your GitHub repository. Perfect for documentation sites using static site generators.
            </p>
            <a href="/docs/integrations/github" className="text-blue-600 hover:text-blue-700 font-medium">
              Setup GitHub integration →
            </a>
          </div>

          {/* Slack */}
          <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Slack</h3>
                <p className="text-sm text-gray-600">Get notifications in your channels</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Receive instant notifications when screenshots change. Keep your team informed with visual diffs right in Slack.
            </p>
            <a href="/docs/integrations/slack" className="text-blue-600 hover:text-blue-700 font-medium">
              Setup Slack integration →
            </a>
          </div>

          {/* Email */}
          <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-600">Stay updated via email</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Get email summaries of screenshot changes. Perfect for stakeholders who need to stay informed without accessing the dashboard.
            </p>
            <a href="/docs/integrations/email" className="text-blue-600 hover:text-blue-700 font-medium">
              Setup email notifications →
            </a>
          </div>

          {/* Webhooks */}
          <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Webhooks</h3>
                <p className="text-sm text-gray-600">Custom integrations via HTTP</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Build custom integrations with webhooks. Receive HTTP POST requests when screenshots are captured or changed.
            </p>
            <a href="/docs/integrations/webhooks" className="text-blue-600 hover:text-blue-700 font-medium">
              Setup webhooks →
            </a>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Coming Soon</h2>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Notion</h3>
              <p className="text-gray-600 text-sm">Update documentation pages automatically</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Confluence</h3>
              <p className="text-gray-600 text-sm">Keep your knowledge base up-to-date</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Microsoft Teams</h3>
              <p className="text-gray-600 text-sm">Notifications in Teams channels</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Discord</h3>
              <p className="text-gray-600 text-sm">Updates for your community</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">GitLab</h3>
              <p className="text-gray-600 text-sm">Alternative to GitHub integration</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Zapier</h3>
              <p className="text-gray-600 text-sm">Connect to 5000+ apps</p>
            </div>
          </div>
        </div>
      </section>

      {/* How Integrations Work */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">How Integrations Work</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Configure in YAML</h3>
            <p className="text-gray-700 mb-3">
              Add integration settings to your project's YAML configuration:
            </p>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
{`integrations:
  github:
    repo: "your-org/your-repo"
    path: "docs/screenshots"
  slack:
    webhook: "https://hooks.slack.com/..."
  email:
    recipients: ["team@example.com"]`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Authenticate</h3>
            <p className="text-gray-700">
              Some integrations require authentication tokens or API keys. Store these securely as environment variables in your project settings.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Automatic Triggers</h3>
            <p className="text-gray-700">
              Integrations trigger automatically based on events:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3">
              <li>When screenshots are captured</li>
              <li>When visual changes are detected</li>
              <li>When changes are approved</li>
              <li>On scheduled intervals (daily/weekly summaries)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Integration Best Practices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">✅ Do's</h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li>• Use environment variables for sensitive data</li>
              <li>• Test integrations with a single screenshot first</li>
              <li>• Set up appropriate notification schedules</li>
              <li>• Use specific channels/recipients for different projects</li>
              <li>• Document your integration setup for team members</li>
            </ul>
          </div>

          <div className="bg-red-50 rounded-lg p-6">
            <h3 className="font-semibold text-red-900 mb-3">❌ Don'ts</h3>
            <ul className="space-y-2 text-red-800 text-sm">
              <li>• Don't commit API keys or tokens to your repo</li>
              <li>• Don't spam channels with too frequent updates</li>
              <li>• Don't use production webhooks for testing</li>
              <li>• Don't ignore failed integration notifications</li>
              <li>• Don't give excessive permissions to tokens</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Common Integration Issues
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900">GitHub push failing?</h3>
            <p className="text-gray-600 text-sm">Check that your token has write permissions and the branch exists.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Not receiving Slack notifications?</h3>
            <p className="text-gray-600 text-sm">Verify your webhook URL is correct and the channel allows bot posts.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Email going to spam?</h3>
            <p className="text-gray-600 text-sm">Add noreply@docshot.ai to your email whitelist.</p>
          </div>
        </div>
        <div className="mt-6">
          <a href="/docs/troubleshooting#integrations" className="text-blue-600 hover:text-blue-700 text-sm">
            View full troubleshooting guide →
          </a>
        </div>
      </section>
    </div>
  );
}