export default function YamlReferencePage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        YAML Configuration Reference
      </h1>

      <p className="text-xl text-gray-600 mb-8">
        Complete reference for all YAML configuration options in DocShot AI.
      </p>

      {/* Quick Example */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Example</h2>
        <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
          <pre className="text-sm">
{`project:
  name: "My Documentation"
  description: "Automated screenshots for our docs"

defaults:
  viewport:
    width: 1920
    height: 1080
  waitUntil: "networkidle"

screenshots:
  - name: "Homepage"
    url: "https://example.com"
    fullPage: true
    enabled: true

integrations:
  github:
    repo: "owner/repository"
    path: "docs/screenshots"
    branch: "main"
  email:
    recipients:
      - "team@example.com"
    schedule: "daily"

schedule:
  interval: "daily"
  time: "09:00"
  timezone: "America/New_York"`}
          </pre>
        </div>
      </section>

      {/* Project Configuration */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Project Configuration</h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">project.name</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">string</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">Yes</td>
                <td className="px-6 py-4 text-sm">Name of your project</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">project.description</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">string</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">No</td>
                <td className="px-6 py-4 text-sm">Optional description of the project</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">project.tags</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">string[]</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">No</td>
                <td className="px-6 py-4 text-sm">Tags for organizing projects</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Example:</h3>
          <pre className="text-sm bg-white rounded p-3 border border-gray-200">
{`project:
  name: "Marketing Site"
  description: "Screenshots for marketing pages and landing pages"
  tags: ["marketing", "public", "landing-pages"]`}
          </pre>
        </div>
      </section>

      {/* Screenshot Configuration */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Screenshot Configuration</h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Default</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">name</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">string</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">Required</td>
                <td className="px-6 py-4 text-sm">Unique name for this screenshot</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">url</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">string</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">Required</td>
                <td className="px-6 py-4 text-sm">URL to capture</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">selector</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">string</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">null</td>
                <td className="px-6 py-4 text-sm">CSS selector for specific element</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">fullPage</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">boolean</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">false</td>
                <td className="px-6 py-4 text-sm">Capture entire page height</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">viewport</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">object</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">1920×1080</td>
                <td className="px-6 py-4 text-sm">Browser viewport dimensions</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">waitUntil</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">string</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">"networkidle"</td>
                <td className="px-6 py-4 text-sm">When to consider page loaded</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">waitFor</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">number</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">0</td>
                <td className="px-6 py-4 text-sm">Additional wait time (ms)</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">enabled</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">boolean</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">true</td>
                <td className="px-6 py-4 text-sm">Enable/disable this screenshot</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">authentication</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">object</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">null</td>
                <td className="px-6 py-4 text-sm">Authentication configuration</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">headers</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">object</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">null</td>
                <td className="px-6 py-4 text-sm">Custom HTTP headers</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">cookies</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">array</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">null</td>
                <td className="px-6 py-4 text-sm">Cookies to set before capture</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">beforeScript</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">string</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">null</td>
                <td className="px-6 py-4 text-sm">JavaScript to run before capture</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Viewport Options */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Viewport Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Options</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Field</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Default</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-2 text-sm font-mono">width</td>
                    <td className="px-4 py-2 text-sm">number</td>
                    <td className="px-4 py-2 text-sm">1920</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm font-mono">height</td>
                    <td className="px-4 py-2 text-sm">number</td>
                    <td className="px-4 py-2 text-sm">1080</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm font-mono">deviceScaleFactor</td>
                    <td className="px-4 py-2 text-sm">number</td>
                    <td className="px-4 py-2 text-sm">1</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm font-mono">isMobile</td>
                    <td className="px-4 py-2 text-sm">boolean</td>
                    <td className="px-4 py-2 text-sm">false</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm font-mono">hasTouch</td>
                    <td className="px-4 py-2 text-sm">boolean</td>
                    <td className="px-4 py-2 text-sm">false</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Common Presets</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Desktop</h4>
                <pre className="text-sm bg-white rounded p-2 border border-gray-200">
{`viewport:
  width: 1920
  height: 1080`}
                </pre>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Mobile (iPhone 12)</h4>
                <pre className="text-sm bg-white rounded p-2 border border-gray-200">
{`viewport:
  width: 390
  height: 844
  deviceScaleFactor: 3
  isMobile: true
  hasTouch: true`}
                </pre>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Tablet (iPad)</h4>
                <pre className="text-sm bg-white rounded p-2 border border-gray-200">
{`viewport:
  width: 820
  height: 1180
  deviceScaleFactor: 2
  hasTouch: true`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wait Strategies */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Wait Strategies</h2>
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="mb-4 text-gray-700">
            The <code className="bg-gray-200 px-1 rounded">waitUntil</code> option determines when a page is considered ready for screenshot:
          </p>
          <ul className="space-y-3">
            <li>
              <code className="bg-gray-200 px-2 py-1 rounded text-sm">"load"</code>
              <p className="text-gray-600 mt-1">Wait for the load event (fastest, but may miss dynamic content)</p>
            </li>
            <li>
              <code className="bg-gray-200 px-2 py-1 rounded text-sm">"domcontentloaded"</code>
              <p className="text-gray-600 mt-1">Wait for DOM content to be loaded</p>
            </li>
            <li>
              <code className="bg-gray-200 px-2 py-1 rounded text-sm">"networkidle"</code>
              <p className="text-gray-600 mt-1">Wait for network to be idle (recommended for most cases)</p>
            </li>
            <li>
              <code className="bg-gray-200 px-2 py-1 rounded text-sm">"networkidle0"</code>
              <p className="text-gray-600 mt-1">Wait for 0 network connections (most thorough)</p>
            </li>
          </ul>
        </div>
      </section>

      {/* Authentication */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Authentication</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Authentication</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
{`screenshots:
  - name: "Protected Page"
    url: "https://example.com/admin"
    authentication:
      type: "basic"
      username: "admin"
      password: "{{ADMIN_PASSWORD}}"  # Use environment variable`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Cookie-based Authentication</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
{`screenshots:
  - name: "Dashboard"
    url: "https://app.example.com/dashboard"
    cookies:
      - name: "session_token"
        value: "{{SESSION_TOKEN}}"
        domain: "app.example.com"
        path: "/"
        httpOnly: true
        secure: true`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Custom Headers</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
{`screenshots:
  - name: "API Docs"
    url: "https://api.example.com/docs"
    headers:
      Authorization: "Bearer {{API_TOKEN}}"
      X-API-Version: "v2"`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Integrations Configuration</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">GitHub Integration</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
{`integrations:
  github:
    repo: "owner/repository"  # Required
    path: "docs/screenshots"  # Directory for screenshots
    branch: "main"           # Target branch
    commitMessage: "Update screenshots [skip ci]"
    pullRequest: false       # Create PR instead of direct commit`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Email Notifications</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
{`integrations:
  email:
    recipients:
      - "team@example.com"
      - "qa@example.com"
    schedule: "daily"        # daily, weekly, or on-change
    includeImages: true      # Attach images to emails
    onlyOnChange: true       # Only send when changes detected`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Slack Integration</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
{`integrations:
  slack:
    webhook: "https://hooks.slack.com/services/T00/B00/XXX"
    channel: "#screenshots"  # Optional, override webhook default
    mentions:
      onFailure: ["@devops", "@qa"]
      onChange: ["@design"]
    includeImages: true`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Scheduling */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Scheduling</h2>
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Schedule Options</h3>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Simple Intervals</h4>
              <pre className="text-sm">
{`schedule:
  interval: "daily"      # daily, weekly, monthly
  time: "09:00"         # 24-hour format
  timezone: "UTC"       # IANA timezone`}
              </pre>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Cron Expression</h4>
              <pre className="text-sm">
{`schedule:
  cron: "0 9 * * 1-5"   # Weekdays at 9 AM
  timezone: "America/New_York"`}
              </pre>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Multiple Schedules</h4>
              <pre className="text-sm">
{`schedule:
  - interval: "daily"
    time: "09:00"
    screenshots: ["homepage", "docs"]  # Only these screenshots
  - cron: "0 */4 * * *"  # Every 4 hours
    screenshots: ["status-page"]`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Example */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Complete Example</h2>
        <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
          <pre className="text-sm">
{`# DocShot AI Configuration
# Version: 1.0

project:
  name: "ACME Documentation"
  description: "Automated screenshots for docs.acme.com"
  tags: ["documentation", "public", "marketing"]

# Default settings for all screenshots
defaults:
  viewport:
    width: 1920
    height: 1080
  waitUntil: "networkidle"
  enabled: true

screenshots:
  # Homepage - Full page capture
  - name: "Homepage"
    url: "https://docs.acme.com"
    fullPage: true
    
  # Getting Started Guide - Specific section
  - name: "Getting Started"
    url: "https://docs.acme.com/getting-started"
    selector: "#main-content"
    waitFor: 2000  # Wait 2 seconds for animations
    
  # API Reference - With authentication
  - name: "API Reference"
    url: "https://api.acme.com/reference"
    authentication:
      type: "basic"
      username: "docs"
      password: "{{API_DOCS_PASSWORD}}"
    headers:
      X-Documentation-Mode: "true"
      
  # Mobile View
  - name: "Mobile Homepage"
    url: "https://docs.acme.com"
    viewport:
      width: 390
      height: 844
      deviceScaleFactor: 3
      isMobile: true
      hasTouch: true
      
  # Dashboard - With cookies
  - name: "User Dashboard"
    url: "https://app.acme.com/dashboard"
    cookies:
      - name: "auth_token"
        value: "{{DASHBOARD_AUTH_TOKEN}}"
        domain: "app.acme.com"
        path: "/"
        secure: true
    beforeScript: |
      // Close any popups
      document.querySelectorAll('.popup-close').forEach(el => el.click());
    
integrations:
  github:
    repo: "acme/documentation"
    path: "static/screenshots"
    branch: "main"
    commitMessage: "chore: Update screenshots [skip ci]"
    
  email:
    recipients:
      - "docs-team@acme.com"
    schedule: "weekly"
    onlyOnChange: true
    
  slack:
    webhook: "{{SLACK_WEBHOOK_URL}}"
    channel: "#docs-updates"
    mentions:
      onChange: ["@docs-team"]
    includeImages: true

schedule:
  # Daily captures at 9 AM EST
  - interval: "daily"
    time: "09:00"
    timezone: "America/New_York"
    
  # Weekly full capture on Sundays
  - cron: "0 2 * * 0"  # 2 AM UTC on Sundays
    fullCapture: true  # Force capture even if no changes

# Advanced settings
advanced:
  diffThreshold: 0.1  # 10% change threshold
  retryAttempts: 3
  retryDelay: 5000
  timeout: 30000
  parallelCaptures: 3`}
          </pre>
        </div>
      </section>

      {/* Environment Variables */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Environment Variables</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">🔐 Security Best Practice</h3>
          <p className="text-yellow-800 mb-4">
            Never store sensitive data like passwords, tokens, or API keys directly in your YAML configuration. 
            Use environment variables instead.
          </p>
          <div className="bg-white rounded-lg p-4 border border-yellow-300">
            <p className="font-semibold text-gray-900 mb-2">Syntax:</p>
            <code className="text-sm text-gray-700">{"{{VARIABLE_NAME}}"}</code>
            <p className="text-gray-600 mt-2 text-sm">
              Environment variables are resolved at runtime from your project settings.
            </p>
          </div>
        </div>
      </section>

      {/* Validation */}
      <section className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Configuration Validation
        </h2>
        <p className="text-gray-600 mb-4">
          DocShot AI validates your YAML configuration in real-time as you type. Common validation checks include:
        </p>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Required fields are present</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>URLs are valid and properly formatted</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>CSS selectors are valid syntax</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Viewport dimensions are reasonable</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Cron expressions are valid</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Environment variables are properly formatted</span>
          </li>
        </ul>
      </section>
    </div>
  );
}