export default function EmailIntegrationPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Email Notifications
      </h1>

      <p className="text-xl text-gray-600 mb-8">
        Keep stakeholders informed with automated email notifications when screenshots change, fail, or need approval.
      </p>

      {/* Overview */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overview</h2>
        <p className="text-gray-700 mb-4">
          Email notifications in DocShot AI help you:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Alert team members who don&apos;t use the dashboard daily</li>
          <li>Send summary reports to stakeholders</li>
          <li>Get immediate alerts for critical failures</li>
          <li>Provide visual context with attached screenshots</li>
          <li>Create an audit trail of changes</li>
        </ul>
      </section>

      {/* Configuration */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Basic Configuration
        </h2>
        
        <p className="text-gray-700 mb-4">
          Add email notification settings to your project&apos;s YAML:
        </p>

        <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
          <pre className="text-sm">
{`integrations:
  email:
    # Required: List of recipient email addresses
    recipients:
      - &quot;team@example.com&quot;
      - &quot;qa@example.com&quot;
      - &quot;stakeholder@example.com&quot;
    
    # Optional: When to send notifications
    notifications:
      onCapture: false        # Every screenshot capture
      onChange: true          # When changes detected (default)
      onApproval: true        # When changes approved
      onFailure: true         # When captures fail
    
    # Optional: Email content settings
    includeImages: true       # Attach screenshots to emails
    includeLinks: true        # Include dashboard links
    includeDiff: true         # Include visual diff when available
    
    # Optional: Summary schedule
    schedule: "weekly"        # none, daily, weekly, monthly
    scheduleDay: "monday"     # For weekly (monday-sunday)
    scheduleTime: "09:00"     # 24-hour format
    timezone: "UTC"           # IANA timezone`}
          </pre>
        </div>
      </section>

      {/* Email Types */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Email Notification Types
        </h2>
        
        <div className="space-y-6">
          {/* Change Detection Email */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">🔍 Visual Changes Detected</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Sent when screenshots show visual differences from the baseline.
              </p>
              <div className="bg-white border border-gray-300 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="border-b border-gray-200 pb-3">
                    <p className="text-sm text-gray-500">Subject</p>
                    <p className="font-medium">Screenshot Changes Detected - Marketing Site</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Body</p>
                    <div className="text-sm text-gray-700 space-y-2">
                      <p><strong>Project:</strong> Marketing Site</p>
                      <p><strong>Changes Detected:</strong> 3 screenshots</p>
                      <p><strong>Largest Change:</strong> Homepage Hero (23.5% pixels changed)</p>
                      <p className="pt-2">The following screenshots have changed:</p>
                      <ul className="list-disc list-inside ml-4">
                        <li>Homepage Hero - 23.5% change</li>
                        <li>Features Section - 12.1% change</li>
                        <li>Pricing Table - 5.3% change</li>
                      </ul>
                      <p className="pt-3">
                        <a href="#" className="text-blue-600">Review Changes in Dashboard →</a>
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">Attachments: visual-diff.png, screenshot-comparison.png</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Failure Notification */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">❌ Screenshot Capture Failed</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Immediate alert when screenshot captures fail.
              </p>
              <div className="bg-white border border-gray-300 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="border-b border-gray-200 pb-3">
                    <p className="text-sm text-gray-500">Subject</p>
                    <p className="font-medium text-red-600">⚠️ Screenshot Failure - Dashboard Project</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Body</p>
                    <div className="text-sm text-gray-700 space-y-2">
                      <p><strong>Project:</strong> Dashboard</p>
                      <p><strong>Failed Screenshots:</strong> 2</p>
                      <p className="pt-2"><strong>Errors:</strong></p>
                      <ul className="list-disc list-inside ml-4">
                        <li>
                          <strong>Analytics Page:</strong><br/>
                          Timeout waiting for selector &quot;.chart-container&quot;
                        </li>
                        <li>
                          <strong>User Profile:</strong><br/>
                          Navigation timeout exceeded
                        </li>
                      </ul>
                      <p className="pt-3">
                        Please check the configuration or contact support if the issue persists.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Report */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">📊 Weekly Summary Report</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Scheduled digest of all screenshot activity.
              </p>
              <div className="bg-white border border-gray-300 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="border-b border-gray-200 pb-3">
                    <p className="text-sm text-gray-500">Subject</p>
                    <p className="font-medium">Weekly Screenshot Report - Jan 8-14, 2024</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Body</p>
                    <div className="text-sm text-gray-700 space-y-3">
                      <div className="bg-blue-50 rounded p-3">
                        <p className="font-semibold text-blue-900 mb-2">📈 Summary Statistics</p>
                        <div className="grid grid-cols-2 gap-2 text-blue-800">
                          <p>Total Captures: 168</p>
                          <p>Success Rate: 97.6%</p>
                          <p>Changes Detected: 12</p>
                          <p>Changes Approved: 10</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="font-semibold mb-1">Top Changes by Project:</p>
                        <ul className="list-disc list-inside ml-4">
                          <li>Marketing Site - 7 changes</li>
                          <li>Documentation - 3 changes</li>
                          <li>Dashboard - 2 changes</li>
                        </ul>
                      </div>

                      <div>
                        <p className="font-semibold mb-1">Failed Captures:</p>
                        <ul className="list-disc list-inside ml-4">
                          <li>4 timeouts (resolved after retry)</li>
                          <li>0 configuration errors</li>
                        </ul>
                      </div>

                      <p className="pt-3">
                        <a href="#" className="text-blue-600">View Detailed Report →</a>
                      </p>
                    </div>
                  </div>
                </div>
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
              Conditional Recipients
            </h3>
            <p className="text-gray-700 mb-3">
              Send different notifications to different people:
            </p>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
{`integrations:
  email:
    # Default recipients
    recipients:
      - &quot;team@example.com&quot;
    
    # Conditional recipients
    conditionalRecipients:
      onFailure:
        - "devops@example.com"
        - "oncall@example.com"
      
      onChange:
        - "design@example.com"
        - &quot;qa@example.com&quot;
      
      largeChanges:  # > 20% pixels changed
        - "product@example.com"
        - "leadership@example.com"`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Custom Templates
            </h3>
            <p className="text-gray-700 mb-3">
              Customize email content for your brand:
            </p>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
{`integrations:
  email:
    recipients: ["team@example.com"]
    
    # Custom branding
    branding:
      fromName: "ACME Screenshots"
      replyTo: "noreply@acme.com"
      logoUrl: "https://acme.com/logo.png"
      primaryColor: "#0066CC"
    
    # Custom templates
    templates:
      subject:
        onChange: "🎨 {{project.name}} - Visual changes require review"
        onFailure: "🚨 Urgent: {{project.name}} screenshot failures"
      
      footer: |
        This is an automated message from ACME Screenshot Monitoring.
        Manage your preferences at https://app.acme.com/settings`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Filtering and Thresholds
            </h3>
            <p className="text-gray-700 mb-3">
              Control when emails are sent:
            </p>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
{`integrations:
  email:
    recipients: ["team@example.com"]
    
    # Only send emails for significant changes
    thresholds:
      minChangePercent: 5      # Ignore changes < 5%
      minPixelDiff: 1000      # Ignore tiny changes
    
    # Batch notifications
    batching:
      enabled: true
      delay: 300              # Wait 5 minutes
      maxBatch: 10           # Max screenshots per email
    
    # Quiet hours (no emails during these times)
    quietHours:
      enabled: true
      start: "18:00"         # 6 PM
      end: "09:00"           # 9 AM
      timezone: "America/New_York"
      urgent: ["onFailure"]  # Still send these`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Email Formatting */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Email Content Options
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Attachments</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <div>
                  <strong>Screenshots:</strong> Current capture as PNG
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <div>
                  <strong>Visual Diff:</strong> Side-by-side comparison
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <div>
                  <strong>Diff Overlay:</strong> Highlighted changes
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <div>
                  <strong>Summary Report:</strong> PDF for weekly digests
                </div>
              </li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Email Features</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <div>
                  <strong>Responsive Design:</strong> Works on all devices
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <div>
                  <strong>Dark Mode:</strong> Respects email client settings
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <div>
                  <strong>Plain Text:</strong> Fallback for text-only clients
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <div>
                  <strong>Unsubscribe:</strong> One-click preference management
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Best Practices
        </h2>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">✅ Email Notification Tips</h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li>• Use distribution lists instead of individual emails</li>
              <li>• Set appropriate thresholds to avoid notification fatigue</li>
              <li>• Include visual context (screenshots) for better understanding</li>
              <li>• Use descriptive subject lines with project names</li>
              <li>• Configure quiet hours to respect work-life balance</li>
              <li>• Test with a small group before rolling out broadly</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-semibold text-yellow-900 mb-3">⚠️ Common Pitfalls</h3>
            <ul className="space-y-2 text-yellow-800 text-sm">
              <li>• Sending too many emails (use batching and thresholds)</li>
              <li>• Not including stakeholders who need visibility</li>
              <li>• Forgetting to whitelist noreply@docshot.ai</li>
              <li>• Using personal emails instead of group aliases</li>
              <li>• Not testing email rendering across clients</li>
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
              Emails going to spam?
            </h3>
            <p className="text-gray-700 text-sm mb-2">Common solutions:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm ml-4">
              <li>Add noreply@docshot.ai to your email whitelist</li>
              <li>Check with your IT team about email filters</li>
              <li>Use company email addresses, not personal</li>
              <li>Ensure your domain&apos;s SPF records are correct</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              Not receiving emails?
            </h3>
            <p className="text-gray-700 text-sm mb-2">Check these settings:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm ml-4">
              <li>Verify email addresses in YAML configuration</li>
              <li>Check notification settings are enabled</li>
              <li>Look in spam/junk folders</li>
              <li>Verify SMTP settings in production environment</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              Attachments too large?
            </h3>
            <p className="text-gray-700 text-sm mb-2">Options to reduce size:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm ml-4">
              <li>Disable image attachments and use links instead</li>
              <li>Reduce screenshot quality in capture settings</li>
              <li>Use thumbnail previews with dashboard links</li>
              <li>Configure email provider limits appropriately</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Email Preferences */}
      <section className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Managing Email Preferences
        </h2>
        
        <p className="text-gray-700 mb-4">
          Recipients can manage their notification preferences:
        </p>
        
        <ul className="space-y-3 text-gray-700">
          <li>
            <strong>Unsubscribe Link:</strong>
            <p className="text-sm text-gray-600 mt-1">
              Every email includes a one-click unsubscribe link
            </p>
          </li>
          
          <li>
            <strong>Preference Center:</strong>
            <p className="text-sm text-gray-600 mt-1">
              Users can choose which types of notifications to receive
            </p>
          </li>
          
          <li>
            <strong>Frequency Control:</strong>
            <p className="text-sm text-gray-600 mt-1">
              Options for immediate, daily, or weekly summaries
            </p>
          </li>
        </ul>
      </section>
    </div>
  );
}