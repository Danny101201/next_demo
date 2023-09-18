import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// export { default } from "next-auth/middleware"
import { withAuth } from "next-auth/middleware"
import { getToken } from 'next-auth/jwt';
export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  async function middleware(request) {

    const pathName = request.nextUrl.pathname

    // // auth 
    const token = await getToken({ req: request })
    const isAuth = !!token
    console.log(isAuth)
    const sensitiveRoutes = ['/posts']
    if (isAuth && !sensitiveRoutes.some(route => pathName.startsWith(route))) return NextResponse.redirect(new URL('/posts', request.url))
    if (!isAuth && sensitiveRoutes.some(route => pathName.startsWith(route))) return NextResponse.redirect(new URL('/', request.url))
  },
  {
    // pages: {
    //   signIn: '/'
    // },
    secret: process.env.AUTH_SECRET,
    callbacks: {
      // authorized: ({ token }) => {
      //   return token !== null
      // },
      authorized: () => true
    },
  }
)
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/posts', '/'],
}