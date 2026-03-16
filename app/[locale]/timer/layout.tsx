import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WOD 타이머 | 크로스핏 AMRAP·EMOM·Tabata·For Time — FITTERS STUDIO',
  description:
    'AMRAP·EMOM·Tabata·For Time·Interval 5가지 모드를 지원하는 크로스핏 전용 타이머. 소리 알림, 화면 꺼짐 방지, 10초 후 시작 옵션 포함. 무료 온라인 크로스핏 타이머.',
  keywords: [
    'WOD 타이머',
    '크로스핏 타이머',
    'AMRAP 타이머',
    'EMOM 타이머',
    'Tabata 타이머',
    'For Time',
    '인터벌 타이머',
    'crossfit timer',
    '운동 타이머',
  ],
  alternates: {
    canonical: 'https://www.fittersstudio.com/timer',
    languages: {
      ko: 'https://www.fittersstudio.com/ko/timer',
      en: 'https://www.fittersstudio.com/en/timer',
    },
  },
  openGraph: {
    title: 'WOD 타이머 — AMRAP・EMOM・Tabata・For Time | FITTERS STUDIO',
    description: '5가지 크로스핏 운동 모드 타이머. 소리 알림 + 화면 꺼짐 방지 + 10초 카운트다운.',
    url: 'https://www.fittersstudio.com/timer',
    images: [{ url: '/OG_img.png', width: 1200, height: 630 }],
  },
}

export default function TimerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'WOD 타이머 — FITTERS STUDIO',
            description: 'AMRAP·EMOM·Tabata·For Time·Interval 5가지 모드 크로스핏 타이머.',
            url: 'https://www.fittersstudio.com/timer',
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
