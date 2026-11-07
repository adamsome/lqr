import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  /^\/$/,
  /^\/api\/staticdata$/,
  /^\/research$/,
  /^\/specs$/,
  /^\/sign-(in|up)(\/.*)?$/,
  /^\/u\/[^/]*$/,
  /^\/u\/[^/]*\/bar(\/.*)?$/,
  /^\/u\/[^/]*\/following$/,
  /^\/u\/[^/]*\/specs(\/[^/]*)?$/,
])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) await auth.protect()
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
