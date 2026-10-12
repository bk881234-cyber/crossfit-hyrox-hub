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
// 여기서 로케일별 자기참조 canonical을 지정한다. 다른 페이지들은 각자
// layout.tsx/generateMetadata에서 이 값을 자기 경로 기준으로 덮어쓴다.
export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  return { alternates: localizedAlternates(locale, '') }
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
