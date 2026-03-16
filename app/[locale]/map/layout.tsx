import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '드랍인 지도 | 전국 크로스핏 박스 위치·드랍인 비용 — FITTERS STUDIO',
  description:
    '서울·부산·대구·대전·광주·수원·인천·제주 전국 크로스핏 박스 위치를 카카오 지도로 확인하세요. 드랍인 비용·편의시설·길찾기 정보를 한눈에. 내 주변 크로스핏 박스 찾기.',
  keywords: [
    '크로스핏 드랍인',
    '크로스핏 박스 위치',
    '크로스핏 지도',
    '드랍인 비용',
    '서울 크로스핏',
    '부산 크로스핏',
    '내 주변 크로스핏',
    'crossfit box korea',
    '크로스핏 찾기',
  ],
  alternates: {
    canonical: 'https://www.fittersstudio.com/map',
    languages: {
      ko: 'https://www.fittersstudio.com/ko/map',
      en: 'https://www.fittersstudio.com/en/map',
    },
  },
  openGraph: {
    title: '드랍인 지도 — 전국 크로스핏 박스 위치 찾기 | FITTERS STUDIO',
    description: '카카오 지도로 전국 크로스핏 박스 위치·드랍인 비용을 한눈에 확인하세요.',
    url: 'https://www.fittersstudio.com/map',
    images: [{ url: '/OG_img.png', width: 1200, height: 630 }],
  },
}

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Map',
            name: '한국 크로스핏 박스 드랍인 지도 — FITTERS STUDIO',
            description: '전국 크로스핏 박스 위치 및 드랍인 정보 지도.',
            url: 'https://www.fittersstudio.com/map',
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
