'use client'
import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from '@/navigation'
import { createClient } from '@/lib/supabase/client'
import type { WodLog } from '@/lib/supabase-types'

// ─── Time helpers ────────────────────────────────────────────
function parseTimeToSec(t: string | null | undefined): number | null {
  if (!t?.trim()) return null
  const parts = t.trim().split(':').map(s => parseInt(s, 10))
  if (parts.some(n => isNaN(n))) return null
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  return null
}

function fmtSec(s: number): string {
  if (s >= 3600) {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sc = s % 60
    return `${h}:${String(m).padStart(2, '0')}:${String(sc).padStart(2, '0')}`
  }
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

function parseRoundsToNum(r: string | null | undefined): number | null {
  if (!r?.trim()) return null
  const m = r.trim().match(/(\d+)/)
  return m ? parseInt(m[1]) : null
}

// ─── PR detection ────────────────────────────────────────────
function findPrIndex(logs: WodLog[]): number {
  if (logs.length === 0) return -1
  const wodType = logs[0].wod_type

  if (wodType === 'For Time') {
    let best = Infinity, bestIdx = -1
    logs.forEach((l, i) => {
      const s = parseTimeToSec(l.time)
      if (s !== null && s < best) { best = s; bestIdx = i }
    })
    return bestIdx >= 0 ? bestIdx : 0
  }

  if (wodType === 'AMRAP') {
    let best = -Infinity, bestIdx = -1
    logs.forEach((l, i) => {
      const r = parseRoundsToNum(l.rounds)
      if (r !== null && r > best) { best = r; bestIdx = i }
    })
    return bestIdx >= 0 ? bestIdx : 0
  }

  return 0 // default: most recent
}

// ─── Delta badge between two attempts ────────────────────────
type DeltaBadge = { dir: 'up' | 'down' | 'same'; label: string }

function computeDelta(current: WodLog, previous: WodLog): DeltaBadge | null {
  const wt = current.wod_type

  if (wt === 'For Time') {
    const curr = parseTimeToSec(current.time)
    const prev = parseTimeToSec(previous.time)
    if (curr === null || prev === null) return null
    const delta = prev - curr // positive = faster = better
    if (delta > 0) return { dir: 'up',   label: `↑ ${fmtSec(delta)} 단축!` }
    if (delta < 0) return { dir: 'down', label: `↓ ${fmtSec(Math.abs(delta))} 느림` }
    return { dir: 'same', label: '동일' }
  }

  if (wt === 'AMRAP') {
    const curr = parseRoundsToNum(current.rounds)
    const prev = parseRoundsToNum(previous.rounds)
    if (curr === null || prev === null) return null
    const delta = curr - prev // positive = more rounds = better
    if (delta > 0) return { dir: 'up',   label: `↑ ${delta} 라운드 더!` }
    if (delta < 0) return { dir: 'down', label: `↓ ${Math.abs(delta)} 라운드 감소` }
    return { dir: 'same', label: '동일' }
  }

  return null
}

// ─── Delta badge component ────────────────────────────────────
function DeltaChip({ badge }: { badge: DeltaBadge }) {
  const styles: Record<string, { bg: string; color: string; border: string }> = {
    up:   { bg: 'rgba(34,197,94,0.13)',  color: '#22c55e', border: 'rgba(34,197,94,0.3)' },
    down: { bg: 'rgba(239,68,68,0.13)',  color: '#ef4444', border: 'rgba(239,68,68,0.3)' },
    same: { bg: 'rgba(255,255,255,0.07)', color: '#999',   border: 'rgba(255,255,255,0.1)' },
  }
  const s = styles[badge.dir]
  return (
    <span
      className="flex-shrink-0 px-2.5 py-1 rounded-xl font-bold whitespace-nowrap"
      style={{ fontSize: 16, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {badge.label}
    </span>
  )
}

// ─── Main panel ───────────────────────────────────────────────
interface Props { wodId: string }

export default function WodHistoryPanel({ wodId }: Props) {
  const supabase = useMemo(() => createClient(), [])
  const [logs, setLogs] = useState<WodLog[]>([])
  const [status, setStatus] = useState<'loading' | 'guest' | 'ready'>('loading')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setStatus('guest'); return }

      const { data } = await supabase
        .from('wod_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('wod_id', wodId)
        .order('date', { ascending: false })

      setLogs((data ?? []) as WodLog[])
      setStatus('ready')
    }
    load()
  }, [supabase, wodId])

  // Don't render anything while loading or for guests
  if (status !== 'ready') return null

  const prIdx = findPrIndex(logs)

  // Best result for the banner
  const prLog = logs[prIdx]
  const prResult = prLog?.time ?? prLog?.rounds ?? null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="mb-6"
    >
      {/* ── Re-challenge banner ── */}
      {logs.length > 0 ? (
        <div
          className="rounded-2xl p-5 mb-4"
          style={{
            background: 'linear-gradient(135deg, rgba(232,50,26,0.10), rgba(255,45,139,0.10))',
            border: '1px solid rgba(232,50,26,0.40)',
          }}
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              {/* Title row */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span style={{ fontSize: 22 }}>🔄</span>
                <span className="font-black text-white uppercase tracking-tight" style={{ fontSize: 20 }}>
                  Re-challenge
                </span>
                <span
                  className="px-2.5 py-0.5 rounded-full font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #E8321A, #FF2D8B)', fontSize: 16 }}
                >
                  {logs.length}회 도전
                </span>
              </div>

              {/* Stats row */}
              <div className="flex gap-6 flex-wrap">
                {prResult && (
                  <div>
                    <p className="text-rx-muted" style={{ fontSize: 16 }}>PR 기록</p>
                    <p className="font-black gradient-text" style={{ fontSize: 24 }}>{prResult}</p>
                  </div>
                )}
                <div>
                  <p className="text-rx-muted" style={{ fontSize: 16 }}>마지막 도전</p>
                  <p className="text-white font-bold" style={{ fontSize: 16 }}>{logs[0].date}</p>
                </div>
                {logs[0].difficulty && (
                  <div>
                    <p className="text-rx-muted" style={{ fontSize: 16 }}>난이도</p>
                    <p style={{ fontSize: 16 }}>{'🔥'.repeat(logs[0].difficulty)}</p>
                  </div>
                )}
              </div>
            </div>

            <Link
              href={`/wod/log?wod=${wodId}`}
              className="btn-primary py-2.5 px-5 whitespace-nowrap self-start"
              style={{ fontSize: 16 }}
            >
              재도전 →
            </Link>
          </div>
        </div>
      ) : (
        /* First-time hint */
        <div
          className="glass-card p-4 flex items-center justify-between gap-4 mb-4 flex-wrap"
        >
          <div>
            <p className="text-white font-bold" style={{ fontSize: 16 }}>아직 이 WOD를 기록하지 않았어요</p>
            <p className="text-rx-muted" style={{ fontSize: 16 }}>첫 도전을 시작해보세요!</p>
          </div>
          <Link
            href={`/wod/log?wod=${wodId}`}
            className="btn-primary py-2 px-4 whitespace-nowrap flex-shrink-0"
            style={{ fontSize: 16 }}
          >
            기록하기
          </Link>
        </div>
      )}

      {/* ── Attempt history ── */}
      {logs.length > 0 && (
        <div>
          <h3 className="font-black text-white uppercase tracking-tight mb-3" style={{ fontSize: 18 }}>
            도전 기록{' '}
            <span className="text-rx-muted font-normal" style={{ fontSize: 16 }}>
              ({logs.length}회)
            </span>
          </h3>

          <div className="space-y-2.5">
            {logs.slice(0, 5).map((log, i) => {
              const isPR = i === prIdx
              // Compare this attempt with the PREVIOUS (older) attempt
              const delta = i < logs.length - 1 ? computeDelta(log, logs[i + 1]) : null

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className="glass-card p-4 flex items-center gap-3"
                  style={isPR ? {
                    border: '1px solid rgba(255,45,139,0.45)',
                    boxShadow: '0 0 18px rgba(255,45,139,0.10)',
                  } : {}}
                >
                  {/* Rank / trophy */}
                  <div className="flex-shrink-0 w-9 flex flex-col items-center">
                    {isPR
                      ? <span style={{ fontSize: 22 }}>🏆</span>
                      : <span className="text-rx-muted font-bold" style={{ fontSize: 16 }}>#{i + 1}</span>
                    }
                  </div>

                  {/* Result */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      {log.time && (
                        <span className="font-black gradient-text" style={{ fontSize: 20 }}>⏱ {log.time}</span>
                      )}
                      {log.rounds && (
                        <span className="font-black text-green-400" style={{ fontSize: 20 }}>🔄 {log.rounds}</span>
                      )}
                      {!log.time && !log.rounds && (
                        <span className="text-rx-muted" style={{ fontSize: 16 }}>결과 없음</span>
                      )}
                      {isPR && (
                        <span
                          className="px-2 py-0.5 rounded-full font-black text-white"
                          style={{ background: 'linear-gradient(135deg, #E8321A, #FF2D8B)', fontSize: 15 }}
                        >
                          PR
                        </span>
                      )}
                    </div>
                    <p className="text-rx-muted" style={{ fontSize: 16 }}>{log.date}</p>
                  </div>

                  {/* Delta chip */}
                  {delta && <DeltaChip badge={delta} />}
                </motion.div>
              )
            })}
          </div>

          {logs.length > 5 && (
            <p className="text-rx-muted text-center mt-3" style={{ fontSize: 16 }}>
              + {logs.length - 5}개 더 —{' '}
              <Link href="/mypage" className="text-white underline underline-offset-2">마이페이지</Link>
              에서 전체 보기
            </p>
          )}
        </div>
      )}
    </motion.div>
  )
}
