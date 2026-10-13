import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import MobileNav from '@/components/layout/MobileNav'
import {
  MOVEMENTS,
  CATEGORY_LABELS,
  getMovementBySlug,
  type Movement,
} from '@/lib/movements-data'
import { localizeMovement, CATEGORY_LABELS_EN, DIFFICULTY_LABELS_EN } from '@/lib/movements-data-en'
import { WODS } from '@/lib/wod-data'
import { localizeWod } from '@/lib/wod-data-en'
import { getMovementSlug } from '@/lib/movement-links'
import { localizedAlternates } from '@/lib/seo'

type Props = { params: { locale: string; slug: string } }

export function generateStaticParams() {
  const locales = ['ko', 'en']
  return locales.flatMap((locale) => MOVEMENTS.map((m) => ({ locale, slug: m.slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const movement = getMovementBySlug(params.slug)
  if (!movement) return {}

  const isEn = params.locale === 'en'
  const title = isEn
    ? `${movement.nameEn} Guide — Technique, Common Faults & Scaling | FITTERS STUDIO`
    : `${movement.name} 완전 가이드 — 기술 기준·일반 실수·스케일링`
  const description = isEn
    ? `A complete breakdown of the CrossFit ${movement.nameEn}: ${movement.technicalStandards.length} technical standards, ${movement.commonFaults.length} common faults, and ${movement.scaling.length} scaling levels.`
    : `${movement.nameEn} 크로스핏 동작 완전 분석. 기술 기준 ${movement.technicalStandards.length}가지, 일반적 실수 ${movement.commonFaults.length}가지, ${movement.scaling.length}단계 스케일링 방법을 포함한 상세 가이드.`
  const displayName = isEn ? movement.nameEn : movement.name
  const url = `https://www.fittersstudio.com/${params.locale}/movements/${movement.slug}`

  return {
    title,
    description,
    keywords: isEn
      ? [movement.nameEn, `${movement.nameEn} technique`, `${movement.nameEn} form`, `how to do ${movement.nameEn}`, 'crossfit movement guide']
      : undefined,
    openGraph: {
      title: `FITTERS STUDIO — ${displayName}`,
      description,
      url,
      siteName: 'FITTERS STUDIO',
      type: 'article',
      locale: isEn ? 'en_US' : 'ko_KR',
    },
    twitter: {
      card: 'summary_large_image',
      title: `FITTERS STUDIO — ${displayName}`,
      description,
    },
    alternates: localizedAlternates(params.locale, `/movements/${movement.slug}`),
  }
}

const DIFFICULTY_LABELS = ['', '입문', '초급', '중급', '상급', '전문가']
const UI = {
  ko: {
    home: '홈', guide: '무브먼트 가이드', muscles: '주요 근육', overview: '동작 개요', steps: '단계별 수행 방법',
    standards: '기술 기준 (Technical Standards)', faults: '일반적 실수 (Common Faults)', scaling: '스케일링 (Scaling)',
    relatedWods: '이 동작이 나오는 WOD', sameCat: '같은 카테고리 동작', all: '모든 동작 보기',
    howTo: (n: string) => `${n} 올바른 방법`,
    howToDesc: (n: string) => `크로스핏 ${n} 동작의 단계별 수행 방법. 기술 기준과 일반적 실수를 포함한 완전한 가이드.`,
  },
  en: {
    home: 'Home', guide: 'Movement Guide', muscles: 'Primary muscles', overview: 'Overview', steps: 'Step-by-step',
    standards: 'Technical Standards', faults: 'Common Faults', scaling: 'Scaling',
    relatedWods: 'WODs featuring this movement', sameCat: 'More in this category', all: 'View all movements',
    howTo: (n: string) => `How to do the ${n} correctly`,
    howToDesc: (n: string) => `Step-by-step instructions for the CrossFit ${n}, including technical standards and common faults.`,
  },
}
const DIFFICULTY_COLORS = [
  '',
  'text-green-400 border-green-400/30 bg-green-400/10',
  'text-green-400 border-green-400/30 bg-green-400/10',
  'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  'text-rx-orange border-rx-orange/30 bg-rx-orange/10',
  'text-rx-red border-rx-red/30 bg-rx-red/10',
]

const SCALING_COLORS = ['bg-green-500/20 text-green-400', 'bg-yellow-500/20 text-yellow-400', 'bg-rx-orange/20 text-rx-orange']

function buildHowToSchema(movement: Movement, locale: string) {
  const ui = locale === 'en' ? UI.en : UI.ko
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: ui.howTo(movement.name),
    description: ui.howToDesc(movement.nameEn),
    tool: movement.equipment.map((eq) => ({ '@type': 'HowToTool', name: eq })),
    step: movement.howToSteps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
    totalTime: 'PT10M',
  }
}

function buildBreadcrumbSchema(movement: Movement, locale: string) {
  const ui = locale === 'en' ? UI.en : UI.ko
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: ui.home, item: `https://www.fittersstudio.com/${locale}` },
      { '@type': 'ListItem', position: 2, name: ui.guide, item: `https://www.fittersstudio.com/${locale}/movements` },
      { '@type': 'ListItem', position: 3, name: movement.name, item: `https://www.fittersstudio.com/${locale}/movements/${movement.slug}` },
    ],
  }
}

export default function MovementDetailPage({ params }: Props) {
  const base = getMovementBySlug(params.slug)
  if (!base) notFound()
  const locale = params.locale
  const isEn = locale === 'en'
  const ui = isEn ? UI.en : UI.ko
  const movement = localizeMovement(base, locale)
  const diffLabels = isEn ? DIFFICULTY_LABELS_EN : DIFFICULTY_LABELS
  const catLabels = isEn ? CATEGORY_LABELS_EN : CATEGORY_LABELS

  const categoryMovements = MOVEMENTS.filter(
    (m) => m.category === movement.category && m.slug !== movement.slug,
  ).map((m) => localizeMovement(m, locale))

  const relatedWods = WODS.filter((w) =>
    w.movements.some((m) => getMovementSlug(m) === movement.slug),
  ).map((w) => localizeWod(w, locale))

  return (
    <div className="min-h-screen bg-rx-bg">
      <Header />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildHowToSchema(movement, locale)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema(movement, locale)) }}
      />

      <main className="pt-20 pb-24 md:pb-10 px-4 max-w-[992px] mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-rx-muted mb-4" aria-label="breadcrumb">
          <Link href="../movements" className="hover:text-white transition-colors">{ui.guide}</Link>
          <span>/</span>
          <span className="text-white">{movement.nameEn}</span>
        </nav>

        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${DIFFICULTY_COLORS[movement.difficulty]}`}>
              ★ {diffLabels[movement.difficulty]}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border border-rx-border text-rx-muted">
              {catLabels[movement.category]}
            </span>
          </div>

          <h1 className="text-3xl font-black text-white leading-tight mb-2">
            {movement.name}
          </h1>
          <p className="text-rx-muted text-sm">
            {ui.muscles}: {movement.primaryMuscles.join(' · ')}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {movement.equipment.map((eq) => (
              <span
                key={eq}
                className="px-2 py-0.5 rounded-md bg-rx-surface text-rx-muted text-xs border border-rx-border"
              >
                {eq}
              </span>
            ))}
          </div>
        </div>

        {/* Overview */}
        <section className="mb-10">
          <h2 className="text-xl font-black text-white mb-4">{ui.overview}</h2>
          <div className="space-y-4">
            {movement.overview.split('\n\n').map((para, i) => (
              <p key={i} className="text-white/70 text-base leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        </section>

        {/* How To Steps */}
        <section className="mb-10">
          <h2 className="text-xl font-black text-white mb-5">{ui.steps}</h2>
          <div className="space-y-6">
            {movement.howToSteps.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rx-red/10 border border-rx-red/30 flex items-center justify-center text-sm font-black text-rx-red shadow-[0_0_10px_rgba(232,50,26,0.2)]">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-white font-bold text-base mb-1">{step.name}</h3>
                  <p className="text-white/60 text-base leading-relaxed">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Standards */}
        <section className="mb-10">
          <h2 className="text-xl font-black text-white mb-4">{ui.standards}</h2>
          <div className="space-y-3">
            {movement.technicalStandards.map((std, i) => (
              <div key={i} className="flex gap-3 items-start p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <svg
                  className="flex-shrink-0 mt-1 text-rx-red"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <p className="text-white/70 text-base leading-relaxed">{std}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Common Faults */}
        <section className="mb-10">
          <h2 className="text-xl font-black text-white mb-4">{ui.faults}</h2>
          <div className="space-y-4">
            {movement.commonFaults.map((fault, i) => {
              const [title, ...rest] = fault.split(':')
              return (
                <div key={i} className="flex gap-3 items-start">
                  <svg
                    className="flex-shrink-0 mt-1 text-rx-pink"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="text-base leading-relaxed">
                    <span className="text-white font-bold">{title}</span>
                    {rest.length > 0 && (
                      <span className="text-white/60">:{rest.join(':')}</span>
                    )}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Scaling */}
        <section className="mb-12">
          <h2 className="text-xl font-black text-white mb-5">{ui.scaling}</h2>
          <div className="grid gap-4">
            {movement.scaling.map((s, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-black tracking-tight ${SCALING_COLORS[i]}`}>
                    {s.level}
                  </span>
                </div>
                <p className="text-white/60 text-base leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* WODs that use this movement */}
        {relatedWods.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-black text-white mb-3">{ui.relatedWods}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {relatedWods.map((w) => (
                <Link
                  key={w.id}
                  href={`../wod/${w.id}`}
                  className="tool-card group flex items-center justify-between hover:border-rx-red/60 transition-colors py-3 px-5"
                >
                  <div>
                    <p className="text-white font-bold text-sm group-hover:text-rx-red transition-colors">
                      {w.name}
                    </p>
                    <p className="text-rx-muted text-xs mt-0.5">{w.timeTarget}</p>
                  </div>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-rx-muted group-hover:text-rx-red group-hover:translate-x-1 transition-all flex-shrink-0"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Movements in same category */}
        {categoryMovements.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-black text-white mb-3">{ui.sameCat}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {categoryMovements.map((m) => (
                <Link
                  key={m.slug}
                  href={m.slug}
                  className="tool-card group flex items-center justify-between hover:border-rx-red/60 transition-colors py-3 px-5"
                >
                  <div>
                    <p className="text-white font-bold text-sm group-hover:text-rx-red transition-colors">
                      {m.name}
                    </p>
                    <p className="text-rx-muted text-xs mt-0.5">{m.primaryMuscles.slice(0, 2).join(' · ')}</p>
                  </div>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-rx-muted group-hover:text-rx-red group-hover:translate-x-1 transition-all flex-shrink-0"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back link */}
        <Link
          href="../movements"
          className="inline-flex items-center gap-2 text-rx-muted hover:text-white transition-colors text-sm"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          {ui.all}
        </Link>
      </main>
      <MobileNav />
    </div>
  )
}
