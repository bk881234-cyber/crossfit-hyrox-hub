import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/seo'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isEn = locale === 'en'
  return {
    title: isEn
      ? '1RM Calculator — Free CrossFit Max Lift Calculator | FITTERS STUDIO'
      : '1RM 계산기 | 크로스핏 최대 중량 계산 — FITTERS STUDIO',
    description: isEn
      ? 'Calculate your one-rep max instantly with the Epley formula. Barbell, dumbbell, and bodyweight modes, kg/lb conversion, and a 60–100% percentage table — free, no sign-up.'
      : '크로스핏·파워리프팅 1RM(최대 중량)을 Epley 공식으로 즉시 계산하세요. 바벨·덤벨·맨몸 탭, KG/LB 전환, 60~100% 퍼센트 테이블 제공. 한국 최초 크로스핏 전용 1RM 계산기.',
    keywords: isEn
      ? ['1rm calculator', 'one rep max calculator', 'crossfit max calculator', 'epley formula calculator', 'kg to lbs calculator', 'barbell weight calculator', 'powerlifting 1rm calculator', 'free 1rm calculator']
      : [
          '1RM 계산기',
          '크로스핏 최대 중량',
          '파워리프팅 1RM',
          'Epley 공식',
          '운동 중량 계산',
          '크로스핏 퍼센트 테이블',
          'one rep max calculator',
          'kg lb 변환',
          '킬로그램 파운드 변환',
          '바벨 무게 계산기',
          '1rm kg to lb',
        ],
    alternates: localizedAlternates(locale, '/calculator'),
    openGraph: {
      title: isEn
        ? '1RM Calculator — Instant CrossFit Max Lift | FITTERS STUDIO'
        : '1RM 계산기 — 크로스핏 최대 중량 즉시 계산 | FITTERS STUDIO',
      description: isEn
        ? 'Calculate barbell, dumbbell, and bodyweight 1RM with the Epley formula and see your 60–100% percentage table.'
        : '바벨·덤벨·맨몸 1RM을 Epley 공식으로 계산하고 60~100% 퍼센트 테이블을 확인하세요.',
      url: 'https://www.fittersstudio.com/calculator',
      images: [{ url: '/OG_img.png', width: 1200, height: 630 }],
    },
  }
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
