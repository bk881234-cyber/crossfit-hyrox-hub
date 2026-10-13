import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // 오류 시 사용자가 보던 언어의 로그인 화면으로 돌려보낸다 (NEXT_LOCALE 쿠키 기준)
  const loc = request.cookies.get('NEXT_LOCALE')?.value === 'en' ? 'en' : 'ko'

  // Google/Supabase can reject the OAuth request itself (e.g. redirect_uri
  // mismatch, consent denied) before a `code` is ever issued — in that case
  // the provider puts the reason directly on this callback URL.
  const providerError = searchParams.get('error_description') || searchParams.get('error')
  if (providerError) {
    console.error('[auth/callback] provider error:', providerError)
    return NextResponse.redirect(`${origin}/${loc}/login?error=${encodeURIComponent(providerError)}`)
  }

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          },
        },
      },
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // 복귀 경로는 /auth/complete 클라이언트 페이지에서 localStorage로 복원
      return NextResponse.redirect(`${origin}/auth/complete`)
    }
    console.error('[auth/callback] exchangeCodeForSession error:', error.message)
    return NextResponse.redirect(`${origin}/${loc}/login?error=${encodeURIComponent(error.message)}`)
  }

  // 오류 시 로그인 페이지로 (locale은 /auth/complete에서 읽으므로 기본값 ko 사용)
  return NextResponse.redirect(`${origin}/${loc}/login?error=auth_callback_failed`)
}
