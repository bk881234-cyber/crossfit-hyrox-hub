import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/seo'

// 이 레이아웃은 /wod, /wod/[id], /wod/log 전부를 감싸지만, 자식(각 WOD
// 상세 페이지, /wod/log)이 자기 자신의 generateMetadata로 이 값을 덮어쓰기
// 때문에 여기서는 실질적으로 /wod 목록 페이지에만 적용된다.
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  return {
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
    alternates: localizedAlternates(locale, '/wod'),
    openGraph: {
      title: 'WOD 라이브러리 — 크로스핏 Named·Open WOD 전체 검색 | FITTERS STUDIO',
      description: 'Girl·Hero·Open WOD 86개 이상 무료 검색. 2017~2025 CrossFit Open 전체 수록.',
      url: 'https://www.fittersstudio.com/wod',
      images: [{ url: '/OG_img.png', width: 1200, height: 630 }],
    },
  }
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
