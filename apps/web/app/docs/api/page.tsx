export default function ApiOverviewPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        API Reference
      </h1>

      <p className="text-xl text-gray-600 mb-8">
        Programmatically control DocShot AI with our RESTful API. Trigger captures, check status, and manage projects.
      </p>

      {/* API Overview */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overview</h2>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Base URL</h3>
              <code className="bg-white px-3 py-1 rounded border border-gray-300 text-sm">
                https://api.docshot.ai/v1
              </code>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Format</h3>
              <p className="text-gray-700">JSON (application/json)</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Authentication</h3>
              <p className="text-gray-700">Bearer token (API Key)</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Rate Limits</h3>
              <p className="text-gray-700">1000 requests/hour</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Start</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Get Your API Key</h3>
            <p className="text-gray-700 mb-3">
              Generate an API key from your{' '}
              <a href="/dashboard/settings/api" className="text-blue-600 hover:text-blue-700">
                account settings
              </a>.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Make Your First Request</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
{`curl -X GET https://api.docshot.ai/v1/projects \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Response Format</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
{`{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "proj_123abc",
        "name": "Marketing Site",
        "created_at": "2024-01-15T10:00:00Z"
      }
    ]
  },
  "meta": {
    "total": 1,
    "page": 1,
    "per_page": 20
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Authentication */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Authentication</h2>
        
        <p className="text-gray-700 mb-4">
          All API requests require authentication using an API key. Include your API key in the Authorization header:
        </p>

        <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-6">
          <pre className="text-sm">
{`Authorization: Bearer YOUR_API_KEY`}
          </pre>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-900 mb-2">🔐 Security Best Practices</h3>
          <ul className="space-y-2 text-yellow-800 text-sm">
            <li>• Never expose your API key in client-side code</li>
            <li>• Regenerate keys periodically</li>
            <li>• Use environment variables to store keys</li>
            <li>• Set up IP allowlisting for production</li>
            <li>• Monitor API usage for anomalies</li>
          </ul>
        </div>
      </section>

      {/* Available Endpoints */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Available Endpoints</h2>
        
        <div className="space-y-6">
          {/* Projects */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Projects</h3>
            </div>
            <div className="divide-y divide-gray-200">
              <a href="/docs/api/endpoints#list-projects" className="block p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded">GET</span>
                    <span className="ml-3 font-mono text-sm">/projects</span>
                  </div>
                  <span className="text-gray-600 text-sm">List all projects</span>
                </div>
              </a>
              <a href="/docs/api/endpoints#get-project" className="block p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded">GET</span>
                    <span className="ml-3 font-mono text-sm">/projects/:id</span>
                  </div>
                  <span className="text-gray-600 text-sm">Get project details</span>
                </div>
              </a>
              <a href="/docs/api/endpoints#create-project" className="block p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded">POST</span>
                    <span className="ml-3 font-mono text-sm">/projects</span>
                  </div>
                  <span className="text-gray-600 text-sm">Create new project</span>
                </div>
              </a>
            </div>
          </div>

          {/* Screenshots */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Screenshots</h3>
            </div>
            <div className="divide-y divide-gray-200">
              <a href="/docs/api/endpoints#trigger-capture" className="block p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded">POST</span>
                    <span className="ml-3 font-mono text-sm">/projects/:id/capture</span>
                  </div>
                  <span className="text-gray-600 text-sm">Trigger screenshot capture</span>
                </div>
              </a>
              <a href="/docs/api/endpoints#list-screenshots" className="block p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded">GET</span>
                    <span className="ml-3 font-mono text-sm">/projects/:id/screenshots</span>
                  </div>
                  <span className="text-gray-600 text-sm">List project screenshots</span>
                </div>
              </a>
              <a href="/docs/api/endpoints#approve-changes" className="block p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded">POST</span>
                    <span className="ml-3 font-mono text-sm">/screenshots/:id/approve</span>
                  </div>
                  <span className="text-gray-600 text-sm">Approve screenshot changes</span>
                </div>
              </a>
            </div>
          </div>

          {/* Jobs */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Jobs & Status</h3>
            </div>
            <div className="divide-y divide-gray-200">
              <a href="/docs/api/endpoints#get-job-status" className="block p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded">GET</span>
                    <span className="ml-3 font-mono text-sm">/jobs/:id</span>
                  </div>
                  <span className="text-gray-600 text-sm">Get job status</span>
                </div>
              </a>
              <a href="/docs/api/endpoints#list-jobs" className="block p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded">GET</span>
                    <span className="ml-3 font-mono text-sm">/projects/:id/jobs</span>
                  </div>
                  <span className="text-gray-600 text-sm">List recent jobs</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Rate Limiting */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Rate Limiting</h2>
        
        <p className="text-gray-700 mb-4">
          API requests are rate limited to ensure fair usage:
        </p>

        <div className="bg-gray-50 rounded-lg p-6">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-semibold text-gray-900">Tier</th>
                <th className="text-left py-2 font-semibold text-gray-900">Requests/Hour</th>
                <th className="text-left py-2 font-semibold text-gray-900">Burst</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 text-gray-700">Free</td>
                <td className="py-3 text-gray-700">100</td>
                <td className="py-3 text-gray-700">10/minute</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">Pro</td>
                <td className="py-3 text-gray-700">1,000</td>
                <td className="py-3 text-gray-700">100/minute</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">Team</td>
                <td className="py-3 text-gray-700">10,000</td>
                <td className="py-3 text-gray-700">500/minute</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Rate Limit Headers</h3>
          <p className="text-gray-700 text-sm">
            Every response includes rate limit information:
          </p>
          <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
            <pre className="text-sm">
{`X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1516131600`}
            </pre>
          </div>
        </div>
      </section>

      {/* Error Handling */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Error Handling</h2>
        
        <p className="text-gray-700 mb-4">
          The API returns standard HTTP status codes and detailed error messages:
        </p>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="text-green-600 font-semibold">200 OK</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">Request successful</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="text-green-600 font-semibold">201 Created</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">Resource created successfully</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="text-yellow-600 font-semibold">400 Bad Request</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">Invalid request parameters</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="text-yellow-600 font-semibold">401 Unauthorized</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">Missing or invalid API key</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="text-yellow-600 font-semibold">403 Forbidden</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">Access denied to resource</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="text-yellow-600 font-semibold">404 Not Found</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">Resource not found</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="text-red-600 font-semibold">429 Too Many Requests</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">Rate limit exceeded</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="text-red-600 font-semibold">500 Internal Server Error</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">Server error</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Error Response Format</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
              <pre className="text-sm">
{`{
  "success": false,
  "error": {
    "code": "INVALID_PROJECT_ID",
    "message": "The project ID provided is invalid",
    "details": {
      "project_id": "invalid_id_format"
    }
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* SDKs */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">SDKs & Libraries</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center mr-3">
                <span className="text-xl font-bold">JS</span>
              </div>
              <h3 className="font-semibold text-gray-900">JavaScript/TypeScript</h3>
            </div>
            <div className="bg-gray-50 rounded p-3 mb-3">
              <code className="text-sm">npm install @docshot/sdk</code>
            </div>
            <a href="https://github.com/docshot/js-sdk" className="text-blue-600 hover:text-blue-700 text-sm">
              View on GitHub →
            </a>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-xl font-bold text-white">Py</span>
              </div>
              <h3 className="font-semibold text-gray-900">Python</h3>
            </div>
            <div className="bg-gray-50 rounded p-3 mb-3">
              <code className="text-sm">pip install docshot</code>
            </div>
            <a href="https://github.com/docshot/python-sdk" className="text-blue-600 hover:text-blue-700 text-sm">
              View on GitHub →
            </a>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-xl font-bold text-white">Go</span>
              </div>
              <h3 className="font-semibold text-gray-900">Go</h3>
            </div>
            <div className="bg-gray-50 rounded p-3 mb-3">
              <code className="text-sm">go get github.com/docshot/go-sdk</code>
            </div>
            <a href="https://github.com/docshot/go-sdk" className="text-blue-600 hover:text-blue-700 text-sm">
              View on GitHub →
            </a>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-xl font-bold text-white">Rb</span>
              </div>
              <h3 className="font-semibold text-gray-900">Ruby</h3>
            </div>
            <div className="bg-gray-50 rounded p-3 mb-3">
              <code className="text-sm">gem install docshot</code>
            </div>
            <a href="https://github.com/docshot/ruby-sdk" className="text-blue-600 hover:text-blue-700 text-sm">
              View on GitHub →
            </a>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Next Steps
        </h2>
        <div className="space-y-3">
          <a href="/docs/api/authentication" className="block text-blue-600 hover:text-blue-700">
            → Learn more about authentication
          </a>
          <a href="/docs/api/endpoints" className="block text-blue-600 hover:text-blue-700">
            → Explore all endpoints in detail
          </a>
          <a href="/docs/api/webhooks" className="block text-blue-600 hover:text-blue-700">
            → Set up webhooks for real-time updates
          </a>
          <a href="/docs/api/examples" className="block text-blue-600 hover:text-blue-700">
            → View code examples
          </a>
        </div>
      </section>
    </div>
  );
}