export default function WebhooksIntegrationPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Webhooks Integration
      </h1>

      <p className="text-xl text-gray-600 mb-8">
        Build custom integrations using webhooks to trigger your own workflows when screenshots change.
      </p>

      {/* Overview */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overview</h2>
        
        <p className="text-gray-700 mb-4">
          Webhooks allow you to receive real-time HTTP notifications when events occur in DocShot AI. This enables you to:
        </p>
        
        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
          <li>Update your own systems when screenshots change</li>
          <li>Trigger custom workflows and automations</li>
          <li>Integrate with tools that aren&apos;t natively supported</li>
          <li>Build custom dashboards and monitoring</li>
          <li>Create audit trails and compliance records</li>
        </ul>
      </section>

      {/* Configuration */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Configuration</h2>
        
        <p className="text-gray-700 mb-4">
          Add webhook configuration to your project&apos;s YAML file:
        </p>

        <div className="bg-gray-900 text-gray-100 rounded-lg p-6 mb-6 overflow-x-auto">
          <pre className="text-sm">
{`integrations:
  webhooks:
    enabled: true
    endpoints:
      - url: "https://your-server.com/webhook/docshot"
        secret: "{{WEBHOOK_SECRET}}"
        events:
          - screenshot.captured
          - screenshot.changed
          - screenshot.approved
        headers:
          Authorization: "Bearer {{API_KEY}}"
          X-Custom-Header: "value"
        retry:
          attempts: 3
          backoff: exponential`}
          </pre>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">Configuration Options</h3>
        
        <div className="bg-gray-50 rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Field</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 font-mono text-sm">url</td>
                <td className="px-4 py-3 text-sm">string</td>
                <td className="px-4 py-3 text-sm">The endpoint URL to send webhooks to (required)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-sm">secret</td>
                <td className="px-4 py-3 text-sm">string</td>
                <td className="px-4 py-3 text-sm">Secret for HMAC signature validation (recommended)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-sm">events</td>
                <td className="px-4 py-3 text-sm">array</td>
                <td className="px-4 py-3 text-sm">List of events to subscribe to (default: all)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-sm">headers</td>
                <td className="px-4 py-3 text-sm">object</td>
                <td className="px-4 py-3 text-sm">Custom headers to include in webhook requests</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-sm">retry.attempts</td>
                <td className="px-4 py-3 text-sm">number</td>
                <td className="px-4 py-3 text-sm">Number of retry attempts (default: 3)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-sm">retry.backoff</td>
                <td className="px-4 py-3 text-sm">string</td>
                <td className="px-4 py-3 text-sm">Retry strategy: linear, exponential (default)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Webhook Events */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Webhook Events</h2>
        
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">screenshot.captured</h3>
            <p className="text-gray-700 mb-4">
              Triggered when a screenshot is successfully captured, regardless of whether changes were detected.
            </p>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
{`{
  "event": "screenshot.captured",
  "timestamp": "2024-01-17T10:30:00Z",
  "project": {
    "id": "proj_123",
    "name": "My Documentation"
  },
  "screenshot": {
    "id": "shot_456",
    "name": "Homepage",
    "url": "https://example.com",
    "image_url": "https://storage.docshot.ai/shot_456.png",
    "captured_at": "2024-01-17T10:30:00Z",
    "has_changes": false,
    "change_percentage": 0
  }
}`}
              </pre>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">screenshot.changed</h3>
            <p className="text-gray-700 mb-4">
              Triggered when visual changes are detected in a screenshot compared to the baseline.
            </p>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
{`{
  "event": "screenshot.changed",
  "timestamp": "2024-01-17T10:31:00Z",
  "project": {
    "id": "proj_123",
    "name": "My Documentation"
  },
  "screenshot": {
    "id": "shot_457",
    "name": "Features Page",
    "url": "https://example.com/features",
    "image_url": "https://storage.docshot.ai/shot_457.png",
    "baseline_url": "https://storage.docshot.ai/shot_457_baseline.png",
    "diff_url": "https://storage.docshot.ai/shot_457_diff.png",
    "captured_at": "2024-01-17T10:31:00Z",
    "has_changes": true,
    "change_percentage": 15.3,
    "changed_regions": [
      {"x": 100, "y": 200, "width": 300, "height": 150}
    ]
  }
}`}
              </pre>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">screenshot.approved</h3>
            <p className="text-gray-700 mb-4">
              Triggered when screenshot changes are reviewed and approved by a user.
            </p>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
{`{
  "event": "screenshot.approved",
  "timestamp": "2024-01-17T10:45:00Z",
  "project": {
    "id": "proj_123",
    "name": "My Documentation"
  },
  "screenshot": {
    "id": "shot_457",
    "name": "Features Page",
    "url": "https://example.com/features",
    "image_url": "https://storage.docshot.ai/shot_457.png",
    "approved_at": "2024-01-17T10:45:00Z",
    "approved_by": {
      "id": "user_789",
      "email": "john@example.com"
    },
    "comment": "New feature section looks good"
  }
}`}
              </pre>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">screenshot.failed</h3>
            <p className="text-gray-700 mb-4">
              Triggered when a screenshot capture fails due to errors.
            </p>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
{`{
  "event": "screenshot.failed",
  "timestamp": "2024-01-17T10:32:00Z",
  "project": {
    "id": "proj_123",
    "name": "My Documentation"
  },
  "screenshot": {
    "name": "Login Page",
    "url": "https://app.example.com/login",
    "error": {
      "code": "TIMEOUT",
      "message": "Navigation timeout exceeded",
      "details": "Page did not load within 30 seconds"
    }
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Security & Validation</h2>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">⚠️ Important Security Notice</h3>
          <p className="text-yellow-800">
            Always validate webhook payloads to ensure they&apos;re coming from DocShot AI. We provide HMAC signatures for secure validation.
          </p>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">HMAC Signature Validation</h3>
        
        <p className="text-gray-700 mb-4">
          Every webhook request includes a signature in the <code className="bg-gray-100 px-2 py-1 rounded">X-DocShot-Signature</code> header:
        </p>

        <div className="bg-gray-900 text-gray-100 rounded-lg p-6 mb-6 overflow-x-auto">
          <pre className="text-sm">
{`// Node.js validation example
const crypto = require('crypto');

function validateWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  const expectedSignature = 'sha256=' + hmac.digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// In your webhook handler
app.post('/webhook', (req, res) => {
  const signature = req.headers['x-docshot-signature'];
  const secret = process.env.WEBHOOK_SECRET;
  
  if (!validateWebhook(req.body, signature, secret)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process webhook...
  res.status(200).send('OK');
});`}
          </pre>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Security Headers</h3>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2">Header</th>
                <th className="text-left py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-2 font-mono">X-DocShot-Signature</td>
                <td className="py-2">HMAC-SHA256 signature of the payload</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 font-mono">X-DocShot-Event</td>
                <td className="py-2">The event type (e.g., screenshot.captured)</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 font-mono">X-DocShot-Delivery</td>
                <td className="py-2">Unique ID for this delivery attempt</td>
              </tr>
              <tr>
                <td className="py-2 font-mono">X-DocShot-Timestamp</td>
                <td className="py-2">Unix timestamp of when the event occurred</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Best Practices</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">🚀 Performance</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>• Respond quickly (within 3 seconds) with 2xx status</li>
              <li>• Process webhooks asynchronously in the background</li>
              <li>• Implement idempotency using the delivery ID</li>
              <li>• Handle duplicate deliveries gracefully</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">🛡️ Reliability</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>• Always validate webhook signatures</li>
              <li>• Log all webhook receipts for debugging</li>
              <li>• Implement proper error handling</li>
              <li>• Monitor webhook endpoint availability</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Example Implementations */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Example Implementations</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Python Flask Example</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm">
{`from flask import Flask, request, jsonify
import hmac
import hashlib
import os

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def handle_webhook():
    # Validate signature
    signature = request.headers.get('X-DocShot-Signature')
    secret = os.environ.get('WEBHOOK_SECRET')
    
    expected_sig = 'sha256=' + hmac.new(
        secret.encode(),
        request.data,
        hashlib.sha256
    ).hexdigest()
    
    if not hmac.compare_digest(signature, expected_sig):
        return jsonify({'error': 'Invalid signature'}), 401
    
    # Process webhook
    data = request.json
    event = data['event']
    
    if event == 'screenshot.changed':
        # Handle screenshot changes
        screenshot = data['screenshot']
        print(f"Screenshot {screenshot['name']} changed by {screenshot['change_percentage']}%")
        
        # Queue background job, update database, etc.
        process_screenshot_change.delay(screenshot)
    
    return jsonify({'status': 'received'}), 200`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">PHP Example</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm">
{`<?php
function validateWebhook($payload, $signature, $secret) {
    $calculated = 'sha256=' . hash_hmac('sha256', $payload, $secret);
    return hash_equals($calculated, $signature);
}

// Get headers and body
$headers = getallheaders();
$signature = $headers['X-DocShot-Signature'] ?? '';
$body = file_get_contents('php://input');
$secret = $_ENV['WEBHOOK_SECRET'];

// Validate
if (!validateWebhook($body, $signature, $secret)) {
    http_response_code(401);
    exit('Invalid signature');
}

// Parse and process
$data = json_decode($body, true);
$event = $data['event'];

switch ($event) {
    case 'screenshot.captured':
        // Log capture
        error_log("Screenshot captured: " . $data['screenshot']['name']);
        break;
        
    case 'screenshot.changed':
        // Send notification
        notifyTeam($data['screenshot']);
        break;
}

http_response_code(200);
echo json_encode(['status' => 'ok']);`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Troubleshooting</h2>
        
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Webhooks not being received?</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>• Check your endpoint is publicly accessible (not localhost)</li>
              <li>• Verify the URL is correct and includes https://</li>
              <li>• Ensure your firewall allows POST requests from DocShot IPs</li>
              <li>• Check webhook logs in your DocShot dashboard</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Getting 401 Unauthorized errors?</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>• Verify your webhook secret matches exactly</li>
              <li>• Ensure you&apos;re using the raw request body for validation</li>
              <li>• Check you&apos;re reading the correct header name</li>
              <li>• Make sure the signature includes the &quot;sha256=&quot; prefix</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Webhooks timing out?</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>• Respond immediately with 200 OK</li>
              <li>• Process webhook data asynchronously</li>
              <li>• Check for slow database queries or API calls</li>
              <li>• Implement proper connection pooling</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Next Steps
        </h2>
        
        <p className="text-gray-700 mb-4">
          Ready to build your custom integration? Here&apos;s what to do:
        </p>
        
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Set up your webhook endpoint with signature validation</li>
          <li>Add the webhook configuration to your project YAML</li>
          <li>Test with a single screenshot to verify it&apos;s working</li>
          <li>Implement your business logic for each event type</li>
          <li>Monitor webhook deliveries in your dashboard</li>
        </ol>

        <div className="mt-6 space-y-2">
          <a href="/docs/api/webhooks" className="block text-blue-600 hover:text-blue-700">
            View webhook API reference →
          </a>
          <a href="/docs/yaml-reference#webhooks" className="block text-blue-600 hover:text-blue-700">
            See full YAML configuration options →
          </a>
        </div>
      </section>
    </div>
  );
}