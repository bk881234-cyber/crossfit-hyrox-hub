import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import MobileNav from '@/components/layout/MobileNav'
import { WODS, type WOD } from '@/lib/wod-data'

export function generateStaticParams() {
  const locales = ['ko', 'en']
  return locales.flatMap((locale) => WODS.map((wod) => ({ locale, id: wod.id })))
}

const TYPE_COLORS: Record<WOD['type'], string> = {
  girl: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  hero: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  open: 'bg-rx-orange/20 text-rx-orange border-rx-orange/30',
  benchmark: 'bg-green-500/20 text-green-400 border-green-500/30',
}

const TYPE_LABELS: Record<WOD['type'], string> = {
  girl: 'Girl WOD',
  hero: 'Hero WOD',
  open: 'CrossFit Open',
  benchmark: '벤치마크',
}

const EQUIPMENT_LABELS: Record<string, string> = {
  barbell: '바벨',
  dumbbell: '덤벨',
  bodyweight: '맨몸',
  rope: '줄넘기',
  kettlebell: '케틀벨',
  box: '박스',
}

function EquipmentIcon({ type }: { type: string }) {
  const icons: Record<string, JSX.Element> = {
    barbell: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" y1="12" x2="18" y2="12" /><rect x="1" y="10" width="4" height="4" rx="1" /><rect x="19" y="10" width="4" height="4" rx="1" />
      </svg>
    ),
    dumbbell: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="10" width="5" height="4" rx="1" /><rect x="17" y="10" width="5" height="4" rx="1" /><line x1="7" y1="12" x2="17" y2="12" />
      </svg>
    ),
    bodyweight: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" /><path d="M12 7v6l-3 3m3-3l3 3" />
      </svg>
    ),
    rope: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C12 2 8 6 8 12s4 10 4 10M12 2c0 0 4 4 4 10s-4 10-4 10" />
      </svg>
    ),
    kettlebell: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="14" r="7" /><path d="M9 7a3 3 0 0 1 6 0" />
      </svg>
    ),
    box: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-4 0v2" />
      </svg>
    ),
  }
  return icons[type] || null
}

interface Props {
  params: { locale: string; id: string }
}

export default function WODDetailPage({ params }: Props) {
  const wod = WODS.find((w) => w.id === params.id)
  if (!wod) notFound()

  const wodIndex = WODS.indexOf(wod)

  return (
    <div className="min-h-screen bg-rx-bg">
      <Header />
      <main className="pt-20 pb-24 md:pb-10 px-4 max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mt-4 mb-6 text-xs text-rx-muted">
          <Link href="/" className="hover:text-white transition-colors">홈</Link>
          <span>/</span>
          <Link href="/wod" className="hover:text-white transition-colors">WOD Library</Link>
          <span>/</span>
          <span className="text-white">{wod.name}</span>
        </nav>

        {/* Back + Log buttons */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/wod"
            className="inline-flex items-center gap-2 text-rx-muted hover:text-white text-sm font-medium transition-colors group"
          >
            <svg className="group-hover:-translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            WOD 목록으로
          </Link>
          <Link
            href={`/wod/log?wod=${wod.id}`}
            className="btn-primary text-sm px-4 py-2 rounded-xl"
          >
            기록하기
          </Link>
        </div>

        {/* Header Card */}
        <div className="card mb-6">
          <div className="flex items-start justify-between mb-3">
            <span className={`badge border ${TYPE_COLORS[wod.type]}`}>
              {TYPE_LABELS[wod.type]}
            </span>
            {wod.rounds && (
              <span className="badge bg-rx-surface border border-rx-border text-rx-muted">
                {wod.rounds} Rounds
              </span>
            )}
          </div>
          <h1 className="text-5xl font-black text-white mb-3">{wod.name}</h1>

          {/* Equipment */}
          <div className="flex flex-wrap gap-2 mb-4">
            {wod.equipment.map((eq) => (
              <span key={eq} className="text-xs bg-rx-surface px-3 py-1 rounded-full text-rx-muted border border-rx-border flex items-center gap-1.5">
                <EquipmentIcon type={eq} />
                {EQUIPMENT_LABELS[eq]}
              </span>
            ))}
          </div>

          {/* Target Time */}
          <div className="flex items-center gap-2 p-3 bg-rx-surface border border-rx-border rounded-xl">
            <svg className="text-white flex-shrink-0" style={{ color: '#E8321A' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <div>
              <p className="text-xs font-bold gradient-text">목표 시간</p>
              <p className="text-white text-sm font-bold">{wod.timeTarget}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="card mb-6">
          <h2 className="font-black text-white text-xl mb-4">WOD 설명</h2>
          <div className="text-white leading-relaxed whitespace-pre-line text-sm">
            {wod.description}
          </div>
        </div>

        {/* Movements */}
        <div className="card mb-6">
          <h2 className="font-black text-white text-xl mb-4">주요 동작</h2>
          <div className="space-y-2">
            {wod.movements.map((movement, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 bg-rx-surface rounded-xl">
                <span
                  className="w-6 h-6 rounded-full text-white text-xs font-black flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #E8321A, #FF2D8B)' }}
                >
                  {i + 1}
                </span>
                <span className="text-white font-medium">{movement}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scaling */}
        <div className="card mb-6 border-green-500/30">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <h2 className="font-black text-white text-xl">스케일링 옵션</h2>
          </div>
          <div className="text-rx-muted leading-relaxed whitespace-pre-line text-sm bg-rx-surface rounded-xl p-4">
            {wod.scaling}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {wod.tags.map((tag) => (
            <span key={tag} className="px-3 py-1.5 rounded-full text-xs font-bold bg-rx-surface border border-rx-border text-rx-muted">
              #{tag}
            </span>
          ))}
        </div>

        {/* CTA Row */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link href="/timer" className="btn-primary text-sm py-3.5 rounded-xl text-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="inline mr-1.5 -mt-0.5">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            타이머로 이동
          </Link>
          <Link href={`/wod/log?wod=${wod.id}`} className="btn-secondary text-sm py-3.5 rounded-xl text-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="inline mr-1.5 -mt-0.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            기록하기
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {wodIndex > 0 && (
            <Link
              href={`/wod/${WODS[wodIndex - 1].id}`}
              className="flex-1 card text-center hover:border-white/20 transition-colors"
            >
              <p className="text-rx-muted text-xs mb-1">이전 WOD</p>
              <p className="text-white font-bold">{WODS[wodIndex - 1].name}</p>
            </Link>
          )}
          {wodIndex < WODS.length - 1 && (
            <Link
              href={`/wod/${WODS[wodIndex + 1].id}`}
              className="flex-1 card text-center hover:border-white/20 transition-colors"
            >
              <p className="text-rx-muted text-xs mb-1">다음 WOD</p>
              <p className="text-white font-bold">{WODS[wodIndex + 1].name}</p>
            </Link>
          )}
        </div>
      </main>
      <MobileNav />
    </div>
  )
}
