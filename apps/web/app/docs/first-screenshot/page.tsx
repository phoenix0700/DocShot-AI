export default function FirstScreenshotPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Your First Screenshot
      </h1>

      <p className="text-xl text-gray-600 mb-8">
        Follow this step-by-step guide to capture your first automated screenshot with DocShot AI.
      </p>

      {/* Prerequisites */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Prerequisites</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>A DocShot AI account (free tier works great!)</li>
          <li>A website or web application you want to monitor</li>
          <li>5 minutes of your time</li>
        </ul>
      </section>

      {/* Step 1 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Step 1: Create Your First Project
        </h2>
        <div className="bg-gray-50 rounded-lg p-6 mb-4">
          <p className="mb-4">
            After signing in, you&apos;ll see the dashboard. Click the <strong>&quot;Create Project&quot;</strong> button.
          </p>
          <div className="bg-white border border-gray-200 rounded-md p-4 font-mono text-sm">
            <p className="text-gray-600"># Example project details:</p>
            <p>Name: <span className="text-blue-600">My Documentation Site</span></p>
            <p>Description: <span className="text-blue-600">Monitor screenshots for our docs</span></p>
          </div>
        </div>
        <p className="text-gray-700">
          Give your project a meaningful name - you&apos;ll likely create multiple projects for different sites or sections.
        </p>
      </section>

      {/* Step 2 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Step 2: Configure Your Screenshots
        </h2>
        <p className="mb-4 text-gray-700">
          DocShot AI uses YAML configuration to define what screenshots to capture. Here&apos;s a simple example to get started:
        </p>
        
        <div className="bg-gray-900 text-gray-100 rounded-lg p-6 mb-4 overflow-x-auto">
          <pre className="text-sm">
{`project:
  name: &quot;My Documentation Site&quot;
  description: &quot;Automated screenshots for our documentation&quot;

screenshots:
  - name: &quot;Homepage Hero&quot;
    url: &quot;https://docs.example.com&quot;
    selector: ".hero-section"  # Optional: capture specific element
    viewport:
      width: 1920
      height: 1080
    enabled: true

  - name: &quot;Getting Started Guide&quot;
    url: &quot;https://docs.example.com/getting-started&quot;
    fullPage: true  # Capture entire page
    viewport:
      width: 1920
      height: 1080
    enabled: true

  - name: &quot;Mobile Homepage&quot;
    url: &quot;https://docs.example.com&quot;
    viewport:
      width: 375
      height: 812
      deviceScaleFactor: 2  # Retina display
    enabled: true`}
          </pre>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Pro Tips:</h3>
          <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
            <li>Use <code className="bg-blue-100 px-1 rounded">selector</code> to capture specific parts of a page</li>
            <li>Set <code className="bg-blue-100 px-1 rounded">fullPage: true</code> to capture long pages entirely</li>
            <li>Test different viewport sizes for responsive design</li>
            <li>Start with 2-3 screenshots and expand from there</li>
          </ul>
        </div>
      </section>

      {/* Step 3 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Step 3: Save and Validate
        </h2>
        <p className="mb-4 text-gray-700">
          The YAML editor will validate your configuration in real-time:
        </p>
        <ul className="space-y-3 mb-6">
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span className="text-gray-700">Green checkmarks indicate valid configuration</span>
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">✗</span>
            <span className="text-gray-700">Red errors show what needs to be fixed</span>
          </li>
          <li className="flex items-start">
            <span className="text-yellow-500 mr-2">⚠</span>
            <span className="text-gray-700">Yellow warnings suggest improvements</span>
          </li>
        </ul>
        <p className="text-gray-700">
          Click <strong>&quot;Save Configuration&quot;</strong> once all errors are resolved.
        </p>
      </section>

      {/* Step 4 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Step 4: Capture Your First Screenshots
        </h2>
        <div className="bg-gray-50 rounded-lg p-6 mb-4">
          <p className="mb-4 text-gray-700">
            Navigate to your project dashboard and click the <strong>&quot;Run Screenshots&quot;</strong> button.
          </p>
          <div className="space-y-3">
            <p className="text-gray-700">
              <span className="font-semibold">1.</span> DocShot AI will queue your screenshot jobs
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">2.</span> Our workers will visit each URL
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">3.</span> Screenshots are captured and stored securely
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">4.</span> You&apos;ll see the results in your dashboard
            </p>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">
            <strong>Success!</strong> Your screenshots will appear in the dashboard within 30-60 seconds.
          </p>
        </div>
      </section>

      {/* Step 5 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Step 5: Review and Approve
        </h2>
        <p className="mb-4 text-gray-700">
          Once captured, you can:
        </p>
        <ul className="space-y-3 mb-6">
          <li className="flex items-start">
            <span className="text-blue-500 mr-3">👁️</span>
            <div>
              <strong className="text-gray-900">View Screenshots</strong>
              <p className="text-gray-600">Click on any screenshot to see it full-size</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-3">🔍</span>
            <div>
              <strong className="text-gray-900">Compare Changes</strong>
              <p className="text-gray-600">When changes are detected, see a visual diff</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-3">✅</span>
            <div>
              <strong className="text-gray-900">Approve Updates</strong>
              <p className="text-gray-600">Accept changes to update your baseline</p>
            </div>
          </li>
        </ul>
      </section>

      {/* What's Next */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          What&apos;s Next?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ⏰ Set Up Scheduling
            </h3>
            <p className="text-gray-600 mb-3">
              Automate captures to run daily, weekly, or on custom schedules.
            </p>
            <a href="/docs/guides/scheduling" className="text-blue-600 hover:text-blue-700">
              Learn about scheduling →
            </a>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🔗 Connect Integrations
            </h3>
            <p className="text-gray-600 mb-3">
              Push screenshots to GitHub, notify via Slack, and more.
            </p>
            <a href="/docs/integrations" className="text-blue-600 hover:text-blue-700">
              Explore integrations →
            </a>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🎯 Advanced Selectors
            </h3>
            <p className="text-gray-600 mb-3">
              Master CSS selectors to capture exactly what you need.
            </p>
            <a href="/docs/guides/css-selectors" className="text-blue-600 hover:text-blue-700">
              CSS selector guide →
            </a>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              📚 YAML Reference
            </h3>
            <p className="text-gray-600 mb-3">
              Explore all configuration options available.
            </p>
            <a href="/docs/yaml-reference" className="text-blue-600 hover:text-blue-700">
              Complete reference →
            </a>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Having Issues?
        </h2>
        <p className="text-gray-600 mb-4">
          Common problems and their solutions:
        </p>
        <ul className="space-y-3 text-sm">
          <li>
            <strong className="text-gray-900">Screenshots timing out?</strong>
            <p className="text-gray-600">Try adding <code className="bg-gray-200 px-1 rounded">waitUntil: &quot;networkidle&quot;</code> to your config</p>
          </li>
          <li>
            <strong className="text-gray-900">Capturing wrong element?</strong>
            <p className="text-gray-600">Use browser DevTools to verify your CSS selector</p>
          </li>
          <li>
            <strong className="text-gray-900">Need authentication?</strong>
            <p className="text-gray-600">See our <a href="/docs/advanced-config#authentication" className="text-blue-600">authentication guide</a></p>
          </li>
        </ul>
        <div className="mt-4">
          <a href="/docs/troubleshooting" className="text-blue-600 hover:text-blue-700">
            View full troubleshooting guide →
          </a>
        </div>
      </section>
    </div>
  );
}