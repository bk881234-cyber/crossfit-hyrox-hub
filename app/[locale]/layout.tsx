import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Footer from '@/components/layout/Footer'
import { localizedAlternates } from '@/lib/seo'

const locales = ['ko', 'en'] as const

interface Props {
  children: React.ReactNode
  params: { locale: string }
}

// 홈페이지(app/[locale]/page.tsx)는 'use client'라 자체 metadata를 못 가져서
// 여기서 로케일별 자기참조 canonical + 제목/설명을 지정한다. 다른 페이지들은
// 각자 layout.tsx/generateMetadata에서 이 값을 자기 경로 기준으로 덮어쓴다.
export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const isEn = locale === 'en'
  return {
    // title.absolute: 루트 레이아웃의 템플릿("%s | 핏터스 스튜디오...")이
    // 겹쳐 붙지 않도록 완전한 최종 제목으로 고정한다.
    title: {
      absolute: isEn
        ? 'FITTERS STUDIO — Free CrossFit & HYROX Toolkit'
        : '핏터스 스튜디오 (FITTERS STUDIO) — 크로스핏·HYROX 올인원 플랫폼',
    },
    description: isEn
      ? 'Free 1RM calculator, WOD timer, workout library, box finder, and competition calendar for CrossFit and HYROX athletes worldwide.'
      : '핏터스·피터스를 위한 1RM 계산기·WOD 타이머·WOD 라이브러리·드랍인 지도·대회 일정을 한곳에 — 크로스핏·HYROX 커뮤니티 플랫폼 핏터스 스튜디오 (FITTERS STUDIO)',
    keywords: isEn
      ? ['crossfit tools', 'hyrox training', 'wod timer', '1rm calculator', 'crossfit workout library', 'free crossfit app', 'crossfit box finder']
      : ['핏터스', '피터스', '핏터스 스튜디오', '피터스 스튜디오', '크로스핏', 'HYROX', '1RM 계산기', 'WOD 타이머', 'WOD 라이브러리', '드랍인 지도', '크로스핏 대회'],
    alternates: localizedAlternates(locale, ''),
  }
}

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  if (!locales.includes(locale as (typeof locales)[number])) notFound()

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
      <Footer />
    </NextIntlClientProvider>
  )
}
