'use client'
import { useState, useMemo } from 'react'
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

export default function WODPage() {
  const [category, setCategory] = useState('all')
  const [equipment, setEquipment] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return WODS.filter((wod) => {
      const matchCat = category === 'all' || wod.type === category
      const matchEq = equipment === 'all' || wod.equipment.includes(equipment as WOD['equipment'][number])
      const matchSearch = search === '' || wod.name.toLowerCase().includes(search.toLowerCase()) ||
        wod.movements.some(m => m.includes(search)) || wod.tags.some(t => t.includes(search))
      return matchCat && matchEq && matchSearch
    })
  }, [category, equipment, search])

  return (
    <div className="min-h-screen bg-rx-bg">
      <Header />
      <main className="pt-14 pb-24 md:pb-10 px-4 max-w-5xl mx-auto">
        {/* AdSense top */}
        <div className="mt-4 mb-4 w-full h-16 bg-rx-surface border border-rx-border rounded-lg flex items-center justify-center">
          <span className="text-rx-muted text-xs">광고 영역 (AdSense)</span>
        </div>

        <h1 className="section-title">WOD 아카이브</h1>
        <p className="section-sub">{WODS.length}개의 벤치마크 WOD · Girl / Hero / Open</p>

        {/* Search */}
        <div className="relative mb-4">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-rx-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          {WOD_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                category === cat.id
                  ? 'bg-rx-red text-white'
                  : 'bg-rx-surface border border-rx-border text-rx-muted hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Equipment Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {EQUIPMENT_FILTERS.map((eq) => (
            <button
              key={eq.id}
              onClick={() => setEquipment(eq.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                equipment === eq.id
                  ? 'bg-rx-orange/80 text-white'
                  : 'bg-rx-surface border border-rx-border text-rx-muted hover:text-white'
              }`}
            >
              {eq.id !== 'all' && <span className="mr-1">{EQUIPMENT_ICONS[eq.id]}</span>}
              {eq.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-rx-muted text-sm mb-4">{filtered.length}개의 WOD</p>

        {/* WOD Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((wod, index) => (
            <>
              <Link
                key={wod.id}
                href={`/wod/${wod.id}`}
                className="card hover:border-rx-red/40 hover:-translate-y-1 transition-all duration-200 group block"
              >
                {/* Type Badge */}
                <div className="flex items-start justify-between mb-3">
                  <span className={`badge border ${TYPE_COLORS[wod.type]}`}>
                    {TYPE_LABELS[wod.type]}
                  </span>
                  <svg className="text-rx-muted group-hover:text-rx-red transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>

                {/* Name */}
                <h3 className="font-black text-white text-xl mb-1 group-hover:text-rx-red transition-colors">{wod.name}</h3>

                {/* Equipment icons */}
                <div className="flex gap-1.5 mb-3">
                  {wod.equipment.map((eq) => (
                    <span key={eq} className="text-xs bg-rx-surface px-2 py-0.5 rounded-full text-rx-muted border border-rx-border">
                      {EQUIPMENT_ICONS[eq]} {EQUIPMENT_LABELS[eq]}
                    </span>
                  ))}
                </div>

                {/* Movements preview */}
                <div className="mb-3">
                  {wod.movements.slice(0, 3).map((m, i) => (
                    <span key={i} className="text-rx-muted text-xs mr-2">· {m}</span>
                  ))}
                  {wod.movements.length > 3 && (
                    <span className="text-rx-muted text-xs">+{wod.movements.length - 3}개</span>
                  )}
                </div>

                {/* Target time */}
                <div className="flex items-center gap-1 text-xs text-rx-orange font-bold">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {wod.timeTarget.split('(')[0].trim()}
                </div>
              </Link>
              {/* AdSense between rows */}
              {(index + 1) % 9 === 0 && index < filtered.length - 1 && (
                <div key={`ad-${index}`} className="sm:col-span-2 lg:col-span-3 w-full h-16 bg-rx-surface border border-rx-border rounded-lg flex items-center justify-center">
                  <span className="text-rx-muted text-xs">광고 영역 (AdSense)</span>
                </div>
              )}
            </>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-rx-muted text-4xl mb-3">🔍</p>
            <p className="text-white font-bold mb-1">검색 결과가 없습니다</p>
            <p className="text-rx-muted text-sm">다른 검색어나 필터를 사용해보세요</p>
          </div>
        )}
      </main>
      <MobileNav />
    </div>
  )
}
