export default function FAQPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Frequently Asked Questions
      </h1>

      <p className="text-xl text-gray-600 mb-8">
        Find answers to common questions about DocShot AI.
      </p>

      {/* General Questions */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">General Questions</h2>
        
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              What is DocShot AI?
            </h3>
            <p className="text-gray-700">
              DocShot AI is an automated screenshot management platform that captures, monitors, and updates screenshots in your documentation. It detects visual changes in your product and helps keep your docs, help centers, and marketing materials up-to-date with zero manual effort.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              How does DocShot AI work?
            </h3>
            <p className="text-gray-700 mb-3">
              DocShot AI works in four simple steps:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>You configure which screenshots to capture using simple YAML</li>
              <li>Our headless browsers automatically capture screenshots on your schedule</li>
              <li>Visual diff detection identifies any changes from previous versions</li>
              <li>You review and approve changes, which are then pushed to your integrations</li>
            </ol>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Who is DocShot AI for?
            </h3>
            <p className="text-gray-700">
              DocShot AI is perfect for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3">
              <li>Technical writers maintaining documentation sites</li>
              <li>Product teams keeping help centers updated</li>
              <li>Marketing teams with screenshot-heavy content</li>
              <li>SaaS companies with frequently changing UIs</li>
              <li>Anyone tired of manually updating screenshots</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              What makes DocShot AI different from taking screenshots manually?
            </h3>
            <p className="text-gray-700">
              Manual screenshots are time-consuming and error-prone. DocShot AI automates the entire process - from capture to deployment. It runs on a schedule, detects changes automatically, maintains consistent image quality, and pushes updates directly to your documentation platforms. What used to take hours now happens automatically.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing & Billing */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Pricing & Billing</h2>
        
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Is there a free plan?
            </h3>
            <p className="text-gray-700">
              Yes! Our free plan includes 10 screenshots per month, perfect for trying out DocShot AI or managing a small documentation site. No credit card required to get started.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              What counts as a screenshot?
            </h3>
            <p className="text-gray-700 mb-3">
              Each captured image counts as one screenshot, regardless of whether changes were detected. For example:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Daily capture of 5 screenshots = 150 screenshots/month</li>
              <li>Weekly capture of 20 screenshots = 80 screenshots/month</li>
              <li>Failed captures don't count against your limit</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Can I change plans anytime?
            </h3>
            <p className="text-gray-700">
              Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll get immediate access to higher limits. When downgrading, the change takes effect at the next billing cycle.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              What payment methods do you accept?
            </h3>
            <p className="text-gray-700">
              We accept all major credit cards (Visa, MasterCard, American Express) through Stripe. For Enterprise customers, we also offer invoicing and bank transfers.
            </p>
          </div>
        </div>
      </section>

      {/* Technical Questions */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Technical Questions</h2>
        
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Can DocShot AI capture pages behind login?
            </h3>
            <p className="text-gray-700 mb-3">
              Yes! DocShot AI supports multiple authentication methods:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Cookie-based authentication</li>
              <li>HTTP headers (Bearer tokens, API keys)</li>
              <li>Basic authentication</li>
              <li>Custom login flows using JavaScript</li>
            </ul>
            <p className="text-gray-700 mt-3">
              See our <a href="/docs/yaml-reference#authentication" className="text-blue-600 hover:text-blue-700">authentication documentation</a> for setup instructions.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              What browsers does DocShot AI use?
            </h3>
            <p className="text-gray-700">
              DocShot AI uses headless Chromium (via Puppeteer) for all screenshot captures. This ensures consistency and supports all modern web technologies including JavaScript, CSS3, and web fonts. The browser is always up-to-date with the latest stable version.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              How accurate is the visual diff detection?
            </h3>
            <p className="text-gray-700">
              Our visual diff algorithm uses pixel-by-pixel comparison with configurable sensitivity. By default, we detect changes when more than 10% of pixels differ, but you can adjust this threshold. The algorithm ignores minor anti-aliasing differences and can be configured to ignore specific regions.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Can I capture specific parts of a page?
            </h3>
            <p className="text-gray-700">
              Absolutely! You can capture:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3">
              <li>Full pages with <code className="bg-gray-100 px-1 rounded">fullPage: true</code></li>
              <li>Specific elements using CSS selectors</li>
              <li>Custom viewport sizes for responsive testing</li>
              <li>Multiple elements from the same page</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              What image formats are supported?
            </h3>
            <p className="text-gray-700">
              All screenshots are captured and stored as PNG files for maximum quality and transparency support. Images are optimized for web delivery without quality loss.
            </p>
          </div>
        </div>
      </section>

      {/* Integration Questions */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Integration Questions</h2>
        
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Which platforms can DocShot AI integrate with?
            </h3>
            <p className="text-gray-700 mb-3">
              Currently supported integrations:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>GitHub</strong> - Push screenshots directly to your repository</li>
              <li><strong>Slack</strong> - Get notifications about changes</li>
              <li><strong>Email</strong> - Receive summaries and change alerts</li>
              <li><strong>Webhooks</strong> - Build custom integrations</li>
            </ul>
            <p className="text-gray-700 mt-3">
              Coming soon: Notion, Confluence, GitLab, Discord, and more!
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              How does the GitHub integration work?
            </h3>
            <p className="text-gray-700">
              Once configured, DocShot AI automatically commits approved screenshots to your GitHub repository. You can choose to commit directly to a branch or create pull requests for review. The integration uses fine-grained personal access tokens for security.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Can I use my own storage?
            </h3>
            <p className="text-gray-700">
              Enterprise customers can configure custom S3-compatible storage (AWS S3, Cloudflare R2, MinIO, etc.). This gives you full control over where your screenshots are stored. Contact us for setup assistance.
            </p>
          </div>
        </div>
      </section>

      {/* Security & Privacy */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Security & Privacy</h2>
        
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              How secure is DocShot AI?
            </h3>
            <p className="text-gray-700 mb-3">
              We take security seriously:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>All data is encrypted in transit (TLS 1.3) and at rest</li>
              <li>Screenshots are stored in secure, access-controlled buckets</li>
              <li>API keys and tokens are encrypted and never exposed</li>
              <li>Row-level security ensures data isolation between accounts</li>
              <li>Regular security audits and penetration testing</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Can others see my screenshots?
            </h3>
            <p className="text-gray-700">
              No. Your screenshots are private to your account. Each screenshot URL is signed and time-limited. We use row-level security in our database to ensure complete data isolation between customers. Even our support team cannot access your screenshots without explicit permission.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              What about GDPR compliance?
            </h3>
            <p className="text-gray-700">
              DocShot AI is GDPR compliant. You can request data export or deletion at any time. We only process data necessary for the service, and you maintain full ownership of your screenshots. See our <a href="/privacy" className="text-blue-600 hover:text-blue-700">Privacy Policy</a> for details.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              How long are screenshots retained?
            </h3>
            <p className="text-gray-700">
              Screenshots are retained based on your plan:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3">
              <li>Free: 30 days of history</li>
              <li>Pro: 90 days of history</li>
              <li>Team: 1 year of history</li>
              <li>Enterprise: Unlimited retention</li>
            </ul>
            <p className="text-gray-700 mt-3">
              You can delete screenshots at any time, and they'll be permanently removed within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Common Use Cases */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Common Use Cases</h2>
        
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              📚 Documentation Sites
            </h3>
            <p className="text-gray-700 mb-3">
              Keep technical documentation up-to-date:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>API documentation with live examples</li>
              <li>User guides with UI screenshots</li>
              <li>Installation and setup tutorials</li>
              <li>Feature announcements</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              🎯 Marketing Websites
            </h3>
            <p className="text-gray-700 mb-3">
              Ensure marketing materials reflect the current product:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Landing page product shots</li>
              <li>Feature comparison tables</li>
              <li>Case study screenshots</li>
              <li>Blog post illustrations</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              🤝 Customer Support
            </h3>
            <p className="text-gray-700 mb-3">
              Keep help centers accurate:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Knowledge base articles</li>
              <li>Troubleshooting guides</li>
              <li>FAQ screenshots</li>
              <li>Video tutorial thumbnails</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              🧪 QA & Testing
            </h3>
            <p className="text-gray-700 mb-3">
              Monitor UI changes across releases:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Visual regression testing</li>
              <li>Cross-browser compatibility</li>
              <li>Responsive design validation</li>
              <li>A/B test documentation</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Getting Help */}
      <section className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Didn't Find Your Answer?
        </h2>
        
        <p className="text-gray-700 mb-4">
          We're here to help! Here are ways to get assistance:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/docs" className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
            <h3 className="font-semibold text-gray-900 mb-1">📖 Documentation</h3>
            <p className="text-gray-600 text-sm">Browse our comprehensive docs</p>
          </a>
          
          <a href="mailto:support@docshot.ai" className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
            <h3 className="font-semibold text-gray-900 mb-1">📧 Email Support</h3>
            <p className="text-gray-600 text-sm">Get help from our team</p>
          </a>
          
          <a href="https://github.com/phoenix0700/DocShot-AI/issues" className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
            <h3 className="font-semibold text-gray-900 mb-1">🐛 Report Issues</h3>
            <p className="text-gray-600 text-sm">Submit bugs or feature requests</p>
          </a>
        </div>
      </section>
    </div>
  );
}