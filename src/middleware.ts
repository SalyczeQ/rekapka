import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/lib/supabase/types'

// Routes that don't require authentication
const publicPaths = ['/', '/login', '/signup', '/auth']
const publicApiPaths = ['/api/ics', '/api/health']

function isPublicPath(pathname: string): boolean {
  // Exact match for public paths
  if (publicPaths.includes(pathname)) return true

  // Prefix match for auth callbacks (e.g., /auth/callback)
  if (pathname.startsWith('/auth/')) return true

  // Prefix match for public API routes
  if (publicApiPaths.some((p) => pathname.startsWith(p))) return true

  return false
}

export async function middleware(request: NextRequest) {
  // Refresh the session (keeps auth cookies alive)
  const response = await updateSession(request)

  const { pathname } = request.nextUrl

  // Allow public paths through without auth check
  if (isPublicPath(pathname)) {
    return response
  }

  // For protected routes, check if user is authenticated
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets (images, svgs, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
