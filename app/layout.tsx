import type { Metadata, Viewport } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import './globals.css'

const notoSansKR = Noto_Sans_KR({
  weight: ['400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-noto-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.fittersstudio.com'),
  title: 'FITTERS STUDIO - 크로스피터를 위한 모든 것',
  description: '1RM 계산기, WOD 타이머, WOD Library, 드랍인 지도 - 크로스피터에게 꼭 필요한 기능만',
  verification: {
    // 구글 서치콘솔 인증코드 (Google Search Console > 소유권 확인 > HTML 태그에서 content 값 복사)
    // google: 'YOUR_GOOGLE_VERIFICATION_CODE',
    other: {
      // 네이버 서치어드바이저 인증
      'naver-site-verification': '2681da9e9f1013a8a47193aaff8acd03f63d39d5',
    },
  },
  openGraph: {
    title: 'Fitters Studio',
    description: '크로스피터를 위한 모든 도구를 한곳에',
    url: 'https://www.fittersstudio.com',
    images: [{ url: '/OG_img.png', width: 1200, height: 630 }],
    siteName: 'Fitters Studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fitters Studio',
    description: '크로스피터를 위한 모든 도구를 한곳에',
    images: ['/OG_img.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0D0D0D',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={`${notoSansKR.variable} bg-rx-bg min-h-screen`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
