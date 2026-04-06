import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin/bookings')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET ?? 'dev-secret-change-me' })

    if (!token) {
      const url = new URL('/', request.url)
      url.searchParams.set('login', 'required')
      return NextResponse.redirect(url)
    }
  }

  if (pathname.startsWith('/api/bookings') && request.method !== 'POST') {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET ?? 'dev-secret-change-me' })

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/bookings/:path*', '/api/bookings/:path*'],
}