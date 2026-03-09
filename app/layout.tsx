import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RX HUB - 크로스피터를 위한 모든 것',
  description: '1RM 계산기, WOD 타이머, WOD 아카이브, 드랍인 지도 - 크로스피터에게 꼭 필요한 기능만',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0D0D0D',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-rx-bg min-h-screen">
        {children}
      </body>
    </html>
  )
}
