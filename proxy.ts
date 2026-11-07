import { clerkMiddleware } from '@clerk/nextjs/server'

// Provides Clerk auth state to the app. Access control lives in each page
// (`await auth.protect()`) and route handler (401/403 responses), not here.
export default clerkMiddleware()

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
