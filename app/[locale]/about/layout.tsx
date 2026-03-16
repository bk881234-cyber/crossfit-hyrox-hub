import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '크로스핏이란? | 크로스핏 개념·용어·HYROX 소개 — FITTERS STUDIO',
  description:
    '크로스핏(CrossFit)이란 무엇인지, 기본 개념과 철학, WOD·AMRAP·EMOM·RX·Scaled·Tabata·Interval 용어 사전을 쉽게 설명합니다. 크로스핏 처음 시작하는 법과 HYROX 관계도 소개.',
  keywords: [
    '크로스핏이란',
    '크로스핏 용어',
    'WOD 뜻',
    'AMRAP 뜻',
    'EMOM 설명',
    'RX 크로스핏',
    'Tabata 운동',
    '크로스핏 HYROX',
    '크로스핏 초보',
    '크로스핏 시작',
  ],
  alternates: {
    canonical: 'https://www.fittersstudio.com/about',
    languages: {
      ko: 'https://www.fittersstudio.com/ko/about',
      en: 'https://www.fittersstudio.com/en/about',
    },
  },
  openGraph: {
    title: '크로스핏이란? — 개념·용어·HYROX 소개 | FITTERS STUDIO',
    description: 'WOD·AMRAP·EMOM·Tabata 등 크로스핏 용어 사전과 처음 시작하는 법을 쉽게 설명합니다.',
    url: 'https://www.fittersstudio.com/about',
    images: [{ url: '/OG_img.png', width: 1200, height: 630 }],
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: '크로스핏이란? 개념·철학·용어 완벽 가이드',
            description:
              '크로스핏의 기본 개념과 철학, WOD·AMRAP·EMOM·RX·Tabata·Interval 주요 용어 사전을 정리한 입문 가이드.',
            url: 'https://www.fittersstudio.com/about',
            publisher: {
              '@type': 'Organization',
              name: 'Fitters Studio',
              url: 'https://www.fittersstudio.com',
              logo: { '@type': 'ImageObject', url: 'https://www.fittersstudio.com/Fittersstudio_BI.png' },
            },
            image: 'https://www.fittersstudio.com/OG_img.png',
            inLanguage: 'ko',
          }),
        }}
      />
      {children}
    </>
  )
}
