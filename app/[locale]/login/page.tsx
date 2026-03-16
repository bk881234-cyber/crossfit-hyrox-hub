'use client'
import { useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const KAKAO_REST_API_KEY = 'aaabffa226fc652b4faedaec8af04582'

export default function LoginPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const locale = (params?.locale as string) ?? 'ko'
  const callbackUrl = searchParams.get('callbackUrl') ?? `/${locale}`
  const errorParam = searchParams.get('error')

  const [loading, setLoading] = useState<'kakao' | 'google' | null>(null)

  const supabase = createClient()

  const handleGoogleLogin = async () => {
    setLoading('google')
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(callbackUrl)}&locale=${locale}`
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    })
  }

  const handleKakaoLogin = () => {
    setLoading('kakao')
    // locale과 callbackUrl을 state 파라미터로 전달해 콜백에서 복원
    const state = encodeURIComponent(JSON.stringify({ locale, callbackUrl }))
    const oauthParams = new URLSearchParams({
      client_id: KAKAO_REST_API_KEY,
      redirect_uri: `${window.location.origin}/api/auth/kakao`,
      response_type: 'code',
      scope: 'openid profile_nickname profile_image',
      state,
    })
    window.location.href = `https://kauth.kakao.com/oauth/authorize?${oauthParams}`
  }

  const isKo = locale === 'ko'

  return (
    <div className="min-h-screen bg-rx-bg flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background glow effects */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #E8321A 0%, #FF2D8B 100%)' }}
        />

        <div className="w-full max-w-sm relative z-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href={`/${locale}`} className="inline-block mb-6">
              <Image
                src="/Fittersstudio_BI.png"
                alt="FITTERS STUDIO"
                height={40}
                width={160}
                className="h-10 w-auto mx-auto"
                priority
              />
            </Link>
            <h1 className="text-white font-black text-2xl mb-1">
              {isKo ? '환영합니다' : 'Welcome'}
            </h1>
            <p className="text-rx-muted text-sm">
              {isKo ? '크로스피터를 위한 모든 것' : 'Everything for CrossFitters'}
            </p>
          </div>

          {/* Glassmorphism card */}
          <div
            className="rounded-2xl p-7 border"
            style={{
              background: 'rgba(26,26,26,0.85)',
              backdropFilter: 'blur(20px)',
              borderColor: 'rgba(255,255,255,0.1)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            <p className="text-center text-rx-muted text-sm mb-6">
              {isKo ? '소셜 계정으로 간편하게 시작하세요' : 'Sign in with your social account'}
            </p>

            {/* Error message */}
            {errorParam && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-rx-red/10 border border-rx-red/30 text-rx-red text-sm text-center">
                {isKo ? '로그인 중 오류가 발생했습니다. 다시 시도해주세요.' : 'Login failed. Please try again.'}
              </div>
            )}

            {/* Kakao login button */}
            <button
              onClick={handleKakaoLogin}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm mb-3 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: '#FEE500',
                color: '#3C1E1E',
                boxShadow: loading === 'kakao' ? 'none' : '0 2px 12px rgba(254,229,0,0.25)',
              }}
            >
              {loading === 'kakao' ? (
                <span className="inline-block w-4 h-4 border-2 border-[#3C1E1E]/40 border-t-[#3C1E1E] rounded-full animate-spin" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3C6.48 3 2 6.69 2 11.24c0 2.9 1.9 5.44 4.74 6.92l-.86 3.18a.5.5 0 0 0 .73.55l3.87-2.54A12.22 12.22 0 0 0 12 19.5c5.52 0 10-3.69 10-8.26S17.52 3 12 3z" />
                </svg>
              )}
              {isKo ? '카카오로 계속하기' : 'Continue with Kakao'}
            </button>

            {/* Google login button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm mb-4 border transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'rgba(255,255,255,0.07)',
                borderColor: 'rgba(255,255,255,0.15)',
                color: '#fff',
                boxShadow: loading === 'google' ? 'none' : '0 2px 12px rgba(255,255,255,0.05)',
              }}
            >
              {loading === 'google' ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              {isKo ? 'Google로 계속하기' : 'Continue with Google'}
            </button>

            <p className="text-center text-rx-muted text-xs">
              {isKo ? '계정이 없으면 자동으로 생성됩니다' : 'New accounts are created automatically'}
            </p>
          </div>

          {/* Terms and Privacy */}
          <p className="text-center text-rx-muted text-xs mt-4">
            {isKo ? '로그인 시' : 'By signing in, you agree to our'}{' '}
            <Link href={`/${locale}/terms`} className="text-white/60 hover:text-white transition-colors underline">
              {isKo ? '이용약관' : 'Terms'}
            </Link>
            {isKo ? ' 및 ' : ' and '}
            <Link href={`/${locale}/privacy`} className="text-white/60 hover:text-white transition-colors underline">
              {isKo ? '개인정보처리방침' : 'Privacy Policy'}
            </Link>
            {isKo ? '에 동의합니다' : ''}
          </p>

          {/* Back to home */}
          <div className="text-center mt-4">
            <Link href={`/${locale}`} className="text-rx-muted text-xs hover:text-white transition-colors">
              ← {isKo ? '홈으로 돌아가기' : 'Back to home'}
            </Link>
          </div>
        </div>
      </div>
  )
}
