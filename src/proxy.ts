import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Routes that don't require authentication
const publicPaths = ['/', '/login', '/signup']
const publicApiPaths = ['/api/ics', '/api/health', '/api/auth']

function isPublicPath(pathname: string): boolean {
  if (publicPaths.includes(pathname)) return true
  if (pathname.startsWith('/api/auth/')) return true
  if (publicApiPaths.some((p) => pathname.startsWith(p))) return true
  return false
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (isPublicPath(pathname)) return NextResponse.next()

  const secureCookie = req.headers.get('x-forwarded-proto') === 'https' || req.nextUrl.protocol === 'https:'
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie,
  })
  if (!token) {
    console.log('[proxy] no token for', pathname, '— redirecting to /login (secure:', secureCookie, ')')
    console.log('[proxy] cookies:', req.cookies.getAll().map(c => c.name).join(', '))
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
