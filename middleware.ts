import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const token = req.cookies.get('auth_token')?.value
  const isLoggedIn = Boolean(token)

  const isPublicAsset =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/icon') ||
    pathname.startsWith('/manifest') ||
    pathname.startsWith('/logo') ||
    pathname.match(/\.(.*)$/)

  const isLogin = pathname === '/login'

  if (!isPublicAsset) {
    if (!isLoggedIn && !isLogin) {
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      url.search = search || ''
      return NextResponse.redirect(url)
    }
    if (isLoggedIn && isLogin) {
      const url = req.nextUrl.clone()
      url.pathname = '/'
      url.search = ''
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
