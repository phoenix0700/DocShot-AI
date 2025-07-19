export default function SlackIntegrationPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Slack Integration
      </h1>

      <p className="text-xl text-gray-600 mb-8">
        Get instant notifications in Slack when your screenshots change. Keep your team informed with visual updates right in your channels.
      </p>

      {/* Prerequisites */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Prerequisites</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Admin access to your Slack workspace</li>
          <li>Permission to add apps to Slack</li>
          <li>A Slack channel for notifications</li>
        </ul>
      </section>

      {/* Step 1: Create Webhook */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Step 1: Create a Slack Webhook
        </h2>
        
        <ol className="space-y-4">
          <li>
            <p className="text-gray-700">
              <strong>1.</strong> Go to{' '}
              <a href="https://api.slack.com/apps" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                Slack App Directory
              </a>{' '}
              and click "Create New App"
            </p>
          </li>
          
          <li>
            <p className="text-gray-700">
              <strong>2.</strong> Choose "From scratch" and name your app "DocShot AI"
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mt-2">
              <p className="text-sm text-gray-600">
                Select your workspace from the dropdown
              </p>
            </div>
          </li>

          <li>
            <p className="text-gray-700">
              <strong>3.</strong> Navigate to "Incoming Webhooks" in the sidebar
            </p>
          </li>

          <li>
            <p className="text-gray-700">
              <strong>4.</strong> Toggle "Activate Incoming Webhooks" to ON
            </p>
          </li>

          <li>
            <p className="text-gray-700">
              <strong>5.</strong> Click "Add New Webhook to Workspace"
            </p>
          </li>

          <li>
            <p className="text-gray-700">
              <strong>6.</strong> Choose the channel where you want notifications
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2">
              <p className="text-blue-800 text-sm">
                💡 Tip: Create a dedicated #screenshot-updates channel
              </p>
            </div>
          </li>

          <li>
            <p className="text-gray-700">
              <strong>7.</strong> Copy the webhook URL that looks like:
            </p>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mt-2">
              <code className="text-sm">
                https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
              </code>
            </div>
          </li>
        </ol>
      </section>

      {/* Step 2: Configure in DocShot */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Step 2: Configure Slack in Your YAML
        </h2>
        
        <p className="text-gray-700 mb-4">
          Add the Slack integration to your project configuration:
        </p>

        <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
          <pre className="text-sm">
{`integrations:
  slack:
    # Required: Your webhook URL
    webhook: "https://hooks.slack.com/services/T00/B00/XXX"
    
    # Optional: Override default channel
    channel: "#screenshots"
    
    # Optional: Notification settings
    notifications:
      onCapture: false        # Notify on every capture
      onChange: true          # Notify when changes detected
      onApproval: true        # Notify when changes approved
      onFailure: true         # Notify on failures
    
    # Optional: Include images in messages
    includeImages: true
    
    # Optional: Mentions for different events
    mentions:
      onChange: ["@design-team", "@qa"]
      onFailure: ["@devops"]`}
          </pre>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-900 mb-2">🔐 Security Tip</h3>
          <p className="text-yellow-800 text-sm mb-3">
            Store your webhook URL as an environment variable for better security:
          </p>
          <div className="bg-white rounded p-3 border border-yellow-300">
            <pre className="text-sm">
{`integrations:
  slack:
    webhook: "{{SLACK_WEBHOOK_URL}}"`}
            </pre>
          </div>
        </div>
      </section>

      {/* Message Types */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Notification Types
        </h2>
        
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              📸 Screenshot Captured
            </h3>
            <p className="text-gray-700 mb-3">
              Notifies when screenshots are successfully captured.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Example message:</p>
              <div className="bg-white border border-gray-300 rounded p-3">
                <p className="font-semibold text-gray-900">✅ Screenshot Captured</p>
                <p className="text-gray-700 text-sm mt-1">
                  <strong>Project:</strong> Marketing Site<br/>
                  <strong>Screenshot:</strong> Homepage Hero<br/>
                  <strong>URL:</strong> https://example.com
                </p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              🔍 Visual Changes Detected
            </h3>
            <p className="text-gray-700 mb-3">
              Alerts when visual differences are found between captures.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Example message:</p>
              <div className="bg-white border border-gray-300 rounded p-3">
                <p className="font-semibold text-gray-900">🔍 Visual Changes Detected</p>
                <p className="text-gray-700 text-sm mt-1">
                  <strong>Project:</strong> Documentation<br/>
                  <strong>Screenshot:</strong> Getting Started Guide<br/>
                  <strong>Change:</strong> 15.3% pixels changed<br/>
                  <strong>Action:</strong> <a href="#" className="text-blue-600">Review Changes</a>
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  @design-team Please review these changes
                </p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              ❌ Capture Failed
            </h3>
            <p className="text-gray-700 mb-3">
              Notifies when screenshot capture fails.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Example message:</p>
              <div className="bg-white border border-gray-300 rounded p-3">
                <p className="font-semibold text-red-600">❌ Screenshot Failed</p>
                <p className="text-gray-700 text-sm mt-1">
                  <strong>Project:</strong> Dashboard<br/>
                  <strong>Screenshot:</strong> User Analytics<br/>
                  <strong>Error:</strong> Timeout waiting for selector<br/>
                  <strong>URL:</strong> https://app.example.com/analytics
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  @devops Capture failed, please investigate
                </p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              📊 Daily/Weekly Summary
            </h3>
            <p className="text-gray-700 mb-3">
              Aggregated reports of all screenshot activity.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Example message:</p>
              <div className="bg-white border border-gray-300 rounded p-3">
                <p className="font-semibold text-gray-900">📊 Weekly Screenshot Summary</p>
                <p className="text-gray-700 text-sm mt-1">
                  <strong>Period:</strong> Jan 8-14, 2024<br/>
                  <strong>Total Captures:</strong> 42<br/>
                  <strong>Changes Detected:</strong> 7<br/>
                  <strong>Approved:</strong> 5<br/>
                  <strong>Failed:</strong> 2
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  <a href="#" className="text-blue-600">View Full Report</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Configuration */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Advanced Configuration
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Multiple Channels
            </h3>
            <p className="text-gray-700 mb-3">
              Send different types of notifications to different channels:
            </p>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
{`integrations:
  slack:
    # Default webhook
    webhook: "{{SLACK_WEBHOOK_GENERAL}}"
    
    # Channel-specific webhooks
    webhooks:
      failures:
        url: "{{SLACK_WEBHOOK_ALERTS}}"
        channel: "#alerts"
        mentions: ["@oncall"]
      
      design:
        url: "{{SLACK_WEBHOOK_DESIGN}}"
        channel: "#design-updates"
        mentions: ["@designers"]`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Custom Message Templates
            </h3>
            <p className="text-gray-700 mb-3">
              Customize notification messages:
            </p>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
{`integrations:
  slack:
    webhook: "{{SLACK_WEBHOOK_URL}}"
    
    # Custom message formats
    messages:
      onChange: |
        🎨 *Visual Changes Detected*
        Project: {{project.name}}
        Screenshot: {{screenshot.name}}
        Change: {{change.percentage}}% pixels changed
        
        <{{approvalUrl}}|Review Changes>
      
      onFailure: |
        🚨 *Screenshot Capture Failed*
        Project: {{project.name}}
        Error: {{error.message}}
        
        Please check the configuration.`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Scheduled Summaries
            </h3>
            <p className="text-gray-700 mb-3">
              Configure when to receive summary reports:
            </p>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
{`integrations:
  slack:
    webhook: "{{SLACK_WEBHOOK_URL}}"
    
    summaries:
      daily:
        enabled: true
        time: "09:00"
        timezone: "America/New_York"
        channel: "#daily-standup"
      
      weekly:
        enabled: true
        dayOfWeek: "monday"
        time: "10:00"
        channel: "#team-updates"`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Best Practices
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-3">✅ Recommended</h3>
            <ul className="space-y-2 text-green-800 text-sm">
              <li>• Create dedicated channels for screenshot updates</li>
              <li>• Use mentions sparingly to avoid notification fatigue</li>
              <li>• Include images for visual context</li>
              <li>• Set up different webhooks for different severity levels</li>
              <li>• Test notifications with a test channel first</li>
              <li>• Use thread replies for detailed discussions</li>
            </ul>
          </div>

          <div className="bg-red-50 rounded-lg p-6">
            <h3 className="font-semibold text-red-900 mb-3">❌ Avoid</h3>
            <ul className="space-y-2 text-red-800 text-sm">
              <li>• Sending every capture notification (too noisy)</li>
              <li>• Using @channel or @here unnecessarily</li>
              <li>• Posting to general channels</li>
              <li>• Sharing webhook URLs publicly</li>
              <li>• Ignoring failed capture notifications</li>
              <li>• Overwhelming channels with automated messages</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Troubleshooting
        </h2>
        
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              Not receiving notifications?
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
              <li>Verify webhook URL is correct and active</li>
              <li>Check if the channel allows bot posts</li>
              <li>Ensure notifications are enabled in YAML config</li>
              <li>Look for error messages in DocShot AI logs</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              Images not showing?
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
              <li>Confirm <code className="bg-gray-200 px-1 rounded text-xs">includeImages: true</code> in config</li>
              <li>Check Slack workspace file upload limits</li>
              <li>Verify bot has permission to upload files</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              Mentions not working?
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
              <li>Use Slack user IDs instead of display names</li>
              <li>Format: <code className="bg-gray-200 px-1 rounded text-xs">@U1234567890</code></li>
              <li>Find user IDs in Slack profile → More → Copy member ID</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Testing */}
      <section className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Testing Your Integration
        </h2>
        
        <p className="text-gray-700 mb-4">
          Test your Slack integration before going live:
        </p>
        
        <ol className="space-y-3 text-gray-700">
          <li>
            <strong>1. Test Webhook:</strong>
            <p className="text-sm text-gray-600 mt-1">
              Use curl to test your webhook:
            </p>
            <div className="bg-gray-900 text-gray-100 rounded p-3 mt-2">
              <pre className="text-xs overflow-x-auto">
{`curl -X POST -H 'Content-type: application/json' \\
  --data '{"text":"Test message from DocShot AI"}' \\
  YOUR_WEBHOOK_URL`}
              </pre>
            </div>
          </li>
          
          <li>
            <strong>2. Test Channel:</strong>
            <p className="text-sm text-gray-600 mt-1">
              Create a test project with a single screenshot
            </p>
          </li>
          
          <li>
            <strong>3. Verify Notifications:</strong>
            <p className="text-sm text-gray-600 mt-1">
              Run capture and check all notification types work
            </p>
          </li>
        </ol>
      </section>
    </div>
  );
}