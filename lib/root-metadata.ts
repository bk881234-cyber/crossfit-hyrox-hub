import type { Metadata, Viewport } from 'next'

// Static site-wide metadata (formerly app/layout.tsx). Merged into app/[locale]/layout.tsx.
export const rootMetadata: Metadata = {
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

export const rootViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0D0D0D',
}
