'use client'
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[]
  }
}

interface AdBannerProps {
  /** 애드센스 대시보드에서 발급받은 광고 단위 슬롯 ID (환경변수 미설정 시 렌더링 생략) */
  slot?: string
  format?: 'auto' | 'horizontal' | 'rectangle'
  className?: string
}

const PUB_ID = process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-6607759856824002'

export default function AdBanner({ slot, format = 'auto', className = '' }: AdBannerProps) {
  const pushedRef = useRef(false)

  useEffect(() => {
    if (!slot || pushedRef.current) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      pushedRef.current = true
    } catch {
      // 광고 차단기 또는 스크립트 미로드 시 무시
    }
  }, [slot])

  if (!slot) return null

  return (
    <div className={`w-full overflow-hidden text-center ${className}`} aria-label="Advertisement">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={PUB_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
