import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


const hasSessionCookie = (request: NextRequest) =>
  request.cookies.getAll().some((cookie) => {
    const name = cookie.name.replace(/^__Secure-/, '')
    return (
      name === 'better-auth.session_token' ||
      name.startsWith('better-auth.session_token.')
    )
  })

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {


  if (!hasSessionCookie(request)) {
    const signInUrl = new URL('/signin', request.url)
    signInUrl.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}


export const config = {
  matcher: [
    // '/books/:path*', // book details
    '/add-book',
    '/my-books',
    '/my-borrow',
    '/profile',
  ],
}
