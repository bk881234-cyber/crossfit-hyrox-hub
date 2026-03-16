import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WOD 라이브러리 | 크로스핏 Named WOD·Open WOD 검색 — FITTERS STUDIO',
  description:
    'Girl WOD(Fran, Murph 등), Hero WOD, CrossFit Open 2017~2025 전체 WOD를 검색·필터링. 총 86개 이상의 크로스핏 WOD 데이터베이스. 카테고리별·장비별 무료 검색.',
  keywords: [
    'WOD 라이브러리',
    '크로스핏 WOD',
    'CrossFit Open WOD',
    'Girl WOD',
    'Hero WOD',
    'Fran WOD',
    'Murph WOD',
    '크로스핏 운동 목록',
    'wod database',
  ],
  alternates: {
    canonical: 'https://www.fittersstudio.com/wod',
    languages: {
      ko: 'https://www.fittersstudio.com/ko/wod',
      en: 'https://www.fittersstudio.com/en/wod',
    },
  },
  openGraph: {
    title: 'WOD 라이브러리 — 크로스핏 Named·Open WOD 전체 검색 | FITTERS STUDIO',
    description: 'Girl·Hero·Open WOD 86개 이상 무료 검색. 2017~2025 CrossFit Open 전체 수록.',
    url: 'https://www.fittersstudio.com/wod',
    images: [{ url: '/OG_img.png', width: 1200, height: 630 }],
  },
}

export default function WodLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Dataset',
            name: 'CrossFit WOD 라이브러리 — FITTERS STUDIO',
            description: 'Girl WOD, Hero WOD, CrossFit Open 2017~2025 WOD 데이터베이스.',
            url: 'https://www.fittersstudio.com/wod',
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
