import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/seo'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'CrossFit & HYROX Competition Calendar Korea | FITTERS STUDIO'
      : '크로스핏 대회·HYROX 일정 커뮤니티 — FITTERS STUDIO',
    description: isEn
      ? 'HYROX Korea Seoul & Incheon dates, plus major Korean CrossFit competitions — Team of Four, Makia, Battle Crew, CrossFit Korea Open, and more — all in one place. Register your own event.'
      : '2025 HYROX Korea 서울·부산·인천 대회 일정, 팀오브포·마키아·배틀크루·크로스핏 코리아 오픈 등 국내 크로스핏 대회 정보를 한곳에서 확인하세요. 대회 직접 등록 가능.',
    keywords: isEn
      ? ['hyrox korea schedule', 'hyrox seoul', 'hyrox incheon', 'crossfit competition korea', 'korean crossfit events', 'crossfit korea open']
      : [
          '크로스핏 대회',
          'HYROX 2025',
          '하이록스 한국',
          '크로스핏 대회 일정',
          '팀오브포',
          '마키아',
          '배틀크루',
          '크로스핏 코리아 오픈',
          '국내 크로스핏 대회',
        ],
    alternates: localizedAlternates(locale, '/community'),
    openGraph: {
      title: isEn
        ? 'CrossFit & HYROX Competition Calendar | FITTERS STUDIO'
        : '크로스핏·HYROX 대회 일정 & 커뮤니티 | FITTERS STUDIO',
      description: isEn
        ? 'HYROX Korea and major domestic CrossFit competition dates in one place. Register your own event.'
        : '2025 HYROX Korea 및 국내 크로스핏 대회 일정을 한 곳에서. 대회 직접 등록 가능.',
      url: `https://www.fittersstudio.com/${locale}/community`,
      images: [{ url: '/OG_img.png', width: 1200, height: 630 }],
    },
  }
}

export default function CommunityLayout({ children, params: { locale } }: { children: React.ReactNode; params: { locale: string } }) {
  const isEn = locale === 'en'
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: isEn ? 'HYROX & CrossFit Competition Calendar — FITTERS STUDIO' : '2025 HYROX Korea & 크로스핏 대회 일정 — FITTERS STUDIO',
            description: isEn ? 'HYROX event dates plus major CrossFit competitions in Korea.' : 'HYROX Korea 서울·부산·인천 일정 및 국내 크로스핏 주요 대회 정보.',
            url: `https://www.fittersstudio.com/${locale}/community`,
            publisher: {
              '@type': 'Organization',
              name: 'Fitters Studio',
              url: 'https://www.fittersstudio.com',
            },
          }),
        }}
      />
      {children}
    </>
  )
}
