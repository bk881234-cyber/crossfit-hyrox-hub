import type { Metadata, Viewport } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import Script from 'next/script'
import '../globals.css'
import { rootMetadata, rootViewport } from '@/lib/root-metadata'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Footer from '@/components/layout/Footer'
import AdSenseLoader from '@/components/layout/AdSenseLoader'
import { localizedAlternates } from '@/lib/seo'

const locales = ['ko', 'en'] as const

const notoSansKR = Noto_Sans_KR({
  weight: ['400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-noto-sans',
  display: 'swap',
})

export const viewport: Viewport = rootViewport

const adsensePubId = process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-6607759856824002'
const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-KEXR0BMH62'

// 사이트 전체 Organization / WebSite 구조화 데이터 (로케일별)
const organizationJsonLd = (locale: string) => {
  const isEn = locale === 'en'
  return {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: isEn ? 'FITTERS STUDIO' : '핏터스 스튜디오 (FITTERS STUDIO)',
  alternateName: isEn ? ['Fitters Studio', 'FITTERS STUDIO'] : ['핏터스', '피터스', '핏터스 스튜디오', '피터스 스튜디오', '핏터즈', '피터즈', 'Fitters Studio', 'FITTERS STUDIO'],
  url: `https://www.fittersstudio.com/${locale}`,
  logo: 'https://www.fittersstudio.com/Fittersstudio_BI.png',
  description: isEn ? 'All-in-one information hub for the CrossFit and HYROX community: 1RM calculator, WOD timer, WOD library, box finder and competition calendar.' : '핏터스·피터스 및 크로스핏·HYROX 커뮤니티를 위한 올인원 정보 허브 플랫폼 핏터스 스튜디오',
  sameAs: ['https://www.instagram.com/fitters.studio'],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'bkbk881234@gmail.com',
    contactType: 'customer support',
  },
}
}

const websiteJsonLd = (locale: string) => {
  const isEn = locale === 'en'
  return {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: isEn ? 'FITTERS STUDIO' : '핏터스 스튜디오 (FITTERS STUDIO)',
  alternateName: isEn ? ['Fitters Studio'] : ['핏터스', '피터스', '핏터스 스튜디오', '피터스 스튜디오', '핏터즈', '피터즈'],
  url: `https://www.fittersstudio.com/${locale}`,
  description: isEn ? 'Free all-in-one toolkit and information hub for CrossFit and HYROX athletes.' : '핏터스·피터스를 위한 크로스핏·HYROX 커뮤니티 올인원 정보 허브 플랫폼',
  potentialAction: {
    '@type': 'SearchAction',
    target: `https://www.fittersstudio.com/${locale}/wod?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}
}

interface Props {
  children: React.ReactNode
  params: { locale: string }
}

// 홈페이지(app/[locale]/page.tsx)는 'use client'라 자체 metadata를 못 가져서
// 여기서 로케일별 자기참조 canonical + 제목/설명을 지정한다. 다른 페이지들은
// 각자 layout.tsx/generateMetadata에서 이 값을 자기 경로 기준으로 덮어쓴다.
export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const isEn = locale === 'en'
  return {
    ...rootMetadata,
    // title.absolute: 루트 레이아웃의 템플릿("%s | 핏터스 스튜디오...")이
    // 겹쳐 붙지 않도록 완전한 최종 제목으로 고정한다.
    title: {
      absolute: isEn
        ? 'FITTERS STUDIO — Free CrossFit & HYROX Toolkit'
        : '핏터스 스튜디오 (FITTERS STUDIO) — 크로스핏·HYROX 올인원 플랫폼',
    },
    description: isEn
      ? 'Free 1RM calculator, WOD timer, workout library, box finder, and competition calendar for CrossFit and HYROX athletes worldwide.'
      : '핏터스·피터스를 위한 1RM 계산기·WOD 타이머·WOD 라이브러리·드랍인 지도·대회 일정을 한곳에 — 크로스핏·HYROX 커뮤니티 플랫폼 핏터스 스튜디오 (FITTERS STUDIO)',
    keywords: isEn
      ? ['crossfit tools', 'hyrox training', 'wod timer', '1rm calculator', 'crossfit workout library', 'free crossfit app', 'crossfit box finder']
      : ['핏터스', '피터스', '핏터스 스튜디오', '피터스 스튜디오', '크로스핏', 'HYROX', '1RM 계산기', 'WOD 타이머', 'WOD 라이브러리', '드랍인 지도', '크로스핏 대회'],
    openGraph: {
      title: isEn ? 'FITTERS STUDIO — Free CrossFit & HYROX Toolkit' : '핏터스 스튜디오 (FITTERS STUDIO) — 크로스피터를 위한 올인원 플랫폼',
      description: isEn
        ? 'Free 1RM calculator, WOD timer, workout library, box finder, and competition calendar for CrossFit and HYROX athletes.'
        : '핏터스·피터스를 위한 1RM 계산기, WOD 타이머, 드랍인 지도, 대회 일정 — 크로스핏·HYROX 올인원 허브',
      url: `https://www.fittersstudio.com/${locale}`,
      siteName: 'FITTERS STUDIO',
      type: 'website',
      locale: isEn ? 'en_US' : 'ko_KR',
      images: [{ url: '/OG_img.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: isEn ? 'FITTERS STUDIO — Free CrossFit & HYROX Toolkit' : '핏터스 스튜디오 (FITTERS STUDIO)',
      description: isEn ? 'Free all-in-one toolkit for CrossFit and HYROX athletes' : '핏터스·피터스를 위한 크로스피터 올인원 도구 모음',
      images: ['/OG_img.png'],
    },
    alternates: localizedAlternates(locale, ''),
  }
}

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  if (!locales.includes(locale as (typeof locales)[number])) notFound()

  const messages = await getMessages()

  return (
    <html suppressHydrationWarning lang={locale}>
      <head>
        {/* Organization & WebSite 구조화 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(locale)) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd(locale)) }}
        />
        {adsensePubId && <meta name="google-adsense-account" content={adsensePubId} />}
      </head>
      <body className={`${notoSansKR.variable} bg-rx-bg min-h-screen`} suppressHydrationWarning>
        {adsensePubId && <AdSenseLoader pubId={adsensePubId} />}
        <NextIntlClientProvider messages={messages}>
          {children}
          <Footer />
        </NextIntlClientProvider>
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
