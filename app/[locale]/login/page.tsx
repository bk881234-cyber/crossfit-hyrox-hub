'use client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { Link } from '@/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const locale = useLocale()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? `/${locale}`
  const errorParam = searchParams.get('error')

  const [loading, setLoading] = useState<'google' | 'kakao' | null>(null)

  const supabase = createClient()
  const tAuth = useTranslations('auth')

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
    const state = encodeURIComponent(JSON.stringify({ locale, callbackUrl }))
    const kakaoUrl = `https://kauth.kakao.com/oauth/authorize?client_id=aaabffa226fc652b4faedaec8af04582&redirect_uri=${window.location.origin}/api/auth/kakao&response_type=code&state=${state}`
    window.location.href = kakaoUrl
  }

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
          <Link href="/" className="inline-block mb-6">
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
            {tAuth('welcome')}
          </h1>
          <p className="text-rx-muted text-sm">
            {tAuth('loginSubtitle')}
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
            {tAuth('loginDesc')}
          </p>

          {/* Error message */}
          {errorParam && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-rx-red/10 border border-rx-red/30 text-rx-red text-sm text-center">
              {tAuth('loginError')}
            </div>
          )}

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
            {tAuth('google')}
          </button>

          {/* Kakao login button */}
          <button
            onClick={handleKakaoLogin}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm mb-4 border transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: '#FEE500',
              borderColor: '#FEE500',
              color: '#000000',
              boxShadow: loading === 'kakao' ? 'none' : '0 2px 12px rgba(254,229,0,0.15)',
            }}
          >
            {loading === 'kakao' ? (
              <span className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#000000">
                <path d="M12 3C6.477 3 2 6.477 2 10.766c0 2.766 1.847 5.178 4.606 6.551-.19.702-.686 2.535-.749 2.784-.08.318.114.318.241.231.102-.07 1.637-1.111 2.308-1.579.51.083 1.037.127 1.586.127 5.523 0 10-3.477 10-7.766C22 6.477 17.523 3 12 3z"/>
              </svg>
            )}
            {tAuth('kakao')}
          </button>

          <p className="text-center text-rx-muted text-xs">
            {tAuth('loginNote')}
          </p>
        </div>

        {/* Terms and Privacy */}
        <p className="text-center text-rx-muted text-xs mt-4">
          {tAuth('agreePrefix')}
          <Link href="/terms" className="text-white/60 hover:text-white transition-colors underline">
            {tAuth('terms')}
          </Link>
          {tAuth('agreeAnd')}
          <Link href="/privacy" className="text-white/60 hover:text-white transition-colors underline">
            {tAuth('privacy')}
          </Link>
          {tAuth('agreeSuffix')}
        </p>

        {/* Back to home */}
        <div className="text-center mt-4">
          <Link href="/" className="text-rx-muted text-xs hover:text-white transition-colors">
            {tAuth('backToHome')}
          </Link>
        </div>
      </div>
    </div>
  )
}
