import type { Metadata, Viewport } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const notoSansKR = Noto_Sans_KR({
  weight: ['400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-noto-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.fittersstudio.com'),
  title: {
    default: '핏터스 스튜디오 (FITTERS STUDIO) — 크로스핏·HYROX 올인원 플랫폼',
    template: '%s | 핏터스 스튜디오 (FITTERS STUDIO)',
  },
  description:
    '핏터스·피터스를 위한 1RM 계산기·WOD 타이머·WOD 라이브러리·드랍인 지도·대회 일정을 한곳에 — 크로스핏·HYROX 커뮤니티 플랫폼 핏터스 스튜디오 (FITTERS STUDIO)',
  icons: {
    icon: [
      { url: '/fittersstudio_symbol.png', type: 'image/png' },
      { url: '/fittersstudio_symbol.ico', sizes: 'any' },
    ],
    shortcut: '/fittersstudio_symbol.png',
    apple: '/fittersstudio_symbol.png',
  },

  keywords: [
    '핏터스',
    '피터스',
    '핏터스 스튜디오',
    '피터스 스튜디오',
    '핏터스스튜디오',
    '피터스스튜디오',
    '핏터즈',
    '피터즈',
    '크로스핏',
    'HYROX',
    '1RM 계산기',
    'WOD 타이머',
    'WOD 라이브러리',
    '드랍인 지도',
    '크로스핏 대회',
    'FITTERS STUDIO',
    'fittersstudio',
  ],
  verification: {
    other: {
      'naver-site-verification': [
        '9f167b2764552644b1b0e0795a770734d8564d2f',
        '2681da9e9f1013a8a47193aaff8acd03f63d39d5',
      ],
    },
  },
  openGraph: {
    title: '핏터스 스튜디오 (FITTERS STUDIO) — 크로스피터를 위한 올인원 플랫폼',
    description: '핏터스·피터스를 위한 1RM 계산기, WOD 타이머, 드랍인 지도, 대회 일정 — 크로스핏·HYROX 올인원 허브',
    url: 'https://www.fittersstudio.com',
    images: [{ url: '/OG_img.png', width: 1200, height: 630 }],
    siteName: '핏터스 스튜디오 (FITTERS STUDIO)',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '핏터스 스튜디오 (FITTERS STUDIO)',
    description: '핏터스·피터스를 위한 크로스피터 올인원 도구 모음',
    images: ['/OG_img.png'],
  },
  alternates: {
    canonical: 'https://www.fittersstudio.com',
    languages: {
      ko: 'https://www.fittersstudio.com/ko',
      en: 'https://www.fittersstudio.com/en',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0D0D0D',
}

// 사이트 전체 Organization 구조화 데이터
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '핏터스 스튜디오 (FITTERS STUDIO)',
  alternateName: ['핏터스', '피터스', '핏터스 스튜디오', '피터스 스튜디오', '핏터즈', '피터즈', 'Fitters Studio', 'FITTERS STUDIO'],
  url: 'https://www.fittersstudio.com',
  logo: 'https://www.fittersstudio.com/Fittersstudio_BI.png',
  description: '핏터스·피터스 및 크로스핏·HYROX 커뮤니티를 위한 올인원 정보 허브 플랫폼 핏터스 스튜디오',
  sameAs: ['https://www.instagram.com/fitters.studio'],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'bkbk881234@gmail.com',
    contactType: 'customer support',
  },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: '핏터스 스튜디오 (FITTERS STUDIO)',
  alternateName: ['핏터스', '피터스', '핏터스 스튜디오', '피터스 스튜디오', '핏터즈', '피터즈'],
  url: 'https://www.fittersstudio.com',
  description: '핏터스·피터스를 위한 크로스핏·HYROX 커뮤니티 올인원 정보 허브 플랫폼',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://www.fittersstudio.com/wod?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

const adsensePubId = process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-6607759856824002'
const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-KEXR0BMH62'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="ko">
      <head>
        {/* Organization & WebSite 구조화 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/* Google AdSense 자동 광고 */}
        {adsensePubId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePubId}`}
            crossOrigin="anonymous"
          ></script>
        )}
      </head>
      <body className={`${notoSansKR.variable} bg-rx-bg min-h-screen`} suppressHydrationWarning>
        {children}
        {/* Google Analytics 4 */}
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
