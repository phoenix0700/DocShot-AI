export default function TestPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">DocShot AI - Test Page</h1>
      <p className="text-lg text-gray-600 mb-6">
        This is a simple test page to verify the web application is working.
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-xl font-semibold text-blue-900 mb-2">✅ Application Status</h2>
        <ul className="space-y-2 text-blue-800">
          <li>✅ Next.js 14 is running</li>
          <li>✅ Tailwind CSS is working</li>
          <li>✅ App Router is functional</li>
          <li>✅ TypeScript compilation successful</li>
        </ul>
      </div>
    </div>
  );
}