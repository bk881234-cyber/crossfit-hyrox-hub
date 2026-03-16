import createIntlMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'
import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

// 로그인 필요 경로 (locale prefix 제외한 실제 경로)
const PROTECTED_ROUTES = ['/community/write']

// next-intl v4: createMiddleware(routing)
const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /auth/* 또는 /api/* 경로는 무조건 통과 – OAuth 콜백에 locale 리다이렉트 금지
  if (pathname.startsWith('/auth/') || pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // locale prefix를 제거한 실제 경로 추출 (/ko/timer → /timer)
  const localeMatch = pathname.match(/^\/(ko|en)(\/.*)?$/)
  const pathnameWithoutLocale = localeMatch ? (localeMatch[2] || '/') : pathname

  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(route + '/'),
  )

  if (isProtected) {
    const supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              supabaseResponse.cookies.set(name, value, options)
            })
          },
        },
      },
    )

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      const currentLocale = localeMatch ? localeMatch[1] : routing.defaultLocale
      const loginUrl = new URL(`/${currentLocale}/login`, request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // next-intl로 locale 라우팅 처리 (언어 감지 + 리다이렉트)
  return intlMiddleware(request)
}

export const config = {
  matcher: [
    // /auth/* 와 /api/* 는 matcher에서도 제외 (이중 보호)
    '/((?!auth|api|_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|woff2?|ttf|otf)).*)',
  ],
}
