import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/seo'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'What Is CrossFit? Concepts, Terms & HYROX Explained | FITTERS STUDIO'
      : '크로스핏이란? | 크로스핏 개념·용어·HYROX 소개 — FITTERS STUDIO',
    description: isEn
      ? "A beginner guide to CrossFit: core philosophy, WOD/AMRAP/EMOM/RX/Scaled/Tabata/Interval terminology explained simply, how to get started, and how it relates to HYROX."
      : '크로스핏(CrossFit)이란 무엇인지, 기본 개념과 철학, WOD·AMRAP·EMOM·RX·Scaled·Tabata·Interval 용어 사전을 쉽게 설명합니다. 크로스핏 처음 시작하는 법과 HYROX 관계도 소개.',
    keywords: isEn
      ? ['what is crossfit', 'crossfit terms', 'wod meaning', 'amrap meaning', 'emom explained', 'crossfit for beginners', 'crossfit vs hyrox', 'rx scaled crossfit']
      : [
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
          '하이록스란',
          '하이록스 크로스핏 차이',
          '하이록스 종목',
        ],
    alternates: localizedAlternates(locale, '/about'),
    openGraph: {
      title: isEn
        ? 'What Is CrossFit? Concepts, Terms & HYROX | FITTERS STUDIO'
        : '크로스핏이란? — 개념·용어·HYROX 소개 | FITTERS STUDIO',
      description: isEn
        ? 'A simple explainer of CrossFit terminology (WOD, AMRAP, EMOM, Tabata) and how to get started.'
        : 'WOD·AMRAP·EMOM·Tabata 등 크로스핏 용어 사전과 처음 시작하는 법을 쉽게 설명합니다.',
      url: `https://www.fittersstudio.com/${locale}/about`,
      images: [{ url: '/OG_img.png', width: 1200, height: 630 }],
    },
  }
}

export default function AboutLayout({ children, params: { locale } }: { children: React.ReactNode; params: { locale: string } }) {
  const isEn = locale === 'en'
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: isEn ? 'What is CrossFit? Concepts, Philosophy & Terminology Guide' : '크로스핏이란? 개념·철학·용어 완벽 가이드',
            description:
              isEn ? 'A beginner guide to CrossFit concepts and philosophy, with a glossary of WOD, AMRAP, EMOM, RX, Tabata and Interval terms.' : '크로스핏의 기본 개념과 철학, WOD·AMRAP·EMOM·RX·Tabata·Interval 주요 용어 사전을 정리한 입문 가이드.',
            url: `https://www.fittersstudio.com/${locale}/about`,
            publisher: {
              '@type': 'Organization',
              name: 'Fitters Studio',
              url: 'https://www.fittersstudio.com',
              logo: { '@type': 'ImageObject', url: 'https://www.fittersstudio.com/Fittersstudio_BI.png' },
            },
            image: 'https://www.fittersstudio.com/OG_img.png',
            inLanguage: locale,
          }),
        }}
      />
      {children}
    </>
  )
}
