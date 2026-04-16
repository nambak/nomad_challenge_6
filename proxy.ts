import { NextResponse, type NextRequest } from 'next/server'

// Routes that require the user to be logged in.
// `/` only matches the exact root; `/profile` and `/tweets` also match subpaths.
const PROTECTED_PREFIXES = ['/', '/profile', '/tweets']
// Routes that only logged-out users should see.
const PUBLIC_ONLY_PATHS = ['/log-in', '/create-account']

const SESSION_COOKIE = 'nomad_auth_session'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  // We only verify the cookie's *presence* here. The real signature check
  // happens inside `getSession()` on the page/action that reads it, so
  // tampered cookies can't actually authenticate the user.
  const hasSession = request.cookies.has(SESSION_COOKIE)

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
  const isPublicOnly = PUBLIC_ONLY_PATHS.includes(pathname)

  if (isProtected && !hasSession) {
    const url = request.nextUrl.clone()
    url.pathname = '/log-in'
    return NextResponse.redirect(url)
  }

  if (isPublicOnly && hasSession) {
    const url = request.nextUrl.clone()
    url.pathname = '/profile'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/log-in',
    '/create-account',
    '/profile/:path*',
    '/tweets/:path*',
  ],
}
