import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/layout/Header'
import MobileNav from '@/components/layout/MobileNav'
import { MOVEMENTS, type MovementCategory } from '@/lib/movements-data'

export const metadata: Metadata = {
  title: '크로스핏 동작 가이드 — 15가지 핵심 무브먼트 완전 정복',
  description:
    '풀업, 데드리프트, 더블언더 등 크로스핏 필수 동작 15가지의 기술 기준, 일반적 실수, 스케일링 방법을 상세히 설명합니다. 초보자부터 RX 선수까지 모든 레벨을 위한 완전한 무브먼트 가이드.',
  openGraph: {
    title: 'FITTERS STUDIO — 크로스핏 동작 완전 가이드',
    description:
      '상체 파워, 하체 근력, 대사 컨디셔닝 카테고리별 15가지 핵심 무브먼트. 기술 기준·일반 실수·스케일링 방법 포함.',
    url: 'https://www.fittersstudio.com/movements',
    siteName: 'FITTERS STUDIO',
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FITTERS STUDIO — 크로스핏 동작 가이드',
    description: '크로스핏 15가지 핵심 무브먼트 완전 분석',
  },
  alternates: {
    canonical: 'https://www.fittersstudio.com/movements',
  },
}

const CATEGORY_ORDER: MovementCategory[] = ['upper_power', 'lower_strength', 'metabolic']

const DIFFICULTY_LABELS = ['', '입문', '초급', '중급', '상급', '전문가']
const DIFFICULTY_COLORS = [
  '',
  'text-green-400',
  'text-green-400',
  'text-yellow-400',
  'text-rx-orange',
  'text-rx-red',
]

const CATEGORY_ICONS: Record<MovementCategory, string> = {
  upper_power: '💪',
  lower_strength: '🦵',
  metabolic: '🔥',
}

export default async function MovementsIndexPage() {
  const t = await getTranslations('movements')

  const catInfo: Record<MovementCategory, { label: string; desc: string }> = {
    upper_power: { label: t('catUpperPower'), desc: t('catUpperDesc') },
    lower_strength: { label: t('catLowerStrength'), desc: t('catLowerDesc') },
    metabolic: { label: t('catMetabolic'), desc: t('catMetabolicDesc') },
  }

  return (
    <div className="min-h-screen bg-rx-bg">
      <Header />
      <main className="pt-20 pb-24 md:pb-10 px-4 max-w-[992px] mx-auto">
        {/* Hero */}
        <h1 className="section-title mt-4">{t('title')}</h1>
        <p className="section-sub mb-6">
          {t('subtitle')}
        </p>

        {/* Schema — BreadcrumbList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: '홈', item: 'https://www.fittersstudio.com' },
                { '@type': 'ListItem', position: 2, name: '무브먼트 가이드', item: 'https://www.fittersstudio.com/movements' },
              ],
            }),
          }}
        />

        {/* Category sections */}
        {CATEGORY_ORDER.map((cat) => {
          const movements = MOVEMENTS.filter((m) => m.category === cat)
          return (
            <section key={cat} className="mb-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{CATEGORY_ICONS[cat]}</span>
                <h2 className="text-xl font-black text-white">{catInfo[cat].label}</h2>
              </div>
              <p className="text-rx-muted text-sm mb-4">{catInfo[cat].desc}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {movements.map((m) => (
                  <Link
                    key={m.slug}
                    href={`movements/${m.slug}`}
                    className="tool-card group p-6 flex flex-col gap-3 hover:border-rx-red/60 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-white font-bold text-lg leading-tight group-hover:text-rx-red transition-colors">
                        {m.name}
                      </h3>
                      <span className={`text-xs font-bold flex-shrink-0 ${DIFFICULTY_COLORS[m.difficulty]}`}>
                        ★ {DIFFICULTY_LABELS[m.difficulty]}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {m.equipment.map((eq) => (
                        <span
                          key={eq}
                          className="px-2 py-0.5 rounded-md bg-white/5 text-rx-muted text-xs border border-white/10"
                        >
                          {eq}
                        </span>
                      ))}
                    </div>

                    <p className="text-rx-muted text-sm line-clamp-2 leading-relaxed">
                      {m.primaryMuscles.join(' · ')}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                      <span className="text-rx-muted text-xs">
                        {t('technicalStandards', { count: m.technicalStandards.length })} · {t('scalingSteps', { count: m.scaling.length })}
                      </span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="text-rx-muted group-hover:text-rx-red group-hover:translate-x-1 transition-all flex-shrink-0"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}

        {/* CTA to WOD */}
        <div className="mt-4 p-5 rounded-2xl" style={{
          background: 'linear-gradient(135deg, rgba(232,50,26,0.08), rgba(255,45,139,0.08))',
          border: '1px solid rgba(232,50,26,0.25)',
        }}>
          <p className="text-white font-black mb-1">{t('ctaTitle')}</p>
          <p className="text-rx-muted text-sm mb-3">
            {t('ctaDesc')}
          </p>
          <Link
            href="wod"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg btn-primary text-sm font-bold"
          >
            {t('ctaBtn')}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </main>
      <MobileNav />
    </div>
  )
}
