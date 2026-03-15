import type { Metadata, Viewport } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import '../globals.css'
import Footer from '@/components/layout/Footer'

const notoSansKR = Noto_Sans_KR({
  weight: ['400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-noto-sans',
  display: 'swap',
})

const locales = ['ko', 'en'] as const

export const metadata: Metadata = {
  metadataBase: new URL('https://www.fittersstudio.com'),
  title: 'FITTERS STUDIO - 크로스피터를 위한 모든 것',
  description: '1RM 계산기, WOD 타이머, WOD Library, 드랍인 지도 - 크로스피터에게 꼭 필요한 기능만',
  openGraph: {
    title: 'Fitters Studio',
    description: '크로스피터를 위한 모든 도구를 한곳에',
    url: 'https://www.fittersstudio.com',
    images: [{ url: '/OG_img.png', width: 1200, height: 630 }],
    siteName: 'Fitters Studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fitters Studio',
    description: '크로스피터를 위한 모든 도구를 한곳에',
    images: ['/OG_img.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0D0D0D',
}

interface Props {
  children: React.ReactNode
  params: { locale: string }
}

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  if (!locales.includes(locale as (typeof locales)[number])) notFound()

  const messages = await getMessages()

  return (
    <html lang={locale} className={notoSansKR.variable} suppressHydrationWarning>
      <body className="bg-rx-bg min-h-screen" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
