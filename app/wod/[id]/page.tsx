import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import MobileNav from '@/components/layout/MobileNav'
import { WODS, type WOD } from '@/lib/wod-data'

export function generateStaticParams() {
  return WODS.map((wod) => ({ id: wod.id }))
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

const EQUIPMENT_ICONS: Record<string, string> = {
  barbell: '🏋️',
  dumbbell: '💪',
  bodyweight: '🤸',
  rope: '🪢',
  kettlebell: '🔔',
  box: '📦',
}

const EQUIPMENT_LABELS: Record<string, string> = {
  barbell: '바벨',
  dumbbell: '덤벨',
  bodyweight: '맨몸',
  rope: '줄넘기',
  kettlebell: '케틀벨',
  box: '박스',
}

interface Props {
  params: { id: string }
}

export default function WODDetailPage({ params }: Props) {
  const wod = WODS.find((w) => w.id === params.id)
  if (!wod) notFound()

  return (
    <div className="min-h-screen bg-rx-bg">
      <Header />
      <main className="pt-14 pb-24 md:pb-10 px-4 max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mt-4 mb-6 text-xs text-rx-muted">
          <Link href="/" className="hover:text-white transition-colors">홈</Link>
          <span>/</span>
          <Link href="/wod" className="hover:text-white transition-colors">WOD 아카이브</Link>
          <span>/</span>
          <span className="text-white">{wod.name}</span>
        </nav>

        {/* Back Button */}
        <Link
          href="/wod"
          className="inline-flex items-center gap-2 text-rx-muted hover:text-white text-sm font-medium mb-6 transition-colors group"
        >
          <svg className="group-hover:-translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          WOD 목록으로
        </Link>

        {/* Header Card */}
        <div className="card mb-6">
          <div className="flex items-start justify-between mb-3">
            <span className={`badge border ${TYPE_COLORS[wod.type]}`}>
              {TYPE_LABELS[wod.type]}
            </span>
            {wod.rounds && (
              <span className="badge bg-rx-surface border border-rx-border text-rx-muted">
                {wod.rounds}라운드
              </span>
            )}
          </div>
          <h1 className="text-4xl font-black text-white mb-2">{wod.name}</h1>

          {/* Equipment */}
          <div className="flex flex-wrap gap-2 mb-4">
            {wod.equipment.map((eq) => (
              <span key={eq} className="text-xs bg-rx-surface px-3 py-1 rounded-full text-rx-muted border border-rx-border">
                {EQUIPMENT_ICONS[eq]} {EQUIPMENT_LABELS[eq]}
              </span>
            ))}
          </div>

          {/* Target Time */}
          <div className="flex items-center gap-2 p-3 bg-rx-orange/10 border border-rx-orange/30 rounded-xl">
            <svg className="text-rx-orange flex-shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <div>
              <p className="text-rx-orange text-xs font-bold">목표 시간</p>
              <p className="text-white text-sm font-bold">{wod.timeTarget}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="card mb-6">
          <h2 className="font-black text-white text-lg mb-4">WOD 설명</h2>
          <div className="text-white leading-relaxed whitespace-pre-line text-sm">
            {wod.description}
          </div>
        </div>

        {/* Movements */}
        <div className="card mb-6">
          <h2 className="font-black text-white text-lg mb-4">주요 동작</h2>
          <div className="space-y-2">
            {wod.movements.map((movement, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 bg-rx-surface rounded-xl">
                <span className="w-6 h-6 rounded-full bg-rx-red/20 border border-rx-red/40 text-rx-red text-xs font-black flex items-center justify-center flex-shrink-0">
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
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <h2 className="font-black text-white text-lg">스케일링 옵션</h2>
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

        {/* Timer CTA */}
        <div className="bg-gradient-to-br from-rx-red/20 to-rx-orange/10 border border-rx-red/30 rounded-2xl p-5 text-center mb-6">
          <h3 className="font-black text-white mb-1">이 WOD 타이머로 시작하기</h3>
          <p className="text-rx-muted text-sm mb-4">WOD 타이머로 기록을 측정해보세요</p>
          <Link href="/timer" className="btn-primary inline-block">
            타이머로 이동
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {WODS.indexOf(wod) > 0 && (
            <Link
              href={`/wod/${WODS[WODS.indexOf(wod) - 1].id}`}
              className="flex-1 card text-center hover:border-rx-red/40 transition-colors"
            >
              <p className="text-rx-muted text-xs mb-1">이전 WOD</p>
              <p className="text-white font-bold">{WODS[WODS.indexOf(wod) - 1].name}</p>
            </Link>
          )}
          {WODS.indexOf(wod) < WODS.length - 1 && (
            <Link
              href={`/wod/${WODS[WODS.indexOf(wod) + 1].id}`}
              className="flex-1 card text-center hover:border-rx-red/40 transition-colors"
            >
              <p className="text-rx-muted text-xs mb-1">다음 WOD</p>
              <p className="text-white font-bold">{WODS[WODS.indexOf(wod) + 1].name}</p>
            </Link>
          )}
        </div>
      </main>
      <MobileNav />
    </div>
  )
}
