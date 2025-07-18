/* eslint-disable react/no-unescaped-entities */
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back to DocShot AI</h2>
          <p className="text-gray-600">Sign in to manage your screenshot automation</p>
        </div>

        <div className="flex justify-center">
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-sm normal-case',
              },
            }}
            redirectUrl="/dashboard"
            signUpUrl="/sign-up"
          />
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>
            Don't have an account?{' '}
            <a href="/sign-up" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign up for free
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
