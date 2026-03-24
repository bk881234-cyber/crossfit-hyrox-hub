'use client'
import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import Header from '@/components/layout/Header'
import MobileNav from '@/components/layout/MobileNav'
import { WODS, WOD_CATEGORIES, EQUIPMENT_FILTERS, type WOD } from '@/lib/wod-data'

const TYPE_COLORS: Record<WOD['type'], string> = {
  girl: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  hero: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  open: 'bg-rx-orange/20 text-rx-orange border-rx-orange/30',
  benchmark: 'bg-green-500/20 text-green-400 border-green-500/30',
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

export default function WODPage() {
  const t = useTranslations('wod')
  const [category, setCategory] = useState('all')
  const [equipment, setEquipment] = useState('all')
  const [search, setSearch] = useState('')
  const [showAll, setShowAll] = useState(false)

  const TYPE_LABELS: Record<WOD['type'], string> = {
    girl: 'Girl WOD',
    hero: 'Hero WOD',
    open: 'Open',
    benchmark: t('benchmark'),
  }

  const EQUIPMENT_LABELS: Record<string, string> = {
    barbell: t('equipBarbell'),
    dumbbell: t('equipDumbbell'),
    bodyweight: t('equipBodyweight'),
    rope: t('equipRope'),
    kettlebell: t('equipKettlebell'),
    box: t('equipBox'),
  }

  const filtered = useMemo(() => {
    return WODS.filter((wod) => {
      const matchCat = category === 'all' || wod.type === category
      const matchEq = equipment === 'all' || wod.equipment.includes(equipment as WOD['equipment'][number])
      const matchSearch = search === '' || wod.name.toLowerCase().includes(search.toLowerCase()) ||
        wod.movements.some(m => m.toLowerCase().includes(search.toLowerCase())) ||
        wod.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      return matchCat && matchEq && matchSearch
    })
  }, [category, equipment, search])

  return (
    <div className="min-h-screen bg-rx-bg">
      <Header />
      <main className="pt-20 pb-24 md:pb-10 px-4 max-w-[992px] mx-auto">
        {/* AdSense top */}
        <div className="hidden mt-4 mb-6 w-full h-16 bg-rx-surface border border-rx-border rounded-lg flex items-center justify-center">
          <span className="text-rx-muted text-xs">광고 영역 (AdSense)</span>
        </div>

        <div className="mb-6">
          <h1 className="text-4xl font-black text-white mb-1">{t('title')}</h1>
          <p className="text-rx-muted text-sm">{t('subtitle', { count: WODS.length })}</p>
        </div>

        {/* Sticky Search + Filters */}
        <div
          className="sticky top-20 z-40 -mx-4 px-4"
          style={{
            background: '#0A0A0A',
            paddingTop: '10px',
            paddingBottom: '8px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* gradient fade below sticky area */}
          <div
            className="pointer-events-none absolute left-0 right-0"
            style={{
              top: '100%',
              height: '28px',
              background: 'linear-gradient(to bottom, rgba(13,13,13,0.7) 0%, transparent 100%)',
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
              placeholder={t('searchPlaceholder')}
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
        <p className="text-rx-muted text-sm mt-6 mb-4">{t('resultsCount', { count: filtered.length })}</p>

        {/* WOD Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(showAll ? filtered : filtered.slice(0, 36)).map((wod, index) => (
            <React.Fragment key={wod.id}>
              <Link
              href={`/wod/${wod.id}`}
              className="group relative block bg-rx-card border border-rx-border rounded-2xl p-5 hover:-translate-y-1 transition-all duration-200 hover:border-white/20 hover:shadow-lg"
            >
                {/* Type Badge */}
                <div className="flex items-start justify-between mb-3">
                  <span className={`badge border ${TYPE_COLORS[wod.type]}`}>
                    {TYPE_LABELS[wod.type]}
                  </span>
                  <span className="text-xs text-rx-muted group-hover:text-white transition-colors flex items-center gap-0.5">
                    {t('viewDetail')}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </span>
                </div>

                {/* Name */}
                <h3 className="font-black text-white text-2xl mb-2 group-hover:gradient-text transition-all leading-tight">{wod.name}</h3>

                {/* Equipment icons */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {wod.equipment.map((eq) => (
                    <span key={eq} className="text-xs bg-rx-surface px-2 py-0.5 rounded-full text-rx-muted border border-rx-border flex items-center gap-1">
                      {EQUIPMENT_ICONS[eq]}
                      {EQUIPMENT_LABELS[eq]}
                    </span>
                  ))}
                </div>

                {/* Movements preview */}
                <div className="mb-3 min-h-[1.25rem]">
                  {wod.movements.slice(0, 3).map((m, i) => (
                    <span key={i} className="text-rx-muted text-xs mr-2 font-medium">· {m}</span>
                  ))}
                  {wod.movements.length > 3 && (
                    <span className="text-rx-muted text-xs">{t('moreMovements', { count: wod.movements.length - 3 })}</span>
                  )}
                </div>

                {/* Target time */}
                <div className="flex items-center gap-1 text-xs text-rx-muted font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {wod.timeTarget.split('(')[0].trim()}
                </div>
            </Link>
              {/* AdSense between rows */}
              {(index + 1) % 9 === 0 && index < filtered.length - 1 && (
                <div key={`ad-${index}`} className="hidden sm:col-span-2 lg:col-span-3 w-full h-16 bg-rx-surface border border-rx-border rounded-lg flex items-center justify-center">
                  <span className="text-rx-muted text-xs">광고 영역 (AdSense)</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {filtered.length > 36 && !showAll && (
          <div className="text-center mt-8">
            <button onClick={() => setShowAll(true)} className="btn-secondary px-8 py-3 rounded-xl">
              {t('loadMore', { count: filtered.length - 36 })}
            </button>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-12 h-12 text-rx-muted mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p className="text-white font-bold text-lg mb-1">{t('noResults')}</p>
            <p className="text-rx-muted text-sm">{t('noResultsDesc')}</p>
          </div>
        )}
      </main>
      <MobileNav />
    </div>
  )
}
