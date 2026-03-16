import { NextRequest, NextResponse } from 'next/server'

const KAKAO_REST_API_KEY = 'aaabffa226fc652b4faedaec8af04582'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const rawState = searchParams.get('state')

  // state 파라미터에서 locale, callbackUrl 복원
  let locale = 'ko'
  let callbackUrl = '/ko'
  if (rawState) {
    try {
      const parsed = JSON.parse(decodeURIComponent(rawState))
      if (parsed.locale) locale = parsed.locale
      if (parsed.callbackUrl) callbackUrl = parsed.callbackUrl
    } catch {
      // state 파싱 실패 시 기본값 사용
    }
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/${locale}/login?error=kakao_no_code`)
  }

  try {
    const tokenRes = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: KAKAO_REST_API_KEY,
        redirect_uri: `${origin}/api/auth/kakao`,
        code,
        client_secret: process.env.KAKAO_CLIENT_SECRET ?? '',
      }),
    })

    const tokens = await tokenRes.json()

    if (!tokens.id_token) {
      console.error('No id_token in Kakao response:', tokens)
      return NextResponse.redirect(`${origin}/${locale}/login?error=kakao_no_token`)
    }

    // 클라이언트 페이지에서 Supabase signInWithIdToken을 완료하도록 리다이렉트
    const completeUrl = new URL(`${origin}/${locale}/auth/kakao-complete`)
    completeUrl.searchParams.set('token', tokens.id_token)
    completeUrl.searchParams.set('next', callbackUrl)
    return NextResponse.redirect(completeUrl.toString())
  } catch (err) {
    console.error('Kakao token exchange error:', err)
    return NextResponse.redirect(`${origin}/${locale}/login?error=kakao_exchange_failed`)
  }
}
