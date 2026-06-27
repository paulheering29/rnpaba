import { type NextRequest, NextResponse } from 'next/server'

const PLATFORM_DOMAIN = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ?? 'orgsite.com'
const DEFAULT_ORG_SLUG = process.env.NEXT_PUBLIC_DEFAULT_ORG_SLUG ?? 'rnpaba'

export function proxy(request: NextRequest) {
  const { hostname, pathname } = request.nextUrl
  const requestHeaders = new Headers(request.headers)

  // Platform admin routes — no org context
  if (pathname.startsWith('/platform-admin')) {
    requestHeaders.set('x-platform-admin', 'true')
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Local dev: DEFAULT_ORG_SLUG env var picks which org to render
    requestHeaders.set('x-org-slug', DEFAULT_ORG_SLUG)
  } else if (hostname === `app.${PLATFORM_DOMAIN}`) {
    // Platform super-admin subdomain
    requestHeaders.set('x-platform-admin', 'true')
  } else if (hostname.endsWith(`.${PLATFORM_DOMAIN}`)) {
    // Subdomain routing: rnpaba.orgsite.com → slug "rnpaba"
    const slug = hostname.slice(0, hostname.length - PLATFORM_DOMAIN.length - 1)
    requestHeaders.set('x-org-slug', slug)
  } else {
    // Custom domain (e.g. rnpaba.org) — layout resolves by hostname
    requestHeaders.set('x-org-hostname', hostname)
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
