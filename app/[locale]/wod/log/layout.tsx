import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WOD 기록 관리 | 크로스핏 운동 기록 트래커 — FITTERS STUDIO',
  description:
    'Fran, Murph 등 와드별 완료 시간을 기록하고 이전 기록과 비교하세요. 크로스핏 WOD 기록 관리, 재도전 추적까지 한 곳에서.',
  keywords: [
    '와드 기록',
    'WOD 로그',
    '크로스핏 기록 관리',
    '운동 기록 어플',
    'WOD 기록하기',
    '크로스핏 기록 트래커',
  ],
  alternates: {
    canonical: 'https://www.fittersstudio.com/wod/log',
    languages: {
      ko: 'https://www.fittersstudio.com/ko/wod/log',
      en: 'https://www.fittersstudio.com/en/wod/log',
    },
  },
  openGraph: {
    title: 'WOD 기록 관리 — 크로스핏 운동 기록 트래커 | FITTERS STUDIO',
    description: '와드별 완료 시간을 기록하고 이전 기록과 비교하세요.',
    url: 'https://www.fittersstudio.com/wod/log',
    images: [{ url: '/OG_img.png', width: 1200, height: 630 }],
  },
}

export default function WodLogLayout({ children }: { children: React.ReactNode }) {
  return children
}
