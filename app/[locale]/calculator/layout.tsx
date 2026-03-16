import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '1RM 계산기 | 크로스핏 최대 중량 계산 — FITTERS STUDIO',
  description:
    '크로스핏·파워리프팅 1RM(최대 중량)을 Epley 공식으로 즉시 계산하세요. 바벨·덤벨·맨몸 탭, KG/LB 전환, 60~100% 퍼센트 테이블 제공. 한국 최초 크로스핏 전용 1RM 계산기.',
  keywords: [
    '1RM 계산기',
    '크로스핏 최대 중량',
    '파워리프팅 1RM',
    'Epley 공식',
    '운동 중량 계산',
    '크로스핏 퍼센트 테이블',
    'one rep max calculator',
  ],
  alternates: {
    canonical: 'https://www.fittersstudio.com/calculator',
    languages: {
      ko: 'https://www.fittersstudio.com/ko/calculator',
      en: 'https://www.fittersstudio.com/en/calculator',
    },
  },
  openGraph: {
    title: '1RM 계산기 — 크로스핏 최대 중량 즉시 계산 | FITTERS STUDIO',
    description: '바벨·덤벨·맨몸 1RM을 Epley 공식으로 계산하고 60~100% 퍼센트 테이블을 확인하세요.',
    url: 'https://www.fittersstudio.com/calculator',
    images: [{ url: '/OG_img.png', width: 1200, height: 630 }],
  },
}

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: '1RM 계산기 — FITTERS STUDIO',
            description: '크로스핏·파워리프팅 1RM 즉시 계산기. Epley 공식 기반 퍼센트 테이블 제공.',
            url: 'https://www.fittersstudio.com/calculator',
            applicationCategory: 'HealthApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
          }),
        }}
      />
      {children}
    </>
  )
}
