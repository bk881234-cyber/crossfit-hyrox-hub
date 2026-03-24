'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, YAxis,
} from 'recharts'
import Header from '@/components/layout/Header'
import MobileNav from '@/components/layout/MobileNav'
import { Link } from '@/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { OneRmRecord, LiftType, WeightUnit } from '@/lib/supabase-types'

// ─── Lift config ──────────────────────────────────────────────
const LIFTS = [
  { key: 'deadlift'       as LiftType, name: '데드리프트',   nameEn: 'Deadlift',       emoji: '🏋️' },
  { key: 'back_squat'     as LiftType, name: '백 스쿼트',     nameEn: 'Back Squat',     emoji: '🦵' },
  { key: 'bench_press'    as LiftType, name: '벤치프레스',    nameEn: 'Bench Press',    emoji: '💪' },
  { key: 'front_squat'    as LiftType, name: '프론트 스쿼트', nameEn: 'Front Squat',    emoji: '🔄' },
  { key: 'overhead_press' as LiftType, name: 'OHP',           nameEn: 'Overhead Press', emoji: '☝️' },
  { key: 'clean'          as LiftType, name: '클린',          nameEn: 'Clean',          emoji: '⚡' },
  { key: 'snatch'         as LiftType, name: '스내치',        nameEn: 'Snatch',         emoji: '🌟' },
] as const

type LiftConfig = typeof LIFTS[number]

// ─── Empty state helper ───────────────────────────────────────
const emptyRecords = (): Record<LiftType, OneRmRecord[]> => ({
  deadlift: [], back_squat: [], bench_press: [], front_squat: [],
  overhead_press: [], clean: [], snatch: [],
})

// ─── Unit helpers ─────────────────────────────────────────────
function toKg(weight: number, unit: WeightUnit): number {
  return unit === 'lbs' ? weight / 2.2046 : weight
}
function fromKg(kg: number, unit: WeightUnit): number {
  return Math.round((unit === 'lbs' ? kg * 2.2046 : kg) * 10) / 10
}
function convert(weight: number, from: WeightUnit, to: WeightUnit): number {
  if (from === to) return weight
  return fromKg(toKg(weight, from), to)
}

// ─── PR detection ─────────────────────────────────────────────
function getPR(records: OneRmRecord[], displayUnit: WeightUnit): OneRmRecord | null {
  if (!records.length) return null
  return records.reduce((best, rec) =>
    toKg(rec.weight, rec.unit) > toKg(best.weight, best.unit) ? rec : best
  )
}

// ─── Chart helpers ────────────────────────────────────────────
function getChartData(records: OneRmRecord[], displayUnit: WeightUnit) {
  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - 6)
  const from = cutoff.toISOString().split('T')[0]

  return records
    .filter(r => r.date >= from)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(r => ({
      date: r.date,
      w: fromKg(toKg(r.weight, r.unit), displayUnit),
    }))
}

function getTrend(data: { w: number }[]) {
  if (data.length < 2) return null
  const pct = ((data[data.length - 1].w - data[0].w) / data[0].w) * 100
  return {
    pct: Math.abs(pct),
    dir: pct > 0.4 ? 'up' : pct < -0.4 ? 'down' : 'flat',
  } as const
}

// ─── Web Share / Clipboard ────────────────────────────────────
async function sharePR(
  liftNameEn: string,
  weight: number,
  unit: WeightUnit,
): Promise<'shared' | 'copied' | 'failed'> {
  const url = typeof window !== 'undefined' ? window.location.href : 'https://www.fittersstudio.com/calculator/1rm'
  const text = `🔥 ${liftNameEn} PR UPDATED: ${weight}${unit} on FITTERS STUDIO! 🚀 Track yours: ${url}`
  try {
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({ title: 'FITTERS STUDIO — 나의 PR 기록하기', text, url })
      return 'shared'
    }
    await navigator.clipboard.writeText(text)
    return 'copied'
  } catch {
    return 'failed'
  }
}

// ─── Sparkline ────────────────────────────────────────────────
function Sparkline({ data, id }: { data: { w: number }[]; id: string }) {
  if (data.length < 2) {
    return (
      <div className="h-16 flex items-center justify-center rounded-lg"
        style={{ background: 'rgba(255,255,255,0.03)' }}>
        <span className="text-rx-muted" style={{ fontSize: 16 }}>
          {data.length === 1 ? '기록 1개' : '기록 없음'}
        </span>
      </div>
    )
  }
  return (
    <div className="h-16 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 2, bottom: 4, left: 2 }}>
          <defs>
            <linearGradient id={`sg-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#FF2D8B" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#E8321A" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <YAxis domain={['auto', 'auto']} hide />
          <Tooltip
            contentStyle={{
              background: '#1A1A1A', border: '1px solid #333',
              borderRadius: 8, fontSize: 13, padding: '4px 10px',
            }}
            itemStyle={{ color: '#fff' }}
            labelStyle={{ color: '#999', fontSize: 12 }}
            formatter={(v) => [`${v ?? ''}`, '']}
          />
          <Area
            type="monotone" dataKey="w"
            stroke="#FF2D8B" strokeWidth={2}
            fill={`url(#sg-${id})`}
            dot={false}
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── Lift card ────────────────────────────────────────────────
interface CardProps {
  lift: LiftConfig
  records: OneRmRecord[]
  displayUnit: WeightUnit
  selected: boolean
  onSelect: () => void
}

function LiftCard({ lift, records, displayUnit, selected, onSelect }: CardProps) {
  const pr = getPR(records, displayUnit)
  const chartData = getChartData(records, displayUnit)
  const trend = getTrend(chartData)
  const prDisplay = pr ? fromKg(toKg(pr.weight, pr.unit), displayUnit) : null

  return (
    <div
      onClick={onSelect}
      className="tool-card p-4 select-none"
      style={selected ? {
        borderColor: 'rgba(255,45,139,0.65)',
        boxShadow: '0 0 28px rgba(255,45,139,0.15), inset 0 1px 0 rgba(255,255,255,0.18)',
      } : {}}
    >
      {/* Top row: emoji + trend badge */}
      <div className="flex items-start justify-between mb-2">
        <span style={{ fontSize: 20 }}>{lift.emoji}</span>
        {trend && (
          <span
            className="font-bold px-1.5 py-0.5 rounded-md"
            style={{
              fontSize: 14,
              color:      trend.dir === 'up' ? '#22c55e' : trend.dir === 'down' ? '#ef4444' : '#666',
              background: trend.dir === 'up' ? 'rgba(34,197,94,0.12)' : trend.dir === 'down' ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.05)',
            }}
          >
            {trend.dir === 'up' ? '↑' : trend.dir === 'down' ? '↓' : '—'} {trend.pct.toFixed(1)}%
          </span>
        )}
      </div>

      {/* Lift name */}
      <p className="text-rx-muted font-medium truncate mb-1" style={{ fontSize: 16 }}>{lift.name}</p>

      {/* PR weight */}
      <div className="flex items-baseline gap-1 mb-2 min-h-[34px]">
        {prDisplay !== null ? (
          <>
            <span className="font-black gradient-text" style={{ fontSize: 28, lineHeight: 1 }}>{prDisplay}</span>
            <span className="text-rx-muted font-bold" style={{ fontSize: 16 }}>{displayUnit}</span>
          </>
        ) : (
          <span className="text-rx-muted font-bold" style={{ fontSize: 20 }}>—</span>
        )}
      </div>

      {/* Sparkline */}
      <Sparkline data={chartData} id={lift.key} />

      {/* Footer */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-rx-muted" style={{ fontSize: 16 }}>
          {records.length > 0 ? `${records.length}회 기록` : '첫 기록 추가'}
        </span>
        <svg
          width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.5" className="text-rx-muted transition-transform duration-200"
          style={{ transform: selected ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  )
}

// ─── Share button ─────────────────────────────────────────────
function ShareBtn({ onClick, state }: { onClick: () => void; state: 'idle' | 'copied' | 'shared' }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all"
      style={{
        fontSize: 16,
        background: state !== 'idle' ? 'rgba(34,197,94,0.14)' : 'rgba(255,255,255,0.07)',
        border: state !== 'idle' ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(255,255,255,0.12)',
        color: state !== 'idle' ? '#22c55e' : '#fff',
      }}
    >
      {state === 'copied' ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          복사됨!
        </>
      ) : state === 'shared' ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          공유됨!
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          나의 PR 공유하기
        </>
      )}
    </button>
  )
}

// ─── Main component ───────────────────────────────────────────
export default function StrengthHubClient() {
  const supabase   = useMemo(() => createClient(), [])
  const [user,     setUser]     = useState<User | null>(null)
  const [records,  setRecords]  = useState<Record<LiftType, OneRmRecord[]>>(emptyRecords)
  const [loading,  setLoading]  = useState(true)
  const [dispUnit, setDispUnit] = useState<WeightUnit>('lbs')
  const [selected, setSelected] = useState<LiftType | null>(null)

  // Log-form state
  const [logW,    setLogW]    = useState('')
  const [logUnit, setLogUnit] = useState<WeightUnit>('lbs')
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0])
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)

  // Share state
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'shared'>('idle')

  // ── Load records ──
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (!user) { setLoading(false); return }

      const { data } = await supabase
        .from('one_rm_records')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (data) {
        const grouped = emptyRecords()
        data.forEach(r => {
          if (r.lift_type in grouped)
            grouped[r.lift_type as LiftType].push(r as OneRmRecord)
        })
        setRecords(grouped)
      }
      setLoading(false)
    }
    load()
  }, [supabase])

  // ── Card select ──
  const handleSelect = useCallback((key: LiftType) => {
    setSelected(prev => {
      if (prev === key) return null
      setSaved(false)
      setLogW('')
      setLogDate(new Date().toISOString().split('T')[0])
      return key
    })
    setShareState('idle')
  }, [])

  // ── Save PR ──
  const handleSave = async () => {
    if (!user || !selected || !logW) return
    const w = parseFloat(logW)
    if (isNaN(w) || w <= 0) return
    setSaving(true)

    const { data, error } = await supabase
      .from('one_rm_records')
      .insert({ user_id: user.id, lift_type: selected, weight: w, unit: logUnit, date: logDate })
      .select().single()

    if (!error && data) {
      setRecords(prev => ({ ...prev, [selected]: [data as OneRmRecord, ...prev[selected]] }))
      setLogW('')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  // ── Delete record ──
  const handleDelete = async (liftKey: LiftType, id: string) => {
    await supabase.from('one_rm_records').delete().eq('id', id)
    setRecords(prev => ({ ...prev, [liftKey]: prev[liftKey].filter(r => r.id !== id) }))
  }

  // ── Share PR ──
  const handleShare = async () => {
    if (!selected) return
    const lift = LIFTS.find(l => l.key === selected)!
    const pr   = getPR(records[selected], dispUnit)
    if (!pr) return
    const w = fromKg(toKg(pr.weight, pr.unit), dispUnit)
    const result = await sharePR(lift.nameEn, w, dispUnit)
    if (result !== 'failed') {
      setShareState(result)
      setTimeout(() => setShareState('idle'), 2800)
    }
  }

  // ── Selected lift helpers ──
  const selConfig  = selected ? LIFTS.find(l => l.key === selected)! : null
  const selRecords = selected ? records[selected] : []
  const selPR      = selected ? getPR(selRecords, dispUnit) : null

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-rx-bg flex items-center justify-center">
        <div className="w-9 h-9 rounded-full border-2 border-rx-pink border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-rx-bg pb-28">
      <Header />
      <main className="pt-24 px-4 max-w-[640px] mx-auto">

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex items-start justify-between mb-7 flex-wrap gap-3"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/calculator" className="text-rx-muted hover:text-white transition-colors" style={{ fontSize: 16 }}>
                ← 계산기
              </Link>
            </div>
            <h1 className="font-black text-white uppercase tracking-tight" style={{ fontSize: 38, lineHeight: 1 }}>
              나의 PR <span className="gradient-text">기록하기</span>
            </h1>
            <p className="text-rx-muted mt-1" style={{ fontSize: 16 }}>나의 PR을 기록하고 관리하며 성장과정을 공유하세요.</p>
          </div>

          {/* kg / lbs toggle */}
          <div className="flex rounded-xl overflow-hidden border border-rx-border">
            {(['kg', 'lbs'] as WeightUnit[]).map(u => (
              <button
                key={u}
                onClick={() => setDispUnit(u)}
                className="px-5 py-2.5 font-bold transition-colors"
                style={dispUnit === u
                  ? { background: 'linear-gradient(135deg,#E8321A,#FF2D8B)', color: '#fff', fontSize: 16 }
                  : { color: '#999', fontSize: 16 }}
              >
                {u}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Login gate ── */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-10 text-center mb-6"
          >
            <p style={{ fontSize: 40 }}>💪</p>
            <p className="text-white font-bold mt-3 mb-2" style={{ fontSize: 18 }}>
              로그인하면 나의 1RM을 추적할 수 있어요
            </p>
            <p className="text-rx-muted mb-6" style={{ fontSize: 16 }}>클라우드에 안전하게 저장 · 어디서든 확인</p>
            <Link href="/login" className="btn-primary" style={{ fontSize: 16 }}>
              로그인하기
            </Link>
          </motion.div>
        )}

        {/* ── 7-card grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {LIFTS.map((lift, i) => (
            <motion.div
              key={lift.key}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
            >
              <LiftCard
                lift={lift}
                records={records[lift.key]}
                displayUnit={dispUnit}
                selected={selected === lift.key}
                onSelect={() => handleSelect(lift.key)}
              />
            </motion.div>
          ))}
        </div>

        {/* ── Expanded detail panel ── */}
        <AnimatePresence mode="wait">
          {selected && selConfig && (
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden mb-8"
            >
              <div className="glass-card p-5">

                {/* Detail header */}
                <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ fontSize: 26 }}>{selConfig.emoji}</span>
                      <h2 className="font-black text-white uppercase tracking-tight" style={{ fontSize: 24 }}>
                        {selConfig.name}
                      </h2>
                    </div>
                    {selPR ? (
                      <p className="text-rx-muted" style={{ fontSize: 16 }}>
                        PR:{' '}
                        <span className="font-black gradient-text" style={{ fontSize: 24 }}>
                          {fromKg(toKg(selPR.weight, selPR.unit), dispUnit)} {dispUnit}
                        </span>
                        {' '}· {selPR.date}
                      </p>
                    ) : (
                      <p className="text-rx-muted" style={{ fontSize: 16 }}>아직 기록이 없습니다</p>
                    )}
                  </div>

                  {selPR && (
                    <ShareBtn onClick={handleShare} state={shareState} />
                  )}
                </div>

                {/* ── Log form ── */}
                {user && (
                  <div
                    className="rounded-xl p-4 mb-5"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <p className="text-white font-bold mb-3" style={{ fontSize: 16 }}>새 기록 추가</p>
                    <div className="flex gap-2 flex-wrap items-end">
                      {/* Weight */}
                      <div className="flex-1" style={{ minWidth: 110 }}>
                        <label className="text-rx-muted uppercase tracking-wider block mb-1" style={{ fontSize: 16 }}>
                          무게
                        </label>
                        <div className="flex gap-1">
                          <input
                            type="number" inputMode="decimal" placeholder="0"
                            value={logW} onChange={e => setLogW(e.target.value)}
                            className="input text-center font-bold flex-1"
                            style={{ fontSize: 18 }}
                          />
                          <button
                            onClick={() => setLogUnit(u => u === 'kg' ? 'lbs' : 'kg')}
                            className="px-3 rounded-lg border border-rx-border text-rx-muted hover:text-white font-bold transition-colors flex-shrink-0"
                            style={{ fontSize: 16 }}
                          >
                            {logUnit}
                          </button>
                        </div>
                      </div>

                      {/* Date */}
                      <div>
                        <label className="text-rx-muted uppercase tracking-wider block mb-1" style={{ fontSize: 16 }}>
                          날짜
                        </label>
                        <input
                          type="date" value={logDate} onChange={e => setLogDate(e.target.value)}
                          className="input" style={{ fontSize: 16 }}
                        />
                      </div>

                      {/* Save */}
                      <button
                        onClick={handleSave}
                        disabled={saving || !logW}
                        className="btn-primary py-3 px-5 disabled:opacity-40"
                        style={{ fontSize: 16 }}
                      >
                        {saved ? (
                          <span className="flex items-center gap-1.5">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            저장됨!
                          </span>
                        ) : saving ? '저장 중...' : '저장'}
                      </button>
                    </div>
                  </div>
                )}

                {/* ── History table ── */}
                {selRecords.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-rx-muted" style={{ fontSize: 16 }}>첫 기록을 추가해보세요!</p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="overflow-x-auto"
                  >
                    <table className="w-full" style={{ fontSize: 16 }}>
                      <thead>
                        <tr className="border-b border-rx-border">
                          <th className="text-left text-rx-muted font-bold py-2.5 pr-4">날짜</th>
                          <th className="text-right text-rx-muted font-bold py-2.5 pr-4">무게</th>
                          <th className="text-right text-rx-muted font-bold py-2.5 pr-4">이전 대비</th>
                          <th className="py-2.5 w-8"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {selRecords.map((rec, i) => {
                          const isPR  = rec.id === selPR?.id
                          const wDisp = fromKg(toKg(rec.weight, rec.unit), dispUnit)

                          // Delta vs previous (older) attempt
                          let deltaEl: React.ReactNode = <span className="text-rx-muted">—</span>
                          if (i < selRecords.length - 1) {
                            const older = selRecords[i + 1]
                            const diff  = Math.round(
                              (wDisp - fromKg(toKg(older.weight, older.unit), dispUnit)) * 10
                            ) / 10
                            if (diff > 0) {
                              deltaEl = (
                                <span className="font-bold" style={{ color: '#22c55e' }}>
                                  ↑ +{diff}{dispUnit}
                                </span>
                              )
                            } else if (diff < 0) {
                              deltaEl = (
                                <span className="font-bold" style={{ color: '#ef4444' }}>
                                  ↓ {diff}{dispUnit}
                                </span>
                              )
                            } else {
                              deltaEl = <span className="text-rx-muted">±0</span>
                            }
                          }

                          return (
                            <tr
                              key={rec.id}
                              className="border-b transition-colors"
                              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                            >
                              <td className="py-3 pr-4 text-rx-muted">{rec.date}</td>

                              <td className="py-3 pr-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <span className="text-white font-bold">
                                    {wDisp} {dispUnit}
                                  </span>
                                  {isPR && (
                                    <span
                                      className="px-2 py-0.5 rounded-full font-black text-white"
                                      style={{
                                        background: 'linear-gradient(135deg,#E8321A,#FF2D8B)',
                                        fontSize: 13,
                                      }}
                                    >
                                      PR
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="py-3 pr-4 text-right">{deltaEl}</td>

                              <td className="py-3 text-right">
                                <button
                                  onClick={() => handleDelete(selected!, rec.id)}
                                  className="text-rx-muted hover:text-red-400 transition-colors p-1"
                                >
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </motion.div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
      <MobileNav />
    </div>
  )
}
