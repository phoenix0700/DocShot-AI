export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">DocShot AI is Running! 🎉</h1>
        <p className="text-xl text-gray-600 mb-8">Your Next.js app is working correctly.</p>
        <div className="space-y-4">
          <p className="text-gray-500">
            The database connection needs to be configured to access the dashboard.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Go to Landing Page
            </a>
            <a
              href="/sign-out"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Sign Out
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
