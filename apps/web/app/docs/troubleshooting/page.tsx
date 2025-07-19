export default function TroubleshootingPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Troubleshooting Guide
      </h1>

      <p className="text-xl text-gray-600 mb-8">
        Solutions to common issues and error messages in DocShot AI.
      </p>

      {/* Quick Diagnostics */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Diagnostics</h2>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Before You Start</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Check the <a href="https://status.docshot.ai" className="underline">status page</a> for any ongoing incidents</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Ensure you're using the latest version of your browser</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Clear your browser cache and cookies for docshot.ai</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Verify your subscription is active and within limits</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Common Issues */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Common Issues</h2>
        
        <div className="space-y-6">
          {/* Screenshot Capture Issues */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">📸 Screenshot Capture Issues</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {/* Timeout Error */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Screenshot capture times out
                </h4>
                <p className="text-gray-700 mb-3">
                  Error: "Navigation timeout exceeded" or "Timeout waiting for selector"
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-gray-900 mb-2">Solutions:</p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
                    <li>
                      Increase wait time in your YAML configuration:
                      <pre className="bg-white rounded p-2 mt-1 text-xs overflow-x-auto">
{`waitFor: 5000  # Wait 5 seconds
waitUntil: "networkidle0"  # Wait for all network activity`}
                      </pre>
                    </li>
                    <li>Check if the page requires authentication - add cookies or headers if needed</li>
                    <li>Verify the URL is publicly accessible</li>
                    <li>For dynamic content, use a more specific selector</li>
                    <li>Consider using <code className="bg-gray-200 px-1 rounded">beforeScript</code> to wait for elements</li>
                  </ol>
                </div>
              </div>

              {/* Wrong Element Captured */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Wrong element or area captured
                </h4>
                <p className="text-gray-700 mb-3">
                  The screenshot shows the wrong part of the page
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-gray-900 mb-2">Solutions:</p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
                    <li>Verify your CSS selector is unique and specific</li>
                    <li>
                      Use browser DevTools to test selectors:
                      <pre className="bg-white rounded p-2 mt-1 text-xs overflow-x-auto">
{`document.querySelector('.your-selector')`}
                      </pre>
                    </li>
                    <li>Consider using ID selectors for precision: <code className="bg-gray-200 px-1 rounded">#unique-id</code></li>
                    <li>For full page captures, use <code className="bg-gray-200 px-1 rounded">fullPage: true</code></li>
                    <li>Check if the element is inside an iframe (not supported)</li>
                  </ol>
                </div>
              </div>

              {/* Authentication Required */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Page requires login/authentication
                </h4>
                <p className="text-gray-700 mb-3">
                  Screenshot shows login page instead of actual content
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-gray-900 mb-2">Solutions:</p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
                    <li>
                      Add authentication cookies:
                      <pre className="bg-white rounded p-2 mt-1 text-xs overflow-x-auto">
{`cookies:
  - name: "session_token"
    value: "{{SESSION_TOKEN}}"
    domain: "app.example.com"`}
                      </pre>
                    </li>
                    <li>
                      Use basic authentication:
                      <pre className="bg-white rounded p-2 mt-1 text-xs overflow-x-auto">
{`authentication:
  type: "basic"
  username: "user"
  password: "{{PASSWORD}}"`}
                      </pre>
                    </li>
                    <li>Add authorization headers for API-based auth</li>
                    <li>Consider using a public/demo version of the page</li>
                  </ol>
                </div>
              </div>

              {/* Dynamic Content */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Dynamic content not loading
                </h4>
                <p className="text-gray-700 mb-3">
                  JavaScript-rendered content appears blank or incomplete
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-gray-900 mb-2">Solutions:</p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
                    <li>Wait for specific elements to appear:
                      <pre className="bg-white rounded p-2 mt-1 text-xs overflow-x-auto">
{`waitUntil: "networkidle"
waitFor: 3000`}
                      </pre>
                    </li>
                    <li>Use JavaScript to wait for content:
                      <pre className="bg-white rounded p-2 mt-1 text-xs overflow-x-auto">
{`beforeScript: |
  await new Promise(r => {
    const check = setInterval(() => {
      if (document.querySelector('.dynamic-content')) {
        clearInterval(check);
        r();
      }
    }, 100);
  });`}
                      </pre>
                    </li>
                    <li>Check browser console for JavaScript errors</li>
                    <li>Ensure all required API endpoints are accessible</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Diff Issues */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">🔍 Visual Diff Detection Issues</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {/* False Positives */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Too many false positive changes detected
                </h4>
                <p className="text-gray-700 mb-3">
                  DocShot detects changes when nothing visually changed
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-gray-900 mb-2">Common Causes & Solutions:</p>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>
                      <strong>Dynamic timestamps:</strong> Hide elements with changing dates/times
                      <pre className="bg-white rounded p-2 mt-1 text-xs overflow-x-auto">
{`beforeScript: |
  document.querySelectorAll('.timestamp').forEach(el => el.style.display = 'none');`}
                      </pre>
                    </li>
                    <li>
                      <strong>Animations:</strong> Wait for animations to complete or disable them
                    </li>
                    <li>
                      <strong>Random content:</strong> Use specific selectors to exclude dynamic areas
                    </li>
                    <li>
                      <strong>Font rendering:</strong> Ensure consistent font loading
                    </li>
                  </ul>
                </div>
              </div>

              {/* Missing Changes */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Real changes not being detected
                </h4>
                <p className="text-gray-700 mb-3">
                  Visual changes aren't triggering notifications
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-gray-900 mb-2">Solutions:</p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
                    <li>Check the diff threshold in your configuration</li>
                    <li>Ensure screenshots are being captured at the same viewport size</li>
                    <li>Verify the baseline screenshot is up-to-date</li>
                    <li>Look for very small changes that might be below threshold</li>
                    <li>Check if changes are in excluded areas</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Integration Issues */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">🔗 Integration Issues</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {/* GitHub Push Failed */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  GitHub push failing
                </h4>
                <p className="text-gray-700 mb-3">
                  Error: "Permission denied" or "Repository not found"
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-gray-900 mb-2">Checklist:</p>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>✓ GitHub token has "Contents: Write" permission</li>
                    <li>✓ Repository format is "owner/repo"</li>
                    <li>✓ Branch exists and you have access</li>
                    <li>✓ Token hasn't expired</li>
                    <li>✓ Path doesn't contain invalid characters</li>
                  </ul>
                  <div className="mt-3 p-3 bg-yellow-50 rounded">
                    <p className="text-sm text-yellow-800">
                      <strong>Tip:</strong> Test with a personal repo first to verify setup
                    </p>
                  </div>
                </div>
              </div>

              {/* Slack Not Receiving */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Slack notifications not arriving
                </h4>
                <p className="text-gray-700 mb-3">
                  Webhook configured but no messages appear
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-gray-900 mb-2">Debug Steps:</p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
                    <li>Test webhook with curl:
                      <pre className="bg-white rounded p-2 mt-1 text-xs overflow-x-auto">
{`curl -X POST -H 'Content-type: application/json' \\
  --data '{"text":"Test from DocShot"}' \\
  YOUR_WEBHOOK_URL`}
                      </pre>
                    </li>
                    <li>Check if notifications are enabled in YAML</li>
                    <li>Verify channel allows app posts</li>
                    <li>Look for errors in job logs</li>
                    <li>Ensure webhook URL hasn't been revoked</li>
                  </ol>
                </div>
              </div>

              {/* Email Spam */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Emails going to spam
                </h4>
                <p className="text-gray-700 mb-3">
                  Notification emails are filtered as spam
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-gray-900 mb-2">Solutions:</p>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Add <strong>noreply@docshot.ai</strong> to your email whitelist</li>
                    <li>• Use company email addresses, not personal</li>
                    <li>• Check with IT about email security policies</li>
                    <li>• Verify SPF/DKIM records if using custom domain</li>
                    <li>• Reduce email frequency to avoid rate limits</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Issues */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">⚡ Performance Issues</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {/* Slow Captures */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Screenshot captures are very slow
                </h4>
                <p className="text-gray-700 mb-3">
                  Each screenshot takes minutes to capture
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-gray-900 mb-2">Optimization Tips:</p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
                    <li>Reduce viewport size if full resolution isn't needed</li>
                    <li>Use specific selectors instead of full page captures</li>
                    <li>Minimize <code className="bg-gray-200 px-1 rounded">waitFor</code> times</li>
                    <li>Disable unnecessary resource loading:
                      <pre className="bg-white rounded p-2 mt-1 text-xs overflow-x-auto">
{`blockResources: ["font", "image"]  # If text-only needed`}
                      </pre>
                    </li>
                    <li>Check if target site has rate limiting</li>
                  </ol>
                </div>
              </div>

              {/* Queue Backed Up */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Jobs stuck in queue
                </h4>
                <p className="text-gray-700 mb-3">
                  Screenshots queued but not processing
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-gray-900 mb-2">Possible Causes:</p>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• High system load - wait a few minutes</li>
                    <li>• Subscription limit reached - check usage</li>
                    <li>• Previous job failures blocking queue</li>
                    <li>• Scheduled maintenance (check status page)</li>
                  </ul>
                  <div className="mt-3 p-3 bg-blue-50 rounded">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Free tier has lower queue priority during peak hours
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Error Messages */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Common Error Messages</h2>
        
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-mono text-sm text-red-600 mb-2">
              "Subscription limit reached"
            </h3>
            <p className="text-gray-700 text-sm mb-2">
              You've exceeded your monthly screenshot limit.
            </p>
            <p className="text-gray-600 text-sm">
              <strong>Solution:</strong> Upgrade your plan or wait for the next billing cycle.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-mono text-sm text-red-600 mb-2">
              "Invalid YAML configuration"
            </h3>
            <p className="text-gray-700 text-sm mb-2">
              Your YAML has syntax errors or invalid fields.
            </p>
            <p className="text-gray-600 text-sm">
              <strong>Solution:</strong> Use the YAML editor's validation to find and fix errors.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-mono text-sm text-red-600 mb-2">
              "Failed to capture screenshot: ERR_NAME_NOT_RESOLVED"
            </h3>
            <p className="text-gray-700 text-sm mb-2">
              The URL cannot be reached (DNS error).
            </p>
            <p className="text-gray-600 text-sm">
              <strong>Solution:</strong> Verify the URL is correct and publicly accessible.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-mono text-sm text-red-600 mb-2">
              "Storage upload failed"
            </h3>
            <p className="text-gray-700 text-sm mb-2">
              Screenshot captured but couldn't be saved.
            </p>
            <p className="text-gray-600 text-sm">
              <strong>Solution:</strong> This is usually temporary. Retry the capture.
            </p>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Best Practices to Avoid Issues</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-3">✅ Do's</h3>
            <ul className="space-y-2 text-green-800 text-sm">
              <li>• Test selectors in browser DevTools first</li>
              <li>• Start with a single screenshot to verify setup</li>
              <li>• Use environment variables for sensitive data</li>
              <li>• Monitor your usage to avoid limits</li>
              <li>• Keep screenshots focused on specific elements</li>
              <li>• Document your YAML configuration</li>
              <li>• Regular review and cleanup old screenshots</li>
            </ul>
          </div>

          <div className="bg-red-50 rounded-lg p-6">
            <h3 className="font-semibold text-red-900 mb-3">❌ Don'ts</h3>
            <ul className="space-y-2 text-red-800 text-sm">
              <li>• Don't capture entire pages if not needed</li>
              <li>• Don't use overly generic CSS selectors</li>
              <li>• Don't ignore validation warnings</li>
              <li>• Don't hardcode credentials in YAML</li>
              <li>• Don't set excessive wait times</li>
              <li>• Don't capture frequently changing content</li>
              <li>• Don't enable all notifications at once</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Debug Mode */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Debug Mode</h2>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-gray-700 mb-4">
            Enable debug mode to get detailed logs for troubleshooting:
          </p>
          
          <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-4">
            <pre className="text-sm overflow-x-auto">
{`# In your YAML configuration
debug:
  enabled: true
  logLevel: "verbose"
  saveHtml: true      # Save page HTML for inspection
  saveConsole: true   # Capture browser console logs
  screenshots: true   # Save screenshots at each step`}
            </pre>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              <strong>Warning:</strong> Debug mode increases processing time and storage usage. Disable after troubleshooting.
            </p>
          </div>
        </div>
      </section>

      {/* Get Help */}
      <section className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Still Need Help?
        </h2>
        
        <p className="text-gray-700 mb-4">
          If you can't find a solution here, we're ready to help:
        </p>
        
        <div className="space-y-3">
          <div className="flex items-start">
            <span className="text-blue-500 mr-3">📧</span>
            <div>
              <strong className="text-gray-900">Email Support</strong>
              <p className="text-gray-600 text-sm">support@docshot.ai - Response within 24 hours</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <span className="text-blue-500 mr-3">💬</span>
            <div>
              <strong className="text-gray-900">Live Chat</strong>
              <p className="text-gray-600 text-sm">Available weekdays 9 AM - 5 PM EST for Pro/Team plans</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <span className="text-blue-500 mr-3">🐛</span>
            <div>
              <strong className="text-gray-900">Report a Bug</strong>
              <p className="text-gray-600 text-sm">
                <a href="https://github.com/phoenix0700/DocShot-AI/issues" className="text-blue-600 hover:text-blue-700">
                  GitHub Issues
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700 mb-2">
            <strong>When contacting support, please include:</strong>
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>Your project ID</li>
            <li>Screenshot name and URL</li>
            <li>Error messages (exact text)</li>
            <li>YAML configuration (remove sensitive data)</li>
            <li>Time when the issue occurred</li>
          </ul>
        </div>
      </section>
    </div>
  );
}