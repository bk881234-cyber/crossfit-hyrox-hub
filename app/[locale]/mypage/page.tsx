'use client'
import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter, Link } from '@/navigation'
import { useTranslations } from 'next-intl'
import Header from '@/components/layout/Header'
import MobileNav from '@/components/layout/MobileNav'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { WodLog } from '@/lib/supabase-types'

// ─── Constants ──────────────────────────────────────────────
const GAUGE_R = 54
const GAUGE_STROKE = 10
const CIRCUMFERENCE = 2 * Math.PI * GAUGE_R

// ─── Circular Gauge ─────────────────────────────────────────
function CircularGauge({ filled, count }: { filled: boolean; count: number }) {
  const offset = filled ? 0 : CIRCUMFERENCE
  return (
    <div className="relative flex items-center justify-center" style={{ width: 148, height: 148 }}>
      <svg width="148" height="148" viewBox="0 0 148 148" style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E8321A" />
            <stop offset="100%" stopColor="#FF2D8B" />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx="74" cy="74" r={GAUGE_R}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={GAUGE_STROKE}
        />
        {/* Fill */}
        <motion.circle
          cx="74" cy="74" r={GAUGE_R}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth={GAUGE_STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.4 }}
        />
      </svg>
      {/* Center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <motion.span
          className="font-black gradient-text"
          style={{ fontSize: 36, lineHeight: 1 }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {count}
        </motion.span>
        <span className="text-rx-muted font-medium" style={{ fontSize: 16 }}>Today</span>
      </div>
      {/* Glow pulse when complete */}
      {filled && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ boxShadow: '0 0 40px rgba(255,45,139,0.35)' }}
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </div>
  )
}

// ─── Heatmap cell ────────────────────────────────────────────
function HeatCell({ count, date }: { count: number; date: string }) {
  const base = 'rounded-sm transition-all duration-200'
  const size = { width: 12, height: 12 }

  if (count === 0) {
    return <div className={`${base} bg-white/5`} style={size} title={date} />
  }
  if (count === 1) {
    return <div className={`${base}`} style={{ ...size, background: 'rgba(232,50,26,0.45)' }} title={`${date}: ${count}`} />
  }
  if (count === 2) {
    return <div className={`${base}`} style={{ ...size, background: 'rgba(232,50,26,0.82)' }} title={`${date}: ${count}`} />
  }
  // 3+: rx-pink glow
  return (
    <div
      className={base}
      style={{
        ...size,
        background: '#FF2D8B',
        boxShadow: '0 0 7px rgba(255,45,139,0.75)',
      }}
      title={`${date}: ${count}`}
    />
  )
}

// ─── Page ────────────────────────────────────────────────────
export default function MyPage() {
  const t = useTranslations('mypage')
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [user, setUser] = useState<User | null>(null)
  const [logs, setLogs] = useState<WodLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function migrateFromLocalStorage(userId: string) {
      const MIGRATION_KEY = 'ls-migrated-supabase-v1'
      if (localStorage.getItem(MIGRATION_KEY)) return

      type LocalEntry = {
        wodId?: string; wodName?: string; wodType?: string
        date?: string; time?: string; rounds?: string; weight?: string
        difficulty?: number; notes?: string
      }

      try {
        const stored = localStorage.getItem('wod-logs-v2')
        if (!stored) { localStorage.setItem(MIGRATION_KEY, '1'); return }

        const localLogs: LocalEntry[] = JSON.parse(stored)
        if (!localLogs.length) { localStorage.setItem(MIGRATION_KEY, '1'); return }

        const rows = localLogs
          .filter(l => l.wodName)
          .map(l => ({
            user_id:   userId,
            wod_id:    l.wodId && l.wodId !== 'custom' ? l.wodId : null,
            wod_name:  l.wodName!,
            wod_type:  l.wodType || null,
            date:      l.date || new Date().toISOString().split('T')[0],
            time:      l.time   || null,
            rounds:    l.rounds || null,
            weight:    l.weight || null,
            difficulty: l.difficulty ?? null,
            notes:     l.notes  || null,
          }))

        // Insert in batches of 50
        for (let i = 0; i < rows.length; i += 50) {
          await supabase.from('wod_logs').insert(rows.slice(i, i + 50))
        }
      } catch {
        // Migration is best-effort; never block the page
      } finally {
        localStorage.setItem(MIGRATION_KEY, '1')
      }
    }

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace('/login')
        return
      }
      setUser(user)

      // One-time migration from localStorage on first visit
      await migrateFromLocalStorage(user.id)

      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
      const fromDate = oneYearAgo.toISOString().split('T')[0]

      const { data } = await supabase
        .from('wod_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', fromDate)
        .order('date', { ascending: false })

      setLogs((data ?? []) as WodLog[])
      setLoading(false)
    }
    load()
  }, [supabase, router])

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])
  const thisMonthStr = useMemo(() => todayStr.slice(0, 7), [todayStr])

  const todayCount = useMemo(() => logs.filter(l => l.date === todayStr).length, [logs, todayStr])
  const thisMonthCount = useMemo(() => logs.filter(l => l.date?.startsWith(thisMonthStr)).length, [logs, thisMonthStr])

  // Current streak
  const streak = useMemo(() => {
    const dates = new Set(logs.map(l => l.date))
    let count = 0
    const d = new Date()
    if (!dates.has(todayStr)) d.setDate(d.getDate() - 1)
    while (true) {
      const s = d.toISOString().split('T')[0]
      if (!dates.has(s)) break
      count++
      d.setDate(d.getDate() - 1)
    }
    return count
  }, [logs, todayStr])

  // Heatmap: 53 weeks × 7 days
  const { weeks, monthLabels } = useMemo(() => {
    const countMap: Record<string, number> = {}
    logs.forEach(l => { if (l.date) countMap[l.date] = (countMap[l.date] || 0) + 1 })

    const today = new Date()
    const start = new Date(today)
    start.setDate(today.getDate() - 364)
    start.setDate(start.getDate() - start.getDay()) // back to Sunday

    const weeks: { date: string; count: number }[][] = []
    const cur = new Date(start)
    for (let w = 0; w < 53; w++) {
      const week: { date: string; count: number }[] = []
      for (let d = 0; d < 7; d++) {
        const s = cur.toISOString().split('T')[0]
        week.push({ date: s, count: countMap[s] || 0 })
        cur.setDate(cur.getDate() + 1)
      }
      weeks.push(week)
    }

    // Month labels: track first week index per month
    const monthLabels: { label: string; col: number }[] = []
    let lastMonth = -1
    weeks.forEach((week, i) => {
      const m = new Date(week[0].date).getMonth()
      if (m !== lastMonth) {
        monthLabels.push({ label: `${m + 1}월`, col: i })
        lastMonth = m
      }
    })

    return { weeks, monthLabels }
  }, [logs])

  const recentLogs = logs.slice(0, 10)

  const displayName =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email?.split('@')[0] ??
    'Athlete'
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-rx-bg flex items-center justify-center">
        <div className="w-9 h-9 rounded-full border-2 border-rx-pink border-t-transparent animate-spin" />
      </div>
    )
  }

  // ── Render ──
  return (
    <div className="min-h-screen bg-rx-bg pb-28">
      <Header />

      <main className="pt-24 px-4 max-w-2xl mx-auto space-y-5">

        {/* ── Hero card ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-5 flex items-center gap-4"
        >
          {/* Avatar */}
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              width={72} height={72}
              className="rounded-full object-cover ring-2 ring-rx-pink/40 flex-shrink-0"
              style={{ width: 72, height: 72 }}
              unoptimized
            />
          ) : (
            <div
              className="rounded-full flex items-center justify-center text-2xl font-black text-white flex-shrink-0"
              style={{
                width: 72, height: 72,
                background: 'linear-gradient(135deg, #E8321A, #FF2D8B)',
                boxShadow: '0 0 24px rgba(255,45,139,0.4)',
              }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Name */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black text-white truncate">{displayName}</h1>
            <p className="text-rx-muted" style={{ fontSize: 16 }}>{t('member')}</p>
          </div>

          {/* Total WODs badge */}
          <div
            className="flex-shrink-0 text-center px-4 py-3 rounded-xl"
            style={{ background: 'linear-gradient(135deg, #E8321A, #FF2D8B)' }}
          >
            <motion.div
              className="text-2xl font-black text-white leading-none"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.3 }}
            >
              {logs.length}
            </motion.div>
            <div className="text-white/85 font-bold mt-0.5" style={{ fontSize: 16 }}>
              {t('totalWods')}
            </div>
          </div>
        </motion.div>

        {/* ── Daily Gauge + Stats ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {/* Gauge */}
          <div className="glass-card p-5 flex flex-col items-center gap-3">
            <CircularGauge filled={todayCount > 0} count={todayCount} />
            <p className="font-bold text-white text-center" style={{ fontSize: 16 }}>
              {todayCount > 0 ? t('goalComplete') + ' 🔥' : t('todayGoal')}
            </p>
            <p className="text-rx-muted text-center" style={{ fontSize: 16 }}>{t('goalDesc')}</p>
          </div>

          {/* Right 2×2 */}
          <div className="sm:col-span-2 grid grid-cols-2 gap-4">

            {/* Streak */}
            <div className="glass-card p-5 flex flex-col justify-between min-h-[120px]">
              <span className="text-rx-muted" style={{ fontSize: 16 }}>{t('streak')}</span>
              <div className="flex items-end gap-1">
                <motion.span
                  className="font-black gradient-text"
                  style={{ fontSize: 42, lineHeight: 1 }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {streak}
                </motion.span>
                <span className="text-white font-bold pb-1" style={{ fontSize: 16 }}>{t('streakUnit')}</span>
              </div>
            </div>

            {/* This month */}
            <div className="glass-card p-5 flex flex-col justify-between min-h-[120px]">
              <span className="text-rx-muted" style={{ fontSize: 16 }}>{t('thisMonth')}</span>
              <div className="flex items-end gap-1">
                <motion.span
                  className="font-black gradient-text"
                  style={{ fontSize: 42, lineHeight: 1 }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  {thisMonthCount}
                </motion.span>
                <span className="text-white font-bold pb-1" style={{ fontSize: 16 }}>{t('thisMonthUnit')}</span>
              </div>
            </div>

            {/* Log CTA */}
            <div className="glass-card p-4 col-span-2 flex items-center justify-between gap-3">
              <p className="text-white font-bold" style={{ fontSize: 16 }}>{t('logWodPrompt')}</p>
              <Link href="/wod/log" className="btn-primary py-2 px-4 whitespace-nowrap flex-shrink-0" style={{ fontSize: 16 }}>
                {t('logWod')}
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── Activity Heatmap ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="glass-card p-5"
        >
          <h2 className="text-xl font-black text-white uppercase tracking-tight mb-0.5">{t('heatmapTitle')}</h2>
          <p className="text-rx-muted mb-5" style={{ fontSize: 16 }}>{t('heatmapDesc')}</p>

          <div className="overflow-x-auto">
            <div style={{ minWidth: 53 * 14 }}>
              {/* Month labels */}
              <div className="relative mb-1" style={{ height: 20 }}>
                {monthLabels.map(({ label, col }) => (
                  <span
                    key={`${label}-${col}`}
                    className="absolute text-rx-muted select-none"
                    style={{ left: col * 14, fontSize: 16, lineHeight: 1 }}
                  >
                    {label}
                  </span>
                ))}
              </div>

              {/* Grid: grid-auto-flow column → each 7-cell group = 1 week column */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateRows: 'repeat(7, 12px)',
                  gridAutoFlow: 'column',
                  gap: '2px',
                }}
              >
                {weeks.flatMap((week, wi) =>
                  week.map((cell, di) => (
                    <HeatCell key={`${wi}-${di}`} count={cell.count} date={cell.date} />
                  ))
                )}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-2 mt-3 justify-end">
                <span className="text-rx-muted" style={{ fontSize: 16 }}>{t('less')}</span>
                <div style={{ width: 12, height: 12, borderRadius: 2, background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ width: 12, height: 12, borderRadius: 2, background: 'rgba(232,50,26,0.45)' }} />
                <div style={{ width: 12, height: 12, borderRadius: 2, background: 'rgba(232,50,26,0.82)' }} />
                <div style={{ width: 12, height: 12, borderRadius: 2, background: '#FF2D8B', boxShadow: '0 0 7px rgba(255,45,139,0.75)' }} />
                <span className="text-rx-muted" style={{ fontSize: 16 }}>{t('more')}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Recent Activity ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
        >
          <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">{t('recentTitle')}</h2>

          {recentLogs.length === 0 ? (
            <div className="glass-card p-10 flex flex-col items-center gap-4">
              <p className="text-rx-muted text-center" style={{ fontSize: 16 }}>{t('noActivity')}</p>
              <Link href="/wod" className="btn-primary">{t('browseWods')}</Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentLogs.map((log, i) => {
                const flames = Math.min(Math.max(log.difficulty ?? 1, 1), 5)
                const result = log.time
                  ? log.time
                  : log.rounds
                  ? `${log.rounds} rds`
                  : log.notes?.slice(0, 36) || t('noResult')

                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.045 }}
                    className="glass-card p-4 flex items-center gap-4"
                  >
                    {/* Difficulty flames */}
                    <div className="flex-shrink-0 flex flex-col items-center w-14">
                      <span style={{ fontSize: 18, lineHeight: 1 }}>{'🔥'.repeat(flames)}</span>
                      <span className="text-rx-muted mt-1" style={{ fontSize: 16 }}>{flames}/5</span>
                    </div>

                    {/* Name + result */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold truncate" style={{ fontSize: 16 }}>{log.wod_name}</p>
                      <p className="text-rx-muted truncate" style={{ fontSize: 16 }}>{result}</p>
                    </div>

                    {/* Type + date */}
                    <div className="flex-shrink-0 text-right">
                      <div
                        className="font-bold rounded-full px-2 py-0.5 mb-1 inline-block"
                        style={{
                          fontSize: 16,
                          background: 'rgba(232,50,26,0.18)',
                          color: '#E8321A',
                          border: '1px solid rgba(232,50,26,0.35)',
                        }}
                      >
                        {log.wod_type ?? 'WOD'}
                      </div>
                      <p className="text-rx-muted" style={{ fontSize: 16 }}>{log.date}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>

      </main>
      <MobileNav />
    </div>
  )
}
