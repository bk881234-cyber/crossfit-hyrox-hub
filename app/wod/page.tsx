'use client'
import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import MobileNav from '@/components/layout/MobileNav'
import { WODS, WOD_CATEGORIES, EQUIPMENT_FILTERS, type WOD } from '@/lib/wod-data'

const TYPE_COLORS: Record<WOD['type'], string> = {
  girl: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  hero: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  open: 'bg-rx-orange/20 text-rx-orange border-rx-orange/30',
  benchmark: 'bg-green-500/20 text-green-400 border-green-500/30',
}

const TYPE_LABELS: Record<WOD['type'], string> = {
  girl: 'Girl WOD',
  hero: 'Hero WOD',
  open: 'Open',
  benchmark: '벤치마크',
}

const EQUIPMENT_ICONS: Record<string, JSX.Element> = {
  barbell: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="12" x2="18" y2="12" /><rect x="1" y="10" width="4" height="4" rx="1" /><rect x="19" y="10" width="4" height="4" rx="1" />
    </svg>
  ),
  dumbbell: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5h11M6.5 17.5h11M3 10h18M3 14h18" />
    </svg>
  ),
  bodyweight: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2" /><path d="M12 7v6l-3 3m3-3l3 3" />
    </svg>
  ),
  rope: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C12 2 8 6 8 12s4 10 4 10" /><path d="M12 2c0 0 4 4 4 10s-4 10-4 10" />
    </svg>
  ),
  kettlebell: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="13" r="7" /><path d="M9 6a3 3 0 0 1 6 0" />
    </svg>
  ),
  box: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-4 0v2" />
    </svg>
  ),
}

const EQUIPMENT_LABELS: Record<string, string> = {
  barbell: '바벨',
  dumbbell: '덤벨',
  bodyweight: '맨몸',
  rope: '줄넘기',
  kettlebell: '케틀벨',
  box: '박스',
}

export default function WODPage() {
  const [category, setCategory] = useState('all')
  const [equipment, setEquipment] = useState('all')
  const [search, setSearch] = useState('')
  const [showAll, setShowAll] = useState(false)

  const filtered = useMemo(() => {
    return WODS.filter((wod) => {
      const matchCat = category === 'all' || wod.type === category
      const matchEq = equipment === 'all' || wod.equipment.includes(equipment as WOD['equipment'][number])
      const matchSearch = search === '' || wod.name.toLowerCase().includes(search.toLowerCase()) ||
        wod.movements.some(m => m.toLowerCase().includes(search.toLowerCase())) ||
        wod.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
      return matchCat && matchEq && matchSearch
    })
  }, [category, equipment, search])

  return (
    <div className="min-h-screen bg-rx-bg">
      <Header />
      <main className="pt-20 pb-24 md:pb-10 px-4 max-w-5xl mx-auto">
        {/* AdSense top */}
        <div className="mt-4 mb-6 w-full h-16 bg-rx-surface border border-rx-border rounded-lg flex items-center justify-center">
          <span className="text-rx-muted text-xs">광고 영역 (AdSense)</span>
        </div>

        <div className="mb-6">
          <h1 className="text-4xl font-black text-white mb-1">WOD 라이브러리</h1>
          <p className="text-rx-muted text-sm">{WODS.length}개의 벤치마크 WOD · Girl / Hero / Open</p>
        </div>

        {/* Sticky Search + Filters */}
        <div
          className="sticky top-20 z-20 relative"
          style={{ background: '#0D0D0D', paddingBottom: '4px' }}
        >
          {/* gradient fade below sticky area */}
          <div
            className="pointer-events-none absolute left-0 right-0"
            style={{
              top: '100%',
              height: '32px',
              background: 'linear-gradient(to bottom, #0D0D0D 0%, transparent 100%)',
              zIndex: 1,
            }}
          />
          {/* Search */}
          <div className="relative mb-3">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-rx-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="WOD 이름, 동작, 태그 검색..."
              className="input pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
            {WOD_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  category === cat.id
                    ? 'gradient-bg text-white shadow-lg'
                    : 'bg-rx-surface border border-rx-border text-rx-muted hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Equipment Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {EQUIPMENT_FILTERS.map((eq) => (
              <button
                key={eq.id}
                onClick={() => setEquipment(eq.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                  equipment === eq.id
                    ? 'bg-white/10 border border-white/20 text-white'
                    : 'bg-rx-surface border border-rx-border text-rx-muted hover:text-white'
                }`}
              >
                {eq.id !== 'all' && <span>{EQUIPMENT_ICONS[eq.id]}</span>}
                {eq.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-rx-muted text-sm mb-4">{filtered.length}개의 WOD</p>

        {/* WOD Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(showAll ? filtered : filtered.slice(0, 36)).map((wod, index) => (
            <React.Fragment key={wod.id}>
              <div className="group relative bg-rx-card border border-rx-border rounded-2xl p-5 hover:-translate-y-1 transition-all duration-200 hover:border-white/20">
                {/* Type Badge */}
                <div className="flex items-start justify-between mb-3">
                  <span className={`badge border ${TYPE_COLORS[wod.type]}`}>
                    {TYPE_LABELS[wod.type]}
                  </span>
                </div>

                {/* Name */}
                <Link href={`/wod/${wod.id}`}>
                  <h3 className="font-black text-white text-2xl mb-2 hover:gradient-text transition-all">{wod.name}</h3>
                </Link>

                {/* Equipment icons */}
                <div className="flex gap-1.5 mb-3">
                  {wod.equipment.map((eq) => (
                    <span key={eq} className="text-xs bg-rx-surface px-2 py-0.5 rounded-full text-rx-muted border border-rx-border flex items-center gap-1">
                      {EQUIPMENT_ICONS[eq]}
                      {EQUIPMENT_LABELS[eq]}
                    </span>
                  ))}
                </div>

                {/* Movements preview */}
                <div className="mb-3">
                  {wod.movements.slice(0, 3).map((m, i) => (
                    <span key={i} className="text-rx-muted text-xs mr-2 font-medium">· {m}</span>
                  ))}
                  {wod.movements.length > 3 && (
                    <span className="text-rx-muted text-xs">+{wod.movements.length - 3}개</span>
                  )}
                </div>

                {/* Target time */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-rx-muted font-medium">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {wod.timeTarget.split('(')[0].trim()}
                  </div>
                  <Link
                    href={`/wod/${wod.id}`}
                    className="text-xs text-rx-muted hover:text-white transition-colors flex items-center gap-0.5"
                  >
                    자세히
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </Link>
                </div>
              </div>
              {/* AdSense between rows */}
              {(index + 1) % 9 === 0 && index < filtered.length - 1 && (
                <div key={`ad-${index}`} className="sm:col-span-2 lg:col-span-3 w-full h-16 bg-rx-surface border border-rx-border rounded-lg flex items-center justify-center">
                  <span className="text-rx-muted text-xs">광고 영역 (AdSense)</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {filtered.length > 36 && !showAll && (
          <div className="text-center mt-8">
            <button onClick={() => setShowAll(true)} className="btn-secondary px-8 py-3 rounded-xl">
              더보기 ({filtered.length - 36}개 더)
            </button>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-12 h-12 text-rx-muted mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p className="text-white font-bold text-lg mb-1">검색 결과가 없습니다</p>
            <p className="text-rx-muted text-sm">다른 검색어나 필터를 사용해보세요</p>
          </div>
        )}
      </main>
      <MobileNav />
    </div>
  )
}
