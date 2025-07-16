import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhooks/(.*)',
    '/test', // Keep test page public for now
    '/test-workflow', // Keep test workflow public for now
  ],
  
  // Routes that should always be accessible, even without auth
  ignoredRoutes: [
    '/api/health',
    '/api/test-screenshot', // Keep test API public for now
    '/_next/(.*)',
    '/favicon.ico',
  ],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};