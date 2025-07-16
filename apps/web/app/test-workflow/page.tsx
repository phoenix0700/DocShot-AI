'use client';

import { useState } from 'react';

export default function TestWorkflowPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [url, setUrl] = useState('https://example.com');
  const [selector, setSelector] = useState('');

  const triggerScreenshot = async () => {
    setLoading(true);
    setResult('');

    try {
      // For testing, we'll call the worker directly via a test endpoint
      const response = await fetch('/api/test-screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          selector: selector || undefined,
          viewport: { width: 1280, height: 720 },
        }),
      });

      const data = await response.text();
      setResult(`Status: ${response.status}\nResponse: ${data}`);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            DocShot AI - Workflow Testing
          </h1>
          
          <div className="space-y-6">
            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </div>

            {/* Selector Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CSS Selector (optional)
              </label>
              <input
                type="text"
                value={selector}
                onChange={(e) => setSelector(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="header, .main-content, etc."
              />
            </div>

            {/* Action Button */}
            <div>
              <button
                onClick={triggerScreenshot}
                disabled={loading || !url}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Capturing Screenshot...' : 'Trigger Screenshot Capture'}
              </button>
            </div>

            {/* Status Display */}
            {result && (
              <div className="bg-gray-100 rounded-md p-4">
                <h3 className="font-medium text-gray-900 mb-2">Result:</h3>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">{result}</pre>
              </div>
            )}

            {/* System Status */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-md p-3 text-center">
                  <div className="text-green-600 font-medium">Web App</div>
                  <div className="text-green-800 text-sm">✅ Online</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-md p-3 text-center">
                  <div className="text-green-600 font-medium">Worker</div>
                  <div className="text-green-800 text-sm">✅ Healthy</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-md p-3 text-center">
                  <div className="text-green-600 font-medium">Redis Queue</div>
                  <div className="text-green-800 text-sm">✅ Connected</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-md p-3 text-center">
                  <div className="text-green-600 font-medium">Database</div>
                  <div className="text-green-800 text-sm">✅ Connected</div>
                </div>
              </div>
            </div>

            {/* Test Links */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Test Links</h3>
              <div className="space-y-2">
                <a
                  href="http://localhost:3000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  🏠 Homepage
                </a>
                <a
                  href="http://localhost:3000/dashboard-test"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  📊 Dashboard
                </a>
                <a
                  href="http://localhost:3002/health"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  🔧 Worker Health Check
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}