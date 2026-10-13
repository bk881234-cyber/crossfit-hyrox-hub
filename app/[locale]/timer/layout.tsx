import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/seo'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'WOD Timer — Free CrossFit & HYROX Interval Timer | FITTERS STUDIO'
      : 'WOD 타이머 | 크로스핏 AMRAP·EMOM·Tabata·For Time — FITTERS STUDIO',
    description: isEn
      ? 'Free online WOD timer with AMRAP, EMOM, Tabata, For Time, and Interval modes. Sound alerts, screen-wake lock, and a 10-second countdown — built for CrossFit and HYROX training.'
      : 'AMRAP·EMOM·Tabata·For Time·Interval 5가지 모드를 지원하는 크로스핏·하이록스 전용 타이머. 소리 알림, 화면 꺼짐 방지, 10초 후 시작 옵션 포함. 무료 온라인 크로스핏 타이머.',
    keywords: isEn
      ? ['wod timer', 'crossfit timer', 'amrap timer', 'emom timer', 'tabata timer', 'for time timer', 'hyrox timer', 'interval timer', 'free crossfit timer app']
      : [
          'WOD 타이머',
          '크로스핏 타이머',
          'AMRAP 타이머',
          'EMOM 타이머',
          'Tabata 타이머',
          'For Time',
          '인터벌 타이머',
          'crossfit timer',
          '운동 타이머',
          '하이록스 타이머',
          '하이록스 인터벌 타이머',
          '하이록스 훈련 타이머',
        ],
    alternates: localizedAlternates(locale, '/timer'),
    openGraph: {
      title: isEn
        ? 'WOD Timer — AMRAP, EMOM, Tabata, For Time | FITTERS STUDIO'
        : 'WOD 타이머 — AMRAP・EMOM・Tabata・For Time | FITTERS STUDIO',
      description: isEn
        ? 'Five CrossFit workout timer modes with sound alerts, screen-wake lock, and a 10-second countdown.'
        : '5가지 크로스핏 운동 모드 타이머. 소리 알림 + 화면 꺼짐 방지 + 10초 카운트다운.',
      url: `https://www.fittersstudio.com/${locale}/timer`,
      images: [{ url: '/OG_img.png', width: 1200, height: 630 }],
    },
  }
}

export default function TimerLayout({ children, params: { locale } }: { children: React.ReactNode; params: { locale: string } }) {
  const isEn = locale === 'en'
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: isEn ? 'WOD Timer — FITTERS STUDIO' : 'WOD 타이머 — FITTERS STUDIO',
            description: isEn ? 'CrossFit timer with 5 modes: AMRAP, EMOM, Tabata, For Time and Interval.' : 'AMRAP·EMOM·Tabata·For Time·Interval 5가지 모드 크로스핏 타이머.',
            url: `https://www.fittersstudio.com/${locale}/timer`,
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
