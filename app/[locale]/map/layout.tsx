import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/seo'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'CrossFit Box Finder Korea — Drop-in Locations & Fees | FITTERS STUDIO'
      : '드랍인 지도 | 전국 크로스핏 박스 위치·드랍인 비용 — FITTERS STUDIO',
    description: isEn
      ? 'Find CrossFit boxes across Korea — Seoul, Busan, Daegu, Incheon, and more — with drop-in fees, amenities, and directions on an interactive map. Perfect for travelers and expats.'
      : '서울·부산·대구·대전·광주·수원·인천·제주 전국 크로스핏 박스 위치를 카카오 지도로 확인하세요. 드랍인 비용·편의시설·길찾기 정보를 한눈에. 내 주변 크로스핏 박스 찾기, 길찾기, 해외 여행자를 위한 드랍인 정보까지 무료로 제공합니다.',
    keywords: isEn
      ? ['crossfit box korea', 'crossfit drop-in korea', 'crossfit seoul', 'crossfit near me korea', 'drop-in gym korea', 'crossfit gym finder korea', 'hyrox training korea']
      : [
          '크로스핏 드랍인',
          '크로스핏 박스 위치',
          '크로스핏 지도',
          '드랍인 비용',
          '서울 크로스핏',
          '부산 크로스핏',
          '내 주변 크로스핏',
          'crossfit box korea',
          '크로스핏 찾기',
          '하이록스 훈련 박스',
          '하이록스 준비 크로스핏',
        ],
    alternates: localizedAlternates(locale, '/map'),
    openGraph: {
      title: isEn
        ? 'CrossFit Box Finder Korea | FITTERS STUDIO'
        : '드랍인 지도 — 전국 크로스핏 박스 위치 찾기 | FITTERS STUDIO',
      description: isEn
        ? 'An interactive map of CrossFit boxes across Korea with drop-in fees and directions.'
        : '카카오 지도로 전국 크로스핏 박스 위치·드랍인 비용을 한눈에 확인하세요.',
      url: `https://www.fittersstudio.com/${locale}/map`,
      images: [{ url: '/OG_img.png', width: 1200, height: 630 }],
    },
  }
}

export default function MapLayout({ children, params: { locale } }: { children: React.ReactNode; params: { locale: string } }) {
  const isEn = locale === 'en'
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Map',
            name: isEn ? 'Korea CrossFit Box Drop-in Map — FITTERS STUDIO' : '한국 크로스핏 박스 드랍인 지도 — FITTERS STUDIO',
            description: isEn ? 'Map of CrossFit box locations and drop-in info across Korea.' : '전국 크로스핏 박스 위치 및 드랍인 정보 지도.',
            url: `https://www.fittersstudio.com/${locale}/map`,
            creator: {
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
