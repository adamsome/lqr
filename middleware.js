import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  publicRoutes: [
    '/',
    '/api/staticdata',
    '/research',
    '/u/([^/]*)',
    '/u/([^/]*/bar)',
    '/u/([^/]*/bar/.*)',
    '/u/([^/]*/following)',
    '/u/([^/]*/specs)',
    '/u/([^/]*/specs/[^/]*)',
  ],
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
