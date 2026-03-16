'use client'
import { useEffect } from 'react'

export default function AuthCompletePage() {
  useEffect(() => {
    const redirectTo = localStorage.getItem('auth_redirect_to')
    const locale = localStorage.getItem('auth_locale') ?? 'ko'
    localStorage.removeItem('auth_redirect_to')
    localStorage.removeItem('auth_locale')

    const destination =
      redirectTo && redirectTo.startsWith('/') ? redirectTo : `/${locale}`
    window.location.replace(destination)
  }, [])

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full mx-auto mb-4" />
        <p className="text-sm text-white/60">로그인 처리 중...</p>
      </div>
    </div>
  )
}
