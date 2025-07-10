import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // 認証が必要なパスでの処理
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // 謎解き解答時には認証が必要
    if (pathname.startsWith('/puzzles/') && pathname.includes('/solve')) {
      if (!token) {
        // 未認証の場合は自動的に匿名認証を実行
        const url = req.nextUrl.clone()
        url.pathname = '/auth/anonymous'
        url.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(url)
      }
    }

    // 謎解き作成時には認証が必要
    if (pathname.startsWith('/puzzles/create')) {
      if (!token) {
        const url = req.nextUrl.clone()
        url.pathname = '/auth/anonymous'
        url.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(url)
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // API routesの場合は常に通す（各APIで個別に認証チェック）
        if (req.nextUrl.pathname.startsWith('/api/')) {
          return true
        }
        
        // その他のページは認証状態に関わらず通す
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/puzzles/:path*/solve',
    '/puzzles/create',
    '/api/puzzles/:path*/start',
    '/api/puzzles/:path*/answer',
    '/api/puzzles/:path*/complete',
  ],
}