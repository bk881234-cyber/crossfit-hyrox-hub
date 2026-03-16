'use client'
import { useEffect } from 'react'
import { useSearchParams, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function KakaoCompletePage() {
  const searchParams = useSearchParams()
  const params = useParams()
  const locale = (params?.locale as string) ?? 'ko'
  const supabase = createClient()

  useEffect(() => {
    const token = searchParams.get('token')
    const next = searchParams.get('next') ?? `/${locale}`

    if (!token) {
      window.location.href = `/${locale}/login?error=kakao_no_token`
      return
    }

    supabase.auth.signInWithIdToken({
      provider: 'kakao',
      token,
    }).then(({ error }) => {
      if (!error) {
        window.location.href = next
      } else {
        console.error('Kakao signInWithIdToken error:', error)
        window.location.href = `/${locale}/login?error=kakao_signin_failed`
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full mx-auto mb-4" />
        <p className="text-sm text-white/60">카카오 로그인 처리 중...</p>
      </div>
    </div>
  )
}
