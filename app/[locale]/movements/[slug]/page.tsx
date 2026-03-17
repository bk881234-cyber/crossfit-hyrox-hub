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

type Props = { params: { locale: string; slug: string } }

export function generateStaticParams() {
  const locales = ['ko', 'en']
  return locales.flatMap((locale) => MOVEMENTS.map((m) => ({ locale, slug: m.slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const movement = getMovementBySlug(params.slug)
  if (!movement) return {}

  const title = `${movement.name} 완전 가이드 — 기술 기준·일반 실수·스케일링`
  const description = `${movement.nameEn} 크로스핏 동작 완전 분석. 기술 기준 ${movement.technicalStandards.length}가지, 일반적 실수 ${movement.commonFaults.length}가지, ${movement.scaling.length}단계 스케일링 방법을 포함한 상세 가이드.`
  const url = `https://www.fittersstudio.com/movements/${movement.slug}`

  return {
    title,
    description,
    openGraph: {
      title: `FITTERS STUDIO — ${movement.name}`,
      description,
      url,
      siteName: 'FITTERS STUDIO',
      type: 'article',
      locale: 'ko_KR',
    },
    twitter: {
      card: 'summary_large_image',
      title: `FITTERS STUDIO — ${movement.name}`,
      description,
    },
    alternates: { canonical: url },
  }
}

const DIFFICULTY_LABELS = ['', '입문', '초급', '중급', '상급', '전문가']
const DIFFICULTY_COLORS = [
  '',
  'text-green-400 border-green-400/30 bg-green-400/10',
  'text-green-400 border-green-400/30 bg-green-400/10',
  'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  'text-rx-orange border-rx-orange/30 bg-rx-orange/10',
  'text-rx-red border-rx-red/30 bg-rx-red/10',
]

const SCALING_COLORS = ['bg-green-500/20 text-green-400', 'bg-yellow-500/20 text-yellow-400', 'bg-rx-orange/20 text-rx-orange']

function buildHowToSchema(movement: Movement) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `${movement.name} 올바른 방법`,
    description: `크로스핏 ${movement.nameEn} 동작의 단계별 수행 방법. 기술 기준과 일반적 실수를 포함한 완전한 가이드.`,
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

function buildBreadcrumbSchema(movement: Movement) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: 'https://www.fittersstudio.com' },
      { '@type': 'ListItem', position: 2, name: '무브먼트 가이드', item: 'https://www.fittersstudio.com/movements' },
      { '@type': 'ListItem', position: 3, name: movement.name, item: `https://www.fittersstudio.com/movements/${movement.slug}` },
    ],
  }
}

export default function MovementDetailPage({ params }: Props) {
  const movement = getMovementBySlug(params.slug)
  if (!movement) notFound()

  const categoryMovements = MOVEMENTS.filter(
    (m) => m.category === movement.category && m.slug !== movement.slug,
  )

  return (
    <div className="min-h-screen bg-rx-bg">
      <Header />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildHowToSchema(movement)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema(movement)) }}
      />

      <main className="pt-20 pb-24 md:pb-10 px-4 max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-rx-muted mb-4" aria-label="breadcrumb">
          <Link href="../movements" className="hover:text-white transition-colors">무브먼트 가이드</Link>
          <span>/</span>
          <span className="text-white">{movement.nameEn}</span>
        </nav>

        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${DIFFICULTY_COLORS[movement.difficulty]}`}>
              ★ {DIFFICULTY_LABELS[movement.difficulty]}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border border-rx-border text-rx-muted">
              {CATEGORY_LABELS[movement.category]}
            </span>
          </div>

          <h1 className="text-3xl font-black text-white leading-tight mb-2">
            {movement.name}
          </h1>
          <p className="text-rx-muted text-sm">
            주요 근육: {movement.primaryMuscles.join(' · ')}
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
          <h2 className="text-xl font-black text-white mb-4">동작 개요</h2>
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
          <h2 className="text-xl font-black text-white mb-5">단계별 수행 방법</h2>
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
          <h2 className="text-xl font-black text-white mb-4">기술 기준 (Technical Standards)</h2>
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
          <h2 className="text-xl font-black text-white mb-4">일반적 실수 (Common Faults)</h2>
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
          <h2 className="text-xl font-black text-white mb-5">스케일링 (Scaling)</h2>
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

        {/* Related Movements in same category */}
        {categoryMovements.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-black text-white mb-3">같은 카테고리 동작</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {categoryMovements.map((m) => (
                <Link
                  key={m.slug}
                  href={`../${m.slug}`}
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
          모든 동작 보기
        </Link>
      </main>
      <MobileNav />
    </div>
  )
}
