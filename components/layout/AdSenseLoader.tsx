'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// 광고를 띄우면 안 되는 화면(로그인·내 정보·약관 등 콘텐츠가 거의 없는 페이지).
// AdSense 정책상 로그인/개인 화면에 광고를 넣지 않는다.
const NO_AD_PATHS = /^\/(ko|en)\/(login|mypage|privacy|terms)(\/|$)/

export default function AdSenseLoader({ pubId }: { pubId: string }) {
  const pathname = usePathname() ?? ''

  useEffect(() => {
    if (NO_AD_PATHS.test(pathname)) return
    if (document.querySelector('script[data-adsense-loader]')) return
    const s = document.createElement('script')
    s.async = true
    s.crossOrigin = 'anonymous'
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`
    s.setAttribute('data-adsense-loader', '1')
    document.head.appendChild(s)
  }, [pathname, pubId])

  return null
}
