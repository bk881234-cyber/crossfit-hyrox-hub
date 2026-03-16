import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

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
  }

  // 오류 시 로그인 페이지로 (locale은 /auth/complete에서 읽으므로 기본값 ko 사용)
  return NextResponse.redirect(`${origin}/ko/login?error=auth_callback_failed`)
}
