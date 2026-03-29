import { NextRequest, NextResponse } from 'next/server'

// Routes that don't require authentication
const publicPaths = ['/', '/login', '/signup', '/invite']
const publicApiPaths = ['/api/ics', '/api/health', '/api/auth', '/api/uploads']

// All known NextAuth v5 session cookie names (secure + non-secure variants)
const SESSION_COOKIE_NAMES = [
  'authjs.session-token',
  '__Secure-authjs.session-token',
  'next-auth.session-token',
  '__Secure-next-auth.session-token',
]

function isPublicPath(pathname: string): boolean {
  if (publicPaths.some((p) => pathname === p || pathname.startsWith(p + '/'))) return true
  if (publicApiPaths.some((p) => pathname.startsWith(p))) return true
  return false
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (isPublicPath(pathname)) return NextResponse.next()

  // Check for session cookie existence — actual JWT validation happens in each route/action
  const cookies = req.cookies.getAll()
  const hasSession = SESSION_COOKIE_NAMES.some((name) => cookies.some((c) => c.name === name))

  if (!hasSession) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest\\.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
