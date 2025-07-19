export default function ApiEndpointsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        API Endpoints
      </h1>

      <p className="text-xl text-gray-600 mb-8">
        Complete reference for all DocShot AI API endpoints with examples.
      </p>

      {/* Projects Endpoints */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Projects</h2>
        
        {/* List Projects */}
        <div className="mb-10 border border-gray-200 rounded-lg overflow-hidden" id="list-projects">
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <span className="inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded mr-3">GET</span>
              List Projects
            </h3>
          </div>
          <div className="p-6">
            <p className="text-gray-700 mb-4">
              Retrieve a paginated list of all projects in your account.
            </p>
            
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-4">
              <pre className="text-sm">GET /v1/projects</pre>
            </div>

            <h4 className="font-semibold text-gray-900 mb-2">Query Parameters</h4>
            <div className="bg-gray-50 rounded p-4 mb-4">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">Parameter</th>
                    <th className="text-left py-2">Type</th>
                    <th className="text-left py-2">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 font-mono">page</td>
                    <td className="py-2">integer</td>
                    <td className="py-2">Page number (default: 1)</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono">per_page</td>
                    <td className="py-2">integer</td>
                    <td className="py-2">Items per page (default: 20, max: 100)</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono">sort</td>
                    <td className="py-2">string</td>
                    <td className="py-2">Sort by: created_at, updated_at, name</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono">order</td>
                    <td className="py-2">string</td>
                    <td className="py-2">Sort order: asc, desc (default: desc)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 className="font-semibold text-gray-900 mb-2">Example Request</h4>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-4">
              <pre className="text-sm overflow-x-auto">
{`curl -X GET "https://api.docshot.ai/v1/projects?page=1&per_page=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
              </pre>
            </div>

            <h4 className="font-semibold text-gray-900 mb-2">Example Response</h4>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
              <pre className="text-sm overflow-x-auto">
{`{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "proj_kl93ndk2",
        "name": "Marketing Site",
        "description": "Main marketing website screenshots",
        "created_at": "2024-01-15T10:00:00Z",
        "updated_at": "2024-01-16T14:30:00Z",
        "screenshot_count": 12,
        "last_capture": "2024-01-16T14:00:00Z",
        "status": "active"
      },
      {
        "id": "proj_mn4kd92l",
        "name": "Documentation",
        "description": "Product documentation screenshots",
        "created_at": "2024-01-10T09:00:00Z",
        "updated_at": "2024-01-15T11:00:00Z",
        "screenshot_count": 25,
        "last_capture": "2024-01-15T10:30:00Z",
        "status": "active"
      }
    ]
  },
  "meta": {
    "current_page": 1,
    "per_page": 10,
    "total": 2,
    "total_pages": 1
  }
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Get Project */}
        <div className="mb-10 border border-gray-200 rounded-lg overflow-hidden" id="get-project">
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <span className="inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded mr-3">GET</span>
              Get Project Details
            </h3>
          </div>
          <div className="p-6">
            <p className="text-gray-700 mb-4">
              Retrieve detailed information about a specific project.
            </p>
            
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-4">
              <pre className="text-sm">GET /v1/projects/:id</pre>
            </div>

            <h4 className="font-semibold text-gray-900 mb-2">Path Parameters</h4>
            <div className="bg-gray-50 rounded p-4 mb-4">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">Parameter</th>
                    <th className="text-left py-2">Type</th>
                    <th className="text-left py-2">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 font-mono">id</td>
                    <td className="py-2">string</td>
                    <td className="py-2">The project ID</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 className="font-semibold text-gray-900 mb-2">Example Request</h4>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-4">
              <pre className="text-sm overflow-x-auto">
{`curl -X GET "https://api.docshot.ai/v1/projects/proj_kl93ndk2" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
              </pre>
            </div>

            <h4 className="font-semibold text-gray-900 mb-2">Example Response</h4>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
              <pre className="text-sm overflow-x-auto">
{`{
  "success": true,
  "data": {
    "project": {
      "id": "proj_kl93ndk2",
      "name": "Marketing Site",
      "description": "Main marketing website screenshots",
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-16T14:30:00Z",
      "status": "active",
      "config": {
        "project": {
          "name": "Marketing Site",
          "description": "Main marketing website screenshots"
        },
        "screenshots": [
          {
            "name": "Homepage",
            "url": "https://example.com",
            "selector": null,
            "fullPage": true,
            "enabled": true
          }
        ],
        "integrations": {
          "github": {
            "repo": "company/website",
            "path": "docs/screenshots"
          }
        }
      },
      "stats": {
        "total_screenshots": 12,
        "active_screenshots": 10,
        "total_captures": 156,
        "last_capture": "2024-01-16T14:00:00Z",
        "next_scheduled": "2024-01-17T09:00:00Z"
      }
    }
  }
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Create Project */}
        <div className="mb-10 border border-gray-200 rounded-lg overflow-hidden" id="create-project">
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded mr-3">POST</span>
              Create Project
            </h3>
          </div>
          <div className="p-6">
            <p className="text-gray-700 mb-4">
              Create a new project with YAML configuration.
            </p>
            
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-4">
              <pre className="text-sm">POST /v1/projects</pre>
            </div>

            <h4 className="font-semibold text-gray-900 mb-2">Request Body</h4>
            <div className="bg-gray-50 rounded p-4 mb-4">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">Field</th>
                    <th className="text-left py-2">Type</th>
                    <th className="text-left py-2">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 font-mono">name</td>
                    <td className="py-2">string</td>
                    <td className="py-2">Project name (required)</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono">description</td>
                    <td className="py-2">string</td>
                    <td className="py-2">Project description</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono">config</td>
                    <td className="py-2">string</td>
                    <td className="py-2">YAML configuration (required)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 className="font-semibold text-gray-900 mb-2">Example Request</h4>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-4">
              <pre className="text-sm overflow-x-auto">
{`curl -X POST "https://api.docshot.ai/v1/projects" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "New Documentation Site",
    "description": "Screenshots for our new docs",
    "config": "project:\\n  name: \\"New Documentation Site\\"\\n\\nscreenshots:\\n  - name: \\"Homepage\\"\\n    url: \\"https://docs.example.com\\""
  }'`}
              </pre>
            </div>

            <h4 className="font-semibold text-gray-900 mb-2">Example Response</h4>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
              <pre className="text-sm overflow-x-auto">
{`{
  "success": true,
  "data": {
    "project": {
      "id": "proj_new123",
      "name": "New Documentation Site",
      "description": "Screenshots for our new docs",
      "created_at": "2024-01-17T10:00:00Z",
      "updated_at": "2024-01-17T10:00:00Z",
      "status": "active"
    }
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots Endpoints */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Screenshots</h2>
        
        {/* Trigger Capture */}
        <div className="mb-10 border border-gray-200 rounded-lg overflow-hidden" id="trigger-capture">
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded mr-3">POST</span>
              Trigger Screenshot Capture
            </h3>
          </div>
          <div className="p-6">
            <p className="text-gray-700 mb-4">
              Trigger screenshot capture for all enabled screenshots in a project.
            </p>
            
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-4">
              <pre className="text-sm">POST /v1/projects/:id/capture</pre>
            </div>

            <h4 className="font-semibold text-gray-900 mb-2">Path Parameters</h4>
            <div className="bg-gray-50 rounded p-4 mb-4">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">Parameter</th>
                    <th className="text-left py-2">Type</th>
                    <th className="text-left py-2">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 font-mono">id</td>
                    <td className="py-2">string</td>
                    <td className="py-2">The project ID</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 className="font-semibold text-gray-900 mb-2">Request Body (Optional)</h4>
            <div className="bg-gray-50 rounded p-4 mb-4">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">Field</th>
                    <th className="text-left py-2">Type</th>
                    <th className="text-left py-2">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 font-mono">screenshots</td>
                    <td className="py-2">array</td>
                    <td className="py-2">Specific screenshot names to capture</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono">force</td>
                    <td className="py-2">boolean</td>
                    <td className="py-2">Force capture even if recently captured</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 className="font-semibold text-gray-900 mb-2">Example Request</h4>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-4">
              <pre className="text-sm overflow-x-auto">
{`curl -X POST "https://api.docshot.ai/v1/projects/proj_kl93ndk2/capture" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "screenshots": ["Homepage", "Getting Started"],
    "force": true
  }'`}
              </pre>
            </div>

            <h4 className="font-semibold text-gray-900 mb-2">Example Response</h4>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
              <pre className="text-sm overflow-x-auto">
{`{
  "success": true,
  "data": {
    "job": {
      "id": "job_abc123",
      "project_id": "proj_kl93ndk2",
      "type": "screenshot_capture",
      "status": "queued",
      "created_at": "2024-01-17T10:00:00Z",
      "screenshots_queued": 2,
      "estimated_duration": 30
    }
  }
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* List Screenshots */}
        <div className="mb-10 border border-gray-200 rounded-lg overflow-hidden" id="list-screenshots">
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <span className="inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded mr-3">GET</span>
              List Project Screenshots
            </h3>
          </div>
          <div className="p-6">
            <p className="text-gray-700 mb-4">
              Get all screenshots for a specific project.
            </p>
            
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-4">
              <pre className="text-sm">GET /v1/projects/:id/screenshots</pre>
            </div>

            <h4 className="font-semibold text-gray-900 mb-2">Query Parameters</h4>
            <div className="bg-gray-50 rounded p-4 mb-4">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">Parameter</th>
                    <th className="text-left py-2">Type</th>
                    <th className="text-left py-2">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 font-mono">status</td>
                    <td className="py-2">string</td>
                    <td className="py-2">Filter by status: pending, captured, failed</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono">has_changes</td>
                    <td className="py-2">boolean</td>
                    <td className="py-2">Only show screenshots with detected changes</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono">include_history</td>
                    <td className="py-2">boolean</td>
                    <td className="py-2">Include historical captures</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 className="font-semibold text-gray-900 mb-2">Example Response</h4>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
              <pre className="text-sm overflow-x-auto">
{`{
  "success": true,
  "data": {
    "screenshots": [
      {
        "id": "shot_xyz789",
        "project_id": "proj_kl93ndk2",
        "name": "Homepage",
        "url": "https://example.com",
        "status": "captured",
        "image_url": "https://storage.docshot.ai/shot_xyz789.png",
        "last_captured": "2024-01-17T09:30:00Z",
        "has_changes": true,
        "change_percentage": 15.3,
        "viewport": {
          "width": 1920,
          "height": 1080
        }
      }
    ]
  }
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Approve Changes */}
        <div className="mb-10 border border-gray-200 rounded-lg overflow-hidden" id="approve-changes">
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded mr-3">POST</span>
              Approve Screenshot Changes
            </h3>
          </div>
          <div className="p-6">
            <p className="text-gray-700 mb-4">
              Approve detected changes and update the baseline screenshot.
            </p>
            
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-4">
              <pre className="text-sm">POST /v1/screenshots/:id/approve</pre>
            </div>

            <h4 className="font-semibold text-gray-900 mb-2">Request Body</h4>
            <div className="bg-gray-50 rounded p-4 mb-4">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">Field</th>
                    <th className="text-left py-2">Type</th>
                    <th className="text-left py-2">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 font-mono">action</td>
                    <td className="py-2">string</td>
                    <td className="py-2">Action: &quot;approve&quot; or &quot;reject&quot;</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono">comment</td>
                    <td className="py-2">string</td>
                    <td className="py-2">Optional comment</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 className="font-semibold text-gray-900 mb-2">Example Request</h4>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-4">
              <pre className="text-sm overflow-x-auto">
{`curl -X POST "https://api.docshot.ai/v1/screenshots/shot_xyz789/approve" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "action": "approve",
    "comment": "Updated header design looks good"
  }'`}
              </pre>
            </div>

            <h4 className="font-semibold text-gray-900 mb-2">Example Response</h4>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
              <pre className="text-sm overflow-x-auto">
{`{
  "success": true,
  "data": {
    "screenshot": {
      "id": "shot_xyz789",
      "status": "approved",
      "approved_at": "2024-01-17T10:15:00Z",
      "approved_by": "user_123",
      "baseline_updated": true
    }
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Endpoints */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Jobs & Status</h2>
        
        {/* Get Job Status */}
        <div className="mb-10 border border-gray-200 rounded-lg overflow-hidden" id="get-job-status">
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <span className="inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded mr-3">GET</span>
              Get Job Status
            </h3>
          </div>
          <div className="p-6">
            <p className="text-gray-700 mb-4">
              Check the status of a screenshot capture job.
            </p>
            
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-4">
              <pre className="text-sm">GET /v1/jobs/:id</pre>
            </div>

            <h4 className="font-semibold text-gray-900 mb-2">Example Response</h4>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
              <pre className="text-sm overflow-x-auto">
{`{
  "success": true,
  "data": {
    "job": {
      "id": "job_abc123",
      "type": "screenshot_capture",
      "status": "completed",
      "created_at": "2024-01-17T10:00:00Z",
      "started_at": "2024-01-17T10:00:05Z",
      "completed_at": "2024-01-17T10:00:35Z",
      "progress": {
        "total": 2,
        "completed": 2,
        "failed": 0
      },
      "results": {
        "screenshots": [
          {
            "name": "Homepage",
            "status": "captured",
            "duration": 12.5,
            "has_changes": true
          },
          {
            "name": "Getting Started",
            "status": "captured",
            "duration": 8.3,
            "has_changes": false
          }
        ]
      }
    }
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Webhooks */}
      <section className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Webhook Events
        </h2>
        
        <p className="text-gray-700 mb-4">
          DocShot AI can send webhook notifications for these events:
        </p>
        
        <ul className="space-y-3 text-gray-700">
          <li>
            <strong>screenshot.captured</strong> - When a screenshot is successfully captured
          </li>
          <li>
            <strong>screenshot.changed</strong> - When visual changes are detected
          </li>
          <li>
            <strong>screenshot.approved</strong> - When changes are approved
          </li>
          <li>
            <strong>screenshot.failed</strong> - When capture fails
          </li>
          <li>
            <strong>project.created</strong> - When a new project is created
          </li>
        </ul>

        <div className="mt-6">
          <a href="/docs/api/webhooks" className="text-blue-600 hover:text-blue-700">
            Learn more about webhooks →
          </a>
        </div>
      </section>
    </div>
  );
}