import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/seo'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'WOD Log — Track Your CrossFit Workout Times | FITTERS STUDIO'
      : 'WOD 기록 관리 | 크로스핏 운동 기록 트래커 — FITTERS STUDIO',
    description: isEn
      ? 'Log your WOD times for Fran, Murph, and more, and compare against your past attempts — a free CrossFit workout tracker with PR history and retry tracking.'
      : 'Fran, Murph 등 와드별 완료 시간을 기록하고 이전 기록과 비교하세요. 크로스핏 WOD 기록 관리, 재도전 추적, 개인 최고 기록(PR) 확인까지 한 곳에서.',
    keywords: isEn
      ? ['wod log', 'crossfit workout log', 'crossfit tracker app', 'log wod times', 'crossfit progress tracker']
      : [
          '와드 기록',
          'WOD 로그',
          '크로스핏 기록 관리',
          '운동 기록 어플',
          'WOD 기록하기',
          '크로스핏 기록 트래커',
        ],
    alternates: localizedAlternates(locale, '/wod/log'),
    openGraph: {
      title: isEn
        ? 'WOD Log — Track Your Workout Times | FITTERS STUDIO'
        : 'WOD 기록 관리 — 크로스핏 운동 기록 트래커 | FITTERS STUDIO',
      description: isEn
        ? 'Log your WOD times and compare against past attempts.'
        : '와드별 완료 시간을 기록하고 이전 기록과 비교하세요.',
      url: `https://www.fittersstudio.com/${locale}/wod/log`,
      images: [{ url: '/OG_img.png', width: 1200, height: 630 }],
    },
  }
}

export default function WodLogLayout({ children }: { children: React.ReactNode }) {
  return children
}
