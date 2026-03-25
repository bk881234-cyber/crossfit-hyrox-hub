import createIntlMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'
import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

// 로그인 필요 경로 (locale prefix 제외한 실제 경로)
const PROTECTED_ROUTES = ['/community/write']

// next-intl v4: createMiddleware(routing)
const intlMiddleware = createIntlMiddleware(routing)

/**
 * IP 국가 기반 언어 감지
 * - 한국(KR) IP → 'ko'
 * - 그 외 모든 해외 IP → 'en'
 * - 사용자가 직접 선택한 언어(NEXT_LOCALE 쿠키)는 항상 우선
 */
function detectLocale(request: NextRequest): string {
  // 사용자가 직접 선택한 언어 쿠키 우선 적용
  const savedLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (savedLocale === 'ko' || savedLocale === 'en') {
    return savedLocale
  }

  // Vercel 배포 환경의 IP 국가 헤더
  const country =
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    ''

  return country === 'KR' ? 'ko' : 'en'
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /auth/* 또는 /api/* 경로는 무조건 통과 – OAuth 콜백에 locale 리다이렉트 금지
  // .html/.txt 파일(웹마스터 인증 등)도 통과
  if (
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/api/') ||
    pathname.endsWith('.html') ||
    pathname.endsWith('.txt')
  ) {
    return NextResponse.next()
  }

  // locale prefix가 없는 경로 처리 (최초 방문 등)
  const hasLocale = /^\/(ko|en)(\/|$)/.test(pathname)

  if (!hasLocale) {
    const locale = detectLocale(request)
    const targetPath = pathname === '/' ? '' : pathname
    const redirectUrl = new URL(
      `/${locale}${targetPath}${request.nextUrl.search}`,
      request.url,
    )
    const response = NextResponse.redirect(redirectUrl)
    // 감지된 언어를 쿠키에 저장 (1년) — 이후 방문에서도 동일 언어 유지
    if (!request.cookies.get('NEXT_LOCALE')) {
      response.cookies.set('NEXT_LOCALE', locale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
      })
    }
    return response
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

  // next-intl로 locale 라우팅 처리
  return intlMiddleware(request)
}

export const config = {
  matcher: [
    // /auth/* 와 /api/* 는 matcher에서도 제외 (이중 보호)
    '/((?!auth|api|_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|woff2?|ttf|otf|html|txt)).*)',
  ],
}
